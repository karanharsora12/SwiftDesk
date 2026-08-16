import { SettingToggle } from "../SettingToggle";
import { SettingSelect } from "../SettingSelect";
import { SettingsSection } from "../SettingsSection";
import { useSettings } from "../../../hooks/use-settings";
import { Button } from "../../Button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function GeneralPage() {
  const { settings, updateSetting } = useSettings();
  const [deviceId, setDeviceId] = useState("Loading...");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.swiftDesk.getDeviceIdentity().then((identity) => {
      setDeviceId(identity.id.replace(/(\d{3})(?=\d)/g, "$1 "));
    });
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deviceId.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        title="Device"
        description="The identity other devices see when connecting to you."
      >
        <div className="py-3.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Device Name
          </label>
          <input
            type="text"
            className="input-field mt-2 w-full max-w-sm bg-white dark:bg-[#0d1624] text-slate-900 dark:text-white border-slate-200 dark:border-white/[0.1]"
            value={settings.general.deviceName}
            onChange={(e) => void updateSetting("general.deviceName", e.target.value)}
          />
        </div>
        <div className="py-3.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Device ID
          </label>
          <div className="mt-2 flex items-center gap-2.5">
            <div className="min-w-0 flex-1 truncate rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0d1624] px-3.5 py-2.5 font-mono text-sm tracking-widest text-slate-600 dark:text-slate-300 select-all">
              {deviceId}
            </div>
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="h-10 shrink-0 px-3.5 border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent"
            >
              {copied ? (
                <Check size={16} className="text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy size={16} />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SettingSelect
          settingKey="general.theme"
          title="Theme"
          description="Choose how SwiftDesk looks on this device."
          options={[
            { label: "System", value: "system" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Startup">
        <SettingToggle
          settingKey="general.startOnStartup"
          title="Start SwiftDesk when Windows starts"
        />
        <SettingToggle
          settingKey="general.startMinimized"
          title="Start minimized"
          description="Open SwiftDesk in the background when it starts."
        />
        <SettingToggle
          settingKey="general.minimizeToTray"
          title="Minimize SwiftDesk to system tray"
        />
        <SettingToggle
          settingKey="general.closeToTray"
          title="Close SwiftDesk to system tray"
          description="Keeps the application running in the background when you close the window."
        />
      </SettingsSection>
    </div>
  );
}