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

      <SettingsSection
        title="Access Control"
        description="Manage which devices can reach you."
      >
        <div className="flex items-center justify-between gap-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Trusted Devices
              </h3>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Devices allowed to connect without repeated approval.
              </p>
            </div>
          </div>
          <Button variant="secondary" className="h-9 shrink-0 px-3.5 text-xs">
            Manage
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-100/60 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <UserX size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Blocked Devices
              </h3>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Devices permanently prevented from connecting.
              </p>
            </div>
          </div>
          <Button variant="secondary" className="h-9 shrink-0 px-3.5 text-xs">
            Manage
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}