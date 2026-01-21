
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { fetchSheetData } from './services/dataService';
import { Post, ThemeColor } from './types';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

const COLOR_MAP: Record<ThemeColor, { 50: string; 100: string; 500: string; 600: string; 700: string }> = {
  blue: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
  red: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  green: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  purple: { 50: '#faf5ff', 100: '#f3e8ff', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce' },
  orange: { 50: '#fff7ed', 100: '#ffedd5', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
  pink: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
  slate: { 50: '#f8fafc', 100: '#f1f5f9', 500: '#64748b', 600: '#475569', 700: '#334155' }
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    return (localStorage.getItem('themeColor') as ThemeColor) || 'blue';
  });
  
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchSheetData();
      setPosts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);

  // Update Primary Color CSS Variables
  useEffect(() => {
    const palette = COLOR_MAP[themeColor];
    const root = document.documentElement;
    root.style.setProperty('--primary-50', palette[50]);
    root.style.setProperty('--primary-100', palette[100]);
    root.style.setProperty('--primary-500', palette[500]);
    root.style.setProperty('--primary-600', palette[600]);
    root.style.setProperty('--primary-700', palette[700]);
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white">
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          themeColor={themeColor}
          setThemeColor={setThemeColor}
        />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <Home posts={posts} columns={columns} setColumns={setColumns} />
            } />
            <Route path="/post/:slug" element={
              <PostDetail posts={posts} />
            } />
            <Route path="/label/:label" element={
              <LabelFilter posts={posts} columns={columns} />
            } />
          </Routes>
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </HashRouter>
  );
};

const Home: React.FC<{ posts: Post[], columns: number, setColumns: (n: number) => void }> = ({ posts, columns, setColumns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts = useMemo(() => posts.filter(p => p.tipe === 'Post'), [posts]);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artikel Terbaru</h1>
          <p className="text-slate-500 text-sm mt-1">Menampilkan {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, blogPosts.length)} dari {blogPosts.length} artikel</p>
        </div>
        <div className="hidden md:flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          {[1, 2, 3].map(n => (
            <button 
              key={n}
              onClick={() => setColumns(n)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${columns === n ? 'bg-primary-500 text-white shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
            >
              {n} Kolom
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 ${
        columns === 1 ? 'grid-cols-1' : 
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {currentPosts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-10">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all ${
              currentPage === 1 
              ? 'opacity-30 cursor-not-allowed text-slate-400' 
              : 'hover:bg-primary-500 hover:text-white hover:border-primary-500 bg-white dark:bg-slate-800'
            }`}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === number
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all ${
              currentPage === totalPages 
              ? 'opacity-30 cursor-not-allowed text-slate-400' 
              : 'hover:bg-primary-500 hover:text-white hover:border-primary-500 bg-white dark:bg-slate-800'
            }`}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

const LabelFilter: React.FC<{ posts: Post[], columns: number }> = ({ posts, columns }) => {
  const { label } = useParams<{ label: string }>();
  const filtered = posts.filter(p => p.label.includes(label || ''));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Label: {label}</h1>
      <div className={`grid gap-6 ${
        columns === 1 ? 'grid-cols-1' : 
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filtered.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </div>
    </div>
  );
};

export default App;
