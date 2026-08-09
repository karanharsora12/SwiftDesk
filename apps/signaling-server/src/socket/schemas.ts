import { z } from 'zod'

const deviceId = z.string().regex(/^\d{9}$/, 'Device ID must contain exactly nine digits.')
const deviceName = z.string().trim().min(1).max(80).regex(/^[\p{L}\p{N} .,'-]+$/u, 'Device name contains unsupported characters.')
const sessionId = z.string().regex(/^session_[A-Za-z0-9_-]{32}$/, 'Invalid session ID.')

export const deviceRegistrationSchema = z.object({ deviceId, deviceName }).strict()
export const deviceCheckSchema = z.object({ deviceId }).strict()
export const connectionRequestSchema = z.object({ targetDeviceId: deviceId }).strict()
export const sessionActionSchema = z.object({ sessionId }).strict()
export const webRtcSignalSchema = z.object({ sessionId, sdp: z.object({ type: z.enum(['offer', 'answer', 'pranswer', 'rollback']), sdp: z.string().max(100_000).optional() }).strict() }).strict()
export const webRtcIceSchema = z.object({ sessionId, candidate: z.object({ candidate: z.string().max(10_000), sdpMid: z.string().nullable().optional(), sdpMLineIndex: z.number().int().nullable().optional(), usernameFragment: z.string().optional() }).strict() }).strict()
