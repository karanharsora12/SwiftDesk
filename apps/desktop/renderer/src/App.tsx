import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MonitorUp, MousePointer2, Wifi } from "lucide-react";
import type { DeviceIdentity } from "../../shared/device-identity";
import { RemoteSessionPage } from "./components/RemoteSessionPage";
import { useSignaling } from "./hooks/use-signaling";
import { useSettings } from "./hooks/use-settings";
import type { ScreenSource } from "./services/screenCapture/ScreenCaptureService";
import { Button } from "./components/Button";
import { SettingsLayout } from "./components/settings/SettingsLayout";
import { Home } from "./components/home/Home";

interface ApplicationInfo {
  name: string;
  version: string;
}

function formatId(id: string): string {
  return id.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export function App(): JSX.Element {
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationInfo>({
    name: "SwiftDesk",
    version: "—",
  });
  const [deviceIdentity, setDeviceIdentity] = useState<DeviceIdentity | null>(
    null,
  );
  const [remoteId, setRemoteId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [identityError, setIdentityError] = useState<string | null>(null);

  // Modals state
  const [screenPicker, setScreenPicker] = useState<{
    sessionId: string;
    sdp: any;
    sources: ScreenSource[];
  } | null>(null);
  const [controlRequest, setControlRequest] = useState<{
    sessionId: string;
  } | null>(null);

  const { settings } = useSettings();

  const signaling = useSignaling(deviceIdentity, settings, {
    onRequireScreenSelection: (sessionId, sdp, sources) => {
      setScreenPicker({ sessionId, sdp, sources });
    },
    onRequireControlApproval: (sessionId) => {
      setControlRequest({ sessionId });
    },
  });

  useEffect(() => {
    let active = true;

    void Promise.all([
      window.swiftDesk.getApplicationInfo(),
      window.swiftDesk.getDeviceIdentity(),
    ])
      .then(([appInfo, identity]) => {
        if (!active) return;
        setApplication({ name: appInfo.name, version: appInfo.version });
        setDeviceIdentity(identity);
      })
      .catch(() => {
        if (active)
          setIdentityError(
            "Your device identity could not be loaded. Restart SwiftDesk to try again.",
          );
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.swiftDesk.checkForUpdates();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (deviceIdentity && settings?.general?.deviceName && deviceIdentity.name !== settings.general.deviceName) {
      setDeviceIdentity({ ...deviceIdentity, name: settings.general.deviceName });
    }
  }, [settings?.general?.deviceName, deviceIdentity]);

  const handleCopy = async (): Promise<void> => {
    if (!deviceIdentity) return;

    try {
      await navigator.clipboard.writeText(deviceIdentity.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setIdentityError(
        "SwiftDesk could not copy the device ID. Please select and copy it manually.",
      );
    }
  };

  const handleRegenerate = async (): Promise<void> => {
    if (
      !window.confirm(
        "Generate a new SwiftDesk ID? Existing contacts will no longer be able to use your current ID.",
      )
    ) {
      return;
    }

    setIsRegenerating(true);
    setIdentityError(null);
    try {
      setDeviceIdentity(await window.swiftDesk.regenerateDeviceId());
    } catch {
      setIdentityError(
        "SwiftDesk could not generate a new device ID. Please try again.",
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSelectScreen = (sourceId: string) => {
    if (!screenPicker) return;
    signaling.approveScreenShare(
      screenPicker.sessionId,
      screenPicker.sdp,
      sourceId,
    );
    setScreenPicker(null);
  };

  const handleCancelScreenShare = () => {
    if (screenPicker) signaling.disconnectSession();
    setScreenPicker(null);
  };

  const handleApproveControl = () => {
    if (!controlRequest) return;
    signaling.approveControl(controlRequest.sessionId);
    setControlRequest(null);
  };

  const handleDenyControl = () => {
    if (!controlRequest) return;
    signaling.denyControl(controlRequest.sessionId);
    setControlRequest(null);
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "share":
        void handleCopy();
        break;
      case "connect":
        document.getElementById("remote-id")?.focus();
        break;
      case "recent":
      case "settings":
        navigate("/settings");
        break;
    }
  };

  const isServerOnline = signaling.status === "online";
  const statusLabel =
    signaling.status === "online"
      ? "Online"
      : signaling.status === "connecting"
        ? "Connecting"
        : "Offline";

  if (signaling.remoteStream)
    return (
      <RemoteSessionPage
        stream={signaling.remoteStream}
        onDisconnect={signaling.disconnectSession}
        onRequestControl={signaling.requestControl}
        sendRemoteInput={signaling.sendRemoteInput}
        controlEnabled={signaling.controlEnabled}
        revokeControl={signaling.revokeControl}
        sessionId={signaling.sessionId!}
      />
    );

  return (
    <main className="h-screen overflow-hidden bg-slate-50 dark:bg-[#09111f] text-slate-900 dark:text-slate-100 selection:bg-sky-400/30 relative">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              application={application}
              deviceIdentity={deviceIdentity}
              remoteId={remoteId}
              copied={copied}
              isRegenerating={isRegenerating}
              identityError={identityError}
              isServerOnline={isServerOnline}
              statusLabel={statusLabel}
              sessionMessage={signaling.sessionMessage}
              onRemoteIdChange={setRemoteId}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              onRequestConnection={signaling.requestConnection}
              onQuickAction={handleQuickAction}
              onOpenSettings={() => navigate("/settings")}
            />
          }
        />
        <Route
          path="/settings/*"
          element={
            <SettingsLayout
              onClose={() => navigate("/")}
              onRequestConnection={signaling.requestConnection}
            />
          }
        />
      </Routes>

      {/* Connection request modal */}
      {signaling.incomingRequest && (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-request-title"
        >
          <section className="modal-in w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow">
              <Wifi size={13} /> CONNECTION REQUEST
            </div>
            <h2
              id="connection-request-title"
              className="mt-4 text-xl font-semibold text-slate-900 dark:text-white"
            >
              Allow this device to connect?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {signaling.incomingRequest.from.deviceName}
              </span>{" "}
              wants to connect to your device.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              ID: {formatId(signaling.incomingRequest.from.deviceId)}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                className="w-full md:w-auto"
                onClick={signaling.rejectIncomingRequest}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="w-full md:w-auto"
                onClick={signaling.acceptIncomingRequest}
              >
                Accept
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Screen picker modal */}
      {screenPicker && (
        <div
          className="fixed inset-0 z-20 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="screen-picker-title"
        >
          <section className="modal-in flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow">
              <MonitorUp size={13} /> SHARE SCREEN
            </div>
            <h2
              id="screen-picker-title"
              className="mt-4 text-xl font-semibold text-slate-900 dark:text-white"
            >
              Choose what to share
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Select a screen or window to share with the remote device.
            </p>
            <div className="mt-5 flex min-h-0 flex-col gap-6 overflow-y-auto pr-2">
              {/* Screens Section */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Screens
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {screenPicker.sources
                    .filter((s) => s.id.startsWith("screen:"))
                    .map((source) => (
                      <Button
                        key={source.id}
                        onClick={() => handleSelectScreen(source.id)}
                        className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 transition-all hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      >
                        <img
                          src={source.thumbnail}
                          alt={source.name}
                          className="aspect-video w-full rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-200 dark:bg-black/40 object-contain"
                        />
                        <span
                          className="w-full truncate text-center text-sm font-medium text-slate-900 dark:text-slate-100"
                          title={source.name || "Entire Screen"}
                        >
                          {source.name || "Entire Screen"}
                        </span>
                      </Button>
                    ))}
                </div>
              </div>

              {/* Windows Section */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Windows
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {screenPicker.sources
                    .filter((s) => s.id.startsWith("window:"))
                    .map((source) => (
                      <Button
                        key={source.id}
                        onClick={() => handleSelectScreen(source.id)}
                        className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 transition-all hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      >
                        <img
                          src={source.thumbnail}
                          alt={source.name}
                          className="aspect-video w-full rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-200 dark:bg-black/40 object-contain"
                        />
                        <span
                          className="w-full truncate text-center text-sm font-medium text-slate-900 dark:text-slate-100"
                          title={source.name || "Window"}
                        >
                          {source.name || "Window"}
                        </span>
                      </Button>
                    ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end border-t border-white/[0.06] pt-4">
              <Button
                variant="secondary"
                className="w-full md:w-auto"
                onClick={handleCancelScreenShare}
              >
                Cancel
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Control request modal */}
      {controlRequest && (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="control-request-title"
        >
          <section className="modal-in w-full max-w-md rounded-2xl border border-rose-500/30 bg-white dark:bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow text-rose-500 dark:text-rose-400">
              <MousePointer2 size={13} /> REMOTE CONTROL REQUEST
            </div>
            <h2
              id="control-request-title"
              className="mt-4 text-xl font-semibold text-slate-900 dark:text-white"
            >
              Allow remote control?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The remote device is requesting permission to control your mouse
              and keyboard.
            </p>
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-3">
              <p className="text-xs font-medium leading-relaxed text-rose-700 dark:text-rose-300">
                Only grant control to people you trust. They will be able to
                click, type, and interact with your computer as if they were
                sitting in front of it.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                className="w-full md:w-auto"
                onClick={handleDenyControl}
              >
                Deny
              </Button>
              <Button
                variant="danger"
                className="w-full md:w-auto"
                onClick={handleApproveControl}
              >
                Allow Control
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Session toasts */}
      {signaling.sessionId && !signaling.remoteStream && !screenPicker && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {signaling.controlEnabled && (
            <div className="toast-in flex items-center gap-4 rounded-2xl border border-rose-500/20 dark:border-rose-500/40 bg-white dark:bg-rose-950/40 p-4 shadow-elevated">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/15">
                <MousePointer2
                  size={20}
                  className="text-rose-500 dark:text-rose-400"
                />
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
              </span>
              <div>
                <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                  Remote Control Active
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-200/70">
                  The remote device is controlling your computer.
                </p>
              </div>
              <Button
                variant="danger"
                className="h-auto whitespace-nowrap px-3 py-1.5 text-xs"
                onClick={() => signaling.revokeControl(signaling.sessionId!)}
              >
                Disable Control
              </Button>
            </div>
          )}

          <div className="toast-in flex items-center gap-4 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 bg-white dark:bg-[#0d1624] p-4 shadow-elevated">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15">
              <MonitorUp
                size={20}
                className="text-emerald-500 dark:text-emerald-400"
              />
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Sharing Screen
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You are securely sharing your screen.
              </p>
            </div>
            <Button
              variant="secondary"
              className="h-auto whitespace-nowrap px-3 py-1.5 text-xs"
              onClick={signaling.disconnectSession}
            >
              Stop Sharing
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
