# Müzik Grubu - Yapılandırma Dosyaları

Bu dizinde grubunuzun bilgilerini yapılandırmak için kullanacağınız JSON dosyaları bulunmaktadır.

## Dosyalar

### 1. **band-config.json**
Grubunuzun temel bilgilerini içerir:
- Grup adı ve sloganı
- Açıklama ve vizyonu
- Kuruluş yılı
- Üye sayısı

**Düzenleme:** Grup bilgilerinizi bu dosyada güncelleyin.

### 2. **members-template.json**
Üye bilgilerinin şablonunu ve rollerini içerir:
- Üye adı, rol, biyografi
- Profil resmi URL'si
- Sıralama (order)

**Düzenleme:** Üyeleri admin panelinden doğrudan ekleyin. Bu dosya referans amaçlıdır.

### 3. **contact-info.json**
İletişim bilgilerinizi içerir:
- E-posta, telefon, adres
- Çalışma saatleri
- Başvuru ve destek e-postaları

**Düzenleme:** İletişim bilgilerinizi güncelleyin.

### 4. **social-media.json**
Sosyal medya hesaplarınızı içerir:
- Instagram, YouTube, Spotify, TikTok vb.
- Aktif platformlar listesi

**Düzenleme:** Sosyal medya linklerinizi ve aktif platformları güncelleyin.

### 5. **design-config.json**
Tasarım ve renk ayarlarını içerir:
- Renkler (birincil, ikincil, arka plan vb.)
- Tipografi ayarları
- Boşluk ve tema

**Düzenleme:** Grubunuzun renklerini ve tasarımını özelleştirin.

### 6. **settings.json**
Genel ayarları içerir:
- Admin parolası
- Özellik etkinleştirme/devre dışı bırakma
- E-posta ayarları
- Sayfalandırma

**Düzenleme:** Sistem ayarlarını yapılandırın.

## Nasıl Kullanılır?

1. **Dosyaları Açın:** Her dosyayı bir metin editörü ile açın
2. **Bilgileri Güncelleyin:** Grubunuzun bilgilerini ilgili alanlara girin
3. **Kaydedin:** Dosyaları kaydedin
4. **Sunucuyu Yeniden Başlatın:** Değişiklikleri uygulamak için sunucuyu yeniden başlatın

## Önemli Notlar

- **JSON Formatı:** Tüm dosyalar JSON formatındadır. Düzenlerken JSON yapısını bozmaması için dikkat edin.
- **Admin Parolası:** `settings.json` dosyasındaki admin parolasını güvenli bir şekilde saklayın.
- **URL'ler:** Sosyal medya ve resim URL'lerinin doğru olduğundan emin olun.
- **E-posta Adresleri:** E-posta adreslerinin geçerli olduğundan emin olun.

## Örnek Kullanım

### band-config.json
```json
{
  "band": {
    "name": "Benim Müzik Grubum",
    "tagline": "Müzikle Hayat Bulur",
    "description": "Biz, müzik aracılığıyla insanları bir araya getiren bir grupuz.",
    ...
  }
}
```

### contact-info.json
```json
{
  "contact": {
    "email": "iletisim@benimuzigigrubum.com",
    "phone": "+90 (212) 555 1234",
    ...
  }
}
```

## Destek

Sorularınız veya sorunlarınız varsa, lütfen admin panelinden iletişime geçin.
