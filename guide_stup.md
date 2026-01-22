
## Panduan Setup SheetBlog

Ikuti langkah-langkah di bawah ini untuk menghubungkan spreadsheet Anda sendiri ke aplikasi ini.

### 1. Persiapan Spreadsheet
- Buat Google Sheet baru.
- Buat header di baris pertama: `Judul`, `Label`, `Gambar`, `Body`, `Slug`, `Meta Deskripsi`, `Status`, `Tanggal Jam`, `Tipe`.
- Isi setidaknya satu baris dengan Status **Publish**.

### 2. Publikasi ke Web
- Di Google Sheets, buka menu **File > Share > Publish to Web**.
- Pilih tab yang berisi data Anda.
- Ubah format menjadi **Comma-separated values (.csv)**.
- Klik **Publish** dan salin URL yang diberikan.

### 3. Update index.html
- Buka file `index.html`.
- Cari variabel `const CSV_URL`.
- Ganti dengan URL CSV yang Anda salin tadi.

### 4. Hosting
- Upload file `index.html`, `about.md`, dan `guide_stup.md` ke **Cloudflare Pages** atau **GitHub Pages**.
- Aplikasi Anda sekarang live dan sinkron otomatis dengan Google Sheets!
