import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProjectGalleryProps {
  images: string[];
  videos?: string[];
  projectTitle: string;
}

type MediaItem = {
  type: "image" | "video";
  url: string;
  index: number;
};

const ProjectGallery = ({ images, videos = [], projectTitle }: ProjectGalleryProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Combine images and videos into a single array
  const mediaItems: MediaItem[] = [
    ...images.map((url, idx) => ({ type: "image" as const, url, index: idx })),
    ...videos.map((url, idx) => ({ type: "video" as const, url, index: images.length + idx })),
  ];

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before item is visible
        threshold: 0.01,
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [mediaItems.length]);

  // Set initial visible items (first 6)
  useEffect(() => {
    const initial = new Set(Array.from({ length: Math.min(6, mediaItems.length) }, (_, i) => i));
    setVisibleItems(initial);
  }, [mediaItems.length]);

  if (mediaItems.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const navigateMedia = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;
    if (direction === "prev") {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : mediaItems.length - 1);
    } else {
      setSelectedIndex(selectedIndex < mediaItems.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !isAr) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
      } else if (e.key === "ArrowRight" && !isAr) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowRight" && isAr) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
      } else if (e.key === "ArrowLeft" && isAr) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isAr, mediaItems.length]);

  const currentMedia = selectedIndex !== null ? mediaItems[selectedIndex] : null;

  // Calculate lightbox image size based on viewport
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updateImageStyle = () => {
      const padding = window.innerWidth < 768 ? 80 : 120; // Less padding on mobile
      const maxWidth = Math.min(window.innerWidth * 0.95 - padding, window.innerWidth - padding);
      const maxHeight = Math.min(window.innerHeight * 0.95 - padding, window.innerHeight - padding);
      setImageStyle({
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        width: "auto",
        height: "auto",
        objectFit: "contain",
      });
    };

    updateImageStyle();
    window.addEventListener("resize", updateImageStyle);
    return () => window.removeEventListener("resize", updateImageStyle);
  }, [selectedIndex]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item, index) => {
          const isVisible = visibleItems.has(index);
          return (
            <div
              key={`${item.type}-${item.index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-index={index}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-card border border-border hover:border-white/30 transition-all duration-200 will-change-transform"
              onClick={() => openLightbox(index)}
              style={{ contain: "layout style paint" }} // Performance optimization
            >
              {item.type === "image" ? (
                <>
                  {isVisible ? (
                    <img
                      src={item.url}
                      alt={`${projectTitle} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-background/80 backdrop-blur-sm rounded-full p-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {isVisible ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-background/90 backdrop-blur-md rounded-full p-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                      <Play className="w-8 h-8 fill-foreground text-foreground" />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 bg-black/95 border-none overflow-hidden">
          {currentMedia && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 md:top-4 md:right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={closeLightbox}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>

              {/* Navigation Buttons */}
              {mediaItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute left-2 md:left-4 z-50 text-white hover:bg-white/20 rounded-full ${isAr ? "right-2 md:right-4 left-auto" : ""}`}
                    onClick={() => navigateMedia(isAr ? "next" : "prev")}
                  >
                    {isAr ? <ChevronRight className="w-6 h-6 md:w-8 md:h-8" /> : <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 md:right-4 z-50 text-white hover:bg-white/20 rounded-full ${isAr ? "left-2 md:left-4 right-auto" : ""}`}
                    onClick={() => navigateMedia(isAr ? "prev" : "next")}
                  >
                    {isAr ? <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /> : <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />}
                  </Button>
                </>
              )}

              {/* Media Display */}
              <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
                {currentMedia.type === "image" ? (
                  <img
                    src={currentMedia.url}
                    alt={`${projectTitle} - ${selectedIndex! + 1}`}
                    className="object-contain rounded-lg"
                    style={imageStyle}
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    className="object-contain rounded-lg"
                    style={imageStyle}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Counter */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
                  {selectedIndex! + 1} / {mediaItems.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectGallery;
