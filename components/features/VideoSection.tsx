import React from 'react';
import { Heading, Label, Text } from '../Typography';
import { Container } from '../Container';

interface VideoSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  thumbnail?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  title = "Experience Luxury in Motion",
  subtitle = "Virtual Showroom",
  description = "Take a virtual tour of our exclusive collection. See our vehicles in stunning detail.",
  videoUrl,
  thumbnail
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Default placeholder video (for demo purposes)
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  const defaultThumbnail = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=675&fit=crop";

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-pattern" />
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <Label className="text-brand-silver mb-4 block">{subtitle}</Label>
          <Heading as="h2" className="mb-6">
            {title.split(' ').map((word, i) => 
              i === title.split(' ').length - 1 ? (
                <span key={i} className="text-silver-chrome">{word}</span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </Heading>
          <Text className="max-w-2xl mx-auto">{description}</Text>
        </div>

        {/* Video Player */}
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video bg-brand-dark border border-white/10 overflow-hidden group animate-scale-in">
            {!isPlaying ? (
              <>
                {/* Thumbnail */}
                <img
                  src={thumbnail || defaultThumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/40 to-transparent" />
                
                {/* Play Button */}
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Play video"
                >
                  <div className="w-24 h-24 rounded-full bg-brand-gold/20 backdrop-blur border-2 border-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-brand-gold ml-1">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </button>

                {/* Video Label */}
                <div className="absolute bottom-8 left-8">
                  <div className="glass-morph-gold px-4 py-2 inline-block">
                    <span className="text-brand-gold font-bold uppercase tracking-widest text-sm">Watch Full Video</span>
                  </div>
                </div>
              </>
            ) : (
              <iframe
                className="w-full h-full"
                src={videoUrl || defaultVideoUrl}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Video Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-morph p-6 text-center group hover:glass-morph-gold transition-all animate-fade-in-up stagger-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h4 className="text-white font-display font-bold mb-2">360° Views</h4>
              <p className="text-brand-muted text-sm">See every angle of our vehicles</p>
            </div>

            <div className="glass-morph p-6 text-center group hover:glass-morph-gold transition-all animate-fade-in-up stagger-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
              </div>
              <h4 className="text-white font-display font-bold mb-2">Virtual Tours</h4>
              <p className="text-brand-muted text-sm">Explore interiors in detail</p>
            </div>

            <div className="glass-morph p-6 text-center group hover:glass-morph-gold transition-all animate-fade-in-up stagger-3">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h4 className="text-white font-display font-bold mb-2">HD Gallery</h4>
              <p className="text-brand-muted text-sm">Download high-res images</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Mini Video Card Component for multiple videos
export const VideoCard: React.FC<{
  title: string;
  thumbnail: string;
  duration?: string;
  onPlay: () => void;
}> = ({ title, thumbnail, duration, onPlay }) => {
  return (
    <div className="group relative aspect-video bg-brand-dark border border-white/10 overflow-hidden cursor-pointer" onClick={onPlay}>
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent" />
      
      {/* Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-brand-gold/20 backdrop-blur border border-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-brand-gold ml-1">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>

      {/* Title & Duration */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-bold mb-1 truncate">{title}</h4>
        {duration && (
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{duration}</span>
        )}
      </div>
    </div>
  );
};