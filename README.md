# Website "Sistem Manajemen Pesantren Tunanetra Sam'an" — Static + Portal Mode

Siap di-host di **GitHub Pages**. Fitur utama:
- **Tema Gelap/Terang** (persisten)
- **Mode Kontras Tinggi** (aksesibilitas)
- **Kontrol ukuran huruf** (A-, A, A+)
- **Portal Mode (client-side gating)**: Admin menekan **Masuk Portal**, memasukkan **kata sandi**, lalu area portal & admin muncul
- **Admin Page** untuk menandai data sebagai **Publik** atau **Portal**, kemudian **unduh JSON** hasilnya
- Tombol formulir **Microsoft Forms** untuk **Absensi**, **Buku Tamu**, **Izin Penelitian**, dan **Input Data**

> ⚠️ **Catatan keamanan:** GitHub Pages adalah hosting statis. "Portal" di sini **bukan** autentikasi aman. Konten tetap dapat diakses oleh orang yang paham teknis. Untuk data sensitif, gunakan backend/auth sesungguhnya (mis. Cloudflare Workers/Netlify Functions + OAuth).

## Struktur Folder
```
.
├── index.html
├── visi-misi.html
├── sejarah.html
├── struktur.html
├── jadwal.html
├── karyawan.html
├── santri.html
├── donasi.html
├── buku-tamu.html
├── penelitian.html
├── portal.html       ← Dasbor portal (hanya muncul saat portal aktif)
├── admin.html        ← Panel admin untuk set visibilitas dan unduh JSON
├── assets
│   ├── css/styles.css
│   ├── js/config.js        ← ganti tautan Forms & hash kata sandi portal
│   ├── js/main.js
│   ├── data/*.json         ← data yang ditampilkan
│   └── img/logo.svg
└── .nojekyll
```

## Konfigurasi
Buka `assets/js/config.js`:
- Ganti semua URL **Microsoft Forms** sesuai form Anda.
- Ganti `admin.passhash` dengan **SHA-256** dari kata sandi portal Anda.

Contoh (di konsol browser):
```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('RahasiaSaya!')).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))
```

## Menandai Data Publik vs Portal
- Buka **Admin** (muncul setelah aktifkan portal) → ubah `Visibilitas` per baris → **Unduh JSON** → replace ke `assets/data/*.json` di repo → commit.
- Di halaman publik, hanya entri dengan `visibility !== "portal"` yang tampil.

## Deploy ke GitHub Pages
1. Buat repo baru, upload semua file.
2. Settings → Pages → Deploy from a branch → `main` → folder root `/`.
3. Selesai.
