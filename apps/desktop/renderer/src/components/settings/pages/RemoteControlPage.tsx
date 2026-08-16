import { SettingToggle } from "../SettingToggle";
import { SettingSelect } from "../SettingSelect";
import { SettingsSection } from "../SettingsSection";

export function RemoteControlPage() {
  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        title="Incoming Control"
        description="Remote control lets another person interact with your computer as if they were sitting in front of it."
      >
        <SettingSelect
          settingKey="remoteControl.permission"
          title="Control Permission"
          options={[
            { label: "Always ask (Recommended)", value: "always-ask" },
            { label: "Trusted devices only", value: "trusted-only" },
            { label: "Never allow", value: "never" },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Permissions">
        <SettingToggle
          settingKey="remoteControl.allowMouse"
          title="Allow mouse control"
          description="Let the remote user move your mouse and click."
        />
        <SettingToggle
          settingKey="remoteControl.allowKeyboard"
          title="Allow keyboard control"
          description="Let the remote user type on your keyboard."
        />
      </SettingsSection>

      <SettingsSection
        title="Safety"
        description="Protections while someone controls your device."
      >
        <SettingToggle
          settingKey="remoteControl.showIndicator"
          title="Show remote-control indicator"
          description="Display a persistent warning while someone is controlling your computer."
        />
        <SettingToggle
          settingKey="remoteControl.disableOnSessionEnd"
          title="Automatically disable control when session ends"
        />
        <SettingToggle
          settingKey="remoteControl.releaseKeysOnDisconnect"
          title="Release keyboard keys when connection is lost"
          description="Prevents keys from getting stuck if the connection drops unexpectedly."
        />
      </SettingsSection>
    </div>
  );
}