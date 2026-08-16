import { SettingToggle } from "../SettingToggle";
import { SettingSelect } from "../SettingSelect";
import { SettingsSection } from "../SettingsSection";

export function ConnectionPage() {
  return (
    <div className="flex flex-col gap-8">
      <SettingsSection
        title="Connection Quality"
        description="Balance responsiveness against image clarity."
      >
        <SettingSelect
          settingKey="connection.quality"
          title="Quality"
          options={[
            { label: "Auto", value: "auto" },
            { label: "Low", value: "low" },
            { label: "Balanced", value: "balanced" },
            { label: "High", value: "high" },
          ]}
        />
        <SettingSelect
          settingKey="connection.fps"
          title="Frame Rate"
          options={[
            { label: "15 FPS", value: 15 },
            { label: "30 FPS", value: 30 },
            { label: "60 FPS", value: 60 },
          ]}
        />
        <SettingSelect
          settingKey="connection.resolution"
          title="Resolution"
          options={[
            { label: "Auto", value: "auto" },
            { label: "720p", value: "720p" },
            { label: "1080p", value: "1080p" },
          ]}
        />
      </SettingsSection>

      <SettingsSection
        title="Reliability"
        description="How SwiftDesk handles dropped connections."
      >
        <SettingToggle
          settingKey="connection.autoReconnect"
          title="Automatically reconnect"
          description="Attempt to reconnect if the connection drops."
        />
        <SettingSelect
          settingKey="connection.reconnectAttempts"
          title="Reconnect Attempts"
          options={[
            { label: "3 attempts", value: 3 },
            { label: "5 attempts", value: 5 },
            { label: "10 attempts", value: 10 },
          ]}
        />
        <SettingSelect
          settingKey="connection.timeout"
          title="Connection Timeout"
          options={[
            { label: "15 seconds", value: 15 },
            { label: "30 seconds", value: 30 },
            { label: "60 seconds", value: 60 },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Diagnostics">
        <SettingToggle
          settingKey="connection.showStatistics"
          title="Show connection statistics"
          description="Display overlay with latency and bandwidth information during active sessions."
        />
      </SettingsSection>
    </div>
  );
}