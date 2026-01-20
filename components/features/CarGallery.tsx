import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../services/supabase';

interface CarGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export const CarGallery: React.FC<CarGalleryProps> = ({
  images,
  alt,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageUrls = images.map((img) => getImageUrl(img));
  const activeImage = imageUrls[activeIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, imageUrls.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  if (images.length === 0) {
    return (
      <div className={`aspect-video bg-brand-gray flex items-center justify-center text-brand-muted ${className}`}>
        No Images Available
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        {/* Main Image */}
        <div
          className="relative aspect-[16/10] bg-brand-gray/30 cursor-pointer overflow-hidden group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={activeImage}
            alt={`${alt} - Image ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-black/80 px-4 py-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                <path d="M11 8v6"></path>
                <path d="M8 11h6"></path>
              </svg>
              <span className="text-white text-sm font-bold uppercase tracking-widest">Click to Enlarge</span>
            </div>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-brand-black/80 backdrop-blur px-3 py-1.5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-white text-xs font-bold">{activeIndex + 1} / {images.length}</span>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-black/80 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-black transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-black/80 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-black transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2 mt-2">
            {imageUrls.slice(0, 5).map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`aspect-square overflow-hidden border transition-all ${
                  index === activeIndex
                    ? 'border-brand-yellow ring-1 ring-brand-yellow'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={url}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-square bg-brand-gray/50 border border-white/10 flex items-center justify-center text-white hover:border-brand-yellow transition-colors"
              >
                <span className="text-sm font-bold">+{images.length - 5}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-white text-sm">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Toggle zoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isZoomed ? (
                    <>
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                      <path d="M8 11h6"></path>
                    </>
                  ) : (
                    <>
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                      <path d="M11 8v6"></path>
                      <path d="M8 11h6"></path>
                    </>
                  )}
                </svg>
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close lightbox"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt={`${alt} - Image ${activeIndex + 1}`}
              className={`max-h-full max-w-full object-contain transition-transform ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Thumbnails strip */}
          <div className="flex items-center justify-center gap-2 py-4 px-6 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            {imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                  index === activeIndex
                    ? 'border-brand-yellow opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={url}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
