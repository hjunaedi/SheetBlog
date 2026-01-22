
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { marked } from 'https://esm.sh/marked@12';

// --- KONFIGURASI UTAMA ---
// URL Spreadsheet Demo (Publikasi CSV)
const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyPo15zAs0lpBImncFFCVRgQ7IdXFCdBI5DgPcdmjLWtLduIvW-bPHodS3BYlfL7pq_n0BCSB5YwCU/pub?gid=0&single=true&output=csv';

const COLOR_MAP = {
  blue: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
  red: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  green: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  purple: { 50: '#faf5ff', 100: '#f3e8ff', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce' },
  orange: { 50: '#fff7ed', 100: '#ffedd5', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
  pink: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
  slate: { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 600: '#475569', 700: '#334155' }
};

// --- HELPER PARSER CSV ---
function parseCSVLine(line: string) {
  const result = [];
  let curValue = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        curValue += '"';
        i++;
      } else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      result.push(curValue);
      curValue = "";
    } else { curValue += char; }
  }
  result.push(curValue);
  return result;
}

async function fetchSheetData() {
  try {
    const response = await fetch(`${DEFAULT_CSV_URL}&t=${new Date().getTime()}`);
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return [];
    
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    const keyMap: Record<string, string> = {
      'Judul': 'judul', 'Label': 'label', 'Gambar': 'gambar', 'Body': 'body',
      'Slug': 'slug', 'Meta Deskripsi': 'metaDeskripsi', 'Status': 'status',
      'Tanggal Jam': 'tanggalJam', 'Tipe': 'tipe'
    };

    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const obj: any = {};
      headers.forEach((header, index) => {
        const key = keyMap[header] || header;
        obj[key] = (values[index] || '').trim();
      });
      return obj;
    }).filter(p => p.status === 'Publish');
  } catch (error) {
    console.error('Gagal memuat data dari Spreadsheet:', error);
    return [];
  }
}

// --- KOMPONEN UI ---

const Header = ({ darkMode, setDarkMode, themeColor, setThemeColor }: any) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const colors = Object.keys(COLOR_MAP).map(name => ({ name, hex: (COLOR_MAP as any)[name][500] }));

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">SheetBlog</Link>
          <nav className="flex items-center space-x-4 md:space-x-6">
            <Link to="/" className="text-sm font-bold hover:text-primary-500 transition hidden sm:block">Beranda</Link>
            <Link to="/about" className="text-sm font-bold hover:text-primary-500 transition hidden sm:block">Tentang</Link>
            <div className="relative">
              <button onClick={() => setIsThemeOpen(!isThemeOpen)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 shadow-sm border dark:border-slate-700">
                <i className="fas fa-palette"></i>
              </button>
              {isThemeOpen && (
                <div className="absolute right-0 mt-3 p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 w-44 z-[100] animate-in fade-in zoom-in duration-200">
                  {colors.map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => { setThemeColor(c.name); setIsThemeOpen(false); }} 
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === c.name ? 'border-primary-500' : 'border-transparent'}`} 
                      style={{ backgroundColor: c.hex }} 
                    />
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 shadow-sm border dark:border-slate-700">
              <i className={`fas ${darkMode ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

const PostCard = ({ post }: any) => {
  const readTime = Math.ceil((post.body || '').split(/\s+/).length / 200);
  return (
    <article className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border dark:border-slate-700 flex flex-col h-full">
      <Link to={`/post/${post.slug}`} className="relative aspect-video overflow-hidden">
        <img src={post.gambar || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000'} alt={post.judul} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-500 mb-4">
          <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded">{post.label || 'INFO'}</span>
          <span className="text-slate-400">{readTime} MIN BACA</span>
        </div>
        <Link to={`/post/${post.slug}`} className="block mb-3">
          <h2 className="text-xl font-bold leading-tight group-hover:text-primary-500 transition line-clamp-2">{post.judul}</h2>
        </Link>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{post.metaDeskripsi}</p>
        <Link to={`/post/${post.slug}`} className="inline-flex items-center text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
          Baca <i className="fas fa-arrow-right ml-2 text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>
    </article>
  );
};

const PostDetail = ({ posts }: { posts: any[] }) => {
  const { slug } = useParams();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isLocal = slug === 'about' || slug === 'guide_stup';
  const post = useMemo(() => posts.find(p => p.slug === slug), [posts, slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);

    if (isLocal) {
      setLoading(true);
      fetch(`./${slug}.md`)
        .then(res => res.text())
        .then(text => {
          setLocalContent(marked.parse(text) as string);
          setLoading(false);
        })
        .catch(() => {
          setLocalContent(`<p>Gagal memuat file ${slug}.md</p>`);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, isLocal]);

  if (loading) return <div className="py-20 text-center font-bold">Sedang Memuat...</div>;
  if (!post && !isLocal) return <div className="text-center py-20 font-bold">Post tidak ditemukan. <Link to="/" className="text-primary-500">Kembali</Link></div>;

  const displayTitle = isLocal ? (slug === 'about' ? 'Tentang SheetBlog' : 'Panduan Instalasi') : post.judul;
  const displayBody = isLocal ? localContent : post.body;
  const displayImage = isLocal ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000' : post.gambar;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>
      <article className="py-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{displayTitle}</h1>
          {!isLocal && (
            <div className="flex justify-center items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span><i className="far fa-calendar-alt mr-2 text-primary-500"></i>{post.tanggalJam}</span>
              <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
              <span><i className="fas fa-tag mr-2 text-primary-500"></i>{post.label}</span>
            </div>
          )}
        </header>
        <img src={displayImage} alt={displayTitle} className="w-full aspect-[21/9] object-cover rounded-[2.5rem] shadow-2xl mb-16 border dark:border-slate-700" />
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-black prose-p:leading-relaxed prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: displayBody || '' }} 
        />
      </article>
    </div>
  );
};

const Home = ({ posts }: { posts: any[] }) => {
  const blogPosts = useMemo(() => posts.filter(p => p.tipe === 'Post'), [posts]);
  return (
    <div className="space-y-16">
      <header className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase">Wawasan Terbaru</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Konten segar yang diambil langsung dari Spreadsheet Anda.</p>
        <div className="inline-block px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600">
          {blogPosts.length} Artikel Tersedia
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, idx) => <PostCard key={idx} post={post} />)}
      </div>
    </div>
  );
};

const App = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.theme === 'dark');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'blue');

  useEffect(() => {
    fetchSheetData().then(data => { setPosts(data); setLoading(false); });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    const palette = (COLOR_MAP as any)[themeColor];
    if (palette) {
      const root = document.documentElement;
      Object.keys(palette).forEach(key => root.style.setProperty(`--primary-${key}`, palette[key]));
      localStorage.setItem('themeColor', themeColor);
    }
  }, [themeColor]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 dark:bg-slate-900">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="font-black text-[10px] uppercase tracking-[0.5em] text-primary-500 animate-pulse">Menghubungkan Database...</p>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} themeColor={themeColor} setThemeColor={setThemeColor} />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
          <Routes>
            <Route path="/" element={<Home posts={posts} />} />
            <Route path="/post/:slug" element={<PostDetail posts={posts} />} />
            <Route path="/:slug" element={<PostDetail posts={posts} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-slate-50 dark:bg-slate-900 border-t py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black mb-6 italic">SheetBlog.</h2>
            <div className="flex flex-wrap justify-center gap-8 mb-10 text-xs font-black uppercase tracking-widest text-slate-400">
              <Link to="/about" className="hover:text-primary-500 transition">Tentang Kami</Link>
              <Link to="/guide_stup" className="hover:text-primary-500 transition">Setup Guide</Link>
              <a href={DEFAULT_CSV_URL} target="_blank" className="hover:text-primary-500 transition">Database (CSV)</a>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              &copy; {new Date().getFullYear()} SheetBlog Studio. Tanpa Database SQL, Tanpa Ribet.
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
