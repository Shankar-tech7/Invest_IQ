import React, { useState } from "react";
import { AlertTriangle, Activity, FileText, CheckCircle, Network, Send, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CorrelationMap from "../components/CorrelationMap";
import { classifyAndRespond } from "../services/chatbotService";

const mockData = [
  { time: "00:00", activity: 12 },
  { time: "04:00", activity: 19 },
  { time: "08:00", activity: 45 },
  { time: "12:00", activity: 82 },
  { time: "16:00", activity: 65 },
  { time: "20:00", activity: 30 },
];

export default function DashboardPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Investigation overview loaded. Analysis of recent pings suggests a high-priority link in the downtown sector." }
  ]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");

    setTimeout(() => {
      const context = {
        evidenceCount: (() => {
          try {
            const b = localStorage.getItem("investiq_evidence_board");
            return b ? JSON.parse(b).length : 0;
          } catch { return 0; }
        })(),
      };
      const response = classifyAndRespond(userMessage, context);
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
      speak(response);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-wide">InvestIQ Dashboard</h2>
        <div className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-mono">
          NODE_STATUS: ACTIVE | SECURE_LINK: STABLE
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Active Cases", value: "24", icon: Activity, color: "text-[#ff003c]" },
          { title: "Pending Autopsies", value: "7", icon: FileText, color: "text-[#0088ff]" },
          { title: "High Risk Alerts", value: "3", icon: AlertTriangle, color: "text-rose-500" },
          { title: "Resolved (30d)", value: "112", icon: CheckCircle, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-[#171717] ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Correlation Map - NEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-xl p-6 lg:col-span-2 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-[#0088ff]" /> Digital Evidence Map
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Scan</span>
          </div>
          <div className="flex-1 bg-[#000000]/50 rounded-lg border border-[#171717]">
            <CorrelationMap compact={true} />
          </div>
        </motion.div>

        {/* Inline AI Assistant - NEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#ff003c]" /> AI Assistant
          </h3>
          <div className="flex-1 bg-[#0a0a0a] rounded-lg border border-[#171717] p-4 flex flex-col space-y-4 overflow-y-auto mb-4 min-h-[200px]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-lg text-xs ${msg.role === 'assistant' ? 'bg-[#171717] text-slate-300 self-start border border-[#262626]' : 'bg-[#ff003c]/10 text-[#ff003c] self-end border border-[#ff003c]/30'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Query system intelligence..."
              className="w-full bg-[#000000] border border-[#262626] rounded-lg py-2 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-[#ff003c]/50"
            />
            <button onClick={handleChatSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff003c]">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-xl p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4">System Activity & Ingestion</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#171717" vertical={false} />
                <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#171717', color: '#f8fafc' }}
                  itemStyle={{ color: '#ff003c' }}
                />
                <Area type="monotone" dataKey="activity" stroke="#ff003c" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Priority Alerts</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[250px]">
            {[
              { title: "Facial Match: Suspect X", desc: "Camera 04 - Downtown", time: "2 min ago", type: "high" },
              { title: "Autopsy NLP Complete", desc: "Case #4029 - Cause found", time: "15 min ago", type: "info" },
              { title: "GPS Anomaly Detected", desc: "Subject deviated from pattern", time: "1 hr ago", type: "med" },
            ].map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg border ${alert.type === 'high' ? 'bg-rose-500/10 border-rose-500/30' :
                  alert.type === 'info' ? 'bg-[#ff003c]/10 border-[#ff003c]/30' :
                    'bg-amber-500/10 border-amber-500/30'
                }`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-semibold ${alert.type === 'high' ? 'text-rose-400' :
                      alert.type === 'info' ? 'text-[#ff003c]' :
                        'text-amber-400'
                    }`}>{alert.title}</h4>
                  <span className="text-[10px] text-slate-500">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-400">{alert.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
