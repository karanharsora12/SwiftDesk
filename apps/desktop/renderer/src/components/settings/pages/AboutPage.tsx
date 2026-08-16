import { Button } from "../../Button";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import iconUrl from "../../../../../resources/icon.png";

const RESOURCES = ["SwiftDesk Website", "Privacy Policy", "Terms of Service"];

export function AboutPage() {
  const [appInfo, setAppInfo] = useState({
    name: "SwiftDesk",
    version: "Loading...",
  });

  useEffect(() => {
    window.swiftDesk.getApplicationInfo().then((info) => {
      setAppInfo(info);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center py-5 text-center">
        <img
          src={iconUrl}
          alt="SwiftDesk Logo"
          className="mb-6 h-20 w-20 rounded-2xl shadow-elevated"
        />
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {appInfo.name}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Remote access, without limits.
        </p>
        <p className="mt-4 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-500 dark:text-slate-400">
          Version {appInfo.version}
        </p>
        <div className="mt-8">
          <Button variant="primary">
            <RefreshCw size={16} />
            Check for Updates
          </Button>
        </div>
      </section>

      <section className="divide-y divide-slate-200/80 dark:divide-white/[0.06] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
        <h3 className="px-5 pb-1 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Resources
        </h3>
        {RESOURCES.map((label) => (
          <button
            key={label}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
          >
            {label}
            <ExternalLink
              size={14}
              className="text-slate-400 dark:text-slate-500"
            />
          </button>
        ))}
      </section>

      <p className="pb-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2026 SwiftDesk
      </p>
    </div>
  );
}
