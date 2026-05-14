import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rest House Management',
    short_name: 'RestHouse',
    description: 'Track room bookings for VIP Rest House & Biddut Bhaban',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#0a0a0f',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
