import type { SwiftDeskSettings } from "../../../../shared/settings";

export interface ScreenSource {
  id: string;
  name: string;
  thumbnail: string;
}
export class ScreenCaptureService {
  async getSources(): Promise<ScreenSource[]> {
    const sources = await window.swiftDesk.getScreenSources();
    if (import.meta.env.DEV)
      console.debug("[ScreenCapture] Sources available", sources.length);
    return sources;
  }
  async capture(
    sourceId: string,
    settings?: SwiftDeskSettings | null,
  ): Promise<MediaStream> {
    if (import.meta.env.DEV) console.debug("[ScreenCapture] Source selected");
    await window.swiftDesk.selectScreenSource(sourceId);
    let stream: MediaStream;
    try {
      const fps = settings?.screenSharing?.fps || 30;
      const res = settings?.screenSharing?.resolution || "auto";

      const constraints: any = {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId,
        minFrameRate: fps,
        maxFrameRate: fps,
      };

      if (res === "1080p") {
        constraints.maxWidth = 1920;
        constraints.maxHeight = 1080;
      } else if (res === "720p") {
        constraints.maxWidth = 1280;
        constraints.maxHeight = 720;
      }

      // Use getUserMedia with chromeMediaSource for stable capture in Electron
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: constraints,
        } as any,
      });
    } catch (error: unknown) {
      const message =
        error instanceof DOMException
          ? `${error.name}: ${error.message}`
          : "Unknown display-capture error";
      console.error("[ScreenCapture] getUserMedia failed", message);
      throw new Error(message);
    }
    if (import.meta.env.DEV)
      console.debug("[ScreenCapture] Stream created", {
        tracks: stream.getTracks().length,
        videoTracks: stream.getVideoTracks().length,
        live: stream.getVideoTracks()[0]?.readyState === "live",
      });
    return stream;
  }
  stop(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop());
  }
}
