import React, { useState, useRef, useEffect, useCallback } from "react";
import { Video, ScanFace, Upload, AlertCircle, X, Layers, Activity, Loader, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadFaceModels, analyzeFrame, drawDetections } from "../services/faceRecognitionService";

export default function CCTVPage() {
  // ── ML Model State ──────────────────────────────────────────────────────────
  const [modelStatus, setModelStatus] = useState("idle"); // idle | loading | ready | error
  const [modelProgress, setModelProgress] = useState("");

  // ── Media State ─────────────────────────────────────────────────────────────
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // ── Evidence Board ──────────────────────────────────────────────────────────
  const [evidenceBoard, setEvidenceBoard] = useState(() => {
    const saved = localStorage.getItem("investiq_evidence_board");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Refs ────────────────────────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const mediaRef = useRef(null);       // <img> or <video> element
  const canvasRef = useRef(null);      // overlay canvas for bounding boxes
  const videoFrameRef = useRef(null);  // requestAnimationFrame ID

  // ── Load ML Models on Mount ─────────────────────────────────────────────────
  useEffect(() => {
    setModelStatus("loading");
    loadFaceModels((msg) => setModelProgress(msg))
      .then(() => setModelStatus("ready"))
      .catch((err) => {
        console.error("Model load failed:", err);
        setModelStatus("error");
      });

    return () => {
      if (videoFrameRef.current) cancelAnimationFrame(videoFrameRef.current);
    };
  }, []);

  // ── Handle File Upload ──────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    setResult(null);
    localStorage.setItem("last_analyzed_file", file.name);
  };

  // ── Analyze: Image ──────────────────────────────────────────────────────────
  const analyzeImage = useCallback(async () => {
    if (!mediaRef.current || modelStatus !== "ready") return;
    setAnalyzing(true);
    setResult(null);
    try {
      const { faces, primaryMatch } = await analyzeFrame(mediaRef.current);
      drawDetections(canvasRef.current, faces, mediaRef.current);
      setResult({ faces, primaryMatch, timestamp: new Date().toLocaleTimeString() });
    } catch (err) {
      console.error("Analysis error:", err);
    }
    setAnalyzing(false);
  }, [modelStatus]);

  // ── Analyze: Video (continuous frames) ─────────────────────────────────────
  const analyzeVideoLoop = useCallback(async () => {
    if (!mediaRef.current || modelStatus !== "ready") return;
    const video = mediaRef.current;

    const runFrame = async () => {
      if (video.paused || video.ended) return;
      try {
        const { faces, primaryMatch } = await analyzeFrame(video);
        drawDetections(canvasRef.current, faces, video);
        if (faces.length > 0) {
          setResult(prev => {
            const currentConf = primaryMatch?.confidence || 0;
            const prevConf = prev?.primaryMatch?.confidence || 0;
            return (!prev || currentConf > prevConf)
              ? { faces, primaryMatch, timestamp: new Date().toLocaleTimeString() }
              : prev;
          });
        }
      } catch { }
      videoFrameRef.current = requestAnimationFrame(runFrame);
    };
    setAnalyzing(true);
    video.play();
    runFrame();
  }, [modelStatus]);

  // ── Evidence Board Actions ──────────────────────────────────────────────────
  const addToBoard = () => {
    if (!result?.primaryMatch) return;
    const pm = result.primaryMatch;
    const isDuplicate = evidenceBoard.some(i => i.id === pm.id);
    if (!isDuplicate) {
      const entry = { ...pm, addedAt: new Date().toLocaleTimeString() };
      const updated = [...evidenceBoard, entry];
      setEvidenceBoard(updated);
      localStorage.setItem("investiq_evidence_board", JSON.stringify(updated));
      localStorage.setItem("investiq_last_suspect", JSON.stringify(pm));
    }
  };

  const removeFromBoard = (id) => {
    const updated = evidenceBoard.filter(i => i.id !== id);
    setEvidenceBoard(updated);
    localStorage.setItem("investiq_evidence_board", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-wide">CCTV Face Recognition</h2>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-[10px] font-mono px-3 py-1.5 rounded-full border ${modelStatus === "ready" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
              modelStatus === "loading" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                modelStatus === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                  "bg-slate-800 border-slate-700 text-slate-400"
            }`}>
            {modelStatus === "loading" && <Loader className="w-3 h-3 animate-spin" />}
            {modelStatus === "ready" && <CheckCircle className="w-3 h-3" />}
            {modelStatus === "error" && <AlertCircle className="w-3 h-3" />}
            {modelStatus === "idle" && <Activity className="w-3 h-3" />}
            {modelStatus === "ready" ? "ML ENGINE: READY" :
              modelStatus === "loading" ? "LOADING MODELS..." :
                modelStatus === "error" ? "MODEL LOAD FAILED" : "INITIALIZING"}
          </div>
        </div>
      </div>

      {/* Model Loading Progress */}
      <AnimatePresence>
        {modelStatus === "loading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-4 rounded-xl border border-amber-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-amber-400 text-sm font-mono font-bold">LOADING TENSORFLOW MODELS</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{modelProgress}</p>
            <div className="mt-3 h-1 bg-[#171717] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500"
                animate={{ width: ["10%", "90%"] }}
                transition={{ duration: 15, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="glass-panel rounded-xl overflow-hidden relative aspect-video bg-black flex items-center justify-center">
            {!mediaUrl ? (
              <div className="text-center p-8">
                <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm mb-4">Upload CCTV footage for real face detection</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={modelStatus !== "ready"}
                  className="px-6 py-2 bg-[#ff003c] text-black font-bold rounded-lg hover:bg-[#ff003c]/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {modelStatus === "ready" ? "Upload Footage" : "Loading ML Engine..."}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {mediaType === "image" ? (
                  <img
                    ref={mediaRef}
                    src={mediaUrl}
                    alt="CCTV"
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain"
                    onLoad={analyzeImage}
                  />
                ) : (
                  <video
                    ref={mediaRef}
                    src={mediaUrl}
                    className="w-full h-full object-contain"
                    muted
                    loop
                    autoPlay
                    controls
                    onPlay={analyzeVideoLoop}
                    crossOrigin="anonymous"
                  />
                )}
                {/* ML Detection Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ objectFit: "contain" }}
                />
                {analyzing && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-full">
                    <Loader className="w-3 h-3 text-[#ff003c] animate-spin" />
                    <span className="text-[10px] text-[#ff003c] font-mono font-bold">RUNNING NEURAL NETWORK...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {mediaUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => { setMediaUrl(null); setResult(null); if (videoFrameRef.current) cancelAnimationFrame(videoFrameRef.current); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#171717] border border-[#262626] text-slate-400 hover:text-white rounded-lg text-sm transition-all"
              >
                <X className="w-4 h-4" /> Clear Feed
              </button>
              {mediaType === "image" && (
                <button
                  onClick={analyzeImage}
                  disabled={analyzing || modelStatus !== "ready"}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ff003c]/10 border border-[#ff003c]/40 text-[#ff003c] hover:bg-[#ff003c]/20 rounded-lg text-sm transition-all disabled:opacity-40"
                >
                  <ScanFace className="w-4 h-4" /> Re-Analyze
                </button>
              )}
            </div>
          )}
        </div>

        {/* Identification Panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 border-b border-[#171717] pb-3 flex items-center gap-2">
            <ScanFace className="w-4 h-4 text-[#ff003c]" /> Subject Identification
          </h3>

          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-4">
              <Video className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-xs">Upload an image or video with a visible face. The neural network will detect and identify the subject.</p>
            </div>
          ) : result.faces.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-400 text-center p-4">
              <AlertCircle className="w-10 h-10 mb-3 opacity-60" />
              <p className="text-sm font-bold">No Face Detected</p>
              <p className="text-xs text-slate-500 mt-1">Ensure the image contains a clear, frontal human face.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex-1 overflow-y-auto">
              <p className="text-[10px] text-slate-500 font-mono">{result.faces.length} FACE(S) DETECTED — {result.timestamp}</p>

              {result.faces.map((face, i) => (
                <div key={i} className={`p-3 rounded-lg border ${face.isMatch ? "bg-rose-500/10 border-rose-500/30" : "bg-amber-500/10 border-amber-500/20"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`text-xs font-bold ${face.isMatch ? "text-rose-400" : "text-amber-400"}`}>
                        {face.isMatch ? "IDENTITY CONFIRMED" : "UNIDENTIFIED SUBJECT"}
                      </p>
                      <p className="text-white font-bold text-sm mt-0.5">{face.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{face.id}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* Zoomed Live Crop from Footage */}
                      {face.liveCropUrl && (
                        <div className="flex flex-col items-center">
                          <img src={face.liveCropUrl} alt="Live Scan" className={`w-14 h-14 rounded-lg object-cover border ${face.isMatch ? "border-rose-500/50" : "border-amber-500/50"}`} />
                          <span className="text-[8px] text-slate-500 font-mono mt-1">LIVE SCAN</span>
                        </div>
                      )}

                      {/* Criminal Database Photo for Comparison */}
                      {face.isMatch && face.imgUrl && (
                        <div className="flex flex-col items-center">
                          <img src={face.imgUrl} alt={face.name} className="w-14 h-14 rounded-lg object-cover border border-slate-600" crossOrigin="anonymous" />
                          <span className="text-[8px] text-slate-500 font-mono mt-1">DATABASE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Match Confidence</span>
                      <span className={face.confidence > 70 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{face.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-[#171717] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${face.confidence > 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${face.confidence}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {result.primaryMatch && (
                <button
                  onClick={addToBoard}
                  className={`w-full py-3 ${result.primaryMatch.isMatch ? "bg-[#ff003c] hover:bg-[#ff003c]/80 shadow-[0_0_20px_rgba(255,0,60,0.2)]" : "bg-amber-500 hover:bg-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]"} text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all`}
                >
                  <Layers className="w-4 h-4" />
                  Add {result.primaryMatch.name} to Board
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Evidence Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#171717] pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ff003c]" /> Evidence Board
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">CONFIRMED_SUBJECTS: {evidenceBoard.length}</span>
        </div>

        {evidenceBoard.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl border border-dashed border-[#262626] flex flex-col items-center justify-center text-slate-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No subjects added. Run CCTV analysis and click "Add to Board" to pin confirmed matches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {evidenceBoard.map((subject) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#ff003c]/30 transition-all group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#0a0a0a]">
                    {subject.liveCropUrl || subject.imgUrl ? (
                      <img src={subject.liveCropUrl || subject.imgUrl} alt={subject.name} crossOrigin="anonymous" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ScanFace className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <button
                      onClick={() => removeFromBoard(subject.id)}
                      className="absolute top-2 right-2 p-1 bg-black/80 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-bold text-xs truncate">{subject.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono">{subject.id}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 uppercase">Confidence</span>
                      <span className="text-emerald-400 font-bold">{subject.confidence}%</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 uppercase">Logged</span>
                      <span className="text-white font-mono">{subject.addedAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
