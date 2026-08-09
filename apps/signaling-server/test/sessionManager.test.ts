import { describe, expect, it, vi } from 'vitest'
import { SessionManager } from '../src/services/sessionManager'

describe('SessionManager', () => {
  it('creates secure pending sessions and accepts only the target device', () => {
    const manager = new SessionManager(30_000, vi.fn())
    const session = manager.createSession('111111111', '222222222')

    expect(session.sessionId).toMatch(/^session_[A-Za-z0-9_-]{32}$/)
    expect(manager.acceptSession(session.sessionId, '111111111')).toBeUndefined()
    expect(manager.acceptSession(session.sessionId, '222222222')?.status).toBe('accepted')
    manager.endSession(session.sessionId)
  })

  it('notifies when a pending session expires', () => {
    vi.useFakeTimers()
    const onTimeout = vi.fn()
    const manager = new SessionManager(5_000, onTimeout)
    const session = manager.createSession('111111111', '222222222')

    vi.advanceTimersByTime(5_000)

    expect(onTimeout).toHaveBeenCalledWith(expect.objectContaining({ sessionId: session.sessionId, status: 'ended' }))
    vi.useRealTimers()
  })

  it('ends every session related to a disconnected device', () => {
    const manager = new SessionManager(30_000, vi.fn())
    const first = manager.createSession('111111111', '222222222')
    const second = manager.createSession('333333333', '111111111')

    expect(manager.endSessionsForDevice('111111111').map((session) => session.sessionId)).toEqual([first.sessionId, second.sessionId])
  })
})
