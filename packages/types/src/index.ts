export interface DeviceSummary {
  id: string
  name: string
  online: boolean
}

export interface DevicePresence {
  deviceId: string
  deviceName: string
}

export interface DeviceStatus {
  deviceId: string
  online: boolean
  deviceName?: string
}

export interface ConnectionRequestPayload {
  targetDeviceId: string
}

export interface IncomingConnectionRequest {
  sessionId: string
  from: DevicePresence
}

export interface SessionActionPayload {
  sessionId: string
}

export interface SessionNotification {
  sessionId: string
  status: 'accepted' | 'rejected'
}

export interface SessionEndedNotification {
  sessionId: string
  reason: 'peer_disconnected' | 'request_timed_out' | 'rejected'
}

export interface ServerError {
  code: 'INVALID_PAYLOAD' | 'NOT_REGISTERED' | 'DEVICE_OFFLINE' | 'SESSION_NOT_FOUND' | 'UNAUTHORIZED' | 'RATE_LIMITED'
  message: string
}

export interface SocketData {
  userId: string;
}

export interface ServerToClientEvents {
  'device:registered': (device: DevicePresence) => void
  'device:online': (device: DevicePresence) => void
  'device:offline': (device: DevicePresence) => void
  'device:status': (status: DeviceStatus) => void
  'device:replaced': () => void
  'connection:request': (request: IncomingConnectionRequest) => void
  'connection:accepted': (session: SessionNotification) => void
  'connection:rejected': (session: SessionNotification) => void
  'connection:timeout': (session: SessionEndedNotification) => void
  'session:ended': (session: SessionEndedNotification) => void
  'server:error': (error: ServerError) => void
  'webrtc:offer': (payload: WebRtcSignal) => void
  'webrtc:answer': (payload: WebRtcSignal) => void
  'webrtc:ice-candidate': (payload: WebRtcIceSignal) => void
  'control:request': (payload: ControlSignal) => void
  'control:granted': (payload: ControlSignal) => void
  'control:rejected': (payload: ControlSignal) => void
  'control:revoked': (payload: ControlSignal) => void
}

export interface ClientToServerEvents {
  'device:register': (device: DevicePresence) => void
  'device:check': (request: Pick<DevicePresence, 'deviceId'>) => void
  'connection:request': (request: ConnectionRequestPayload) => void
  'connection:accept': (request: SessionActionPayload) => void
  'connection:reject': (request: SessionActionPayload) => void
  'webrtc:offer': (payload: WebRtcSignal) => void
  'webrtc:answer': (payload: WebRtcSignal) => void
  'webrtc:ice-candidate': (payload: WebRtcIceSignal) => void
  'control:request': (payload: SessionActionPayload) => void
  'control:grant': (payload: SessionActionPayload) => void
  'control:reject': (payload: SessionActionPayload) => void
  'control:revoke': (payload: SessionActionPayload) => void
}

export interface WebRtcDescription { type: 'offer' | 'answer' | 'pranswer' | 'rollback'; sdp?: string }
export interface WebRtcCandidate { candidate: string; sdpMid?: string | null; sdpMLineIndex?: number | null; usernameFragment?: string }
export interface WebRtcSignal { sessionId: string; sdp: WebRtcDescription }
export interface WebRtcIceSignal { sessionId: string; candidate: WebRtcCandidate }
export interface ControlSignal extends SessionActionPayload {}

