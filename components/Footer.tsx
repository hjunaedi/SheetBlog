
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">SheetBlog</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
              Platform blog modern yang ditenagai oleh Google Sheets. Menghadirkan kemudahan pengelolaan konten dengan performa website yang maksimal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition"><i className="fab fa-instagram text-xl"></i></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition"><i className="fab fa-twitter text-xl"></i></a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition"><i className="fab fa-github text-xl"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-primary-500 transition">Beranda</Link></li>
              <li><Link to="/post/about-us" className="hover:text-primary-500 transition">Tentang Kami</Link></li>
              <li><Link to="/post/privacy-policy" className="hover:text-primary-500 transition">Kebijakan Privasi</Link></li>
              <li><Link to="/post/contact" className="hover:text-primary-500 transition">Hubungi Kami</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Kategori</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li><Link to="/label/Technology" className="hover:text-primary-500 transition">Technology</Link></li>
              <li><Link to="/label/Lifestyle" className="hover:text-primary-500 transition">Lifestyle</Link></li>
              <li><Link to="/label/Education" className="hover:text-primary-500 transition">Education</Link></li>
              <li><Link to="/label/Business" className="hover:text-primary-500 transition">Business</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SheetBlog. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Powered by Google Sheets</span>
            <span className="flex items-center"><i className="fas fa-heart text-red-500 mr-2"></i> Built for Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
