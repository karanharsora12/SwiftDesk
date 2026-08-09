import { useEffect, useRef, useState } from "react";
import type { IncomingConnectionRequest } from "@swiftdesk/types";
import type { DeviceIdentity } from "../../../shared/device-identity";
import {
  type ConnectionServerStatus,
  signalingService,
} from "../services/signaling-service";
import { WebRTCService } from "../services/webrtc/WebRTCService";
import { ScreenCaptureService, type ScreenSource } from "../services/screenCapture/ScreenCaptureService";

import { RemoteControlService } from "../services/remoteControl/RemoteControlService";
import type { InputMessage } from "../services/remoteControl/InputProtocol";

export interface SignalingState {
  status: ConnectionServerStatus;
  incomingRequest: IncomingConnectionRequest | null;
  sessionMessage: string | null;
  requestConnection(targetDeviceId: string): void;
  acceptIncomingRequest(): void;
  rejectIncomingRequest(): void;
  remoteStream: MediaStream | null;
  sessionId: string | null;
  requestControl(): void;
  disconnectSession(): void;
  sendRemoteInput(message: InputMessage): void;
  approveScreenShare(sessionId: string, sdp: any, sourceId: string): void;
  approveControl(sessionId: string): void;
  denyControl(sessionId: string): void;
  revokeControl(sessionId: string): void;
  controlEnabled: boolean;
}

export interface SignalingCallbacks {
  onRequireScreenSelection?(sessionId: string, sdp: any, sources: ScreenSource[]): void;
  onRequireControlApproval?(sessionId: string): void;
}

export function useSignaling(device: DeviceIdentity | null, uiCallbacks?: SignalingCallbacks): SignalingState {
  const [status, setStatus] = useState<ConnectionServerStatus>("offline");
  const [incomingRequest, setIncomingRequest] =
    useState<IncomingConnectionRequest | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [controlEnabled, setControlEnabled] = useState<boolean>(false);
  const rtc = useRef<WebRTCService | null>(null);
  const capture = useRef(new ScreenCaptureService());
  const remoteControl = useRef<RemoteControlService | null>(null);
  
  const callbacksRef = useRef(uiCallbacks);
  useEffect(() => { callbacksRef.current = uiCallbacks; }, [uiCallbacks]);

  const createRtc = (activeSessionId: string): WebRTCService => {
    const service = new WebRTCService({
      onOffer: (sdp) =>
        signalingService.sendOffer({ sessionId: activeSessionId, sdp }),
      onAnswer: (sdp) =>
        signalingService.sendAnswer({ sessionId: activeSessionId, sdp }),
      onIceCandidate: (candidate) =>
        signalingService.sendIce({ sessionId: activeSessionId, candidate }),
      onRemoteStream: setRemoteStream,
      onStatus: (state) =>
        setSessionMessage(
          state === "connected" ? "WebRTC connected." : `WebRTC ${state}.`,
        ),
      onControlChannel: (channel) => {
        channel.onopen = () => console.debug("[DataChannel] Open");
        const rc = new RemoteControlService(channel, (message) => {
          if ((window as any).swiftDesk?.sendRemoteInput) {
            void (window as any).swiftDesk.sendRemoteInput(message);
          }
        });
        remoteControl.current = rc;
      },
    });
    rtc.current = service;
    return service;
  };

  useEffect(() => {
    if (!device) return;

    const unsubscribe = signalingService.subscribe({
      onStatusChange: setStatus,
      onIncomingRequest: setIncomingRequest,
      onAccepted: (session) => {
        setSessionId(session.sessionId);
        const peer = createRtc(session.sessionId);
        void peer
          .start("controller")
          .then(() => peer.createOffer())
          .catch(() =>
            setSessionMessage("Unable to establish the secure connection."),
          );
      },
      onRejected: () =>
        setSessionMessage("Connection rejected by remote device."),
      onTimeout: (session) => {
        setIncomingRequest((request) =>
          request?.sessionId === session.sessionId ? null : request,
        );
        setSessionMessage("Connection request timed out.");
      },
      onSessionEnded: (session) => {
        setIncomingRequest((request) =>
          request?.sessionId === session.sessionId ? null : request,
        );
        setSessionMessage("Connection ended because the peer disconnected.");
        setControlEnabled(false);
        void (window as any).swiftDesk?.releaseAllKeys?.();
      },
      onError: (error) => setSessionMessage(error.message),
      onOffer: (signal) => {
        setSessionId(signal.sessionId);
        void (async () => {
          const sources = await capture.current.getSources();
          if (!sources || sources.length === 0) {
            setSessionMessage("No screens available to share.");
            return;
          }
          if (callbacksRef.current?.onRequireScreenSelection) {
            callbacksRef.current.onRequireScreenSelection(signal.sessionId, signal.sdp, sources);
          } else {
            setSessionMessage("Screen sharing requires explicit consent UI.");
          }
        })().catch((e) => {
          console.error("[ScreenCapture] Failed to list sources", e);
          setSessionMessage("Unable to list screen sources.");
        });
      },
      onAnswer: (signal) => {
        void rtc.current?.acceptAnswer(signal.sdp);
      },
      onIce: (signal) => {
        void rtc.current?.addIceCandidate(signal.candidate);
      },
      onControlRequest: (signal) => {
        if (callbacksRef.current?.onRequireControlApproval) {
          callbacksRef.current.onRequireControlApproval(signal.sessionId);
        } else {
          signalingService.rejectControl(signal.sessionId);
        }
      },
      onControlGranted: () => {
        setSessionMessage("Remote control enabled.");
        remoteControl.current?.setEnabled(true);
        setControlEnabled(true);
      },
      onControlRevoked: () => {
        setSessionMessage("Remote control disabled.");
        remoteControl.current?.setEnabled(false);
        setControlEnabled(false);
        void (window as any).swiftDesk?.releaseAllKeys?.();
      },
    });

    signalingService.connect(device);
    return () => {
      unsubscribe();
      signalingService.disconnect();
      rtc.current?.closeConnection();
      remoteControl.current?.release();
    };
  }, [device]);

  return {
    status,
    incomingRequest,
    sessionMessage,
    requestConnection: (targetDeviceId) => {
      setSessionMessage("Connection request sent. Waiting for approval...");
      signalingService.requestConnection(targetDeviceId);
    },
    acceptIncomingRequest: () => {
      if (!incomingRequest) return;
      signalingService.acceptConnection(incomingRequest.sessionId);
      setSessionMessage(
        `Connection accepted. Session ID: ${incomingRequest.sessionId}`,
      );
      setIncomingRequest(null);
    },
    rejectIncomingRequest: () => {
      if (!incomingRequest) return;
      signalingService.rejectConnection(incomingRequest.sessionId);
      setSessionMessage("Connection request rejected.");
      setIncomingRequest(null);
    },
    remoteStream,
    sessionId,
    requestControl: () => {
      if (sessionId) signalingService.requestControl(sessionId);
    },
    disconnectSession: () => {
      rtc.current?.closeConnection();
      remoteControl.current?.release();
      setRemoteStream(null);
      setSessionId(null);
      setSessionMessage("Session disconnected.");
    },
    sendRemoteInput: (message) => {
      remoteControl.current?.send(message);
    },
    approveScreenShare: (targetSessionId, sdp, sourceId) => {
      void (async () => {
        try {
          const stream = await capture.current.capture(sourceId);
          const peer = createRtc(targetSessionId);
          await peer.start("host", stream);
          await peer.acceptOffer(sdp);
        } catch (e) {
          setSessionMessage(e instanceof Error ? `Failed to share screen: ${e.message}` : "Failed to share screen");
        }
      })();
    },
    approveControl: (targetSessionId) => {
      signalingService.grantControl(targetSessionId);
      remoteControl.current?.setEnabled(true);
      setControlEnabled(true);
    },
    denyControl: (targetSessionId) => {
      signalingService.rejectControl(targetSessionId);
    },
    revokeControl: (targetSessionId) => {
      signalingService.revokeControl(targetSessionId);
      remoteControl.current?.setEnabled(false);
      setControlEnabled(false);
      void (window as any).swiftDesk?.releaseAllKeys?.();
    },
    controlEnabled
  };
}
