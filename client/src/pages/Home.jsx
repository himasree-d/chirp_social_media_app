import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import FeedPost from '../components/Feed/FeedPost';
import InfiniteScroll from '../components/Feed/InfiniteScroll';
import FeedSkeleton from '../components/Feed/FeedSkeleton';
import { useFeed } from '../hooks/useFeed';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Home() {
  const { posts, isLoading, hasMore, fetchNextPage } = useFeed();
  const { user } = useContext(AuthContext);

  const breakpointColumnsObj = {
    default: 1,
    1100: 2,
  };

  return (
    <div className="home-feed">
      <div className="feed-header">
        <h1>Your Chirp</h1>
        <p>A quiet space for your thoughts.</p>
      </div>

      {isLoading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : (
        <InfiniteScroll 
          onIntersect={fetchNextPage} 
          hasMore={hasMore} 
          isLoading={isLoading}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {posts.map(post => (
              <FeedPost 
                key={post._id} 
                post={post} 
                currentUserId={user?._id} 
              />
            ))}
          </Masonry>
        </InfiniteScroll>
      )}

      <style jsx="true">{`
        .home-feed {
          animation: fadeIn 0.4s ease-out;
        }

        .feed-header {
          margin-bottom: var(--spacing-xl);
          text-align: center;
        }

        .feed-header h1 {
          font-size: 2.5rem;
          color: var(--terracotta);
          margin-bottom: var(--spacing-xs);
        }

        .feed-header p {
          color: var(--warm-taupe);
          font-size: 1.1rem;
        }

        /* Masonry Layout Styles */
        :global(.my-masonry-grid) {
          display: flex;
          margin-left: -20px; /* gutter size offset */
          width: auto;
        }
        :global(.my-masonry-grid_column) {
          padding-left: 20px; /* gutter size */
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
