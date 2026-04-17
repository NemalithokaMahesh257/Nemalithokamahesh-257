import { useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'CyberSynth AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/neon/300/300',
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'Aura Digital',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/grid/300/300',
  },
  {
    id: '3',
    title: 'Digital Pulse',
    artist: 'Binary Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://picsum.photos/seed/pulse/300/300',
  },
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    nextSong();
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div
          key={currentSong.id}
          initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="relative w-24 h-24 flex-shrink-0 group"
        >
          <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover rounded-2xl border border-white/20 relative z-10"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-slate-900 z-20">
              <span className="flex gap-0.5 items-end h-2.5">
                <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-slate-900" />
                <motion.div animate={{ height: [2, 8, 2] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-slate-900" />
                <motion.div animate={{ height: [5, 12, 5] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-slate-900" />
              </span>
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg truncate mb-1">{currentSong.title}</h3>
          <p className="text-slate-400 text-sm font-mono flex items-center gap-2">
            <Music className="w-3 h-3" /> {currentSong.artist}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevSong}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-white text-slate-900 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={nextSong}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <div className="h-1 flex-1 bg-slate-800 rounded-full">
            <div className="h-full w-2/3 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
