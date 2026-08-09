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
};

contextBridge.exposeInMainWorld("swiftDesk", api);
