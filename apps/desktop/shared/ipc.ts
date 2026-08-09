import type { DeviceIdentity } from './device-identity'

export const IPC_CHANNELS = {
  getDeviceIdentity: 'identity:get',
  regenerateDeviceIdentity: 'identity:regenerate',
  getApplicationInfo: 'app:get-info',
  getScreenSources: 'screen:get-sources',
  selectScreenSource: 'screen:select-source',
  sendRemoteInput: 'remote:send-input',
  getAuthToken: 'auth:get-token',
  saveAuthToken: 'auth:save-token',
  clearAuthToken: 'auth:clear-token',
  releaseAllKeys: 'remote:release-keys',
} as const

export interface ApplicationInfo {
  name: string
  version: string
  platform: string
}

export interface SwiftDeskApi {
  getApplicationInfo(): Promise<ApplicationInfo>
  getDeviceIdentity(): Promise<DeviceIdentity>
  regenerateDeviceId(): Promise<DeviceIdentity>
  getScreenSources(): Promise<Array<{ id: string; name: string; thumbnail: string }>>
  selectScreenSource(sourceId: string): Promise<void>
  sendRemoteInput(input: unknown): Promise<void>
  getAuthToken(): Promise<string | null>
  saveAuthToken(token: string): Promise<void>
  clearAuthToken(): Promise<void>
  releaseAllKeys(): Promise<void>
}
