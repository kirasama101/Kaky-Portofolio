import { useState, useEffect } from "react";
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

  // Combine images and videos into a single array
  const mediaItems: MediaItem[] = [
    ...images.map((url, idx) => ({ type: "image" as const, url, index: idx })),
    ...videos.map((url, idx) => ({ type: "video" as const, url, index: images.length + idx })),
  ];

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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item, index) => (
          <div
            key={`${item.type}-${item.index}`}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-card border border-border hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => openLightbox(index)}
          >
            {item.type === "image" ? (
              <>
                <img
                  src={item.url}
                  alt={`${projectTitle} - ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-background/80 backdrop-blur-sm rounded-full p-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="none"
                  poster=""
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur-md rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-8 h-8 fill-foreground text-foreground" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
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
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation Buttons */}
              {mediaItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute left-4 z-50 text-white hover:bg-white/20 ${isAr ? "right-4 left-auto" : ""}`}
                    onClick={() => navigateMedia(isAr ? "next" : "prev")}
                  >
                    {isAr ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-4 z-50 text-white hover:bg-white/20 ${isAr ? "left-4 right-auto" : ""}`}
                    onClick={() => navigateMedia(isAr ? "prev" : "next")}
                  >
                    {isAr ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                  </Button>
                </>
              )}

              {/* Media Display */}
              <div className="w-full h-full flex items-center justify-center p-8 md:p-12">
                {currentMedia.type === "image" ? (
                  <img
                    src={currentMedia.url}
                    alt={`${projectTitle} - ${selectedIndex! + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                    style={{ maxWidth: 'calc(100% - 2rem)', maxHeight: 'calc(100% - 8rem)' }}
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                    style={{ maxWidth: 'calc(100% - 2rem)', maxHeight: 'calc(100% - 8rem)' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Counter */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
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

