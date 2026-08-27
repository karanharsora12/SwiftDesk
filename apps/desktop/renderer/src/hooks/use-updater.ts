import { useEffect, useState } from "react";

export interface UpdaterState {
  status: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';
  progress?: { percent: number; bytesPerSecond: number; total: number; transferred: number };
  error?: string;
}

export function useUpdater() {
  const [updaterState, setUpdaterState] = useState<UpdaterState>({ status: 'idle' });

  useEffect(() => {
    const unsub = window.swiftDesk.onUpdaterEvent((event) => {
      setUpdaterState((prev) => {
        if (event.type === 'checking') return { status: 'checking' };
        if (event.type === 'available') return { status: 'available' };
        if (event.type === 'not-available') return { status: 'not-available' };
        if (event.type === 'progress') return { status: 'downloading', progress: event.data };
        if (event.type === 'downloaded') return { status: 'downloaded' };
        if (event.type === 'error') return { status: 'error', error: event.data };
        return prev;
      });
    });

    return unsub;
  }, []);

  const checkForUpdates = () => window.swiftDesk.checkForUpdates();
  const downloadUpdate = () => window.swiftDesk.downloadUpdate();
  const installUpdate = () => window.swiftDesk.installUpdate();

  return {
    updaterState,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  };
}
