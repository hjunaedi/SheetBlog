
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';

// --- KONFIGURASI DATA ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyPo15zAs0lpBImncFFCVRgQ7IdXFCdBI5DgPcdmjLWtLduIvW-bPHodS3BYlfL7pq_n0BCSB5YwCU/pub?gid=0&single=true&output=csv';

const COLOR_MAP: Record<string, any> = {
    blue: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
    red: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
    green: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
    purple: { 50: '#faf5ff', 100: '#f3e8ff', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce' },
    orange: { 50: '#fff7ed', 100: '#ffedd5', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
    pink: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
    emerald: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
    slate: { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 600: '#475569', 700: '#334155' }
};

// --- INTERFACES ---
interface Post {
    judul: string;
    label: string;
    gambar: string;
    body: string;
    slug: string;
    metaDeskripsi: string;
    status: string;
    tanggalJam: string;
    tipe: string;
}

// --- SERVICES ---
function parseCSVLine(line: string): string[] {
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

async function fetchSheetData(): Promise<Post[]> {
    try {
        const response = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
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
            return obj as Post;
        }).filter(p => p.status === 'Publish');
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// --- COMPONENTS ---

const Header = ({ darkMode, setDarkMode, themeColor, setThemeColor }: any) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const colors = Object.keys(COLOR_MAP).map(name => ({ name, hex: COLOR_MAP[name][500] }));

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">SheetBlog</Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-semibold hover:text-primary-500 transition">Beranda</Link>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                        <div className="relative">
                            <button onClick={() => setIsThemeOpen(!isThemeOpen)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition shadow-sm"><i className="fas fa-palette"></i></button>
                            {isThemeOpen && (
                                <>
                                    <div className="fixed inset-0 z-0" onClick={() => setIsThemeOpen(false)}></div>
                                    <div className="absolute right-0 mt-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 rounded-2xl shadow-2xl grid grid-cols-4 gap-3 w-48 z-10 animate-bounce-in">
                                        {colors.map(c => (
                                            <button key={c.name} onClick={() => { setThemeColor(c.name); setIsThemeOpen(false); }} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === c.name ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition shadow-sm"><i className={`fas ${darkMode ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i></button>
                    </nav>
                    <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 shadow-xl">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-semibold">Beranda</Link>
                    <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center">
                        <span className="text-sm">Mode Gelap</span>
                        <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <i className={`fas ${darkMode ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

const PostCard = ({ post }: { post: Post }) => {
    const readTime = Math.ceil((post.body || '').split(' ').length / 200);
    return (
        <article className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 flex flex-col h-full">
            <Link to={`/post/${post.slug}`} className="relative aspect-video overflow-hidden">
                <img src={post.gambar} alt={post.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                <div className="absolute top-4 left-4 flex gap-2">
                    {(post.label || '').split(',').map(l => (
                        <span key={l} className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[10px] font-black uppercase rounded shadow-sm tracking-widest">{l.trim()}</span>
                    ))}
                </div>
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-[10px] text-slate-500 uppercase font-bold mb-3 space-x-3">
                    <span><i className="far fa-calendar mr-1 text-primary-500"></i> {post.tanggalJam ? post.tanggalJam.split(' ')[0] : '-'}</span>
                    <span><i className="far fa-clock mr-1 text-primary-500"></i> {readTime} MIN</span>
                </div>
                <Link to={`/post/${post.slug}`} className="block mb-3"><h2 className="text-xl font-bold leading-tight group-hover:text-primary-500 transition line-clamp-2">{post.judul}</h2></Link>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">{post.metaDeskripsi}</p>
                <Link to={`/post/${post.slug}`} className="inline-flex items-center text-sm font-black text-primary-600 dark:text-primary-400 group/link uppercase tracking-[0.15em] text-[11px]">Selengkapnya <i className="fas fa-arrow-right ml-2 group-hover/link:translate-x-1 transition-transform"></i></Link>
            </div>
        </article>
    );
};

const PostDetail = ({ posts }: { posts: Post[] }) => {
    const { slug } = useParams();
    const [scrollProgress, setScrollProgress] = useState(0);
    const post = useMemo(() => posts.find(p => p.slug === slug), [posts, slug]);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    if (!post) return <div className="text-center py-20 font-bold">Post tidak ditemukan. <Link to="/" className="text-primary-500">Kembali</Link></div>;

    const readTime = Math.ceil((post.body || '').split(/\s+/).length / 200);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="fixed top-0 left-0 w-full h-1.5 z-[60]"><div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${scrollProgress}%` }} /></div>
            <article>
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">{post.judul}</h1>
                    <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500 border-y py-6">
                        <span><i className="far fa-calendar-alt mr-2 text-primary-500"></i>{post.tanggalJam}</span>
                        <span><i className="far fa-clock mr-2 text-primary-500"></i>{readTime} MENIT BACA</span>
                    </div>
                </header>
                <img src={post.gambar} alt={post.judul} className="w-full aspect-video object-cover rounded-[2rem] shadow-2xl mb-12" />
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-black prose-h2:mt-12 prose-h2:mb-6 prose-p:leading-relaxed prose-img:rounded-3xl"
                    dangerouslySetInnerHTML={{ __html: post.body }} 
                />
            </article>
        </div>
    );
};

const Home = ({ posts, columns, setColumns }: any) => {
    const [currentPage, setCurrentPage] = useState(1);
    const blogPosts = useMemo(() => posts.filter((p: Post) => p.tipe === 'Post'), [posts]);
    const postsPerPage = 6;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b pb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Eksplorasi</h1>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em]">Tersedia {blogPosts.length} Artikel</p>
                </div>
                <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 shadow-inner">
                    {[1, 2, 3].map(n => (
                        <button key={n} onClick={() => setColumns(n)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${columns === n ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{n} Kolom</button>
                    ))}
                </div>
            </div>
            <div className={`grid gap-10 ${columns === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {currentPosts.map((post: Post, idx: number) => <PostCard key={idx} post={post} />)}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button key={n} onClick={() => { setCurrentPage(n); window.scrollTo({top:0, behavior:'smooth'}); }} className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${currentPage === n ? 'bg-primary-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border text-slate-400'}`}>{n}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => localStorage.theme === 'dark');
    const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'blue');
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        fetchSheetData().then(data => { setPosts(data); setLoading(false); });
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.theme = darkMode ? 'dark' : 'light';
    }, [darkMode]);

    useEffect(() => {
        const palette = COLOR_MAP[themeColor];
        if (palette) {
            const root = document.documentElement;
            Object.keys(palette).forEach(key => root.style.setProperty(`--primary-${key}`, palette[key]));
            localStorage.setItem('themeColor', themeColor);
        }
    }, [themeColor]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-slate-50 dark:bg-slate-900">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-[10px] uppercase tracking-[0.5em] text-primary-500">Memuat Data...</p>
        </div>
    );

    return (
        <HashRouter>
            <div className="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white">
                <Header darkMode={darkMode} setDarkMode={setDarkMode} themeColor={themeColor} setThemeColor={setThemeColor} />
                <main className="flex-grow container mx-auto px-4 py-16">
                    <Routes>
                        <Route path="/" element={<Home posts={posts} columns={columns} setColumns={setColumns} />} />
                        <Route path="/post/:slug" element={<PostDetail posts={posts} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <footer className="bg-white dark:bg-slate-900 border-t mt-20 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-black mb-4">SheetBlog.</h2>
                        <div className="border-t pt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            &copy; {new Date().getFullYear()} SheetBlog Studio. All rights reserved.
                        </div>
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
