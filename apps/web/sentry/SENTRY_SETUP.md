# Sentry Entegrasyonu

Bu proje, hata izleme ve performans monitoring için **Sentry** kullanmaktadır.

## 📦 Kurulum

Sentry paketi zaten yüklenmiş durumda:

```bash
pnpm install @sentry/nextjs --save
```

## 🔧 Yapılandırma

### 1. Environment Variables

`.env.local` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Sentry DSN (Data Source Name)
# Sentry.io panelinden alacağınız proje-specific URL
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Opsiyonel: Source map yükleme için (CI/CD'de kullanılır)
SENTRY_ORG=your-organization-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

### 2. Sentry Projesi Oluşturma

1. [Sentry.io](https://sentry.io) hesabınıza giriş yapın
2. Yeni bir proje oluşturun (Next.js platformunu seçin)
3. Proje ayarlarından **DSN** değerinizi kopyalayın
4. DSN'i `.env.local` dosyasına ekleyin

### 3. Source Maps (Opsiyonel)

Production'da hata stack trace'lerini görmek için source map yüklemesi yapabilirsiniz:

1. Sentry panelinden **Auth Token** oluşturun
2. Token'ı `.env.local` dosyasına ekleyin
3. `SENTRY_ORG` ve `SENTRY_PROJECT` değerlerini doldurun

## 📝 Dosya Yapısı

Entegrasyon için oluşturulan dosyalar:

```
travel-ui/
├── sentry.client.config.ts      # Client-side Sentry yapılandırması (tarayıcı)
├── sentry.server.config.ts      # Server-side Sentry yapılandırması (Node.js)
├── sentry.edge.config.ts        # Edge runtime Sentry yapılandırması (Vercel Edge)
└── next.config.ts               # Sentry webpack plugin ile wrap edilmiş
```

**Not:** `instrumentation.ts` dosyası gerekli değildir çünkü `withSentryConfig` otomatik olarak gerekli konfigürasyonları inject eder.

## 🎯 Kullanım

### Otomatik Hata Yakalama

Sentry otomatik olarak tüm unhandled exception'ları ve promise rejection'ları yakalar.

### Manuel Hata Raporlama

```typescript
import * as Sentry from '@sentry/nextjs'

// Basit hata raporlama
try {
  // Kodunuz
} catch (error) {
  Sentry.captureException(error)
}

// Özel mesaj gönderme
Sentry.captureMessage('Bir şeyler yanlış gitti', 'warning')

// Ek context bilgisi ile
Sentry.captureException(error, {
  tags: {
    section: 'checkout',
  },
  extra: {
    userId: user.id,
  },
})
```

### Kullanıcı Bilgisi Ekleme

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
})

// Kullanıcı bilgisini temizleme (logout)
Sentry.setUser(null)
```

### Breadcrumbs

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
})
```

### Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs'

// Manuel transaction
const transaction = Sentry.startTransaction({
  name: 'Ödeme İşlemi',
  op: 'checkout',
})

try {
  // İşlemleriniz
  await processPayment()
} finally {
  transaction.finish()
}
```

## 🎨 Replay Özelliği

Client-side yapılandırmada **Session Replay** aktif edilmiştir:

- Normal oturumlarda %10 kayıt yapılır
- Hata olduğunda %100 kayıt yapılır
- Tüm text ve media maskelenir (gizlilik için)

### Replay'i Kapatma

Eğer replay özelliğini kapatmak isterseniz, `sentry.client.config.ts` dosyasından `replayIntegration` kısmını kaldırın.

## ⚙️ Yapılandırma Ayarları

### Sampling Oranları

Production ortamında performans için sampling oranlarını düşürün:

```typescript
// sentry.client.config.ts ve sentry.server.config.ts
{
  tracesSampleRate: 0.1, // %10 transaction
  replaysSessionSampleRate: 0.01, // %1 normal session
  replaysOnErrorSampleRate: 1.0, // %100 hata durumunda
}
```

### Environment Ayarı

Sentry otomatik olarak `NODE_ENV` değerini kullanır. Farklı environment'lar için:

```typescript
{
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
}
```

## 🚀 Build Scripts İzni

Eğer build sırasında `@sentry/cli` uyarısı alırsanız:

```bash
pnpm approve-builds
```

Bu komut size hangi paketlerin script çalıştırmasına izin vermek istediğinizi soracaktır.

## 🔍 Test Etme

Sentry entegrasyonunu test etmek için:

```typescript
// Herhangi bir sayfa veya component'te
throw new Error('Test hatası - Sentry çalışıyor mu?')
```

Bu hatayı Sentry dashboard'unuzda görebilmelisiniz.

## 📚 Ek Kaynaklar

- [Sentry Next.js Dokümantasyonu](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/)

## ⚠️ Önemli Notlar

1. **DSN'i asla commit etmeyin** - `.env.local` dosyası `.gitignore`'da olmalı
2. **Production'da sampling kullanın** - Tüm eventleri göndermek maliyetli olabilir
3. **PII (Personally Identifiable Information) dikkat edin** - Hassas verileri Sentry'ye göndermeyin
4. **Auth Token'ı güvenli tutun** - Sadece CI/CD ortamında kullanın

