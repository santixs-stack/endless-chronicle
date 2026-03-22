import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    // roughjs has "exports":{} which blocks deep imports in Rollup.
    // Alias to the explicit ESM bundle so both dev and prod builds work.
    alias: {
      'roughjs': path.resolve(__dirname, 'node_modules/roughjs/bundled/rough.esm.js'),
    },
    mainFields: ['module', 'main'],
  },
})
