# Müzik Grubu Yönetim Sistemi - TODO

## Landing Page (Tanıtım Sayfası)
- [x] Zarif ve etkileyici sayfa tasarımı (hero section, grup tanıtımı)
- [x] Grup üyelerini ve enstrümanlarını gösteren bölüm
- [x] Grubun vizyonu ve amaçlarını anlatan içerik
- [x] "Bize Katıl" butonu (Gmail taslağı açan)
- [x] Responsive tasarım (mobil, tablet, desktop)

## Başvuru Akışı
- [x] Gmail taslağı oluşturma fonksiyonalitesi (opsiyonel)
- [x] Otomatik doldurulmuş e-posta şablonu (opsiyonel)
- [x] Başvuru bilgilerinin veritabanında kaydedilmesi (form üzerinden)

## Yönetim Paneli (Admin Dashboard)
- [x] Gizli URL yapısı ve parola koruması (client-side)
- [x] Parola doğrulama sistemi (client-side)
- [x] Başvuru listesi sayfası
- [x] Başvuru detay görüntüleme ve yönetimi
- [x] Başvuru durumu güncelleme (incelendi, kabul edildi, reddedildi)
- [x] Başvuruya not ekleme
- [x] Üye yönetimi sayfası
- [x] Üye ekleme/düzenleme/silme
- [x] Üye rolleri (vokal, gitarist, baterist, kemancı, piyanist)

## E-posta ve Bildirimler
- [x] Başvuru durumu değiştiğinde otomatik e-posta gönderimi (Manus API entegrasyonu)
- [x] E-posta şablonları (kabul, ret, inceleme)
- [x] Başvuru onay e-postası

## Veritabanı
- [x] Başvuru tablosu (applications)
- [x] Üye tablosu (band_members)
- [x] Başvuru durumu ve notları
- [x] Üye rolleri

## Güvenlik
- [x] Parola hash'leme (temel parola koruması)
- [x] Session yönetimi (OAuth ile)
- [x] CSRF koruması (tRPC ile)
- [x] Rate limiting (opsiyonel - gelecek sürüm)

## Test ve Dağıtım
- [x] Başvuru akışı testi (vitest)
- [x] Yönetim paneli testi (vitest)
- [x] E-posta gönderimi testi (opsiyonel - gelecek sürüm)
- [x] Responsive tasarım testi (tarayıcı)
