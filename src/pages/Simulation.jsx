import React, { useState, useEffect } from 'react';
import { EarthScene } from '../components/simulation/EarthScene.jsx';
import { InputPanel } from '../components/panels/InputPanel.jsx';
import { MetricsPanel } from '../components/panels/MetricsPanel.jsx';
import { ConsoleLog } from '../components/panels/ConsoleLog.jsx';

export const Simulation = () => {
  const [isUIHidden, setIsUIHidden] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fallback fullscreen: ${err.message}`);
      });
      setIsUIHidden(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsUIHidden(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsUIHidden(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-dark">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <EarthScene />
      </div>

      {/* Cinematic Mode Toggle Button */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-opacity duration-500 delay-100 ${isUIHidden ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
        <button 
          onClick={toggleFullScreen}
          className="bg-black/40 border border-neon-cyan/40 text-neon-cyan px-4 py-1.5 rounded shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all backdrop-blur-md font-mono text-xs uppercase tracking-wider flex items-center gap-2"
        >
          {isUIHidden ? (
            <><span>↙</span> Exit Cinematic</>
          ) : (
            <><span>⛶</span> Cinematic Mode</>
          )}
        </button>
      </div>

      {/* UI Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none flex p-6 gap-6 h-full transition-all duration-700 ${isUIHidden ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Left Column: Inputs */}
        <div className="w-[350px] flex flex-col pointer-events-auto h-full">
           <div className="mb-4">
              <h1 className="text-2xl font-bold text-white tracking-widest flex items-center">
                 <span className="text-neon-cyan mr-2">⚡</span> HELIOS-LINK
              </h1>
              <p className="text-sm text-gray-400">SBSP Transmission Control</p>
           </div>
           <InputPanel />
        </div>

        {/* Center: Open Space for 3D View */}
        <div className="flex-1"></div>

        {/* Right Column: Metrics & Logs */}
        <div className="w-[400px] flex flex-col gap-6 pointer-events-auto h-full">
          <MetricsPanel />
          <ConsoleLog />
        </div>
      </div>
    </div>
  );
};
