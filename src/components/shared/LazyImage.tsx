import React, { useRef, useEffect, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string; // Optional placeholder image
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, placeholderSrc, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imageRef) {
      observer = new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observerInstance.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px 100px 0px' } // Load image when it's 100px from viewport
      );

      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      {...props}
    />
  );
};

export default LazyImage;