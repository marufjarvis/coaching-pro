import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'logo.png', 'icons.svg'],
      manifest: {
        name: "Maruf's ICT Care",
        short_name: "ICT Care",
        description: "Maruf's ICT Care - HSC ICT একাডেমিক ও প্র্যাকটিক্যাল ল্যাব",
        theme_color: "#070d19",
        background_color: "#070d19",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
      }
    })
  ]
})
