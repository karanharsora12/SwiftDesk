import { useState, useEffect } from "react";
import {
  getRecentSessions,
  removeRecentSession,
  clearRecentSessions,
  type RecentSession,
} from "../services/recent-sessions";

export function useRecentSessions() {
  const [sessions, setSessions] = useState<RecentSession[]>(getRecentSessions());

  useEffect(() => {
    const handleUpdate = () => setSessions(getRecentSessions());
    window.addEventListener("recent-sessions-updated", handleUpdate);
    return () => window.removeEventListener("recent-sessions-updated", handleUpdate);
  }, []);

  return { sessions, removeSession: removeRecentSession, clearSessions: clearRecentSessions };
}
