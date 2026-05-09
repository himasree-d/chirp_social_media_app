import Masonry from 'react-masonry-css';

export default function FeedSkeleton() {
  const skeletonCount = 6;
  const breakpointColumnsObj = {
    default: 1,
    1100: 2
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {[...Array(skeletonCount)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" style={{ height: i % 2 === 0 ? '400px' : '300px' }}></div>
          <div className="skeleton-info">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line" style={{ width: '40%' }}></div>
              <div className="skeleton-line" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      ))}

      <style jsx="true">{`
        .skeleton-card {
          background: var(--cream);
          border-radius: var(--radius-lg);
          border: var(--border-light);
          overflow: hidden;
          margin-bottom: var(--spacing-lg);
        }
        .skeleton-image {
          background: var(--sand);
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .skeleton-image::after, .skeleton-avatar::after, .skeleton-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .skeleton-info {
          padding: var(--spacing-md);
          display: flex;
          gap: var(--spacing-sm);
        }
        .skeleton-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-organic);
          background: var(--sand);
          position: relative;
          overflow: hidden;
        }
        .skeleton-lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .skeleton-line {
          height: 12px;
          background: var(--sand);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </Masonry>
  );
}
