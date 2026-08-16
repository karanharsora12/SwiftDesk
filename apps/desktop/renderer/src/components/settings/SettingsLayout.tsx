import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  Clock3,
  Info,
  Link2,
  MonitorUp,
  MousePointer2,
  RefreshCw,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../Button";
import { useSettings } from "../../hooks/use-settings";

import { GeneralPage } from "./pages/GeneralPage";
import { ConnectionPage } from "./pages/ConnectionPage";
import { ScreenSharingPage } from "./pages/ScreenSharingPage";
import { RemoteControlPage } from "./pages/RemoteControlPage";
import { SecurityPage } from "./pages/SecurityPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SessionsPage } from "./pages/SessionsPage";
import { AboutPage } from "./pages/AboutPage";

interface Tab {
  id: string;
  label: string;
  icon: typeof Settings;
}

const PREFS_TABS: Tab[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "connection", label: "Connection", icon: Link2 },
  { id: "screen-sharing", label: "Screen Sharing", icon: MonitorUp },
  { id: "remote-control", label: "Remote Control", icon: MousePointer2 },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "sessions", label: "Sessions", icon: Clock3 },
];

const ABOUT_TAB: Tab = { id: "about", label: "About", icon: Info };

export function SettingsLayout({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<string>("general");
  const { resetSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case "general":
        return <GeneralPage />;
      case "connection":
        return <ConnectionPage />;
      case "screen-sharing":
        return <ScreenSharingPage />;
      case "remote-control":
        return <RemoteControlPage />;
      case "security":
        return <SecurityPage />;
      case "notifications":
        return <NotificationsPage />;
      case "sessions":
        return <SessionsPage />;
      case "about":
        return <AboutPage />;
      default:
        return <GeneralPage />;
    }
  };

  const renderTab = (tab: Tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-sky-50 dark:bg-sky-400/10 text-sky-600 dark:text-sky-200"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
            isActive
              ? "bg-sky-100/50 dark:bg-sky-400/15 text-sky-600 dark:text-sky-300"
              : "bg-slate-100/50 dark:bg-white/[0.04] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
          }`}
        >
          <Icon size={16} />
        </span>
        <span className="truncate">{tab.label}</span>
      </button>
    );
  };

  const handleReset = async () => {
    setIsResetting(true);
    await resetSettings();
    setIsResetting(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#09111f] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#0d1624]/70 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onClose}
            aria-label="Go back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100/50 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize how SwiftDesk works for you
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 dark:border-emerald-400/15 bg-emerald-50 dark:bg-emerald-400/[0.07] px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300 sm:inline-flex">
          <Check size={12} />
          Saved automatically
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <nav className="flex w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r border-slate-200 dark:border-white/[0.06] bg-slate-100/50 dark:bg-[#0d1624]/40 p-3">
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Preferences
          </p>
          {PREFS_TABS.map(renderTab)}

          <div className="mx-2 my-2 border-t border-slate-200 dark:border-white/[0.06]" />
          {renderTab(ABOUT_TAB)}

          <div className="mt-auto border-t border-slate-200 dark:border-white/[0.06] px-2 pt-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <RefreshCw size={16} />
              </span>
              Reset Settings
            </button>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div key={activeTab} className="settings-page mx-auto max-w-2xl pb-8">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="modal-in w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101b2d] p-6 shadow-elevated">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <RefreshCw size={20} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              Reset all settings?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your SwiftDesk settings will return to their default values. This
              will not delete your Device ID or sessions.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => void handleReset()}
                disabled={isResetting}
              >
                {isResetting ? "Resetting..." : "Reset Settings"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}