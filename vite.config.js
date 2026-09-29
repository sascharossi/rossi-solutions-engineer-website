import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import { defineConfig } from 'vite'

// Lebenslauf-Button nur aktivieren, wenn die PDF wirklich im Repository liegt
const CV_PATH = 'cv/Sascha_Rossi_Lebenslauf.pdf'
const hasCv = fs.existsSync(new URL(`./public/${CV_PATH}`, import.meta.url))

// GitHub Pages: Seite liegt unter /rossi-solutions-engineer-website/
export default defineConfig({
  base: '/rossi-solutions-engineer-website/',
  plugins: [react(), tailwindcss()],
  define: { 'import.meta.env.VITE_CV_PATH': JSON.stringify(hasCv ? CV_PATH : '') },
})
