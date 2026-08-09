export class SocketRateLimiter {
  private readonly events: number[] = []

  constructor(
    private readonly maxEvents: number,
    private readonly intervalMs: number
  ) {}

  allow(): boolean {
    const now = Date.now()
    while (this.events.length > 0) {
      const oldestEvent = this.events[0]
      if (oldestEvent === undefined || now - oldestEvent <= this.intervalMs) break
      this.events.shift()
    }
    if (this.events.length >= this.maxEvents) return false
    this.events.push(now)
    return true
  }
}
