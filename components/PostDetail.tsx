
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types';

interface PostDetailProps {
  posts: Post[];
}

const PostDetail: React.FC<PostDetailProps> = ({ posts }) => {
  const { slug } = useParams<{ slug: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const post = useMemo(() => posts.find(p => p.slug === slug), [posts, slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Post tidak ditemukan</h2>
        <Link to="/" className="text-primary-500 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Extract headings H2 for automatic Table of Contents
  const headings = useMemo(() => {
    const matches = Array.from(post.body.matchAll(/<h2.*?>(.*?)<\/h2>/g));
    return matches.map(match => match[1].replace(/<[^>]*>?/gm, ''));
  }, [post.body]);

  const relatedPosts = useMemo(() => {
    return posts
      .filter(p => p.slug !== slug && p.tipe === 'Post' && p.label.includes(post.label.split(',')[0]))
      .slice(0, 3);
  }, [posts, slug, post.label]);

  const readTime = Math.ceil(post.body.split(/\s+/).length / 200);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60]">
        <div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-400 truncate">{post.judul}</span>
      </nav>

      <article>
        <header className="mb-10 text-center">
          <div className="flex justify-center gap-2 mb-4">
            {post.label.split(',').map(l => (
              <Link key={l} to={`/label/${l.trim()}`} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {l.trim()}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">{post.judul}</h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-4">
            <div className="flex items-center">
              <i className="far fa-user-circle mr-2 text-primary-500"></i>
              <span>Admin</span>
            </div>
            <div className="flex items-center">
              <i className="far fa-calendar-alt mr-2 text-primary-500"></i>
              <span>{post.tanggalJam}</span>
            </div>
            <div className="flex items-center">
              <i className="far fa-clock mr-2 text-primary-500"></i>
              <span>{readTime} menit baca</span>
            </div>
          </div>
        </header>

        <div className="relative group mb-10">
          <img 
            src={post.gambar} 
            alt={post.judul} 
            className="w-full aspect-video object-cover rounded-3xl shadow-2xl transition duration-500 group-hover:brightness-105" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            {/* Table of Contents Box */}
            {headings.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl mb-10 border-l-4 border-primary-500 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <i className="fas fa-stream mr-2 text-primary-500"></i>
                  Daftar Isi
                </h3>
                <ul className="space-y-3">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a href={`#heading-${i}`} className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-start">
                        <span className="mr-2 text-primary-500/50 font-mono">{i + 1}.</span>
                        {h}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content Body */}
            <div 
              className="prose prose-slate dark:prose-invert max-w-none 
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800
                prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto
                prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-4 prose-pre:shadow-inner"
              dangerouslySetInnerHTML={{ 
                __html: post.body.replace(/<h2>/g, (match, offset, string) => {
                  const index = string.substring(0, offset).split('<h2>').length - 1;
                  return `<h2 id="heading-${index}">`;
                }) 
              }}
            />

            {/* Social Share */}
            <div className="mt-16 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h4 className="font-bold mb-6 text-center text-lg">Bagikan ke Media Sosial</h4>
              <div className="flex justify-center flex-wrap gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] text-white hover:scale-105 transition shadow-lg shadow-blue-500/20"><i className="fab fa-facebook-f"></i> Facebook</button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DA1F2] text-white hover:scale-105 transition shadow-lg shadow-sky-500/20"><i className="fab fa-twitter"></i> Twitter</button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white hover:scale-105 transition shadow-lg shadow-green-500/20"><i className="fab fa-whatsapp"></i> WhatsApp</button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold border-b-2 border-primary-500 pb-2 mb-6 flex items-center">
                  <i className="fas fa-fire mr-2 text-orange-500"></i> Rekomendasi
                </h4>
                <div className="space-y-6">
                  {relatedPosts.map((rp, i) => (
                    <Link key={i} to={`/post/${rp.slug}`} className="group block">
                      <div className="space-y-3">
                        <img src={rp.gambar} className="w-full h-24 rounded-xl object-cover shadow-sm group-hover:brightness-110 transition" />
                        <div>
                          <h5 className="text-sm font-bold line-clamp-2 group-hover:text-primary-500 transition-colors leading-snug">{rp.judul}</h5>
                          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 block tracking-widest">{rp.tanggalJam.split(' ')[0]}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {relatedPosts.length === 0 && <p className="text-xs text-slate-400 italic">Tidak ada artikel terkait saat ini.</p>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Bottom Related Section */}
      <section className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-black mb-10 flex items-center">
          <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center mr-3 text-sm">
            <i className="fas fa-plus"></i>
          </span>
          Mungkin Anda Suka
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((rp, i) => (
            <div key={i} className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
              <Link to={`/post/${rp.slug}`} className="block overflow-hidden aspect-video">
                <img src={rp.gambar} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/post/${rp.slug}`} className="font-bold text-lg line-clamp-2 hover:text-primary-500 transition leading-tight mb-2">{rp.judul}</Link>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{rp.metaDeskripsi}</p>
                <Link to={`/post/${rp.slug}`} className="text-primary-500 text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center">
                  Lanjut Baca <i className="fas fa-chevron-right ml-1"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
