export interface DeviceIdentity {
  id: string
  name: string
}

export interface StoredDeviceIdentity extends DeviceIdentity {
  schemaVersion: 1
  createdAt: string
}
