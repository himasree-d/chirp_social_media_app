import { useState, useCallback, useEffect, useRef } from 'react';
import * as feedAPI from '../api/feedAPI';

export function useFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef(false);

  const fetchNextPage = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;
    
    fetchingRef.current = true;
    setIsLoading(true);
    
    try {
      const res = await feedAPI.getFeed(page, 10);
      const newPosts = res.data.data;
      
      setPosts(prev => {
        const combined = [...prev, ...newPosts];
        // Deduplicate by _id to prevent double-showing posts
        const uniquePosts = Array.from(new Map(combined.map(post => [post._id, post])).values());
        return uniquePosts;
      });
      
      setHasMore(res.data.hasMore);
      if (newPosts.length > 0) {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to fetch feed', err);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [page, hasMore]);

  useEffect(() => {
    if (posts.length === 0 && hasMore && !isLoading) {
      fetchNextPage();
    }
  }, [posts.length, hasMore, isLoading, fetchNextPage]);

  // Listen for custom events to refresh the feed
  useEffect(() => {
    const handleRefresh = () => {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchingRef.current = false;
    };

    window.addEventListener('postCreated', handleRefresh);
    window.addEventListener('postDeleted', handleRefresh);
    
    return () => {
      window.removeEventListener('postCreated', handleRefresh);
      window.removeEventListener('postDeleted', handleRefresh);
    };
  }, []);

  return { posts, isLoading, hasMore, fetchNextPage };
}
