import { Select } from "../Select";
import { useSettings } from "../../hooks/use-settings";

interface Option {
  label: string;
  value: string | number | null;
}

export function SettingSelect({
  settingKey,
  title,
  description,
  options,
}: {
  settingKey: string;
  title: string;
  description?: string;
  options: Option[];
}) {
  const { settings, updateSetting } = useSettings();

  if (!settings) return null;

  const [category, key] = settingKey.split(".");
  const currentValue = (settings as any)[category]?.[key];

  return (
    <div className="py-3.5">
      <Select
        label={title}
        description={description}
        options={options}
        value={currentValue}
        onChange={(val) => void updateSetting(settingKey, val)}
      />
    </div>
  );
}