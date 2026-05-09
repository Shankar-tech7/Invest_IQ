import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Clock, Activity, ShieldAlert, Cpu, Share2 } from "lucide-react";

import { forensicDatabase } from "../data/forensicDatabase";

const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
};

export default function ReconstructionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);

  const startReconstruction = () => {
    setIsProcessing(true);
    setShowTimeline(false);
    
    // Get last analyzed file from CCTV page
    const lastFile = localStorage.getItem("last_analyzed_file") || "default_feed";
    const hash = getHash(lastFile);
    const index = hash % forensicDatabase.length;
    
    // Map database structure to UI component structure
    const dbScenario = forensicDatabase[index];
    setCurrentScenario(dbScenario.reconstruction);
    
    // Simulate complex AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowTimeline(true);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Cpu className="w-6 h-6 text-[#ff003c]" /> AI Crime Scene Reconstruction
        </h2>
        <div className="flex gap-2">
          <button className="p-2 bg-[#171717] rounded-lg text-slate-400 hover:text-white border border-[#262626]">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reconstruction Panel */}
      <div className="glass-panel rounded-2xl p-8 min-h-[500px] relative overflow-hidden flex flex-col items-center justify-center">
        
        {!isProcessing && !showTimeline && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-[#ff003c]/10 rounded-full flex items-center justify-center mx-auto border border-[#ff003c]/30">
              <History className="w-10 h-10 text-[#ff003c]" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-2">Initialize Sequence Analysis</h3>
              <p className="text-slate-400 text-sm">
                AIVENTRA will correlate CCTV pings, autopsy timestamps, GPS data, and acoustic alerts to reconstruct the probable sequence of events.
              </p>
            </div>
            <button 
              onClick={startReconstruction}
              className="px-8 py-3 bg-[#ff003c] text-black font-bold rounded-lg hover:bg-[#ff003c]/80 transition-all neon-border-primary"
            >
              RUN RECONSTRUCTION
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center z-10">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-transparent border-t-[#ff003c] rounded-full"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-[#ff003c] animate-pulse" />
              </div>
            </div>
            <p className="text-[#ff003c] font-mono tracking-[0.3em] uppercase text-sm">
              Analyzing Temporal Nodes...
            </p>
            <div className="mt-4 flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-[#ff003c] rounded-full"
                />
              ))}
            </div>
          </div>
        )}

        {showTimeline && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex-1"
          >
            <div className="flex items-center gap-4 mb-10 p-4 bg-[#ff003c]/5 border border-[#ff003c]/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-[#ff003c]" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sequence Reconstructed</h4>
                <p className="text-xs text-slate-400">Deterministic probability score: 94.8% based on multivariate sensor data.</p>
              </div>
            </div>

            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#ff003c] before:to-[#0088ff] before:opacity-30">
              {currentScenario?.events.map((ev, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-[#000000] border-2 border-[#ff003c] z-10 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,60,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-[#ff003c] animate-pulse"></div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <span className="text-[#ff003c] font-mono text-sm font-bold w-20">{ev.time}</span>
                    <div className="glass-panel p-4 rounded-xl flex-1 border border-white/5 hover:border-[#ff003c]/30 transition-all cursor-default">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        {ev.event}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {ev.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sensor Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "CCTV Sync", value: "Locked", color: "text-[#0088ff]" },
          { label: "Audio Profile", value: "Analyzed", color: "text-emerald-400" },
          { label: "GPS Plotting", value: "Verified", color: "text-amber-400" }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest">{item.label}</span>
            <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
