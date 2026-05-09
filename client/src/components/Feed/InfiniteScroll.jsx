import { useEffect, useRef } from 'react';

export default function InfiniteScroll({ children, onIntersect, hasMore, isLoading }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '200px' } // Trigger slightly before it comes into view
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [hasMore, isLoading, onIntersect]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="infinite-scroll-sentinel" style={{ height: '20px', margin: '20px 0' }}>
        {isLoading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .spinner-container {
          display: flex;
          justify-content: center;
          padding: var(--spacing-md);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--sand);
          border-top-color: var(--terracotta);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
