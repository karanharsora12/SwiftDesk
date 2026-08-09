# SwiftDesk

SwiftDesk is a privacy-conscious remote desktop application built with Electron, React, TypeScript, and WebRTC.

## Status

Phases 1–3 are complete: the secure Electron shell, locally persisted device identity, and Socket.IO signaling service are in place. WebRTC, screen capture, and remote input are intentionally deferred to subsequent phases.

## Prerequisites

- Node.js 20.19+ (LTS recommended)
- npm 10+

## Run the desktop app

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run typecheck
npm run build
npm run package:win
```

`package:win` produces the Windows installer in `apps/desktop/release/`.

## Phase 1 architecture

```text
apps/desktop/
├── electron/
│   ├── main/       Electron lifecycle and secure BrowserWindow
│   └── preload/    Narrow, typed IPC bridge
├── renderer/       React + Vite UI; no Node.js access
└── shared/         Main/preload/renderer IPC contracts
packages/types/     Shared application domain types
```

The BrowserWindow runs with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`. The renderer only receives the small `window.swiftDesk` API exposed by the preload script.

## Device identity

On first launch, SwiftDesk creates a cryptographically random nine-digit device ID formatted as `123 456 789` and a friendly device name based on the local computer name and platform. The record is stored at `swift-desk/device-identity.json` beneath Electron's per-user application-data directory (`app.getPath('userData')`).

The main process validates the complete record before using it. Missing, malformed, or corrupted data is safely replaced with a new identity. The renderer can only read the public device ID/name or request a regenerated ID after its own UI confirmation.

## What comes next

## Run the signaling server

In a separate terminal:

```bash
cd apps/signaling-server
npm install
copy .env.example .env
npm run dev
```

The health endpoint is available at `http://localhost:4000/health`. With the server running, launch the desktop app from the repository root with `npm run dev`; it registers its persisted device ID automatically.

The signaling service coordinates device presence and connection-request sessions only. It never transports screen, audio, keyboard, or mouse data.

## What comes next

Phase 4 will add WebRTC data-channel negotiation. Screen capture and remote input remain out of scope for this release.
