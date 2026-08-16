import { SettingToggle } from "../SettingToggle";
import { SettingSelect } from "../SettingSelect";
import { SettingsSection } from "../SettingsSection";
import { useEffect, useState } from "react";

export function ScreenSharingPage() {
  const [displays, setDisplays] = useState<{ label: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    window.swiftDesk.getScreenSources().then((sources) => {
      const screenSources = sources
        .filter((s) => s.id.startsWith("screen:"))
        .map((s) => ({ label: s.name || "Unknown Display", value: s.id }));

      if (screenSources.length === 0) {
        screenSources.push({ label: "Primary Display", value: "primary" });
      }
      setDisplays(screenSources);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <SettingsSection title="Display">
        {displays.length > 0 ? (
          <SettingSelect
            settingKey="screenSharing.defaultDisplay"
            title="Default Display"
            description="The screen used when a remote device requests a view."
            options={displays}
          />
        ) : (
          <div className="py-3.5 text-sm text-slate-500 dark:text-slate-400">
            Loading displays...
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        title="Quality & Performance"
        description="Control the visual quality of shared screens."
      >
        <SettingSelect
          settingKey="screenSharing.quality"
          title="Quality"
          options={[
            { label: "Auto", value: "auto" },
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
        />
        <SettingSelect
          settingKey="screenSharing.frameRate"
          title="Frame Rate"
          options={[
            { label: "15 FPS", value: 15 },
            { label: "30 FPS", value: 30 },
            { label: "60 FPS", value: 60 },
          ]}
        />
        <SettingSelect
          settingKey="screenSharing.resolution"
          title="Resolution"
          options={[
            { label: "Auto", value: "auto" },
            { label: "720p", value: "720p" },
            { label: "1080p", value: "1080p" },
          ]}
        />
        <SettingToggle
          settingKey="screenSharing.lowLatency"
          title="Optimize for low latency"
          description="Prioritize speed over image quality when the network is unstable."
        />
      </SettingsSection>

      <SettingsSection title="Experience">
        <SettingToggle
          settingKey="screenSharing.showIndicator"
          title="Show screen-sharing indicator"
          description="Display a notification when your screen is being shared."
        />
        <SettingToggle
          settingKey="screenSharing.allowRemoteCursor"
          title="Allow remote cursor"
          description="Show the remote user's cursor on your screen."
        />
      </SettingsSection>

      <SettingsSection title="Multiple Displays">
        <SettingToggle
          settingKey="screenSharing.multipleDisplays"
          title="Allow multiple displays"
          description="Allow the remote user to view and switch between all of your connected displays."
        />
      </SettingsSection>
    </div>
  );
}