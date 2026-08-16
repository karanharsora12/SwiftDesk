import { ReactNode } from "react";

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      <div className="divide-y divide-slate-200/80 dark:divide-white/[0.06] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] px-5">
        {children}
      </div>
    </section>
  );
}