import { describe, expect, it } from 'vitest'
import { DeviceRegistry } from '../src/services/deviceRegistry'

describe('DeviceRegistry', () => {
  it('registers and looks up an online device', () => {
    const registry = new DeviceRegistry()
    registry.registerDevice({ deviceId: '123456789', deviceName: 'Office PC' }, 'socket-a')

    expect(registry.isDeviceOnline('123456789')).toBe(true)
    expect(registry.getSocketId('123456789')).toBe('socket-a')
    expect(registry.getDeviceForSocket('socket-a')?.deviceName).toBe('Office PC')
  })

  it('replaces an existing active registration safely', () => {
    const registry = new DeviceRegistry()
    registry.registerDevice({ deviceId: '123456789', deviceName: 'Office PC' }, 'socket-a')
    const result = registry.registerDevice({ deviceId: '123456789', deviceName: 'Office PC' }, 'socket-b')

    expect(result.replacedSocketId).toBe('socket-a')
    expect(registry.getSocketId('123456789')).toBe('socket-b')
    expect(registry.getDeviceForSocket('socket-a')).toBeUndefined()
  })

  it('only removes the device registered by the disconnecting socket', () => {
    const registry = new DeviceRegistry()
    registry.registerDevice({ deviceId: '123456789', deviceName: 'Office PC' }, 'socket-a')
    registry.registerDevice({ deviceId: '123456789', deviceName: 'Office PC' }, 'socket-b')

    expect(registry.unregisterDevice('socket-a')).toBeUndefined()
    expect(registry.getSocketId('123456789')).toBe('socket-b')
    expect(registry.unregisterDevice('socket-b')?.deviceId).toBe('123456789')
    expect(registry.isDeviceOnline('123456789')).toBe(false)
  })
})
