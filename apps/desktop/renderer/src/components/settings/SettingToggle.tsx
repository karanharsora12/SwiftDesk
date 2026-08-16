import { useSettings } from "../../hooks/use-settings";

export function SettingToggle({
  settingKey,
  title,
  description,
}: {
  settingKey: string;
  title: string;
  description?: string;
}) {
  const { settings, updateSetting } = useSettings();

  if (!settings) return null;

  const [category, key] = settingKey.split(".");
  const value = (settings as any)[category]?.[key] as boolean;

  return (
    <label className="group flex cursor-pointer items-center justify-between gap-4 py-3.5">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={value}
          onChange={(e) => void updateSetting(settingKey, e.target.checked)}
        />
        <span
          aria-hidden="true"
          className={`block h-6 w-11 rounded-full transition-colors ${
            value ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700/80"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400/60`}
        />
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
}