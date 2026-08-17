import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "../Button";

interface ConnectCardProps {
  remoteId: string;
  isServerOnline: boolean;
  sessionMessage: string | null;
  onRemoteIdChange: (id: string) => void;
  onRequestConnection: (id: string) => void;
}

export function ConnectCard({
  remoteId,
  isServerOnline,
  sessionMessage,
  onRemoteIdChange,
  onRequestConnection,
}: ConnectCardProps) {
  return (
    <section className="surface-card shrink-0 p-6 sm:p-8">
      <div className="eyebrow">
        <ArrowRight size={13} /> CONNECT
      </div>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Connect to another device
      </h2>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
        Enter a SwiftDesk ID to request a secure session.
      </p>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onRequestConnection(remoteId);
        }}
      >
        <label className="sr-only" htmlFor="remote-id">
          Remote device ID
        </label>
        <input
          id="remote-id"
          value={remoteId}
          onChange={(event) =>
            onRemoteIdChange(
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
          disabled={remoteId.replace(/\s/g, "").length !== 9 || !isServerOnline}
        >
          Connect <ChevronRight size={17} />
        </Button>
      </form>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {isServerOnline
          ? "A remote device must approve every connection request."
          : "Start the signaling server to connect to another device."}
      </p>
      {sessionMessage && (
        <p
          className="mt-3 rounded-xl border border-sky-500/20 dark:border-sky-400/20 bg-sky-50 dark:bg-sky-400/[0.09] px-3 py-2 text-sm text-sky-700 dark:text-sky-100"
          role="status"
        >
          {sessionMessage}
        </p>
      )}
    </section>
  );
}
