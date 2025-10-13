import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Replay ayarları
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // Production'da %10, dev'de %100

  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1, // Production'da %1, dev'de %10
  replaysOnErrorSampleRate: 1.0, // Hata olduğunda her zaman %100

  // Environment ayarları
  environment: process.env.NODE_ENV,

  // Debug mode (sadece development'ta)
  debug: process.env.NODE_ENV === 'development',
})
