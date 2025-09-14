/* ====== Configuration (edit me) ====== */
const CONFIG = {
  forms: {
    absensi: "https://forms.office.com/r/ABSENSI_PLACEHOLDER",
    buku_tamu: "https://forms.office.com/r/BUKU_TAMU_PLACEHOLDER",
    penelitian: "https://forms.office.com/r/PENELITIAN_PLACEHOLDER",
    input_sejarah: "https://forms.office.com/r/SEJARAH_PLACEHOLDER",
    input_visimisi: "https://forms.office.com/r/VISIMISI_PLACEHOLDER",
    input_karyawan: "https://forms.office.com/r/KARYAWAN_PLACEHOLDER",
    input_santri: "https://forms.office.com/r/SANTRI_PLACEHOLDER"
  },
  site: {
    title: "Pesantren Tunanetra Sam'an",
    timezone: "Asia/Jakarta"
  },
  admin: {
    /* SHA-256 hash of your portal passcode (client-side gating; not secure for sensitive data)
       To generate in browser console:
       crypto.subtle.digest('SHA-256', new TextEncoder().encode('PASSCODE')).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))
    */
    passhash: "replace_with_sha256_hash"
  }
};
