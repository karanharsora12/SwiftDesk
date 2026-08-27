import { contextBridge, ipcRenderer } from "electron";
import {
  IPC_CHANNELS,
  type ApplicationInfo,
  type SwiftDeskApi,
} from "../../shared/ipc";

const api: SwiftDeskApi = {
  getApplicationInfo: (): Promise<ApplicationInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.getApplicationInfo),
  getDeviceIdentity: () => ipcRenderer.invoke(IPC_CHANNELS.getDeviceIdentity),
  regenerateDeviceId: () =>
    ipcRenderer.invoke(IPC_CHANNELS.regenerateDeviceIdentity),
  getScreenSources: () => ipcRenderer.invoke(IPC_CHANNELS.getScreenSources),
  selectScreenSource: (sourceId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.selectScreenSource, sourceId),
  sendRemoteInput: (message: unknown) =>
    ipcRenderer.invoke(IPC_CHANNELS.sendRemoteInput, message),
  getAuthToken: () => ipcRenderer.invoke(IPC_CHANNELS.getAuthToken),
  saveAuthToken: (token: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.saveAuthToken, token),
  clearAuthToken: () => ipcRenderer.invoke(IPC_CHANNELS.clearAuthToken),
  releaseAllKeys: () => ipcRenderer.invoke(IPC_CHANNELS.releaseAllKeys),
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.getSettings),
  updateSetting: (key: string, value: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.updateSetting, key, value),
  resetSettings: () => ipcRenderer.invoke(IPC_CHANNELS.resetSettings),
  onSettingsChange: (callback) => {
    const subscription = (_event: any, settings: any) => callback(settings);
    ipcRenderer.on(IPC_CHANNELS.onSettingsChange, subscription);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.onSettingsChange, subscription);
    };
  },
  checkForUpdates: () => ipcRenderer.invoke(IPC_CHANNELS.checkForUpdates),
  downloadUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.downloadUpdate),
  installUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.installUpdate),
  onUpdaterEvent: (callback) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on(IPC_CHANNELS.onUpdaterEvent, subscription);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.onUpdaterEvent, subscription);
    };
  },
};

contextBridge.exposeInMainWorld("swiftDesk", api);
