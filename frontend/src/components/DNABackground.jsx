import React from 'react';
import { motion } from 'framer-motion';

export default function DNABackground() {
  // Generate pairs for the DNA ladder
  const pairs = Array.from({ length: 24 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000]">
      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff003c]/10 via-transparent to-transparent opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#0088ff]/10 via-transparent to-transparent opacity-60"></div>
      
      {/* 3D Container for DNA Helix */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] w-[200vw] h-[150vh] flex flex-col items-center justify-center space-y-[20px] opacity-60"
        style={{ perspective: "1000px" }}
      >
        {pairs.map((_, i) => (
          <motion.div 
            key={i} 
            className="flex items-center justify-between w-72 relative"
            animate={{ rotateX: [0, 360] }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear", 
              delay: i * -0.3 
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Left Node (Red) */}
            <motion.div 
              className="w-4 h-4 rounded-full bg-[#ff003c] shadow-[0_0_30px_#ff003c,0_0_10px_#ff003c]"
            />
            {/* Rung Connection */}
            <div className="absolute left-4 right-4 h-[1px] bg-gradient-to-r from-[#ff003c] to-[#0088ff] opacity-80"></div>
            {/* Right Node (Blue) */}
            <motion.div 
              className="w-4 h-4 rounded-full bg-[#0088ff] shadow-[0_0_30px_#0088ff,0_0_10px_#0088ff]"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Vignette mask to fade edges */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]"></div>
    </div>
  );
}
