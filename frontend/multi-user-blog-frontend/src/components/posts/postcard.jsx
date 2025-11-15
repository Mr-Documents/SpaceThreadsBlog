import React from "react";
import { Link } from "react-router-dom";

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}d`;
}

export default function PostCard({ post }) {
  return (
    <article className="w-full rounded-md bg-gray-900 border border-gray-800 overflow-hidden">
      {post.coverImage ? (
        <img src={post.coverImage} alt="" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center text-gray-400">No image</div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
              {post.author?.name?.[0] || "U"}
            </div>
            <div>
              <Link to={`/profile/${post.author?.username}`} className="text-sm text-gray-300 font-medium hover:text-white">{post.author?.name}</Link>
              <div className="text-xs text-gray-500">{timeAgo(new Date(post.createdAt).getTime())} • {post.readTime || "5 min read"}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{post.viewCount?.toLocaleString() || 0} views</div>
        </div>

        <Link to={`/posts/${post.id}`} className="block mt-3">
          <h3 className="text-lg text-white font-semibold leading-tight hover:underline">{post.title}</h3>
          <p className="mt-2 text-gray-300 text-sm line-clamp-3">{post.excerpt}</p>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <button aria-label="Like" className="flex items-center gap-2 hover:text-white transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.6c0 5.6-7.8 9.4-7.8 9.4S5.2 14.2 5.2 8.6A3.6 3.6 0 018.8 5a3.6 3.6 0 013.4 3.6c0 .9.9 1.9 1.6 2.6.7-.7 1.6-1.7 1.6-2.6A3.6 3.6 0 0116.8 5a3.6 3.6 0 012.9 3.6z"/>
                </svg>
                <span>{post.likeCount || 0}</span>
              </button>
            </div>
            <div className="text-xs text-gray-500">·</div>
            <div className="text-sm text-gray-400">{post.commentCount || 0} comments</div>
          </div>

          <div className="flex items-center gap-2">
            {post.tags?.slice(0, 2).map(t => <span key={t.id || t.name} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{t.name || t}</span>)}
            <button className="text-sm text-gray-400 px-2 py-1 rounded hover:bg-gray-800">Save</button>
          </div>
        </div>
      </div>
    </article>
  );
}
