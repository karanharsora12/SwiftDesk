import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SwiftDeskSettings } from "../../../shared/settings";

interface SettingsContextType {
  settings: SwiftDeskSettings | null;
  updateSetting: (keyPath: string, value: any) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SwiftDeskSettings | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const applyTheme = (themeValue: string | undefined) => {
      const root = document.documentElement;
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (themeValue === "dark" || (themeValue === "system" && systemDark) || (!themeValue && systemDark)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (settings?.general?.theme === "system" || !settings?.general?.theme) {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    
    // Initial fetch
    window.swiftDesk.getSettings().then((s) => {
      setSettings(s);
      applyTheme(s?.general?.theme);
    });

    // Subscribe to changes
    unsubscribe = window.swiftDesk.onSettingsChange((newSettings) => {
      setSettings(newSettings);
      applyTheme(newSettings?.general?.theme);
    });

    return () => {
      if (unsubscribe) unsubscribe();
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [settings?.general?.theme]);

  const updateSetting = async (keyPath: string, value: any) => {
    await window.swiftDesk.updateSetting(keyPath, value);
    // Optimistic update for UI responsiveness
    setSettings((prev) => {
      if (!prev) return prev;
      const parts = keyPath.split(".");
      if (parts.length === 2) {
        const [category, key] = parts;
        return {
          ...prev,
          [category]: {
            ...(prev as any)[category],
            [key]: value,
          },
        };
      }
      return prev;
    });
  };

  const resetSettings = async () => {
    await window.swiftDesk.resetSettings();
    const newSettings = await window.swiftDesk.getSettings();
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
