import type { WebRtcCandidate, WebRtcDescription } from '@swiftdesk/types'

export type PeerRole = 'controller' | 'host'
export type WebRtcStatus = 'connecting' | 'connected' | 'failed' | 'disconnected'

export interface WebRtcCallbacks {
  onOffer(description: WebRtcDescription): void
  onAnswer(description: WebRtcDescription): void
  onIceCandidate(candidate: WebRtcCandidate): void
  onRemoteStream(stream: MediaStream): void
  onStatus(status: WebRtcStatus): void
  onControlChannel(channel: RTCDataChannel): void
}

export class WebRTCService {
  private peer: RTCPeerConnection | undefined
  private stream: MediaStream | undefined
  private controlChannel: RTCDataChannel | undefined
  private queuedCandidates: RTCIceCandidateInit[] = []

  constructor(private readonly callbacks: WebRtcCallbacks, private readonly stunServer = import.meta.env.VITE_STUN_SERVER ?? 'stun:stun.l.google.com:19302') {}

  async start(role: PeerRole, localStream?: MediaStream): Promise<void> {
    this.debug('Creating peer connection', { role, hasLocalStream: Boolean(localStream) })
    this.closeConnection()
    this.peer = new RTCPeerConnection({ iceServers: [{ urls: this.stunServer }] })
    this.peer.onicecandidate = ({ candidate }) => { if (candidate && candidate.candidate) { this.debug('ICE candidate generated'); this.callbacks.onIceCandidate({ candidate: candidate.candidate, sdpMid: candidate.sdpMid, sdpMLineIndex: candidate.sdpMLineIndex }) } }
    this.peer.ontrack = ({ track, streams }) => { this.debug('Remote track received', { kind: track.kind }); if (streams[0]) this.callbacks.onRemoteStream(streams[0]) }
    this.peer.onconnectionstatechange = () => { this.debug('Connection state', { connection: this.peer?.connectionState, ice: this.peer?.iceConnectionState, signaling: this.peer?.signalingState }); this.callbacks.onStatus(this.mapState(this.peer?.connectionState)) }
    this.peer.ondatachannel = ({ channel }) => { this.debug('DataChannel received', { label: channel.label }); if (channel.label === 'swiftdesk-control') { this.controlChannel = channel; this.callbacks.onControlChannel(channel) } }
    if (localStream) { this.stream = localStream; this.debug('Adding media tracks', { tracks: localStream.getTracks().map((track) => `${track.kind}:${track.readyState}`) }); localStream.getTracks().forEach((track) => this.peer?.addTrack(track, localStream)); this.debug('Video track added', { senders: this.peer.getSenders().map((sender) => sender.track?.kind) }) }
    if (role === 'controller') { this.controlChannel = this.peer.createDataChannel('swiftdesk-control', { ordered: true }); this.debug('DataChannel created'); this.callbacks.onControlChannel(this.controlChannel) }
  }

  async createOffer(): Promise<void> { if (!this.peer) return; this.debug('Creating offer'); const offer = await this.peer.createOffer(); await this.peer.setLocalDescription(offer); this.debug('Offer sent'); this.callbacks.onOffer({ type: offer.type, sdp: offer.sdp }) }
  async acceptOffer(description: WebRtcDescription): Promise<void> { if (!this.peer) return; this.debug('Offer received'); await this.peer.setRemoteDescription(description); this.debug('Remote description set'); await this.flushCandidates(); const answer = await this.peer.createAnswer(); await this.peer.setLocalDescription(answer); this.callbacks.onAnswer({ type: answer.type, sdp: answer.sdp }) }
  async acceptAnswer(description: WebRtcDescription): Promise<void> { if (!this.peer) return; this.debug('Answer received'); await this.peer.setRemoteDescription(description); this.debug('Answer applied'); await this.flushCandidates() }
  async addIceCandidate(candidate: WebRtcCandidate): Promise<void> { this.debug('ICE candidate received'); if (!this.peer?.remoteDescription) { this.queuedCandidates.push(candidate); return } await this.peer.addIceCandidate(candidate); this.debug('ICE candidate applied') }
  getControlChannel(): RTCDataChannel | undefined { return this.controlChannel }
  closeConnection(): void { this.stream?.getTracks().forEach((track) => track.stop()); this.stream = undefined; this.controlChannel?.close(); this.controlChannel = undefined; this.peer?.close(); this.peer = undefined; this.queuedCandidates = [] }
  private async flushCandidates(): Promise<void> { const candidates = this.queuedCandidates.splice(0); for (const candidate of candidates) await this.peer?.addIceCandidate(candidate) }
  private mapState(state: RTCPeerConnectionState | undefined): WebRtcStatus { return state === 'connected' ? 'connected' : state === 'failed' ? 'failed' : state === 'disconnected' || state === 'closed' ? 'disconnected' : 'connecting' }
  private debug(message: string, details?: Record<string, unknown>): void { if (import.meta.env.DEV) console.debug('[WebRTC]', message, details ?? '') }
}
