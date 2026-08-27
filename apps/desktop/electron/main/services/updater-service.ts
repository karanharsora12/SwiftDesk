import { autoUpdater } from "electron-updater";
import { BrowserWindow, ipcMain } from "electron";
import { IPC_CHANNELS } from "../../../shared/ipc";
import { is } from "@electron-toolkit/utils";

export class UpdaterService {
  private mainWindow: BrowserWindow | undefined;

  constructor() {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    // Set dev behavior
    if (is.dev) {
      autoUpdater.forceDevUpdateConfig = true;
    }

    this.registerEvents();
  }

  public setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  private sendEventToWindow(event: any) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.onUpdaterEvent, event);
    }
  }

  private registerEvents() {
    autoUpdater.on("checking-for-update", () => {
      this.sendEventToWindow({ type: "checking" });
    });

    autoUpdater.on("update-available", (info) => {
      this.sendEventToWindow({ type: "available", data: info });
    });

    autoUpdater.on("update-not-available", (info) => {
      this.sendEventToWindow({ type: "not-available", data: info });
    });

    autoUpdater.on("error", (err) => {
      const errorString =
        err == null ? "unknown" : (err.stack || err).toString();
      if (errorString.includes("404")) {
        this.sendEventToWindow({ type: "not-available", data: null });
        return;
      }

      this.sendEventToWindow({
        type: "error",
        data: errorString,
      });
    });

    autoUpdater.on("download-progress", (progressObj) => {
      this.sendEventToWindow({ type: "progress", data: progressObj });
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.sendEventToWindow({ type: "downloaded", data: info });
    });
  }

  public registerIpcHandlers() {
    ipcMain.handle(IPC_CHANNELS.checkForUpdates, () => {
      return autoUpdater.checkForUpdates().catch((err) => {
        console.error("Failed to check for updates", err);
      });
    });

    ipcMain.handle(IPC_CHANNELS.downloadUpdate, () => {
      return autoUpdater.downloadUpdate().catch((err) => {
        console.error("Failed to download update", err);
      });
    });

    ipcMain.handle(IPC_CHANNELS.installUpdate, () => {
      autoUpdater.quitAndInstall(true, true);
    });
  }
}
