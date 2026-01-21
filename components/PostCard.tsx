
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const readTime = Math.ceil(post.body.split(' ').length / 200);

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 flex flex-col h-full">
      <Link to={`/post/${post.slug}`} className="relative aspect-video overflow-hidden">
        <img 
          src={post.gambar} 
          alt={post.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {post.label.split(',').map(l => (
            <span key={l} className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
              {l.trim()}
            </span>
          ))}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
          <span><i className="far fa-calendar mr-1"></i> {post.tanggalJam.split(' ')[0]}</span>
          <span><i className="far fa-clock mr-1"></i> {readTime} min read</span>
        </div>
        
        <Link to={`/post/${post.slug}`} className="block mb-3">
          <h2 className="text-xl font-bold leading-tight group-hover:text-primary-500 transition">
            {post.judul}
          </h2>
        </Link>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 flex-grow">
          {post.metaDeskripsi}
        </p>
        
        <Link 
          to={`/post/${post.slug}`}
          className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group/link"
        >
          Baca Selengkapnya
          <i className="fas fa-arrow-right ml-2 group-hover/link:translate-x-1 transition-transform"></i>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
