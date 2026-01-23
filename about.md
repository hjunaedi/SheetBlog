
# SheetBlog Pro: Arsitektur Modern Berbasis Spreadsheet

SheetBlog Pro adalah solusi **Hybrid CMS** revolusioner yang mendefinisikan ulang cara kita membangun situs web. Dengan menggabungkan fleksibilitas Google Sheets dan kecepatan infrastruktur Cloudflare, kami menciptakan platform yang elegan, cepat, dan tanpa manajemen server tradisional.

## 🎨 UI/UX Design Philosophy
Kami mengadopsi bahasa desain **Neo-Brutalism & Minimalism Pro**:
- **Typography Pro**: Menggunakan *Plus Jakarta Sans* dengan pengaturan kerning yang ketat untuk estetika premium dan keterbacaan tinggi.
- **Glassmorphism 2.0**: Efek blur pada header dan kartu artikel memberikan kedalaman visual tanpa mengorbankan performa pemuatan.
- **Micro-Interactions**: Transisi halus pada mode gelap (dark mode), animasi hover yang responsif, dan progress bar pemuatan (loading) yang dinamis untuk memberikan umpan balik instan kepada pengguna.
- **Content-First Layout**: Grid yang adaptif dan navigasi artikel kronologis terbalik memastikan konten terbaru selalu menjadi fokus utama mata pengunjung.

## ⚙️ Backend Architecture (Serverless CMS)
Website ini menggunakan konsep **"Sheet-as-a-Database"**:
- **Database Utama**: Google Sheets bertindak sebagai kontrol panel pusat (CMS). Setiap baris data di spreadsheet adalah sebuah entri database.
- **Data Pipeline**: Frontend melakukan fetch data CSV secara berkala melalui endpoint publikasi Google Sheets. Data kemudian diolah menjadi array objek JSON di sisi klien.
- **Security**: Data diambil secara read-only melalui publikasi web yang terisolasi, menjaga privasi data internal spreadsheet lainnya yang tidak dipublikasikan.

## 🏗️ Struktur Website
- **React 19 (Babel Standalone)**: Memungkinkan eksekusi kode JSX langsung di sisi klien tanpa perlu proses build yang rumit (`no-build architecture`).
- **Tailwind CSS Engine**: Kompilasi gaya desain secara on-the-fly untuk efisiensi ukuran file.
- **Marked.js**: Parser Markdown yang kuat untuk mengubah isi kolom 'Body' spreadsheet menjadi elemen HTML yang kaya (rich text).
- **History Routing**: Menggunakan `BrowserRouter` (History API) untuk URL bersih tanpa simbol `#`, yang sangat krusial untuk SEO (Search Engine Optimization).

## 🚀 Langkah-Langkah Implementasi Online (Step-by-Step)

### 1. Persiapan Google Sheets
1. Buat Spreadsheet baru di Google Drive. Beri judul kolom di baris pertama: `Judul`, `Label`, `Gambar`, `Body`, `Slug`, `Status`, `Tipe`, `Meta Deskripsi`.
2. Isi data artikel Anda. Pastikan kolom **Status** berisi `Publish` agar konten tampil di website.
3. Kolom **Tipe** menentukan struktur URL: isi `Post` untuk artikel blog dan `Page` untuk halaman statis.

### 2. Publikasi Data (CSV)
1. Di Google Sheets, klik **File** > **Share** > **Publish to Web**.
2. Pilih sheet yang berisi data Anda, ubah format output menjadi **Comma-separated values (.csv)**.
3. Klik tombol **Publish** dan salin URL panjang yang muncul. Tempelkan URL tersebut ke variabel `DEFAULT_CSV_URL` di dalam file `index.html`.

### 3. Deployment ke Cloudflare Pages
1. Unggah file `index.html`, `metadata.json`, `about.md`, dan `guide_stup.md` ke repositori GitHub atau unggah langsung ke Cloudflare Dashboard.
2. Di Cloudflare Pages, pilih **Direct Upload** (untuk file statis) atau hubungkan ke repositori Git.
3. **PENTING (SPA Redirect)**: Agar rute History Mode berfungsi saat halaman direfresh, buatlah file bernama `_redirects` di folder root Anda (sejajar dengan index.html) dengan isi berikut:
   ```text
   /* /index.html 200
   ```
   Ini memberitahu Cloudflare untuk mengarahkan semua permintaan rute kembali ke `index.html` agar React Router bisa menanganinya.

### 4. Aktivasi & Update
1. Selesai! Website Anda sekarang online. Setiap kali Anda mengubah data di Google Sheets dan menekan 'Save', website Anda akan memperbarui isinya secara otomatis dalam hitungan detik.

---
*SheetBlog Pro dikembangkan untuk kecepatan, kemudahan pengelolaan konten, dan estetika tanpa batas.*
