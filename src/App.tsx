import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Ghost } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 overflow-x-hidden relative font-sans">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Decorative Grid Lines */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Navigation / Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Cpu className="text-slate-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">NEON CORE</h1>
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em]">System v2.4.0</span>
          </div>
        </div>

        <div className="hidden sm:flex gap-8 text-xs font-mono uppercase tracking-widest text-slate-500">
          <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">Arcade</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terminal</span>
          <span className="hover:text-white cursor-pointer transition-colors">Security</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden xs:block">
            <div className="text-[10px] text-slate-500 font-mono">STATUS</div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Sidebar - Meta Info */}
          <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="flex items-center gap-3 mb-4 text-cyan-400">
                  <Terminal className="w-5 h-5" />
                  <h2 className="font-bold text-sm uppercase tracking-wider">Mission Intel</h2>
                </div>
                <ul className="space-y-4 text-sm font-mono text-slate-400">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Target</span>
                    <span className="text-fuchsia-400">Neon Orbs</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Objective</span>
                    <span className="text-white">Collect & Grow</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Threat</span>
                    <span className="text-rose-400">Self-Impact</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-fuchsia-600/20 to-transparent border border-fuchsia-500/20 rounded-3xl">
                <div className="flex items-center gap-3 mb-2 text-fuchsia-400">
                  <Ghost className="w-5 h-5" />
                  <h2 className="font-bold text-sm uppercase tracking-wider">System Alert</h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  Integrity compromised in sectors 7 through 14. Keep movement fluid. Avoid critical intersections.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center - Game Window */}
          <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <SnakeGame />
            </motion.div>
          </div>

          {/* Right Sidebar - Music Player */}
          <div className="lg:col-span-3 lg:flex lg:justify-end order-3">
             <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-md lg:sticky lg:top-8"
            >
              <div className="mb-4 flex items-center justify-between px-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Atmosphere Control</span>
                <span className="w-12 h-0.5 bg-white/10" />
              </div>
              <MusicPlayer />
            </motion.div>
          </div>

        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-white/5 bg-black/60 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Protocol 8</span>
            <span className="hover:text-fuchsia-400 cursor-pointer transition-colors">Neural Link</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ghost Shell</span>
          </div>
          <p className="text-[10px] font-mono text-slate-700">
            &copy; 2026 CYBERNEURAL INDUSTRIES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
