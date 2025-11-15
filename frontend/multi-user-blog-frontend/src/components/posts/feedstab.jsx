import React, { useEffect, useState } from "react";
import PostCard from "./postcard";
import PostSkeleton from "./postskeleton";
import postService from "../../services/postService";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPosts(page, 10, 'createdAt', 'desc');
      
      if (response.success) {
        const newPosts = response.data.content;
        setPosts(prev => page === 0 ? newPosts : [...prev, ...newPosts]);
        setHasMore(!response.data.last);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (error && posts.length === 0) {
    return (
      <section className="flex-1">
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
          <button
            onClick={() => loadPosts()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1">
      <div className="flex flex-col gap-6">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
        
        {loading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          <p>No posts yet. Be the first to create one!</p>
        </div>
      )}

      {/* load more / pagination */}
      {hasMore && posts.length > 0 && !loading && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-md hover:bg-gray-700"
          >
            Load more
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          No more posts to load
        </div>
      )}
    </section>
  );
}


