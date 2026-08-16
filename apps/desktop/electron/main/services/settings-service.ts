import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { SwiftDeskSettings, DEFAULT_SETTINGS } from '../../../shared/settings'
import { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../../shared/ipc'

export class SettingsService {
  private settingsPath: string
  private settings: SwiftDeskSettings

  constructor(userDataPath: string) {
    this.settingsPath = join(userDataPath, 'settings.json')
    this.settings = this.loadSettings()
  }

  private loadSettings(): SwiftDeskSettings {
    try {
      const data = readFileSync(this.settingsPath, 'utf8')
      const parsed = JSON.parse(data)
      
      // Simple merge to apply defaults for any missing fields
      return {
        general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
        connection: { ...DEFAULT_SETTINGS.connection, ...parsed.connection },
        screenSharing: { ...DEFAULT_SETTINGS.screenSharing, ...parsed.screenSharing },
        remoteControl: { ...DEFAULT_SETTINGS.remoteControl, ...parsed.remoteControl },
        security: { ...DEFAULT_SETTINGS.security, ...parsed.security },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
      }
    } catch {
      return { ...DEFAULT_SETTINGS }
    }
  }

  private saveSettings(): void {
    try {
      writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2), 'utf8')
      this.notifyRenderers()
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  private notifyRenderers(): void {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(win => {
      win.webContents.send(IPC_CHANNELS.onSettingsChange, this.settings)
    })
  }

  public getSettings(): SwiftDeskSettings {
    return { ...this.settings }
  }

  public updateSetting(keyPath: string, value: any): void {
    const parts = keyPath.split('.')
    if (parts.length !== 2) return

    const [category, key] = parts
    
    if (this.settings[category as keyof SwiftDeskSettings]) {
      ;(this.settings[category as keyof SwiftDeskSettings] as any)[key] = value
      this.saveSettings()
    }
  }

  public resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS }
    this.saveSettings()
  }
}
