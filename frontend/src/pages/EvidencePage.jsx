import React, { useState } from "react";
import { Network } from "lucide-react";
import { motion } from "framer-motion";
import CorrelationMap from "../components/CorrelationMap";

export default function EvidencePage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleCorrelate = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-wide">Digital Evidence Correlation</h2>
        <button 
          onClick={handleCorrelate}
          disabled={analyzing || complete}
          className="px-4 py-2 bg-[#0088ff]/20 text-[#0088ff] border border-[#0088ff] rounded-lg hover:bg-[#0088ff]/30 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Network className="w-4 h-4" /> 
          {analyzing ? "Correlating Entities..." : complete ? "Map Generated" : "Generate Link Map"}
        </button>
      </div>

      <div className="glass-panel p-6 rounded-xl min-h-[600px] relative overflow-hidden flex flex-col">
        {!complete && !analyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <Network className="w-24 h-24 mb-4 opacity-10" />
            <p>Upload digital evidence sets and initiate correlation engine.</p>
          </div>
        )}

        {analyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#000000]/80 backdrop-blur-sm z-10">
            <div className="w-32 h-32 border-2 border-transparent border-t-[#0088ff] border-b-[#ff003c] rounded-full animate-spin"></div>
            <p className="mt-6 text-[#ff003c] font-mono tracking-widest animate-pulse">MAPPING ENTITIES...</p>
          </div>
        )}

        {complete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1"
          >
            <CorrelationMap />
          </motion.div>
        )}
      </div>
    </div>
  );
}
