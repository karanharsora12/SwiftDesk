import { useEffect, useState } from "react";
import type { DeviceIdentity } from "../../shared/device-identity";
import { useSignaling } from "./hooks/use-signaling";
import { RemoteSessionPage } from "./components/RemoteSessionPage";
import type { ScreenSource } from "./services/screenCapture/ScreenCaptureService";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Laptop,
  MonitorUp,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
  MousePointer2,
} from "lucide-react";

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
    <main className="min-h-screen bg-[#09111f] text-slate-100 selection:bg-sky-400/30">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/[0.07] pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 shadow-glow">
              <MonitorUp
                size={21}
                strokeWidth={2.4}
                className="text-slate-950"
              />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                {application.name}
              </p>
              <p className="text-xs text-slate-500">
                Fast, secure remote access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium sm:flex ${isServerOnline ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300" : "border-slate-400/15 bg-slate-400/[0.07] text-slate-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isServerOnline ? "bg-emerald-400" : "bg-slate-400"}`}
              />
              Server {statusLabel}
            </div>
            <button className="icon-button" aria-label="Open settings">
              <Settings size={19} />
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2 py-1.5 text-sm">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-400/15 text-xs font-semibold text-sky-300">
                SD
              </span>
              <span className="hidden pr-1 text-slate-300 sm:block">
                Local device
              </span>
            </button>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col gap-6">
            <section className="surface-card relative overflow-hidden p-7 sm:p-9">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/[0.07] blur-3xl" />
              <div className="relative flex flex-col gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="eyebrow">
                      <Wifi size={13} /> MY DEVICE
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      Ready when you are.
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-400">
                      Your local device identity is ready for secure
                      connections.
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${isServerOnline ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300" : "border-slate-400/15 bg-slate-400/[0.07] text-slate-400"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isServerOnline ? "bg-emerald-400" : "bg-slate-400"}`}
                    />{" "}
                    {statusLabel}
                  </span>
                </div>
                <div className="rounded-2xl border border-dashed border-sky-300/20 bg-slate-950/30 px-5 py-5 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    Your SwiftDesk ID
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-2xl font-medium tracking-[0.14em] text-slate-300 sm:text-3xl">
                      {deviceIdentity?.id ?? "Loading..."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => void handleCopy()}
                        className="secondary-button"
                        disabled={copied || !deviceIdentity}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy ID"}
                      </button>
                      <button
                        onClick={() => void handleRegenerate()}
                        className="secondary-button"
                        disabled={isRegenerating || !deviceIdentity}
                      >
                        <RefreshCw
                          size={16}
                          className={isRegenerating ? "animate-spin" : ""}
                        />
                        {isRegenerating ? "Generating" : "Regenerate"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Laptop size={17} className="text-sky-300" />
                  <span>
                    {deviceIdentity?.name ?? "Loading device name..."}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    Stored on this device
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Wifi
                    size={14}
                    className={
                      isServerOnline ? "text-emerald-300" : "text-slate-500"
                    }
                  />{" "}
                  Connection server:{" "}
                  <span
                    className={
                      isServerOnline ? "text-emerald-300" : "text-slate-400"
                    }
                  >
                    {isServerOnline ? "Connected" : statusLabel}
                  </span>
                </div>
                {identityError && (
                  <p
                    className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-3 py-2 text-sm text-rose-200"
                    role="alert"
                  >
                    {identityError}
                  </p>
                )}
              </div>
            </section>

            <section className="surface-card p-7 sm:p-9">
              <div className="eyebrow">
                <ArrowRight size={13} /> CONNECT
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                Connect to another device
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                Enter a SwiftDesk ID to request a secure session.
              </p>
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row"
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
                <button
                  className="primary-button"
                  type="submit"
                  disabled={
                    remoteId.replace(/\s/g, "").length !== 9 || !isServerOnline
                  }
                >
                  Connect <ChevronRight size={17} />
                </button>
              </form>
              <p className="mt-3 text-xs text-slate-500">
                {isServerOnline
                  ? "A remote device must approve every connection request."
                  : "Start the signaling server to connect to another device."}
              </p>
              {signaling.sessionMessage && (
                <p
                  className="mt-3 rounded-xl border border-sky-400/15 bg-sky-400/[0.07] px-3 py-2 text-sm text-sky-100"
                  role="status"
                >
                  {signaling.sessionMessage}
                </p>
              )}
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            <section className="surface-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow">
                    <Plus size={13} /> QUICK ACTIONS
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Everything you need, close at hand.
                  </p>
                </div>
                <MoreHorizontal className="text-slate-500" size={20} />
              </div>
              <div className="mt-5 grid gap-2">
                {quickActions.map(({ icon: Icon, title, detail, accent }) => (
                  <button
                    key={title}
                    className="group flex items-center gap-4 rounded-xl p-3 text-left transition hover:bg-white/[0.045]"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent}`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-200">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {detail}
                      </span>
                    </span>
                    <ChevronRight
                      size={17}
                      className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/[0.1] to-blue-900/[0.1] p-6">
              <ShieldCheck size={22} className="text-sky-300" />
              <h2 className="mt-4 font-semibold text-white">
                Secure by design
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Every session will require your approval. Remote control is
                never granted automatically.
              </p>
              <button className="mt-5 text-sm font-medium text-sky-300 transition hover:text-sky-200">
                Learn about security <span aria-hidden="true">→</span>
              </button>
            </section>
          </aside>
        </section>
      </div>

      {signaling.incomingRequest && (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connection-request-title"
        >
          <section className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#101b2d] p-6 shadow-2xl">
            <div className="eyebrow">
              <Wifi size={13} /> CONNECTION REQUEST
            </div>
            <h2
              id="connection-request-title"
              className="mt-3 text-xl font-semibold text-white"
            >
              Allow this device to connect?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              <span className="font-medium text-slate-200">
                {signaling.incomingRequest.from.deviceName}
              </span>{" "}
              wants to connect to your device.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              ID:{" "}
              {signaling.incomingRequest.from.deviceId.replace(
                /(\d{3})(?=\d)/g,
                "$1 ",
              )}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="secondary-button"
                onClick={signaling.rejectIncomingRequest}
              >
                Reject
              </button>
              <button
                className="primary-button"
                onClick={signaling.acceptIncomingRequest}
              >
                Accept
              </button>
            </div>
          </section>
        </div>
      )}

      {screenPicker && (
        <div
          className="fixed inset-0 z-20 grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="screen-picker-title"
        >
          <section className="w-full max-w-3xl rounded-2xl border border-white/[0.1] bg-[#101b2d] p-6 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="eyebrow">
              <MonitorUp size={13} /> SHARE SCREEN
            </div>
            <h2
              id="screen-picker-title"
              className="mt-3 text-xl font-semibold text-white"
            >
              Choose what to share
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select a screen or window to share with the remote device.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-2">
              {screenPicker.sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSelectScreen(source.id)}
                  className="flex flex-col items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-sky-500/10 hover:border-sky-500/30 transition text-left"
                >
                  <img
                    src={source.thumbnail}
                    alt={source.name}
                    className="w-full aspect-video object-contain bg-black/40 rounded-lg border border-white/10"
                  />
                  <span className="text-sm font-medium text-slate-200 truncate w-full text-center">
                    {source.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end pt-4 border-t border-white/10 shrink-0">
              <button
                className="secondary-button"
                onClick={handleCancelScreenShare}
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}

      {controlRequest && (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="control-request-title"
        >
          <section className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#101b2d] p-6 shadow-2xl shadow-rose-900/20">
            <div className="eyebrow text-rose-400">
              <MousePointer2 size={13} /> REMOTE CONTROL REQUEST
            </div>
            <h2
              id="control-request-title"
              className="mt-3 text-xl font-semibold text-white"
            >
              Allow remote control?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The remote device is requesting permission to control your mouse
              and keyboard.
            </p>
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-xs text-rose-300 font-medium leading-relaxed">
                Only grant control to people you trust. They will be able to
                click, type, and interact with your computer as if they were
                sitting in front of it.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="secondary-button" onClick={handleDenyControl}>
                Deny
              </button>
              <button
                className="primary-button bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg shadow-rose-900/50"
                onClick={handleApproveControl}
              >
                Allow Control
              </button>
            </div>
          </section>
        </div>
      )}

      {signaling.sessionId && !signaling.remoteStream && !screenPicker && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {signaling.controlEnabled && (
            <div className="surface-card p-4 rounded-xl shadow-2xl flex items-center gap-5 border border-rose-500/40 bg-rose-950/20">
              <div className="relative">
                <MousePointer2 size={24} className="text-rose-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              </div>
              <div className="mr-2">
                <p className="text-sm font-semibold text-rose-100">
                  Remote Control Active
                </p>
                <p className="text-xs text-rose-200/70">
                  The remote device is controlling your computer.
                </p>
              </div>
              <button
                className="primary-button bg-rose-500 hover:bg-rose-600 text-white border-none shadow-none py-1.5 px-3 h-auto whitespace-nowrap"
                onClick={() => signaling.revokeControl(signaling.sessionId!)}
              >
                Disable Control
              </button>
            </div>
          )}

          <div className="surface-card p-4 rounded-xl shadow-2xl flex items-center gap-5 border border-emerald-500/30 bg-[#0d1624]">
            <div className="relative">
              <MonitorUp size={24} className="text-emerald-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mr-2">
              <p className="text-sm font-semibold text-white">Sharing Screen</p>
              <p className="text-xs text-slate-400">
                You are securely sharing your screen.
              </p>
            </div>
            <button
              className="primary-button bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 shadow-none py-1.5 px-3 h-auto whitespace-nowrap"
              onClick={signaling.disconnectSession}
            >
              Stop Sharing
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
