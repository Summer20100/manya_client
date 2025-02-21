import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Автоматическая регистрация и обновление
      devOptions: {
        enabled: true, // Включает поддержку PWA в режиме разработки
      },
      manifest: {
        name: 'МарусиныСладости',
        short_name: 'МарусиныСладости',
        description: 'МарусиныСладости with Service Worker',
        theme_color: '#ffffff',
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png"
          },
          {
            src: "android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png"
          },
        ],
      },
    }),
  ],
});
