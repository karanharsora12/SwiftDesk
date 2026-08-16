import { Button } from "../../Button";
import { Clock3, Monitor, Plug, Trash2 } from "lucide-react";

interface Session {
  name: string;
  deviceId: string;
  when: string;
  duration: string;
}

const SESSIONS: Session[] = [
  {
    name: "Office PC",
    deviceId: "123 456 789",
    when: "Today • 11:42 AM",
    duration: "18 min",
  },
  {
    name: "Home Server",
    deviceId: "987 654 321",
    when: "Yesterday • 09:15 PM",
    duration: "45 min",
  },
];

export function SessionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Recent Sessions
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Devices you have connected to recently.
            </p>
          </div>
          <Button
            variant="secondary"
            className="h-9 shrink-0 px-3.5 text-xs"
          >
            <Trash2 size={14} />
            Clear History
          </Button>
        </div>

        <div className="space-y-3">
          {SESSIONS.map((session) => (
            <div
              key={session.deviceId}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-4 transition-colors hover:border-slate-300 dark:hover:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-white/[0.04]"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100/50 dark:bg-sky-400/10 text-sky-600 dark:text-sky-300">
                  <Monitor size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {session.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    Device ID: {session.deviceId}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 size={12} />
                    {session.when} • {session.duration}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="secondary"
                  className="h-9 px-3 text-xs"
                >
                  <Trash2 size={14} />
                  Remove
                </Button>
                <Button variant="primary" className="h-9 px-4 text-xs">
                  <Plug size={14} />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}