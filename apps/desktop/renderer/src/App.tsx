import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Laptop,
  MonitorUp,
  MoreHorizontal,
  MousePointer2,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import iconUrl from "../../resources/icon.png";
import type { DeviceIdentity } from "../../shared/device-identity";
import { RemoteSessionPage } from "./components/RemoteSessionPage";
import { useSignaling } from "./hooks/use-signaling";
import type { ScreenSource } from "./services/screenCapture/ScreenCaptureService";
import { Button } from "./components/Button";

interface ApplicationInfo {
  name: string;
  version: string;
}

const quickActions = [
  {
    icon: MonitorUp,
    title: "Share my screen",
    detail: "Start a secure support session",
    accent: "bg-sky-400/10 text-sky-300",
  },
  {
    icon: ArrowRight,
    title: "Connect to device",
    detail: "Enter an ID to request access",
    accent: "bg-violet-400/10 text-violet-300",
  },
  {
    icon: Clock3,
    title: "Recent sessions",
    detail: "Your connection history",
    accent: "bg-amber-400/10 text-amber-300",
  },
  {
    icon: SlidersHorizontal,
    title: "Settings",
    detail: "Security and preferences",
    accent: "bg-emerald-400/10 text-emerald-300",
  },
];

function formatId(id: string): string {
  return id.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export function App(): JSX.Element {
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

  const signaling = useSignaling(deviceIdentity, {
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
    if (screenPicker) signaling.disconnectSession(); // Abort session
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
    <main className="h-screen overflow-hidden bg-[#09111f] text-slate-100 selection:bg-sky-400/30">
      <div className="mx-auto flex h-full max-w-[1680px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={iconUrl}
              alt="SwiftDesk Logo"
              className="h-10 w-10 rounded-xl border border-white/[0.08]"
            />
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                {application.name}
              </p>
              <p className="text-xs text-slate-400">
                Fast, secure remote access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium sm:inline-flex ${
                isServerOnline
                  ? "border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-300"
                  : "border-slate-400/20 bg-slate-400/[0.09] text-slate-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isServerOnline ? "bg-emerald-400" : "bg-slate-400"
                } animate-pulse`}
              />
              Server {statusLabel}
            </span>
            <Button
              variant="icon"
              className="h-10 w-10"
              aria-label="Open settings"
            >
              <Settings size={18} />
            </Button>
            <Button className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-2.5 py-1.5 text-sm transition-colors hover:bg-white/[0.07]">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-400/15 text-xs font-semibold text-sky-300">
                SD
              </span>
              <span className="hidden pr-1 text-slate-300 sm:block">
                Local device
              </span>
            </Button>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-0 flex-col gap-6">
            {/* Device card */}
            <section className="surface-card relative min-h-0 flex-1 overflow-hidden p-6 sm:p-8">
              <div className="absolute -right-[30px] -top-[30px] h-64 w-64 rounded-full bg-sky-400/[0.05] blur-3xl" />
              <div className="relative flex flex-col gap-6 overflow-y-auto pr-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow">
                      <Wifi size={13} /> MY DEVICE
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
                      Ready when you are.
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-300">
                      Your local device identity is ready for secure
                      connections.
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      isServerOnline
                        ? "border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-300"
                        : "border-slate-400/20 bg-slate-400/[0.09] text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isServerOnline ? "bg-emerald-400" : "bg-slate-400"
                      } animate-pulse`}
                    />{" "}
                    {statusLabel}
                  </span>
                </div>

                <div className="rounded-2xl border border-dashed border-sky-300/20 bg-slate-950/25 px-6 py-5 sm:px-7">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                    Your SwiftDesk ID
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-[0.14em] text-slate-100 sm:text-3xl">
                      {deviceIdentity
                        ? formatId(deviceIdentity.id)
                        : "Loading..."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => void handleCopy()}
                        disabled={copied || !deviceIdentity}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy ID"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => void handleRegenerate()}
                        disabled={isRegenerating || !deviceIdentity}
                      >
                        <RefreshCw
                          size={16}
                          className={isRegenerating ? "animate-pulse" : ""}
                        />
                        {isRegenerating ? "Generating" : "Regenerate"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Laptop size={17} className="text-sky-300 shrink-0" />
                    <span className="truncate">
                      {deviceIdentity?.name ?? "Loading device name..."}
                    </span>
                    <span className="ml-auto text-xs text-slate-400 shrink-0">
                      Stored on this device
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Wifi
                      size={14}
                      className={`shrink-0 ${isServerOnline ? "text-emerald-400" : "text-slate-400"}`}
                    />
                    <span className="truncate">
                      Connection server:{" "}
                      <span
                        className={
                          isServerOnline ? "text-emerald-400 font-medium" : "text-slate-400"
                        }
                      >
                        {isServerOnline ? "Connected" : statusLabel}
                      </span>
                    </span>
                  </div>
                </div>

                {identityError && (
                  <p
                    className="rounded-xl border border-rose-400/20 bg-rose-400/[0.09] px-3 py-2 text-sm text-rose-200"
                    role="alert"
                  >
                    {identityError}
                  </p>
                )}
              </div>
            </section>

            {/* Connect card */}
            <section className="surface-card shrink-0 p-6 sm:p-8">
              <div className="eyebrow">
                <ArrowRight size={13} /> CONNECT
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Connect to another device
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Enter a SwiftDesk ID to request a secure session.
              </p>
              <form
                className="mt-5 flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  signaling.requestConnection(remoteId);
                }}
              >
                <label className="sr-only" htmlFor="remote-id">
                  Remote device ID
                </label>
                <input
                  id="remote-id"
                  value={remoteId}
                  onChange={(event) =>
                    setRemoteId(
                      event.target.value.replace(/[^0-9 ]/g, "").slice(0, 11),
                    )
                  }
                  placeholder="Enter remote device ID"
                  className="input-field flex-1"
                  inputMode="numeric"
                />
                <Button
                  variant="primary"
                  className="whitespace-nowrap"
                  type="submit"
                  disabled={
                    remoteId.replace(/\s/g, "").length !== 9 || !isServerOnline
                  }
                >
                  Connect <ChevronRight size={17} />
                </Button>
              </form>
              <p className="mt-3 text-xs text-slate-400">
                {isServerOnline
                  ? "A remote device must approve every connection request."
                  : "Start the signaling server to connect to another device."}
              </p>
              {signaling.sessionMessage && (
                <p
                  className="mt-3 rounded-xl border border-sky-400/20 bg-sky-400/[0.09] px-3 py-2 text-sm text-sky-100"
                  role="status"
                >
                  {signaling.sessionMessage}
                </p>
              )}
            </section>
          </div>

          <aside className="flex min-h-0 flex-col gap-6">
            {/* Quick actions */}
            <section className="surface-card min-h-0 flex-1 overflow-y-auto p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow">
                    <Plus size={13} /> QUICK ACTIONS
                  </div>
                  <p className="mt-1.5 text-sm text-slate-300">
                    Everything you need, close at hand.
                  </p>
                </div>
                <MoreHorizontal size={20} className="text-slate-500" />
              </div>
              <div className="mt-4 grid gap-2">
                {quickActions.map(({ icon: Icon, title, detail, accent }) => (
                  <Button
                    key={title}
                    className="group flex items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accent}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-200">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {detail}
                      </span>
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-600 transition-colors group-hover:text-slate-300"
                    />
                  </Button>
                ))}
              </div>
            </section>

            {/* Security */}
            <section className="shrink-0 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.08] to-transparent p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-sky-300">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <h2 className="font-semibold text-white">Secure by design</h2>
                  <p className="mt-1 text-sm leading-5 text-slate-300">
                    Every session requires your approval. Remote control is
                    never granted automatically.
                  </p>
                </div>
              </div>
              <Button ripple={false} className="mt-3 text-sm font-medium text-sky-300 transition-colors hover:text-sky-200">
                Learn about security <span aria-hidden="true">→</span>
              </Button>
            </section>
          </aside>
        </section>
      </div>

      {/* Connection request modal */}
      {signaling.incomingRequest && (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-request-title"
        >
          <section className="modal-in w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow">
              <Wifi size={13} /> CONNECTION REQUEST
            </div>
            <h2
              id="connection-request-title"
              className="mt-4 text-xl font-semibold text-white"
            >
              Allow this device to connect?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              <span className="font-medium text-slate-100">
                {signaling.incomingRequest.from.deviceName}
              </span>{" "}
              wants to connect to your device.
            </p>
            <p className="mt-2 text-xs text-slate-400">
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
          <section className="modal-in flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-white/[0.1] bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow">
              <MonitorUp size={13} /> SHARE SCREEN
            </div>
            <h2
              id="screen-picker-title"
              className="mt-4 text-xl font-semibold text-white"
            >
              Choose what to share
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Select a screen or window to share with the remote device.
            </p>
            <div className="mt-5 flex min-h-0 flex-col gap-6 overflow-y-auto pr-2">
              {/* Screens Section */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Screens
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {screenPicker.sources
                    .filter((s) => s.id.startsWith("screen:"))
                    .map((source) => (
                      <Button
                        key={source.id}
                        onClick={() => handleSelectScreen(source.id)}
                        className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
                      >
                        <img
                          src={source.thumbnail}
                          alt={source.name}
                          className="aspect-video w-full rounded-lg border border-white/[0.1] bg-black/40 object-contain"
                        />
                        <span className="w-full truncate text-center text-sm font-medium text-slate-100" title={source.name || "Entire Screen"}>
                          {source.name || "Entire Screen"}
                        </span>
                      </Button>
                    ))}
                </div>
              </div>

              {/* Windows Section */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Windows
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {screenPicker.sources
                    .filter((s) => s.id.startsWith("window:"))
                    .map((source) => (
                      <Button
                        key={source.id}
                        onClick={() => handleSelectScreen(source.id)}
                        className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]"
                      >
                        <img
                          src={source.thumbnail}
                          alt={source.name}
                          className="aspect-video w-full rounded-lg border border-white/[0.1] bg-black/40 object-contain"
                        />
                        <span className="w-full truncate text-center text-sm font-medium text-slate-100" title={source.name || "Window"}>
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
          <section className="modal-in w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#101b2d] p-6 shadow-elevated">
            <div className="eyebrow text-rose-400">
              <MousePointer2 size={13} /> REMOTE CONTROL REQUEST
            </div>
            <h2
              id="control-request-title"
              className="mt-4 text-xl font-semibold text-white"
            >
              Allow remote control?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The remote device is requesting permission to control your mouse
              and keyboard.
            </p>
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
              <p className="text-xs font-medium leading-relaxed text-rose-300">
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
            <div className="toast-in flex items-center gap-4 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 shadow-elevated">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/15">
                <MousePointer2 size={20} className="text-rose-400" />
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
              </span>
              <div>
                <p className="text-sm font-semibold text-rose-100">
                  Remote Control Active
                </p>
                <p className="text-xs text-rose-200/70">
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

          <div className="toast-in flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-[#0d1624] p-4 shadow-elevated">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15">
              <MonitorUp size={20} className="text-emerald-400" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Sharing Screen</p>
              <p className="text-xs text-slate-400">
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
