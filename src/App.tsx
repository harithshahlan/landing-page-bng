/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Suspense, lazy, useSyncExternalStore } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Defer loading heavy 3D component until needed (Rule 2.4 Dynamic Imports for Heavy Components)
const MagicRings = lazy(() => import('./components/MagicRings'));

const menuItems = [
  { 
    id: 'informasi', 
    title: 'Portal Informasi', 
    subtitle: 'Segala maklumat tentang BLESS tersedia di sini', 
    cta: 'SELANJUTNYA' 
  },
  { 
    id: 'sistem', 
    title: 'Sistem BLESS', 
    subtitle: 'Log masuk ke Sistem BLESS untuk mula membuat permohonan', 
    cta: 'LOG MASUK' 
  },
  { 
    id: 'soalan', 
    title: 'Soalan Lazim', 
    subtitle: 'Cari jawapan pantas bagi persoalan umum mengenai BLESS', 
    cta: 'LIHAT FAQ' 
  },
  { 
    id: 'semakan', 
    title: 'Semakan Pantas', 
    subtitle: 'Ketahui status terkini profil dan permohonan lesen anda', 
    cta: 'SEMAK STATUS' 
  },
];

function subscribeToResize(callback: () => void) {
  window.addEventListener('resize', callback, { passive: true });
  return () => window.removeEventListener('resize', callback);
}

function getIsMobileSnapshot() {
  return window.innerWidth < 768;
}

function getServerSnapshot() {
  return false;
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Rule 5.10 Subscribe to Derived State
  const isMobile = useSyncExternalStore(subscribeToResize, getIsMobileSnapshot, getServerSnapshot);

  const activeItem = menuItems[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setCurrentIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="h-[100dvh] bg-inverse-canvas relative font-sans selection:bg-primary selection:text-inverse-ink overflow-hidden">
      
      {/* Global Background Elements (Underneath Everything) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle blue ambient glow at top right to enhance premium feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,98,254,0.1),_transparent_50%)]" />
        
        {/* Magic Rings anchored centrally to act as the primary visual backdrop */}
        <div className="absolute top-[45%] md:top-1/2 left-[50%] md:left-[55%] lg:left-[55%] -translate-x-1/2 -translate-y-1/2 w-[1200px] sm:w-[1400px] md:w-[2000px] lg:w-[2400px] h-[1200px] sm:h-[1400px] md:h-[2000px] lg:h-[2400px] opacity-[0.85] mix-blend-screen pointer-events-none will-change-transform transform-gpu">
          <Suspense fallback={null}>
            <MagicRings
              color="#A855F7"
              colorTwo="#6366f1"
              ringCount={6}
              speed={1.0}
              attenuation={18}
              lineThickness={1.0}
              baseRadius={0.13}
              radiusStep={0.05}
              scaleRate={0.1}
              opacity={0.5}
              blur={0}
              noiseAmount={0.1}
              rotation={isMobile ? 90 : 0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={false}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={true}
            />
          </Suspense>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-full w-full">
        
        {/* Left Menu / Quick Links Tiles - Disabled on mobile, shown on md+ */}
        <div className="hidden md:flex w-[240px] lg:w-[260px] shrink-0 border-r border-white/[0.05] flex-col justify-center relative z-20 h-full bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-md">
          <div className="flex flex-col w-full overflow-hidden transition-all duration-300 ease-in-out">
            {menuItems.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(menuItems.findIndex(i => i.id === item.id));
                  }}
                  className={`text-left px-5 py-5 w-full transition-colors outline-none relative ${
                    isActive 
                      ? 'bg-canvas text-ink border-y border-transparent z-10' 
                      : 'bg-transparent text-inverse-ink-muted hover:text-inverse-ink hover:bg-white/[0.04] border-t border-white/[0.05] first:border-t-0'
                  }`}
                >
                  <h2 className={`text-body-lg ${isActive ? 'font-semibold' : ''}`}>{item.title}</h2>
                </button>
              );
            })}
            {/* Bottom border to cap off the list */}
            <div className="border-t border-white/[0.05]"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative px-6 py-6 md:px-16 md:py-16 h-full overflow-hidden md:overflow-y-auto w-full bg-transparent">
          
          {/* Top Header Row (Logo & Toggle) */}
          <div className="flex justify-between items-start w-full mb-8 md:mb-18 relative z-10 lg:pl-16 shrink-0">
             {/* Logo Construction */}
             <div className="flex items-center shrink-0">
               <img src="/Logo2.png" alt="KUSKOP BLESS Logo" className="h-[40px] md:h-[64px] lg:h-[72px] object-contain object-left" />
             </div>
          </div>
          
          {/* Dynamic Hero Content using framer motion for smooth swapping */}
          <div className="flex-1 flex flex-col justify-start max-w-4xl relative z-10 w-full pl-0 lg:pl-16 min-h-0">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col w-full"
            >
              <h1 className="font-waldenburg text-[36px] sm:text-[40px] md:text-[48px] font-[300] leading-[1.08] text-inverse-ink tracking-[-0.96px] max-w-[900px] text-balance mb-3">
                {activeItem.title}
              </h1>
              <p className="text-body-lg md:text-subhead text-inverse-ink-muted mb-8 md:mb-12 max-w-2xl text-balance">
                {activeItem.subtitle}
              </p>
              
              <div>
                <button className="group btn-magic text-inverse-ink text-button py-[12px] px-[16px] inline-flex items-center rounded-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-inverse-canvas focus:ring-ring-purple shadow-none border border-transparent">
                   <span>{activeItem.cta}</span>
                   <ArrowRight className="w-4 h-4 ml-4 transform group-hover:translate-x-1.5 transition-transform duration-200 ease-out" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden w-full mt-auto mb-4 border-y border-white/[0.05] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent py-4 relative z-10 flex items-center justify-between shrink-0">
          <button onClick={handlePrev} className="p-3 text-inverse-ink-muted hover:text-white hover:bg-white/[0.05] transition-colors rounded-full outline-none focus:ring-2 focus:ring-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center flex-1 overflow-hidden px-4">
             <span className="text-[10px] uppercase tracking-wider text-inverse-ink-muted mb-1">{currentIndex + 1} of {menuItems.length}</span>
             <AnimatePresence mode="wait">
               <motion.span 
                 key={activeItem.id} 
                 initial={{ y: 5, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: -5, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className="text-sm font-medium text-white truncate w-full text-center"
               >
                 {activeItem.title}
               </motion.span>
             </AnimatePresence>
          </div>
          
          <button onClick={handleNext} className="p-3 text-inverse-ink-muted hover:text-white hover:bg-white/[0.05] transition-colors rounded-full outline-none focus:ring-2 focus:ring-primary">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer / Copyright Box */}
        <div className="md:mt-24 text-[10px] md:text-caption text-inverse-ink-muted w-full flex flex-col sm:flex-row sm:justify-between items-center sm:items-start relative z-10 lg:pl-16 shrink-0 justify-center pb-2 md:pb-0">
          <span>Hakcipta Terpelihara © BLESS 2026 - Kerajaan Malaysia</span>
        </div>

      </div>
    </div>
  </div>
  );
}
