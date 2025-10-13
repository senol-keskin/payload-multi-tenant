import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // Production'da %10, dev'de %100

  // Environment ayarları
  environment: process.env.NODE_ENV,

  // Debug mode (sadece development'ta)
  debug: process.env.NODE_ENV === 'development',
})
