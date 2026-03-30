import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  },
  {
    id: 4,
    title: "Mawa Enthaina",
    artist: "Thaman S",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/seed/mawa/300/300"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];
  const isFavorited = favorites.has(currentTrack.id);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl transition-colors duration-500">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-6">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-full border-2 border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.4)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full border border-white/20" />
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-white truncate neon-text-blue">{currentTrack.title}</h3>
            <button 
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`flex-shrink-0 transition-all duration-300 ${isFavorited ? 'text-neon-pink' : 'text-gray-500 hover:text-white'}`}
            >
              <Heart 
                size={20} 
                fill={isFavorited ? "currentColor" : "none"} 
                className={isFavorited ? "drop-shadow-[0_0_8px_#ff00ff]" : ""} 
              />
            </button>
          </div>
          <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
          
          <div className="mt-4 space-y-2">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-neon-blue shadow-[0_0_10px_#00f2ff]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="p-2 text-gray-400 hover:text-neon-blue transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-neon-blue rounded-full text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.6)]"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="p-2 text-gray-400 hover:text-neon-blue transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-gray-400 w-full max-w-[200px]">
          <Volume2 size={18} className="flex-shrink-0" />
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-neon-blue/50 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
        <Music size={12} />
        <span>Now Playing AI Radio</span>
      </div>
    </div>
  );
}
