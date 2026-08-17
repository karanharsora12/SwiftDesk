export interface RecentSession {
  deviceId: string;
  name: string;
  when: string; // ISO string
}

const STORAGE_KEY = "swiftdesk:recent-sessions";

export function getRecentSessions(): RecentSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function addRecentSession(session: Omit<RecentSession, "when">) {
  const sessions = getRecentSessions();
  const existingIndex = sessions.findIndex((s) => s.deviceId.replace(/\s/g, '') === session.deviceId.replace(/\s/g, ''));
  
  if (existingIndex !== -1) {
    const existing = sessions[existingIndex];
    if (session.name !== "Remote Device") {
       existing.name = session.name;
    }
    existing.when = new Date().toISOString();
    sessions.splice(existingIndex, 1);
    sessions.unshift(existing);
  } else {
    sessions.unshift({ ...session, when: new Date().toISOString() });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 10)));
  window.dispatchEvent(new Event("recent-sessions-updated"));
}

export function removeRecentSession(deviceId: string) {
  const sessions = getRecentSessions();
  const filtered = sessions.filter((s) => s.deviceId.replace(/\s/g, '') !== deviceId.replace(/\s/g, ''));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("recent-sessions-updated"));
}

export function clearRecentSessions() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("recent-sessions-updated"));
}
