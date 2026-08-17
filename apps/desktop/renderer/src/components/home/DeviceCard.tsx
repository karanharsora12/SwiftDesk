import { Check, Copy, Laptop, RefreshCw, Wifi } from "lucide-react";
import { Button } from "../Button";
import type { DeviceIdentity } from "../../../../shared/device-identity";

interface DeviceCardProps {
  deviceIdentity: DeviceIdentity | null;
  isServerOnline: boolean;
  statusLabel: string;
  identityError: string | null;
  copied: boolean;
  isRegenerating: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
}

function formatId(id: string): string {
  return id.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export function DeviceCard({
  deviceIdentity,
  isServerOnline,
  statusLabel,
  identityError,
  copied,
  isRegenerating,
  onCopy,
  onRegenerate,
}: DeviceCardProps) {
  return (
    <section className="surface-card relative min-h-0 flex-1 overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-[30px] -top-[30px] h-64 w-64 rounded-full bg-sky-400/[0.05] blur-3xl" />
      <div className="relative flex flex-col gap-6 overflow-y-auto pr-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow">
              <Wifi size={13} /> MY DEVICE
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ready when you are.
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Your local device identity is ready for secure connections.
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

        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-sky-300/20 bg-slate-100/50 dark:bg-slate-950/25 px-6 py-5 sm:px-7">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Your SwiftDesk ID
          </p>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-2xl font-bold tracking-[0.14em] text-slate-900 dark:text-slate-100 sm:text-3xl">
              {deviceIdentity ? formatId(deviceIdentity.id) : "Loading..."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={onCopy}
                disabled={copied || !deviceIdentity}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy ID"}
              </Button>
              <Button
                variant="secondary"
                onClick={onRegenerate}
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
          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <Laptop
              size={17}
              className="text-sky-500 dark:text-sky-300 shrink-0"
            />
            <span className="truncate">
              {deviceIdentity?.name ?? "Loading device name..."}
            </span>
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 shrink-0">
              Stored on this device
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Wifi
              size={14}
              className={`shrink-0 ${
                isServerOnline
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            />
            <span className="truncate">
              Connection server:{" "}
              <span
                className={
                  isServerOnline
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-slate-500 dark:text-slate-400"
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
  );
}
