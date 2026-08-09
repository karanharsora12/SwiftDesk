import { type InputMessage, isInputMessage } from './InputProtocol'

export class RemoteControlService {
  private enabled = false
  private lastMoveAt = 0
  constructor(private readonly channel: RTCDataChannel, private readonly onInput: (message: InputMessage) => void) { channel.onmessage = (event) => this.receive(event.data) }
  setEnabled(enabled: boolean): void { this.enabled = enabled }
  send(message: InputMessage): void { if (!this.enabled || this.channel.readyState !== 'open') return; if (message.type === 'mouse_move') { const now = performance.now(); if (now - this.lastMoveAt < 16) return; this.lastMoveAt = now }; this.channel.send(JSON.stringify(message)) }
  release(): void { this.enabled = false }
  private receive(data: unknown): void { if (!this.enabled || typeof data !== 'string') return; try { const value: unknown = JSON.parse(data); if (isInputMessage(value)) this.onInput(value) } catch { /* reject malformed input */ } }
}
