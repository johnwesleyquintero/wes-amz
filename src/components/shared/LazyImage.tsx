import React, { useRef, useEffect, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string; // Optional placeholder image
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, placeholderSrc, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '');
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imageRef.current) {
      observer = new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observerInstance.unobserve(imageRef.current as Element);
            }
          });
        },
        { rootMargin: '0px 0px 100px 0px' } // Load image when it's 100px from viewport
      );

      observer.observe(imageRef.current);
    }

    return () => {
      if (observer && imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src, imageRef]);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      {...props}
    />
  );
};

export default LazyImage;