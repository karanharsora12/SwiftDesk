import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeTheme,
} from "electron";
import { is } from "@electron-toolkit/utils";
import { join } from "node:path";
import { IPC_CHANNELS } from "../../shared/ipc";
import { DeviceIdentityService } from "./services/device-identity-service";
import { SettingsService } from "./services/settings-service";
import { WindowsInputController } from "./services/nativeInput/windows/WindowsInputController";
// @ts-ignore
import icon from "../../resources/icon.ico?asset";

app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-features", "CalculateNativeWinOcclusion");

if (process.env.SWIFT_DESK_INSTANCE) {
  app.setPath(
    "userData",
    join(
      app.getPath("userData"),
      `instance-${process.env.SWIFT_DESK_INSTANCE}`,
    ),
  );
}

let mainWindow: BrowserWindow | undefined;
let deviceIdentityService: DeviceIdentityService | undefined;
let settingsService: SettingsService | undefined;
let selectedScreenSourceId: string | undefined;
let tray: Tray | undefined;
let isQuitting = false;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    icon,
    width: 1240,
    height: 800,
    minWidth: 1024,
    minHeight: 680,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#09111f",
    title: "SwiftDesk",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  const settings = getSettingsService().getSettings();

  mainWindow.once("ready-to-show", () => {
    if (!settings.general.startMinimized) {
      mainWindow?.show();
    }
  });

  mainWindow.on("close", (event: Electron.Event) => {
    if (!isQuitting && settings.general.closeToTray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  // @ts-ignore
  mainWindow.on("minimize", (event: any) => {
    if (settings.general.minimizeToTray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.webContents.session.setDisplayMediaRequestHandler(
    (_request, callback) => {
      const sourceId = selectedScreenSourceId;
      if (!sourceId) return callback({});
      void desktopCapturer
        .getSources({ types: ["screen", "window"] })
        .then((sources) => {
          const source = sources.find((candidate) => candidate.id === sourceId);
          callback(source ? { video: source } : {});
        })
        .catch(() => callback({}));
    },
    { useSystemPicker: false },
  );

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

function setupTray(): void {
  const settings = getSettingsService().getSettings();
  if (!settings.general.minimizeToTray && !settings.general.closeToTray) return;

  if (tray) return;

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show SwiftDesk", click: () => mainWindow?.show() },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip("SwiftDesk");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => mainWindow?.show());
}

function updateStartupSettings(): void {
  const settings = getSettingsService().getSettings();
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: settings.general.startOnStartup,
      openAsHidden: settings.general.startMinimized,
    });
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getApplicationInfo, () => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
  }));
  ipcMain.handle(IPC_CHANNELS.getDeviceIdentity, () =>
    getDeviceIdentityService().getIdentity(),
  );
  ipcMain.handle(IPC_CHANNELS.regenerateDeviceIdentity, () =>
    getDeviceIdentityService().regenerateDeviceId(),
  );
  ipcMain.handle(IPC_CHANNELS.getScreenSources, async () => {
    const sources = await desktopCapturer.getSources({
      types: ["screen", "window"],
      thumbnailSize: { width: 320, height: 180 },
    });
    return sources.map((source) => {
      let name = source.name;
      if (source.id.startsWith("screen:")) {
        name =
          name.toLowerCase() === "entire screen"
            ? "Entire Screen"
            : name.replace(/^Screen/i, "Entire Screen");
      }
      return {
        id: source.id,
        name,
        thumbnail: source.thumbnail.toDataURL(),
      };
    });
  });
  ipcMain.handle(
    IPC_CHANNELS.selectScreenSource,
    (_event, sourceId: unknown) => {
      if (
        typeof sourceId !== "string" ||
        sourceId.length === 0 ||
        sourceId.length > 256
      )
        throw new Error("Invalid screen source.");
      selectedScreenSourceId = sourceId;
    },
  );
  const inputController = new WindowsInputController();

  ipcMain.handle(IPC_CHANNELS.sendRemoteInput, async (_event, input: any) => {
    try {
      if (input.type === "mouse_move") {
        await inputController.moveMouse(input.x, input.y);
      } else if (input.type === "mouse_click") {
        await inputController.mouseClick(input.button);
      } else if (input.type === "mouse_down") {
        await inputController.mouseDown(input.button);
      } else if (input.type === "mouse_up") {
        await inputController.mouseUp(input.button);
      } else if (input.type === "mouse_wheel") {
        await inputController.mouseWheel(input.deltaX, input.deltaY);
      } else if (input.type === "key_down") {
        await inputController.keyDown(input.key);
      } else if (input.type === "key_up") {
        await inputController.keyUp(input.key);
      }
    } catch (e) {
      console.error("Failed to execute remote input", e);
    }
  });

  ipcMain.handle(IPC_CHANNELS.releaseAllKeys, async () => {
    try {
      await inputController.releaseAll();
    } catch (e) {
      console.error("Failed to release native keys", e);
    }
  });

  ipcMain.handle(IPC_CHANNELS.getSettings, () => {
    return getSettingsService().getSettings();
  });

  ipcMain.handle(
    IPC_CHANNELS.updateSetting,
    (_event, key: string, value: any) => {
      getSettingsService().updateSetting(key, value);

      // Check if we need to update tray or startup settings
      if (key === "general.minimizeToTray" || key === "general.closeToTray") {
        const settings = getSettingsService().getSettings();
        if (settings.general.minimizeToTray || settings.general.closeToTray) {
          setupTray();
        } else if (tray) {
          tray.destroy();
          tray = undefined;
        }
      }

      if (
        key === "general.startOnStartup" ||
        key === "general.startMinimized"
      ) {
        updateStartupSettings();
      }

      if (key === "general.theme") {
        nativeTheme.themeSource = value || "system";
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.resetSettings, () => {
    getSettingsService().resetSettings();
    updateStartupSettings();
    setupTray(); // Will remove tray if defaults say so
  });
}

function getDeviceIdentityService(): DeviceIdentityService {
  if (!deviceIdentityService) {
    throw new Error(
      "Device identity service was requested before the application was ready.",
    );
  }

  return deviceIdentityService;
}

function getSettingsService(): SettingsService {
  if (!settingsService) {
    throw new Error(
      "Settings service was requested before the application was ready.",
    );
  }
  return settingsService;
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.swiftdesk.desktop");
  const userData = app.getPath("userData");
  deviceIdentityService = new DeviceIdentityService(userData);
  settingsService = new SettingsService(userData);

  nativeTheme.themeSource =
    settingsService.getSettings().general.theme || "system";

  updateStartupSettings();
  setupTray();

  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
