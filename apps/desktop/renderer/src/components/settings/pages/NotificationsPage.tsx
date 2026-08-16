import { SettingToggle } from "../SettingToggle";
import { SettingsSection } from "../SettingsSection";

export function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        title="Connection"
        description="Get notified about connection activity."
      >
        <SettingToggle
          settingKey="notifications.connectionRequests"
          title="Connection requests"
        />
        <SettingToggle
          settingKey="notifications.connectionAccepted"
          title="Connection accepted"
        />
        <SettingToggle
          settingKey="notifications.connectionRejected"
          title="Connection rejected"
        />
        <SettingToggle
          settingKey="notifications.disconnected"
          title="Device disconnected"
        />
      </SettingsSection>

      <SettingsSection title="Remote Control">
        <SettingToggle
          settingKey="notifications.controlEnabled"
          title="Remote control enabled"
        />
        <SettingToggle
          settingKey="notifications.controlDisabled"
          title="Remote control disabled"
        />
      </SettingsSection>

      <SettingsSection title="System">
        <SettingToggle
          settingKey="notifications.updates"
          title="Updates"
          description="Notify when a new version of SwiftDesk is available."
        />
        <SettingToggle
          settingKey="notifications.errors"
          title="Errors"
          description="Show alerts for connection or system errors."
        />
      </SettingsSection>
    </div>
  );
}