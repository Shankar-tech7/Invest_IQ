import React from "react";
import { Link } from "react-router-dom";
import { Shield, Fingerprint, Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-200 overflow-hidden relative flex flex-col justify-center items-center">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#ff003c]/10 to-[#0088ff]/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 text-center max-w-4xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(255,0,60,0.2)]">
            <Shield className="w-16 h-16 text-[#ff003c]" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-500"
        >
          InvestIQ <br />
          <span className="text-3xl md:text-4xl font-medium text-[#ff003c] neon-text-primary tracking-widest mt-4 block">
            FORENSIC INTELLIGENCE
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Advanced AI-powered triage and postmortem analysis system. 
          Correlate evidence, extract insights, and accelerate investigations with unprecedented precision.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            to="/dashboard" 
            className="group relative px-8 py-4 bg-[#ff003c]/10 border border-[#ff003c] rounded-full text-[#ff003c] font-semibold tracking-wide hover:bg-[#ff003c]/20 transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)] flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">Access Dashboard</span>
            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff003c]/0 via-[#ff003c]/10 to-[#ff003c]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, mt: 40 }}
          animate={{ opacity: 1, mt: 80 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-white/5"
        >
          {[
            { icon: Fingerprint, title: "Biometric Analysis", desc: "AI-driven facial recognition and pattern matching." },
            { icon: Activity, title: "Autopsy NLP", desc: "Automated extraction of forensic findings." },
            { icon: Shield, title: "Evidence Map", desc: "Correlate digital and physical evidence." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl flex flex-col items-center text-center">
              <feature.icon className="w-8 h-8 text-[#0088ff] mb-4" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
