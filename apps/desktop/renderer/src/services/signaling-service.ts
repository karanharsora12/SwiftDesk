import { io, type Socket } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ConnectionRequestPayload,
  IncomingConnectionRequest,
  ServerError,
  ServerToClientEvents,
  SessionActionPayload,
  SessionEndedNotification,
  SessionNotification
  , WebRtcSignal, WebRtcIceSignal, ControlSignal
} from '@swiftdesk/types'
import type { DeviceIdentity } from '../../../shared/device-identity'

export type ConnectionServerStatus = 'offline' | 'connecting' | 'online'

export interface SignalingListener {
  onStatusChange(status: ConnectionServerStatus): void
  onIncomingRequest(request: IncomingConnectionRequest): void
  onAccepted(session: SessionNotification): void
  onRejected(session: SessionNotification): void
  onTimeout(session: SessionEndedNotification): void
  onSessionEnded(session: SessionEndedNotification): void
  onError(error: ServerError): void
  onOffer(signal: WebRtcSignal): void
  onAnswer(signal: WebRtcSignal): void
  onIce(signal: WebRtcIceSignal): void
  onControlRequest(signal: ControlSignal): void
  onControlGranted(signal: ControlSignal): void
  onControlRevoked(signal: ControlSignal): void
}

type SignalSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export class SignalingService {
  private socket: SignalSocket | undefined
  private device: DeviceIdentity | undefined
  private readonly listeners = new Set<SignalingListener>()

  subscribe(listener: SignalingListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  connect(device: DeviceIdentity): void {
    this.device = device
    this.socket?.removeAllListeners()
    this.socket?.disconnect()
    this.socket = io(import.meta.env.VITE_SIGNALING_URL ?? 'http://localhost:4000', {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
      timeout: 10_000
    })
    this.registerSocketListeners(this.socket)
    this.emitStatus('connecting')
    this.socket.connect()
  }

  disconnect(): void {
    this.socket?.removeAllListeners()
    this.socket?.disconnect()
    this.socket = undefined
    this.emitStatus('offline')
  }

  requestConnection(targetDeviceId: string): void {
    this.socket?.emit('connection:request', { targetDeviceId: normalizeDeviceId(targetDeviceId) } satisfies ConnectionRequestPayload)
  }

  acceptConnection(sessionId: string): void {
    this.socket?.emit('connection:accept', { sessionId } satisfies SessionActionPayload)
  }

  rejectConnection(sessionId: string): void {
    this.socket?.emit('connection:reject', { sessionId } satisfies SessionActionPayload)
  }
  sendOffer(payload: WebRtcSignal): void { this.socket?.emit('webrtc:offer', payload) }
  sendAnswer(payload: WebRtcSignal): void { this.socket?.emit('webrtc:answer', payload) }
  sendIce(payload: WebRtcIceSignal): void { this.socket?.emit('webrtc:ice-candidate', payload) }
  requestControl(sessionId: string): void { this.socket?.emit('control:request', { sessionId }) }
  grantControl(sessionId: string): void { this.socket?.emit('control:grant', { sessionId }) }
  revokeControl(sessionId: string): void { this.socket?.emit('control:revoke', { sessionId }) }
  rejectControl(sessionId: string): void { this.socket?.emit('control:reject', { sessionId }) }

  private registerSocketListeners(socket: SignalSocket): void {
    socket.on('connect', () => {
      if (!this.device) return
      socket.emit('device:register', {
        deviceId: normalizeDeviceId(this.device.id),
        deviceName: this.device.name
      })
    })
    socket.on('device:registered', () => this.emitStatus('online'))
    socket.on('disconnect', () => this.emitStatus('offline'))
    socket.on('connect_error', () => this.emitStatus('offline'))
    socket.on('connection:request', (request) => this.notify((listener) => listener.onIncomingRequest(request)))
    socket.on('connection:accepted', (session) => this.notify((listener) => listener.onAccepted(session)))
    socket.on('connection:rejected', (session) => this.notify((listener) => listener.onRejected(session)))
    socket.on('connection:timeout', (session) => this.notify((listener) => listener.onTimeout(session)))
    socket.on('session:ended', (session) => this.notify((listener) => listener.onSessionEnded(session)))
    socket.on('server:error', (error) => this.notify((listener) => listener.onError(error)))
    socket.on('webrtc:offer', (signal) => this.notify((listener) => listener.onOffer(signal)))
    socket.on('webrtc:answer', (signal) => this.notify((listener) => listener.onAnswer(signal)))
    socket.on('webrtc:ice-candidate', (signal) => this.notify((listener) => listener.onIce(signal)))
    socket.on('control:request', (signal) => this.notify((listener) => listener.onControlRequest(signal)))
    socket.on('control:granted', (signal) => this.notify((listener) => listener.onControlGranted(signal)))
    socket.on('control:revoked', (signal) => this.notify((listener) => listener.onControlRevoked(signal)))
    socket.on('device:replaced', () => {
      this.emitStatus('offline')
      socket.disconnect()
    })
  }

  private emitStatus(status: ConnectionServerStatus): void {
    this.notify((listener) => listener.onStatusChange(status))
  }

  private notify(callback: (listener: SignalingListener) => void): void {
    this.listeners.forEach(callback)
  }
}

function normalizeDeviceId(deviceId: string): string {
  return deviceId.replace(/\s/g, '')
}

export const signalingService = new SignalingService()
