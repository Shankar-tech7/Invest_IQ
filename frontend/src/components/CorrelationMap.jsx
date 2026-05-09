import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Smartphone, PhoneCall, AlertTriangle, Fingerprint, Activity, ShieldAlert, Cpu } from "lucide-react";
import { forensicDatabase } from "../data/forensicDatabase";

const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
};

export default function CorrelationMap({ compact = false }) {
  const [scenario, setScenario] = useState(null);

  useEffect(() => {
    const lastFile = localStorage.getItem("last_analyzed_file") || "default_feed";
    const hash = getHash(lastFile);
    const index = hash % forensicDatabase.length;
    
    // Map database structure to UI component structure
    const dbScenario = forensicDatabase[index];
    setScenario({
      victim: dbScenario.evidence.victim,
      nodes: dbScenario.evidence.nodes.map((n, i) => ({
        ...n,
        // Assign standard icons if missing
        icon: [Smartphone, MapPin, PhoneCall, Cpu, Activity, ShieldAlert][i % 6],
        pos: [
          { top: "15%", left: "20%" },
          { top: "15%", right: "20%" },
          { bottom: "20%", right: "35%" }
        ][i % 3]
      })),
      riskDesc: dbScenario.evidence.riskDesc,
      riskScore: dbScenario.evidence.riskScore
    });
  }, []);

  if (!scenario) return null;

  return (
    <div className={`relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl scale-75 md:scale-100">
        
        {/* Center Node (Victim/Target) */}
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
          key={`center-${scenario.victim}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
            <Fingerprint className="w-8 h-8 text-rose-500" />
          </div>
          <div className="mt-2 bg-[#0a0a0a] border border-[#171717] px-3 py-1 rounded text-xs text-white opacity-100 transition-opacity whitespace-nowrap absolute top-full">
            {scenario.victim}
          </div>
        </motion.div>

        {/* Connected Nodes */}
        {scenario.nodes.map((node, i) => (
          <motion.div 
            key={`${scenario.victim}-node-${node.id}`}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + (i * 0.2) }}
            style={{ top: node.pos.top, left: node.pos.left, right: node.pos.right, bottom: node.pos.bottom }}
            className="absolute z-20 flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full bg-[${node.color}]/20 border-2 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)]`} style={{ borderColor: node.color }}>
              <node.icon className="w-6 h-6" style={{ color: node.color }} />
            </div>
            <div className="mt-2 bg-[#0a0a0a] border border-[#171717] px-3 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute top-full">
              {node.label}
            </div>
          </motion.div>
        ))}

        {/* Dynamic Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {scenario.nodes.map((node, i) => (
            <motion.line 
              key={`${scenario.victim}-line-${node.id}`}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + (i * 0.2), duration: 0.5 }} 
              x1="50%" y1="50%" 
              x2={node.pos.left ? node.pos.left : (node.pos.right ? (100 - parseInt(node.pos.right)) + "%" : "50%")} 
              y2={node.pos.top ? node.pos.top : (node.pos.bottom ? (100 - parseInt(node.pos.bottom)) + "%" : "50%")} 
              stroke={node.color} strokeWidth="2" strokeDasharray="5,5" className="opacity-50" 
            />
          ))}
        </svg>
      </div>

      {!compact && (
        <div className="absolute top-4 left-4 w-64 bg-[#000000]/80 backdrop-blur-md border border-[#171717] rounded-lg p-4 z-30">
          <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-rose-500" /> AI Correlation Insight
          </h4>
          <p className="text-[10px] text-slate-400">
            {scenario.riskDesc}
          </p>
          <div className="text-[10px] text-[#ff003c] uppercase tracking-wider font-bold border-t border-[#171717] pt-2 mt-2">
            Risk Probability: {scenario.riskScore}
          </div>
        </div>
      )}
    </div>
  );
}
