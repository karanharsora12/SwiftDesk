import { randomBytes } from 'node:crypto'

export type SessionStatus = 'pending' | 'accepted' | 'rejected' | 'active' | 'ended'

export interface Session {
  sessionId: string
  requesterDeviceId: string
  targetDeviceId: string
  status: SessionStatus
  createdAt: number
}

export class SessionManager {
  private readonly sessions = new Map<string, Session>()
  private readonly timeouts = new Map<string, NodeJS.Timeout>()

  constructor(
    private readonly pendingTimeoutMs: number,
    private readonly onPendingTimeout: (session: Session) => void
  ) {}

  createSession(requesterDeviceId: string, targetDeviceId: string): Session {
    const session: Session = {
      sessionId: `session_${randomBytes(24).toString('base64url')}`,
      requesterDeviceId,
      targetDeviceId,
      status: 'pending',
      createdAt: Date.now()
    }

    this.sessions.set(session.sessionId, session)
    this.timeouts.set(session.sessionId, setTimeout(() => this.handleTimeout(session.sessionId), this.pendingTimeoutMs))
    return session
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId)
  }

  acceptSession(sessionId: string, targetDeviceId: string): Session | undefined {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== 'pending' || session.targetDeviceId !== targetDeviceId) return undefined
    session.status = 'accepted'
    this.clearTimeout(sessionId)
    return session
  }

  rejectSession(sessionId: string, targetDeviceId: string): Session | undefined {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== 'pending' || session.targetDeviceId !== targetDeviceId) return undefined
    session.status = 'rejected'
    this.clearTimeout(sessionId)
    this.sessions.delete(sessionId)
    return session
  }

  endSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId)
    if (!session) return undefined
    session.status = 'ended'
    this.clearTimeout(sessionId)
    return session
  }

  removeSession(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId)
    this.clearTimeout(sessionId)
    this.sessions.delete(sessionId)
    return session
  }

  endSessionsForDevice(deviceId: string): Session[] {
    const affected: Session[] = []
    for (const session of this.sessions.values()) {
      if (session.requesterDeviceId === deviceId || session.targetDeviceId === deviceId) {
        session.status = 'ended'
        this.clearTimeout(session.sessionId)
        affected.push(session)
        this.sessions.delete(session.sessionId)
      }
    }
    return affected
  }

  private handleTimeout(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== 'pending') return
    session.status = 'ended'
    this.timeouts.delete(sessionId)
    this.sessions.delete(sessionId)
    this.onPendingTimeout(session)
  }

  private clearTimeout(sessionId: string): void {
    const timeout = this.timeouts.get(sessionId)
    if (timeout) clearTimeout(timeout)
    this.timeouts.delete(sessionId)
  }
}
