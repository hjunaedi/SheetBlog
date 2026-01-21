
export interface Post {
  judul: string;
  label: string;
  gambar: string;
  body: string;
  slug: string;
  metaDeskripsi: string;
  status: string;
  tanggalJam: string;
  tipe: 'Post' | 'Page';
}

export interface Config {
  themeColor: string;
  columns: number;
  siteName: string;
}

export type ThemeColor = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'pink' | 'emerald' | 'slate';
