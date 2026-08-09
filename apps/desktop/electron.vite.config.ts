import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'node:path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('electron/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve('electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: 'renderer',
    resolve: {
      alias: {
        '@renderer': resolve('renderer')
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve('renderer/index.html')
        }
      }
    }
  }
})
