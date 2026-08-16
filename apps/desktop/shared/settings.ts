export interface SwiftDeskSettings {
  general: {
    deviceName: string;
    theme: "system" | "light" | "dark";
    startOnStartup: boolean;
    startMinimized: boolean;
    minimizeToTray: boolean;
    closeToTray: boolean;
  };
  connection: {
    quality: "auto" | "low" | "balanced" | "high";
    fps: 15 | 30 | 60;
    resolution: "auto" | "720p" | "1080p";
    autoReconnect: boolean;
    reconnectAttempts: number;
    timeout: number;
    showStatistics: boolean;
  };
  screenSharing: {
    defaultDisplay: string;
    quality: "low" | "medium" | "high" | "auto";
    fps: 15 | 30 | 60;
    resolution: "auto" | "720p" | "1080p";
    lowLatency: boolean;
    showIndicator: boolean;
    allowRemoteCursor: boolean;
    multipleDisplays: boolean;
  };
  remoteControl: {
    permission: "always-ask" | "trusted-only" | "never";
    allowMouse: boolean;
    allowKeyboard: boolean;
    showIndicator: boolean;
    disableOnSessionEnd: boolean;
    releaseKeysOnDisconnect: boolean;
  };
  security: {
    requireConnectionApproval: boolean;
    requireControlApproval: boolean;
    requireScreenShareApproval: boolean;
    sessionTimeout: number | null;
  };
  notifications: {
    connectionRequests: boolean;
    connectionAccepted: boolean;
    connectionRejected: boolean;
    disconnected: boolean;
    controlEnabled: boolean;
    controlDisabled: boolean;
    updates: boolean;
    errors: boolean;
  };
}

export const DEFAULT_SETTINGS: SwiftDeskSettings = {
  general: {
    deviceName: "My PC",
    theme: "system",
    startOnStartup: false,
    startMinimized: false,
    minimizeToTray: false,
    closeToTray: false,
  },
  connection: {
    quality: "auto",
    fps: 30,
    resolution: "auto",
    autoReconnect: true,
    reconnectAttempts: 5,
    timeout: 30,
    showStatistics: false,
  },
  screenSharing: {
    defaultDisplay: "primary",
    quality: "high",
    fps: 30,
    resolution: "auto",
    lowLatency: true,
    showIndicator: true,
    allowRemoteCursor: false,
    multipleDisplays: false,
  },
  remoteControl: {
    permission: "always-ask",
    allowMouse: true,
    allowKeyboard: true,
    showIndicator: true,
    disableOnSessionEnd: true,
    releaseKeysOnDisconnect: true,
  },
  security: {
    requireConnectionApproval: true,
    requireControlApproval: true,
    requireScreenShareApproval: true,
    sessionTimeout: null,
  },
  notifications: {
    connectionRequests: true,
    connectionAccepted: true,
    connectionRejected: true,
    disconnected: true,
    controlEnabled: true,
    controlDisabled: true,
    updates: true,
    errors: true,
  },
};
