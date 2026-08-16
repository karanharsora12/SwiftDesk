import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  PhoneOff,
  MousePointerClick,
  MonitorUp,
  Unlock,
} from "lucide-react";
import type { InputMessage } from "../services/remoteControl/InputProtocol";
import { Button } from "./Button";

function formatId(id: string): string {
  return id.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export function RemoteSessionPage({
  stream,
  onDisconnect,
  onRequestControl,
  sendRemoteInput,
  controlEnabled,
  revokeControl,
  sessionId,
}: {
  stream: MediaStream;
  onDisconnect(): void;
  onRequestControl(): void;
  sendRemoteInput(message: InputMessage): void;
  controlEnabled: boolean;
  revokeControl(sessionId: string): void;
  sessionId: string;
}): JSX.Element {
  const video = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (video.current) {
      video.current.srcObject = stream;
      void video.current.play().catch(() => undefined);
    }
  }, [stream]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* fullscreen not supported */
    }
  };

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

    if (
      actualX < 0 ||
      actualX > displayedWidth ||
      actualY < 0 ||
      actualY > displayedHeight
    )
      return;

    const x = actualX / displayedWidth;
    const y = actualY / displayedHeight;
    sendRemoteInput({ type: "mouse_move", x, y });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLVideoElement>) => {
    const buttons: Record<number, "left" | "middle" | "right"> = {
      0: "left",
      1: "middle",
      2: "right",
    };
    const button = buttons[e.button];
    if (button) sendRemoteInput({ type: "mouse_down", button });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLVideoElement>) => {
    const buttons: Record<number, "left" | "middle" | "right"> = {
      0: "left",
      1: "middle",
      2: "right",
    };
    const button = buttons[e.button];
    if (button) sendRemoteInput({ type: "mouse_up", button });
  };

  const handleWheel = (e: React.WheelEvent<HTMLVideoElement>) => {
    sendRemoteInput({
      type: "mouse_wheel",
      deltaX: e.deltaX,
      deltaY: e.deltaY,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    e.preventDefault();
    sendRemoteInput({ type: "key_down", key: e.key });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    e.preventDefault();
    sendRemoteInput({ type: "key_up", key: e.key });
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0b1220] text-slate-100">
      {/* Slim header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0e1726] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-400/15 text-sky-300">
            <MonitorUp size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-white">
              Remote Session
            </p>
            <p className="truncate text-[11px] text-slate-400">
              SwiftDesk · {formatId(sessionId)}
            </p>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
              controlEnabled
                ? "bg-rose-500/[0.12] text-rose-300"
                : "bg-sky-400/[0.12] text-sky-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                controlEnabled ? "bg-rose-400" : "bg-sky-400"
              } animate-pulse`}
            />
            {controlEnabled ? "Controlling" : "Viewing"}
          </span>

          {controlEnabled ? (
            <Button
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white"
              onClick={() => revokeControl(sessionId)}
              title="Release remote control"
            >
              <MousePointerClick size={14} className="text-rose-400" />
              Release Control
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white"
              onClick={onRequestControl}
              title="Request control of the remote device"
            >
              <Unlock size={14} className="text-sky-400" />
              Request Control
            </Button>
          )}

          <div className="h-5 w-px bg-white/10" />

          <Button
            variant="icon"
            className="h-9 w-9"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
          <Button variant="danger" className="px-4 py-1.5 text-xs" onClick={onDisconnect}>
            <PhoneOff size={14} /> Disconnect
          </Button>
        </div>
      </header>

      {/* Video stage */}
      <section className="relative min-h-0 flex-1 p-3">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/[0.06]">
          <video
            ref={video}
            autoPlay
            playsInline
            muted
            className="h-full w-full cursor-none object-contain outline-none"
            tabIndex={0}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onContextMenu={(e) => e.preventDefault()}
          />



          {/* Mouse pointer overlay when viewing */}
          {!controlEnabled && (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><path d=%22M10 0L15 5L20 5L12 9L17 14L10 11L3 14L8 9L0 5L5 5Z fill=%22%2338bdf8%22/%3E</svg>')] bg-contain bg-no-repeat"
                style={{ width: "20px", height: "20px" }}
              ></div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
