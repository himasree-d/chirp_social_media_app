import { useState } from 'react';

export default function MoodBoard({ recentPosts }) {
  const images = recentPosts && recentPosts.length > 0 
    ? recentPosts.map(post => post.imageUrl).slice(0, 5)
    : [
        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        'https://res.cloudinary.com/demo/image/upload/flower.jpg',
        'https://res.cloudinary.com/demo/image/upload/dog.jpg'
      ];

  return (
    <div className="moodboard-container">
      <div className="collage">
        {images.map((url, i) => (
          <img 
            key={i} 
            src={url} 
            alt="Moodboard snippet" 
            className={`collage-item item-${i}`} 
          />
        ))}
      </div>
      
      <div className="gradient-mask" />

      <style jsx="true">{`
        .moodboard-container {
          position: relative;
          height: 260px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background-color: var(--sand);
          margin-bottom: -40px;
          isolation: isolate;
        }

        .collage {
          position: absolute;
          inset: 0;
          display: flex;
          gap: 2px;
        }

        .collage-item {
          flex-grow: 1;
          height: 100%;
          object-fit: cover;
          filter: blur(4px) saturate(1.1);
          transform: scale(1.05);
          transition: filter 0.4s ease, transform 0.4s ease, opacity 0.4s;
          opacity: 0.7;
        }

        .collage-item:hover {
          filter: blur(0px) saturate(1);
          transform: scale(1);
          opacity: 1;
          z-index: 10;
        }

        .item-0 { flex: 1.5; }
        .item-1 { flex: 1; }
        .item-2 { flex: 2; }
        .item-3 { flex: 0.8; }
        .item-4 { flex: 1.2; }

        .gradient-mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(250, 247, 242, 0.4) 50%,
            var(--cream) 100%
          );
          pointer-events: none;
          z-index: 5;
        }

        @media (max-width: 768px) {
          .moodboard-container {
            height: 200px;
            margin-bottom: -30px;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
