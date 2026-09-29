import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages: Seite liegt unter /rossi-solutions-engineer-website/
export default defineConfig({
  base: '/rossi-solutions-engineer-website/',
  plugins: [react(), tailwindcss()],
})
