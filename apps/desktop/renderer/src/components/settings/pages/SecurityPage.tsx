import { SettingToggle } from "../SettingToggle";
import { SettingSelect } from "../SettingSelect";
import { SettingsSection } from "../SettingsSection";
import { Shield, UserCheck, UserX } from "lucide-react";
import { Button } from "../../Button";

export function SecurityPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/[0.03] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Shield size={20} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-100">
              Secure connection active
            </h2>
            <p className="mt-1 text-xs leading-5 text-emerald-700/70 dark:text-emerald-200/70">
              All traffic between devices is encrypted end-to-end using WebRTC.
            </p>
          </div>
        </div>
      </section>

      <SettingsSection
        title="Session Protection"
        description="Control when access is granted to your device."
      >
        <SettingToggle
          settingKey="security.requireConnectionApproval"
          title="Require approval for incoming connections"
        />
        <SettingToggle
          settingKey="security.requireControlApproval"
          title="Require approval before remote control"
        />
        <SettingToggle
          settingKey="security.requireScreenShareApproval"
          title="Require approval before screen sharing"
        />
        <SettingSelect
          settingKey="security.sessionTimeout"
          title="Session Timeout"
          description="Automatically end sessions that are idle for this long."
          options={[
            { label: "Never", value: null },
            { label: "15 minutes", value: 15 },
            { label: "30 minutes", value: 30 },
            { label: "1 hour", value: 60 },
          ]}
        />
      </SettingsSection>
    </div>
  );
}
