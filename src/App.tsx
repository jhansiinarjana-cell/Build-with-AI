import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music as MusicIcon, Zap, Sun, Moon } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full" />
        {!isLightMode && <div className="scanline" />}
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setIsLightMode(!isLightMode)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-md group"
      >
        {isLightMode ? (
          <Moon className="text-neon-purple group-hover:scale-110 transition-transform" size={20} />
        ) : (
          <Sun className="text-neon-blue group-hover:scale-110 transition-transform" size={20} />
        )}
      </button>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Zap className="text-neon-green animate-pulse" size={24} />
          <h1 
            className="text-5xl font-black tracking-tighter italic uppercase neon-text-blue glitch"
            data-text="NEONSNAKE"
          >
            NEON<span className="text-neon-pink">SNAKE</span>
          </h1>
        </div>
        <p className="text-[var(--text-muted)] font-mono text-xs uppercase tracking-[0.3em]">
          Retro Arcade x AI Beats
        </p>
      </motion.header>

      <div className="jitter-container w-full max-w-6xl">
        <main className="z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar - Stats/Info */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6 hidden lg:block"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl backdrop-blur-md relative group">
            {/* Technical Decorative Corner */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-blue opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-2 mb-4 text-neon-blue">
              <Gamepad2 size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest glitch" data-text="GAME STATS">Game Stats</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Current Score</p>
                <p 
                  className="text-6xl font-black text-neon-green neon-text-green font-digital glitch"
                  data-text={score}
                >
                  {score}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">High Score</p>
                <p className="text-xl font-bold text-[var(--text-main)]">1,240</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl backdrop-blur-md relative group">
            {/* Technical Decorative Corner */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-pink opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 glitch" data-text="INSTRUCTIONS">Instructions</h2>
            <ul className="text-xs space-y-2 text-[var(--text-muted)] font-mono">
              <li>• Use Arrow Keys to move</li>
              <li>• Space to Pause/Resume</li>
              <li>• Eat pink orbs to grow</li>
              <li>• Don't hit yourself!</li>
            </ul>
          </div>
        </motion.div>

        {/* Center - Game Area */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <SnakeGame onScoreChange={setScore} />
        </motion.div>

        {/* Right Sidebar - Music Player */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 text-neon-pink lg:hidden">
            <MusicIcon size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Music Player</h2>
          </div>
          <MusicPlayer />
          
          <div className="bg-neon-blue/5 border border-neon-blue/20 p-4 rounded-xl hidden lg:block backdrop-blur-sm">
            <p className="text-[10px] text-neon-blue/60 uppercase font-mono leading-relaxed">
              System Status: Optimal<br/>
              Neural Link: Stable<br/>
              Audio Stream: Encrypted
            </p>
          </div>
        </motion.div>
        </main>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-12 text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-widest"
      >
        &copy; 2026 NEON ARCADE // POWERED BY AI
      </motion.footer>
    </div>
  );
}
