import { useEffect, useRef } from 'react'
import { Maximize, MousePointer2, PhoneOff, MousePointerClick } from 'lucide-react'
import type { InputMessage } from '../services/remoteControl/InputProtocol'

export function RemoteSessionPage({ stream, onDisconnect, onRequestControl, sendRemoteInput, controlEnabled, revokeControl, sessionId }: { stream: MediaStream; onDisconnect(): void; onRequestControl(): void; sendRemoteInput(message: InputMessage): void; controlEnabled: boolean; revokeControl(sessionId: string): void; sessionId: string }): JSX.Element {
  const video = useRef<HTMLVideoElement>(null)
  
  useEffect(() => { 
    if (video.current) { 
      video.current.srcObject = stream; 
      void video.current.play().catch(() => undefined); 
      console.debug('[RemoteVideo] Video element assigned') 
    } 
  }, [stream])

  const handleMouseMove = (e: React.MouseEvent<HTMLVideoElement>) => {
    const videoEl = video.current;
    if (!videoEl) return;
    const rect = videoEl.getBoundingClientRect();
    const scaleX = videoEl.videoWidth / rect.width;
    const scaleY = videoEl.videoHeight / rect.height;
    const scale = Math.max(scaleX, scaleY);
    const displayedWidth = videoEl.videoWidth / scale;
    const displayedHeight = videoEl.videoHeight / scale;
    const offsetX = (rect.width - displayedWidth) / 2;
    const offsetY = (rect.height - displayedHeight) / 2;
    const actualX = e.clientX - rect.left - offsetX;
    const actualY = e.clientY - rect.top - offsetY;

    if (actualX < 0 || actualX > displayedWidth || actualY < 0 || actualY > displayedHeight) return;

    const x = actualX / displayedWidth;
    const y = actualY / displayedHeight;
    sendRemoteInput({ type: 'mouse_move', x, y });
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLVideoElement>) => {
    const buttons: Record<number, 'left' | 'middle' | 'right'> = { 0: 'left', 1: 'middle', 2: 'right' };
    const button = buttons[e.button];
    if (button) sendRemoteInput({ type: 'mouse_down', button });
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLVideoElement>) => {
    const buttons: Record<number, 'left' | 'middle' | 'right'> = { 0: 'left', 1: 'middle', 2: 'right' };
    const button = buttons[e.button];
    if (button) sendRemoteInput({ type: 'mouse_up', button });
  }

  const handleWheel = (e: React.WheelEvent<HTMLVideoElement>) => {
    sendRemoteInput({ type: 'mouse_wheel', deltaX: e.deltaX, deltaY: e.deltaY });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    e.preventDefault();
    sendRemoteInput({ type: 'key_down', key: e.key });
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    e.preventDefault();
    sendRemoteInput({ type: 'key_up', key: e.key });
  }

  return (
    <main className="min-h-screen bg-[#09111f] p-5 text-slate-100 flex flex-col">
      <header className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 shrink-0">
        <b>SwiftDesk</b>
        <span className="text-emerald-300">● Connected</span>
        {controlEnabled ? (
          <>
            <span className="ml-auto text-sm font-medium text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20 flex items-center gap-2"><MousePointerClick size={16}/> Control Enabled</span>
            <button className="secondary-button hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30" onClick={() => revokeControl(sessionId)}>Release Control</button>
          </>
        ) : (
          <button className="secondary-button ml-auto" onClick={onRequestControl}><MousePointer2 size={16}/>Request control</button>
        )}
        <button className="secondary-button"><Maximize size={16}/>Fullscreen</button>
        <button className="primary-button bg-rose-400" onClick={onDisconnect}><PhoneOff size={16}/>Disconnect</button>
      </header>
      <section className="mt-4 grid flex-1 place-items-center overflow-hidden rounded-xl bg-black relative">
        <video 
          ref={video} 
          autoPlay 
          playsInline
          muted 
          className="h-full w-full object-contain cursor-crosshair focus:outline-none" 
          tabIndex={0}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </section>
    </main>
  )
}
