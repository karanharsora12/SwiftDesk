import { Settings } from "lucide-react";
import iconUrl from "../../../../resources/icon.png";
import type { DeviceIdentity } from "../../../../shared/device-identity";
import { Button } from "../Button";
import { ConnectCard } from "./ConnectCard";
import { DeviceCard } from "./DeviceCard";
import { QuickActions } from "./QuickActions";
import { SecurityPanel } from "./SecurityPanel";
import { useUpdater } from "../../hooks/use-updater";

interface ApplicationInfo {
  name: string;
  version: string;
}

interface HomeProps {
  application: ApplicationInfo;
  deviceIdentity: DeviceIdentity | null;
  remoteId: string;
  copied: boolean;
  isRegenerating: boolean;
  identityError: string | null;
  isServerOnline: boolean;
  statusLabel: string;
  sessionMessage: string | null;
  onRemoteIdChange: (id: string) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onRequestConnection: (id: string) => void;
  onQuickAction: (id: string) => void;
  onOpenSettings: () => void;
}

export function Home({
  application,
  deviceIdentity,
  remoteId,
  copied,
  isRegenerating,
  identityError,
  isServerOnline,
  statusLabel,
  sessionMessage,
  onRemoteIdChange,
  onCopy,
  onRegenerate,
  onRequestConnection,
  onQuickAction,
  onOpenSettings,
}: HomeProps) {
  const { updaterState, downloadUpdate, installUpdate } = useUpdater();

  return (
    <div className="mx-auto flex h-full max-w-[1680px] flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <img
            src={iconUrl}
            alt="SwiftDesk Logo"
            className="h-10 w-10 rounded-xl border border-slate-200 dark:border-white/[0.08]"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                {application.name}
              </p>
              <span className="rounded-md bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                v{application.version}
              </span>
            </div>
            <p className="text-xs text-slate-400">Fast, secure remote access</p>
            {updaterState.status === "available" && (
              <button
                onClick={downloadUpdate}
                className="mt-1 text-xs text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 font-medium underline"
              >
                Update available. Click to download.
              </button>
            )}
            {updaterState.status === "downloading" && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-sky-500 dark:text-sky-400">
                  Downloading update:{" "}
                  {Math.round(updaterState.progress?.percent || 0)}%
                </span>
              </div>
            )}
            {updaterState.status === "downloaded" && (
              <button
                onClick={installUpdate}
                className="mt-1 text-xs text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium underline"
              >
                Update ready. Click to install.
              </button>
            )}
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
            onClick={onOpenSettings}
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
          <DeviceCard
            deviceIdentity={deviceIdentity}
            isServerOnline={isServerOnline}
            statusLabel={statusLabel}
            identityError={identityError}
            copied={copied}
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRegenerate={onRegenerate}
          />
          <ConnectCard
            remoteId={remoteId}
            isServerOnline={isServerOnline}
            sessionMessage={sessionMessage}
            onRemoteIdChange={onRemoteIdChange}
            onRequestConnection={onRequestConnection}
          />
        </div>

        <aside className="flex min-h-0 flex-col gap-6">
          <QuickActions onAction={onQuickAction} />
          <SecurityPanel />
        </aside>
      </section>
    </div>
  );
}
