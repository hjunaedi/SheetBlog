
## Selamat Datang di SheetBlog! 🚀

Website ini sepenuhnya dikendalikan oleh Google Sheets. Berikut adalah cara tercepat untuk mengganti data demo dengan data milik Anda sendiri.

### Langkah 1: Siapkan Database
1. Buka akun Google Sheets Anda.
2. Buat file baru dengan nama kolom di baris pertama sebagai berikut:
   `Judul`, `Label`, `Gambar`, `Body`, `Slug`, `Meta Deskripsi`, `Status`, `Tanggal Jam`, `Tipe`
3. Isi satu baris contoh. Pastikan kolom **Status** berisi kata `Publish` dan kolom **Tipe** berisi kata `Post`.

### Langkah 2: Publikasikan Spreadsheet
1. Di Google Sheets, klik menu **File** > **Share** > **Publish to Web**.
2. Pilih tab spreadsheet Anda dan ubah format "Web Page" menjadi **Comma-separated values (.csv)**.
3. Klik tombol **Publish** dan salin URL panjang yang muncul.

### Langkah 3: Hubungkan ke Web
1. Buka file `index.tsx` dalam editor ini.
2. Cari variabel bernama `DEFAULT_CSV_URL` di bagian atas kode.
3. Hapus URL lama dan paste URL CSV milik Anda di sana.
4. Simpan perubahan!

### Langkah 4: Hosting (Cloudflare Pages)
1. Website ini bersifat **No-Build**. Anda hanya perlu mengunggah file `index.html`, `index.tsx`, `about.md`, dan `guide_stup.md` ke folder root di Cloudflare Pages.
2. Pastikan file `index.html` merujuk ke `index.tsx` dengan benar (secara default sudah benar).
3. Cloudflare akan bertugas sebagai "pelayan" yang mengirimkan file ini ke pengunjung tanpa perlu konfigurasi backend apapun.

**Butuh Bantuan?** Hubungi admin atau cek dokumentasi Google AI Studio untuk optimasi lebih lanjut!
