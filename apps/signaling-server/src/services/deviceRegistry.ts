import type { DevicePresence } from "@swiftdesk/types";

export interface ConnectedDevice extends Pick<DevicePresence, "deviceId" | "deviceName"> {
  socketId: string;
  connectedAt: number;
  lastSeen: number;
}

export class DeviceRegistry {
  private readonly devices = new Map<string, ConnectedDevice>();
  private readonly deviceIdBySocketId = new Map<string, string>();

  registerDevice(
    device: Pick<DevicePresence, "deviceId" | "deviceName">,
    socketId: string,
  ): {
    device: ConnectedDevice;
    replacedSocketId?: string;
    unregisteredDevice?: ConnectedDevice;
  } {
    const previous = this.devices.get(device.deviceId);
    const existingDeviceIdForSocket = this.deviceIdBySocketId.get(socketId);
    const existingDeviceForSocket = existingDeviceIdForSocket
      ? this.devices.get(existingDeviceIdForSocket)
      : undefined;
    const timestamp = Date.now();
    const connectedDevice: ConnectedDevice = {
      ...device,
      socketId,
      connectedAt: timestamp,
      lastSeen: timestamp,
    };

    if (previous) this.deviceIdBySocketId.delete(previous.socketId);
    if (
      existingDeviceForSocket &&
      existingDeviceForSocket.deviceId !== device.deviceId
    ) {
      this.devices.delete(existingDeviceForSocket.deviceId);
    }
    this.devices.set(device.deviceId, connectedDevice);
    this.deviceIdBySocketId.set(socketId, device.deviceId);

    return {
      device: connectedDevice,
      replacedSocketId: previous?.socketId,
      unregisteredDevice:
        existingDeviceForSocket?.deviceId === device.deviceId
          ? undefined
          : existingDeviceForSocket,
    };
  }

  unregisterDevice(socketId: string): ConnectedDevice | undefined {
    const deviceId = this.deviceIdBySocketId.get(socketId);
    if (!deviceId) return undefined;

    const device = this.devices.get(deviceId);
    this.deviceIdBySocketId.delete(socketId);

    if (device?.socketId === socketId) {
      this.devices.delete(deviceId);
      return device;
    }

    return undefined;
  }

  getDevice(deviceId: string): ConnectedDevice | undefined {
    return this.devices.get(deviceId);
  }

  getDeviceForSocket(socketId: string): ConnectedDevice | undefined {
    const deviceId = this.deviceIdBySocketId.get(socketId);
    return deviceId ? this.devices.get(deviceId) : undefined;
  }

  isDeviceOnline(deviceId: string): boolean {
    return this.devices.has(deviceId);
  }

  getSocketId(deviceId: string): string | undefined {
    return this.devices.get(deviceId)?.socketId;
  }
}
