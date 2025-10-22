import React from 'react';

interface OptimizedImageProps {
  srcBase: string; // e.g. '/images/optimized/Marys_electronic'
  alt: string;
  sizes?: string;
  className?: string;
}

export default function OptimizedImage({ srcBase, alt, sizes = "(max-width: 600px) 100vw, 800px", className }: OptimizedImageProps) {
  // Order: AVIF -> WebP -> JPEG
  const avifSrcSet = `${srcBase}-320.avif 320w, ${srcBase}-640.avif 640w, ${srcBase}-1024.avif 1024w, ${srcBase}-1600.avif 1600w`;
  const webpSrcSet = `${srcBase}-320.webp 320w, ${srcBase}-640.webp 640w, ${srcBase}-1024.webp 1024w, ${srcBase}-1600.webp 1600w`;
  const jpgSrcSet  = `${srcBase}-320.jpg 320w, ${srcBase}-640.jpg 640w, ${srcBase}-1024.jpg 1024w, ${srcBase}-1600.jpg 1600w`;
  const fallback = `${srcBase}-1024.jpg`;

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallback}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: '100%', height: 'auto' }}
      />
    </picture>
  );
}