import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
      },
      manifest: {
        name: "Марусины Сладости",
        short_name: "M & S",
        start_url: "/",
        display: "standalone",
        description: "Самые лучшие сладости, мороженое, торты и прочие вкусняхи в Нововоронеже",
        lang: "ru",
        dir: "ltr",
        scope: "/",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        orientation: "portrait",
        icons: [
          {
            src: "pwa/manifest-icon-175.png",
            sizes: "175x175",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa/manifest-icon-175.maskable.png",
            sizes: "175x175",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "pwa/manifest-icon-495.png",
            sizes: "495x495",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa/manifest-icon-495.maskable.png",
            sizes: "495x495",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        screenshots: [
          {
            src: "pwa/home_page.jpg",
            sizes: "358x797",
            type: "image/png",
            label: "Скриншот главной страницы"
          },
          {
            src: "pwa/shopping_cart_page.jpg",
            sizes: "357x798",
            type: "image/png",
            label: "Скриншот страницы корзины"
          },
          {
            src: "pwa/client_page.jpg",
            sizes: "361x798",
            type: "image/png",
            label: "Скриншот страницы клиента"
          }
        ],
        prefer_related_applications: false
      },
    }),
  ],
});
