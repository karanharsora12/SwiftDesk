import {
  ArrowRight,
  ChevronRight,
  Clock3,
  MonitorUp,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../Button";

const quickActions = [
  {
    id: "share",
    icon: MonitorUp,
    title: "Share my screen",
    detail: "Copy your ID to share",
    accent: "bg-sky-400/10 text-sky-300",
  },
  {
    id: "connect",
    icon: ArrowRight,
    title: "Connect to device",
    detail: "Enter an ID to request access",
    accent: "bg-violet-400/10 text-violet-300",
  },
  {
    id: "recent",
    icon: Clock3,
    title: "Recent sessions",
    detail: "Your connection history",
    accent: "bg-amber-400/10 text-amber-300",
  },
  {
    id: "settings",
    icon: SlidersHorizontal,
    title: "Settings",
    detail: "Security and preferences",
    accent: "bg-emerald-400/10 text-emerald-300",
  },
];

interface QuickActionsProps {
  onAction: (id: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <section className="surface-card min-h-0 flex-1 overflow-y-auto p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">
            <Plus size={13} /> QUICK ACTIONS
          </div>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            Everything you need, close at hand.
          </p>
        </div>
        <MoreHorizontal
          size={20}
          className="text-slate-400 dark:text-slate-500"
        />
      </div>
      <div className="mt-4 grid gap-2">
        {quickActions.map(({ id, icon: Icon, title, detail, accent }) => (
          <Button
            key={id}
            onClick={() => onAction(id)}
            className="group flex items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-colors hover:border-slate-200 dark:hover:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04]"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accent}`}
            >
              <Icon size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                {title}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                {detail}
              </span>
            </span>
            <ChevronRight
              size={16}
              className="text-slate-400 dark:text-slate-600 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300"
            />
          </Button>
        ))}
      </div>
    </section>
  );
}
