import { randomInt } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { hostname } from 'node:os'
import { dirname, join } from 'node:path'
import type { DeviceIdentity, StoredDeviceIdentity } from '../../../shared/device-identity'

const DEVICE_ID_PATTERN = /^\d{3} \d{3} \d{3}$/
const STORAGE_FILE_NAME = 'device-identity.json'

export class DeviceIdentityService {
  private readonly storagePath: string
  private operationQueue: Promise<void> = Promise.resolve()

  constructor(userDataPath: string) {
    this.storagePath = join(userDataPath, 'swift-desk', STORAGE_FILE_NAME)
  }

  async getIdentity(): Promise<DeviceIdentity> {
    return this.runExclusively(async () => {
      const identity = await this.getOrCreateIdentity()
      return this.toPublicIdentity(identity)
    })
  }

  async regenerateDeviceId(): Promise<DeviceIdentity> {
    return this.runExclusively(async () => {
      const currentIdentity = await this.getOrCreateIdentity()
      const identity: StoredDeviceIdentity = {
        schemaVersion: 1,
        id: this.generateDeviceId(currentIdentity.id),
        name: currentIdentity.name,
        createdAt: new Date().toISOString()
      }

      await this.persistIdentity(identity)
      return this.toPublicIdentity(identity)
    })
  }

  private async getOrCreateIdentity(): Promise<StoredDeviceIdentity> {
    const storedIdentity = await this.readStoredIdentity()

    if (storedIdentity) {
      return storedIdentity
    }

    const identity = this.createIdentity()
    await this.persistIdentity(identity)
    return identity
  }

  private runExclusively<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(operation, operation)
    this.operationQueue = result.then(
      () => undefined,
      () => undefined
    )
    return result
  }

  private async readStoredIdentity(): Promise<StoredDeviceIdentity | null> {
    try {
      const contents = await readFile(this.storagePath, 'utf8')
      return this.parseStoredIdentity(contents)
    } catch (error: unknown) {
      if (this.isMissingFile(error)) {
        return null
      }

      // A damaged local identity should never stop the application from launching.
      return null
    }
  }

  private parseStoredIdentity(contents: string): StoredDeviceIdentity | null {
    try {
      const value: unknown = JSON.parse(contents)

      if (!this.isStoredIdentity(value)) {
        return null
      }

      return value
    } catch {
      return null
    }
  }

  private isStoredIdentity(value: unknown): value is StoredDeviceIdentity {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

    const candidate = value as Record<string, unknown>
    return candidate.schemaVersion === 1
      && typeof candidate.id === 'string'
      && DEVICE_ID_PATTERN.test(candidate.id)
      && typeof candidate.name === 'string'
      && this.isValidDeviceName(candidate.name)
      && typeof candidate.createdAt === 'string'
      && !Number.isNaN(Date.parse(candidate.createdAt))
  }

  private async persistIdentity(identity: StoredDeviceIdentity): Promise<void> {
    const directory = dirname(this.storagePath)
    const temporaryPath = `${this.storagePath}.tmp`

    await mkdir(directory, { recursive: true })
    await writeFile(temporaryPath, JSON.stringify(identity), { encoding: 'utf8', mode: 0o600 })
    await rename(temporaryPath, this.storagePath)
  }

  private createIdentity(): StoredDeviceIdentity {
    return {
      schemaVersion: 1,
      id: this.generateDeviceId(),
      name: this.generateDeviceName(),
      createdAt: new Date().toISOString()
    }
  }

  private generateDeviceId(excludedId?: string): string {
    let id: string

    do {
      const digits = randomInt(100_000_000, 1_000_000_000).toString()
      id = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`
    } while (id === excludedId)

    return id
  }

  private generateDeviceName(): string {
    const computerName = hostname().trim().replace(/[^a-zA-Z0-9 -]/g, '').slice(0, 48)
    return computerName ? `${computerName}'s ${this.platformLabel()}` : `My ${this.platformLabel()}`
  }

  private platformLabel(): string {
    if (process.platform === 'win32') return 'Windows PC'
    if (process.platform === 'darwin') return 'Mac'
    return 'Linux PC'
  }

  private isValidDeviceName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 80
  }

  private isMissingFile(error: unknown): error is NodeJS.ErrnoException {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
  }

  private toPublicIdentity(identity: StoredDeviceIdentity): DeviceIdentity {
    return { id: identity.id, name: identity.name }
  }
}
