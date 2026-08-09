export type MouseButton = 'left' | 'right' | 'middle'
export type InputMessage =
  | { type: 'mouse_move'; x: number; y: number }
  | { type: 'mouse_click'; button: MouseButton; doubleClick?: boolean }
  | { type: 'mouse_down'; button: MouseButton }
  | { type: 'mouse_up'; button: MouseButton }
  | { type: 'mouse_wheel'; deltaX: number; deltaY: number }
  | { type: 'key_down'; key: string }
  | { type: 'key_up'; key: string }

export function isInputMessage(value: unknown): value is InputMessage {
  if (typeof value !== 'object' || value === null) return false
  const message = value as Record<string, unknown>
  if (message.type === 'mouse_move') return typeof message.x === 'number' && message.x >= 0 && message.x <= 1 && typeof message.y === 'number' && message.y >= 0 && message.y <= 1
  if (message.type === 'mouse_click') return (message.button === 'left' || message.button === 'right' || message.button === 'middle')
  if (message.type === 'mouse_down') return (message.button === 'left' || message.button === 'right' || message.button === 'middle')
  if (message.type === 'mouse_up') return (message.button === 'left' || message.button === 'right' || message.button === 'middle')
  if (message.type === 'mouse_wheel') return typeof message.deltaX === 'number' && Number.isFinite(message.deltaX) && typeof message.deltaY === 'number' && Number.isFinite(message.deltaY)
  return (message.type === 'key_down' || message.type === 'key_up') && typeof message.key === 'string' && message.key.length > 0 && message.key.length <= 64
}
