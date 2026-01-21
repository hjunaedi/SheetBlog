
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeColor } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, themeColor, setThemeColor }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const colors: { name: ThemeColor, hex: string }[] = [
    { name: 'blue', hex: '#0ea5e9' },
    { name: 'red', hex: '#ef4444' },
    { name: 'green', hex: '#22c55e' },
    { name: 'purple', hex: '#a855f7' },
    { name: 'orange', hex: '#f97316' },
    { name: 'pink', hex: '#ec4899' },
    { name: 'emerald', hex: '#10b981' },
    { name: 'slate', hex: '#64748b' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            SheetBlog
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-semibold hover:text-primary-500 transition">Beranda</Link>
            <Link to="/post/about-us" className="text-sm font-semibold hover:text-primary-500 transition">Tentang</Link>
            <Link to="/post/contact" className="text-sm font-semibold hover:text-primary-500 transition">Kontak</Link>
            
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                title="Ganti Warna Tema"
              >
                <i className="fas fa-palette"></i>
              </button>
              {isThemeOpen && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setIsThemeOpen(false)}></div>
                  <div className="absolute right-0 mt-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl grid grid-cols-4 gap-3 w-48 z-10 animate-in fade-in zoom-in duration-200">
                    {colors.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => { setThemeColor(c.name); setIsThemeOpen(false); }}
                        className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2 ${themeColor === c.name ? 'border-primary-500 shadow-md' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {themeColor === c.name && <i className="fas fa-check text-[10px] text-white"></i>}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
              title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </nav>

          <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 shadow-xl">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-semibold">Beranda</Link>
          <Link to="/post/about-us" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-semibold">Tentang</Link>
          <Link to="/post/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-lg font-semibold">Kontak</Link>
          <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center">
             <span className="text-sm font-medium text-slate-500">Mode {darkMode ? 'Terang' : 'Gelap'}</span>
             <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <i className={`fas ${darkMode ? 'fa-sun text-yellow-500' : 'fa-moon'}`}></i>
            </button>
          </div>
          <div className="pt-4 space-y-3">
             <span className="text-sm font-medium text-slate-500">Warna Tema</span>
             <div className="flex flex-wrap gap-3">
               {colors.map(c => (
                 <button 
                   key={c.name}
                   onClick={() => { setThemeColor(c.name); setIsMenuOpen(false); }}
                   className={`w-8 h-8 rounded-full border-2 ${themeColor === c.name ? 'border-slate-900 dark:border-white shadow-lg' : 'border-transparent'}`}
                   style={{ backgroundColor: c.hex }}
                 />
               ))}
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
