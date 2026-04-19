# Müzik Grubu Yönetim Sistemi - TODO

## Landing Page (Tanıtım Sayfası)
- [x] Zarif ve etkileyici sayfa tasarımı (hero section, grup tanıtımı)
- [x] Grup üyelerini ve enstrümanlarını gösteren bölüm
- [x] Grubun vizyonu ve amaçlarını anlatan içerik
- [x] "Bize Katıl" butonu başvuru formuna yönlendirir
- [x] Responsive tasarım (mobil, tablet, desktop)

## Başvuru Akışı
- [x] Başvuru formu (adı, e-posta, telefon, rol, mesaj)
- [x] Başvuruların veritabanında kaydedilmesi
- [x] Başarılı gönderim sonrası onay mesajı

## Ortak Admin Paneli (Tüm Üyeler)
- [x] Gizli URL yapısı ve parola koruması
- [x] Başvuru listesi ve yönetimi
- [x] Başvuru durumu güncelleme
- [x] Üye yönetimi
- [ ] Şarkı yönetimi (ekleme, düzenleme, silme)
- [ ] Şarkı beğenileri görüntüleme
- [ ] Şarkı yorumları görüntüleme
- [ ] Manuel e-posta gönderimi arayüzü

## Üye Kontrol Panelleri (Bireysel)
- [x] Her üye için özel giriş kodu sistemi (veritabanı tabl. oluşturuldu)
- [x] Üye paneli: Kendi şarkılarını görüntüleme (UI oluşturuldu)
- [x] Üye paneli: Beğeni ve yorum istatistikleri (UI oluşturuldu)
- [x] Üye paneli: Şarkı ekleme/düzenleme (UI oluşturuldu)
- [x] Üye paneli: Diğer üyelerin panellerine erişim engeli (giriş kodu ile)

## Şarkı Yönetimi Sistemi
- [x] Şarkı tablosu (başlık, açıklama, link, üye_id)
- [x] Şarkı beğeni sistemi (like/unlike)
- [x] Şarkı yorum sistemi
- [x] Beğeni sayısı ve yorum sayısı gösterimi

## E-posta Sistemi
- [x] Manuel e-posta gönderimi arayüzü (admin panelinde)
- [x] E-posta şablonları (server/email.ts)
- [x] Başvuru sahiplerine e-posta gönderimi (admin tarafından)

## Veritabanı
- [x] Başvuru tablosu (applications)
- [x] Üye tablosu (band_members)
- [x] Şarkı tablosu (songs)
- [x] Beğeni tablosu (likes)
- [x] Yorum tablosu (comments)
- [x] Üye giriş kodları (member_access_codes)

## Güvenlik
- [x] Parola hash'leme (temel parola koruması)
- [x] Session yönetimi (OAuth ile)
- [x] CSRF koruması (tRPC ile)
- [x] Üye paneli erişim kontrolü (kendi kodu ile)
- [x] Ortak panel erişim kontrolü (ortak şifre ile)

## Test ve Dağıtım
- [x] Başvuru akışı testi (vitest)
- [x] Yönetim paneli testi (vitest)
- [x] Şarkı yönetimi testi (vitest - opsiyonel)
- [x] Beğeni/yorum sistemi testi (vitest - opsiyonel)
- [x] Üye paneli erişim testi (vitest - opsiyonel)
- [x] Responsive tasarım testi (tarayıcı)
