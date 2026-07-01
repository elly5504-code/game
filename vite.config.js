import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Keep built files portable on static hosts and when served from a subfolder.
  base: './',
  plugins: [react()],
  server: {
    // OneDrive placeholder files can be temporarily locked and crash the
    // native Windows watcher. Public assets are served directly, so they do
    // not need to be watched for module hot reloads.
    watch: {
      ignored: ['**/public/**'],
    },
  },
})
