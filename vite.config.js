import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/sih_ui/',  // Ensure the base URL matches the repository name
  plugins: [react()],
});
