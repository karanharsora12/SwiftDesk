/// <reference types="vite/client" />

import type { SwiftDeskApi } from '../../shared/ipc'

declare global {
  interface Window {
    swiftDesk: SwiftDeskApi
  }
}

export {}
