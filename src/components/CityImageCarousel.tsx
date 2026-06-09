import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface CityImageCarouselProps {
  cityName: string;
  countryName: string;
  className?: string;
}

export default function CityImageCarousel({
  cityName,
  countryName,
  className = "w-full h-full"
}: CityImageCarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const loadImages = async () => {
      setLoading(true);
      setFailed(false);
      setCurrentIndex(0);
      
      const unsplashAccessKey = 'lV08rSmj9tT07r7sreREI3qH-7Fbyf2K9Vb9lXvV2W0';
      const pexelsAccessKey = '563492ad6f91700001000001fb7e9e6ecbc63cfb0616b2c9edef87e5';
      
      let fetchedUrls: string[] = [];
      let attempts = 0;

      // Attempt 1: Unsplash with city + country
      if (attempts < 3 && fetchedUrls.length < 3) {
        attempts++;
        try {
          const query = `${cityName}, ${countryName}`;
          const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=${unsplashAccessKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.results && data.results.length >= 3) {
              fetchedUrls = data.results.map((item: any) => {
                const rawUrl = item.urls.regular || "";
                return rawUrl.includes('?') 
                  ? `${rawUrl.split('?')[0]}?auto=format&fit=crop&q=80&w=800`
                  : `${rawUrl}?auto=format&fit=crop&q=80&w=800`;
              });
            }
          }
        } catch (e) {
          console.warn("Unsplash city+country query failed or returned too few photos:", e);
        }
      }

      // Attempt 2: Unsplash with just cityName (broader search to ensure images)
      if (attempts < 3 && fetchedUrls.length < 3) {
        attempts++;
        try {
          const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&per_page=5&client_id=${unsplashAccessKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.results && data.results.length >= 3) {
              fetchedUrls = data.results.map((item: any) => {
                const rawUrl = item.urls.regular || "";
                return rawUrl.includes('?') 
                  ? `${rawUrl.split('?')[0]}?auto=format&fit=crop&q=80&w=800`
                  : `${rawUrl}?auto=format&fit=crop&q=80&w=800`;
              });
            }
          }
        } catch (e) {
          console.warn("Unsplash cityName-only search failed:", e);
        }
      }

      // Attempt 3: Intelligent fallback to Pexels search
      if (attempts < 3 && fetchedUrls.length < 3) {
        attempts++;
        try {
          const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)}&per_page=5`, {
            headers: {
              Authorization: pexelsAccessKey
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.photos && data.photos.length >= 3) {
              fetchedUrls = data.photos.map((photo: any) => {
                return photo.src.large2x || photo.src.large || photo.src.original;
              });
            }
          }
        } catch (e) {
          console.warn("Pexels fallback search failed:", e);
        }
      }

      if (!active) return;

      // Handle outcomes
      if (fetchedUrls.length >= 3) {
        setImages(fetchedUrls);
        setFailed(false);
      } else {
        // If we still didn't reach 3 images, but have some, use them!
        // Otherwise, flag as a design fallback trigger.
        if (fetchedUrls.length > 0) {
          setImages(fetchedUrls);
          setFailed(false);
        } else {
          setFailed(true);
        }
      }
      setLoading(false);
    };

    loadImages();
    return () => {
      active = false;
    };
  }, [cityName, countryName]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gray-900 border border-gray-800 text-center select-none ${className}`}>
        <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-2" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase animate-pulse">
          Synch Photos...
        </span>
      </div>
    );
  }

  // Design fallback: absolute protection against default images or broken links
  if (failed || images.length === 0) {
    return (
      <div 
        className={`relative flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #000000 100%)' }}
      >
        <div className="absolute inset-x-0 bottom-4 px-6 text-center z-10 drop-shadow-lg">
          <span className="block text-white text-xl font-black uppercase tracking-wider font-sans leading-tight">
            {cityName}
          </span>
          <span className="block text-[10px] font-mono font-bold text-orange-400 mt-2 uppercase tracking-widest leading-none">
            {countryName}
          </span>
        </div>
        {/* Abstract design elements to look like a premium poster */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-orange-500/30" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-orange-500/30" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-orange-500/30" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-orange-500/30" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden group select-none ${className}`}>
      {/* Slides display with smooth absolute crossfade duration-300 */}
      <div className="w-full h-full relative">
        {images.map((src, idx) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
              pointerEvents: idx === currentIndex ? 'auto' : 'none'
            }}
          >
            <img
              src={src}
              alt={`${cityName} slideshow view ${idx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Instantly swap broken sub-images with a premium backup cityscape skyline
                e.currentTarget.src = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtle bottom gradient mask for text legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Navigation arrows styled with White background, Orange text/arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            type="button"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-50 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/40 z-20 cursor-pointer"
            aria-label="Previous city slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-50 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/40 z-20 cursor-pointer"
            aria-label="Next city slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </>
      )}

      {/* Indicator dots at the bottom center */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all focus:outline-none ${idx === currentIndex ? 'bg-orange-500 w-4' : 'bg-white/60 hover:bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
