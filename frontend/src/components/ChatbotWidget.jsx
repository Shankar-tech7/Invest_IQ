import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ShieldAlert, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { classifyAndRespond } from "../services/chatbotService";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "InvestIQ Intelligence Engine online. I can assist with suspect identification, case status, evidence analysis, autopsy findings, and crime scene reconstruction. What do you need?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if (isMuted) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ""));
      utterance.pitch = 0.8;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Build context from localStorage so the chatbot is aware of case state
  const buildContext = () => ({
    suspect: (() => {
      try {
        const s = localStorage.getItem("investiq_last_suspect");
        return s ? JSON.parse(s).name : null;
      } catch { return null; }
    })(),
    evidenceCount: (() => {
      try {
        const b = localStorage.getItem("investiq_evidence_board");
        return b ? JSON.parse(b).length : 0;
      } catch { return 0; }
    })(),
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      // Real TF-IDF classification
      const context = buildContext();
      const response = classifyAndRespond(userMessage, context);
      const formatted = response;
      setMessages(prev => [...prev, { role: "assistant", content: formatted }]);
      speak(formatted);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (content) => {
    // Render **bold** markdown
    return content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="text-white">{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#ff003c] shadow-[0_0_30px_rgba(255,0,60,0.4)] flex items-center justify-center hover:bg-[#ff003c]/80 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><X className="w-6 h-6 text-black" /></motion.div>
            : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><MessageSquare className="w-6 h-6 text-black" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#262626] bg-[#0a0a0a]"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#171717] bg-black flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#ff003c]" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">InvestIQ ASSISTANT</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 font-mono">TF-IDF ENGINE ACTIVE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg transition-colors ${isMuted ? "text-slate-600 hover:text-slate-400" : "text-slate-400 hover:text-white"}`}
                title={isMuted ? "Unmute" : "Mute voice"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#ff003c]/20 text-white border border-[#ff003c]/30 rounded-tr-none"
                      : "bg-[#171717] text-slate-300 border border-[#262626] rounded-tl-none"
                  }`}>
                    {renderMessage(msg.content)}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#171717] border border-[#262626] px-3 py-2 rounded-xl rounded-tl-none">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#ff003c]"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 border-t border-[#171717] flex gap-2 overflow-x-auto flex-shrink-0">
              {["Who is the suspect?", "Evidence board status", "Autopsy findings"].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="flex-shrink-0 text-[10px] px-2 py-1 bg-[#171717] border border-[#262626] text-slate-400 hover:text-white hover:border-[#ff003c]/30 rounded-full transition-all whitespace-nowrap font-mono"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#171717] flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask InvestIQ anything..."
                className="flex-1 bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff003c] placeholder-slate-600 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-[#ff003c] text-black rounded-lg hover:bg-[#ff003c]/80 transition-all disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
