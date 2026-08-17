import { Settings } from "lucide-react";
import { DeviceCard } from "./DeviceCard";
import { ConnectCard } from "./ConnectCard";
import { QuickActions } from "./QuickActions";
import { SecurityPanel } from "./SecurityPanel";
import { Button } from "../Button";
import iconUrl from "../../../../resources/icon.png";
import type { DeviceIdentity } from "../../../../shared/device-identity";

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
            <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {application.name}
            </p>
            <p className="text-xs text-slate-400">Fast, secure remote access</p>
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
