import type { ClientToServerEvents, DevicePresence, ServerError, ServerToClientEvents, SessionEndedNotification } from '@swiftdesk/types'
import type { Socket } from 'socket.io'
import type { Server } from 'socket.io'
import { ZodError } from 'zod'
import { DeviceRegistry } from '../../services/deviceRegistry'
import type { Session, SessionManager } from '../../services/sessionManager'
import { logger } from '../../utils/logger'
import { connectionRequestSchema, deviceCheckSchema, deviceRegistrationSchema, sessionActionSchema, webRtcIceSchema, webRtcSignalSchema } from '../schemas'
import { SocketRateLimiter } from '../rateLimiter'

type SwiftDeskSocket = Socket<ClientToServerEvents, ServerToClientEvents>
type SwiftDeskServer = Server<ClientToServerEvents, ServerToClientEvents>

interface SocketDependencies {
  io: SwiftDeskServer
  deviceRegistry: DeviceRegistry
  sessionManager: SessionManager
}

export function registerSocketHandlers(socket: SwiftDeskSocket, dependencies: SocketDependencies): void {
  const limiter = new SocketRateLimiter(40, 10_000)

  const validateRate = (): boolean => {
    if (limiter.allow()) return true
    emitError(socket, { code: 'RATE_LIMITED', message: 'Too many requests. Please wait and try again.' })
    return false
  }

  socket.on('device:register', async (payload) => {
    if (!validateRate()) return
    const parsed = deviceRegistrationSchema.safeParse(payload)
    if (!parsed.success) return emitValidationError(socket, parsed.error)

    const registration = dependencies.deviceRegistry.registerDevice(parsed.data, socket.id)
    if (registration.replacedSocketId && registration.replacedSocketId !== socket.id) {
      dependencies.io.to(registration.replacedSocketId).emit('device:replaced')
      dependencies.io.sockets.sockets.get(registration.replacedSocketId)?.disconnect(true)
    }

    const publicDevice = toPresence(registration.device)
    if (registration.unregisteredDevice) {
      socket.broadcast.emit('device:offline', toPresence(registration.unregisteredDevice))
    }
    socket.emit('device:registered', publicDevice)
    socket.broadcast.emit('device:online', publicDevice)
    logger.info({ event: 'device.registered', deviceId: publicDevice.deviceId }, 'Device registered')
  })

  socket.on('device:check', (payload) => {
    if (!validateRate()) return
    const parsed = deviceCheckSchema.safeParse(payload)
    if (!parsed.success) return emitValidationError(socket, parsed.error)

    const device = dependencies.deviceRegistry.getDevice(parsed.data.deviceId)
    socket.emit('device:status', device ? { ...toPresence(device), online: true } : { deviceId: parsed.data.deviceId, online: false })
  })

  socket.on('connection:request', (payload) => {
    if (!validateRate()) return
    const parsed = connectionRequestSchema.safeParse(payload)
    if (!parsed.success) return emitValidationError(socket, parsed.error)

    const requester = dependencies.deviceRegistry.getDeviceForSocket(socket.id)
    if (!requester) return emitError(socket, { code: 'NOT_REGISTERED', message: 'Register this device before requesting a connection.' })
    if (requester.deviceId === parsed.data.targetDeviceId) return emitError(socket, { code: 'INVALID_PAYLOAD', message: 'A device cannot connect to itself.' })

    const target = dependencies.deviceRegistry.getDevice(parsed.data.targetDeviceId)
    if (!target) return emitError(socket, { code: 'DEVICE_OFFLINE', message: 'The requested device is offline or unavailable.' })

    const session = dependencies.sessionManager.createSession(requester.deviceId, target.deviceId)
    dependencies.io.to(target.socketId).emit('connection:request', { sessionId: session.sessionId, from: toPresence(requester) })
    logger.info({ event: 'session.created', sessionId: session.sessionId }, 'Connection request created')
  })

  socket.on('connection:accept', (payload) => {
    if (!validateRate()) return
    const parsed = sessionActionSchema.safeParse(payload)
    if (!parsed.success) return emitValidationError(socket, parsed.error)

    const responder = dependencies.deviceRegistry.getDeviceForSocket(socket.id)
    if (!responder) return emitError(socket, { code: 'NOT_REGISTERED', message: 'Register this device before responding to a request.' })

    const session = dependencies.sessionManager.acceptSession(parsed.data.sessionId, responder.deviceId)
    if (!session) return emitError(socket, { code: 'UNAUTHORIZED', message: 'This connection request is no longer available.' })
    notifyRequester(dependencies.io, dependencies.deviceRegistry, session, 'connection:accepted', { sessionId: session.sessionId, status: 'accepted' })
    logger.info({ event: 'session.accepted', sessionId: session.sessionId }, 'Connection request accepted')
  })

  socket.on('connection:reject', (payload) => {
    if (!validateRate()) return
    const parsed = sessionActionSchema.safeParse(payload)
    if (!parsed.success) return emitValidationError(socket, parsed.error)

    const responder = dependencies.deviceRegistry.getDeviceForSocket(socket.id)
    if (!responder) return emitError(socket, { code: 'NOT_REGISTERED', message: 'Register this device before responding to a request.' })

    const session = dependencies.sessionManager.rejectSession(parsed.data.sessionId, responder.deviceId)
    if (!session) return emitError(socket, { code: 'UNAUTHORIZED', message: 'This connection request is no longer available.' })
    notifyRequester(dependencies.io, dependencies.deviceRegistry, session, 'connection:rejected', { sessionId: session.sessionId, status: 'rejected' })
    logger.info({ event: 'session.rejected', sessionId: session.sessionId }, 'Connection request rejected')
  })

  const forwardToPeer = (sessionId: string, event: 'webrtc:offer' | 'webrtc:answer' | 'webrtc:ice-candidate' | 'control:request' | 'control:granted' | 'control:rejected' | 'control:revoked', payload: unknown): void => {
    const sender = dependencies.deviceRegistry.getDeviceForSocket(socket.id)
    const session = dependencies.sessionManager.getSession(sessionId)
    if (!sender || !session || (session.requesterDeviceId !== sender.deviceId && session.targetDeviceId !== sender.deviceId)) return emitError(socket, { code: 'UNAUTHORIZED', message: 'This session is unavailable.' })
    const peerDeviceId = session.requesterDeviceId === sender.deviceId ? session.targetDeviceId : session.requesterDeviceId
    const peerSocketId = dependencies.deviceRegistry.getSocketId(peerDeviceId)
    if (!peerSocketId) return emitError(socket, { code: 'DEVICE_OFFLINE', message: 'The peer is offline.' })
    dependencies.io.to(peerSocketId).emit(event, payload as never)
  }

  socket.on('webrtc:offer', (payload) => { const parsed = webRtcSignalSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'webrtc:offer', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('webrtc:answer', (payload) => { const parsed = webRtcSignalSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'webrtc:answer', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('webrtc:ice-candidate', (payload) => { const parsed = webRtcIceSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'webrtc:ice-candidate', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('control:request', (payload) => { const parsed = sessionActionSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'control:request', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('control:grant', (payload) => { const parsed = sessionActionSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'control:granted', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('control:reject', (payload) => { const parsed = sessionActionSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'control:rejected', parsed.data); else emitValidationError(socket, parsed.error) })
  socket.on('control:revoke', (payload) => { const parsed = sessionActionSchema.safeParse(payload); if (parsed.success) forwardToPeer(parsed.data.sessionId, 'control:revoked', parsed.data); else emitValidationError(socket, parsed.error) })

  socket.on('disconnect', () => {
    const device = dependencies.deviceRegistry.unregisterDevice(socket.id)
    if (!device) return

    const publicDevice = toPresence(device)
    socket.broadcast.emit('device:offline', publicDevice)
    for (const session of dependencies.sessionManager.endSessionsForDevice(device.deviceId)) {
      notifyPeerSessionEnded(dependencies.io, dependencies.deviceRegistry, session, device.deviceId, 'peer_disconnected')
    }
    logger.info({ event: 'device.disconnected', deviceId: device.deviceId }, 'Device disconnected')
  })
}

export function handlePendingSessionTimeout(io: SwiftDeskServer, registry: DeviceRegistry, session: Session): void {
  const payload: SessionEndedNotification = { sessionId: session.sessionId, reason: 'request_timed_out' }
  const requesterSocketId = registry.getSocketId(session.requesterDeviceId)
  const targetSocketId = registry.getSocketId(session.targetDeviceId)
  if (requesterSocketId) io.to(requesterSocketId).emit('connection:timeout', payload)
  if (targetSocketId) io.to(targetSocketId).emit('connection:timeout', payload)
  logger.info({ event: 'session.timeout', sessionId: session.sessionId }, 'Connection request timed out')
}

function toPresence(device: DevicePresence): DevicePresence {
  return { deviceId: device.deviceId, deviceName: device.deviceName }
}

function notifyRequester(
  io: SwiftDeskServer,
  registry: DeviceRegistry,
  session: Session,
  event: 'connection:accepted' | 'connection:rejected',
  payload: { sessionId: string; status: 'accepted' | 'rejected' }
): void {
  const requesterSocketId = registry.getSocketId(session.requesterDeviceId)
  if (requesterSocketId) io.to(requesterSocketId).emit(event, payload)
}

function notifyPeerSessionEnded(
  io: SwiftDeskServer,
  registry: DeviceRegistry,
  session: Session,
  disconnectedDeviceId: string,
  reason: SessionEndedNotification['reason']
): void {
  const peerDeviceId = session.requesterDeviceId === disconnectedDeviceId ? session.targetDeviceId : session.requesterDeviceId
  const peerSocketId = registry.getSocketId(peerDeviceId)
  if (peerSocketId) io.to(peerSocketId).emit('session:ended', { sessionId: session.sessionId, reason })
}

function emitValidationError(socket: SwiftDeskSocket, error: ZodError): void {
  emitError(socket, { code: 'INVALID_PAYLOAD', message: error.issues[0]?.message ?? 'Invalid request payload.' })
}

function emitError(socket: SwiftDeskSocket, error: ServerError): void {
  socket.emit('server:error', error)
}
