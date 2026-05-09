import { useState } from "react";
import { s, T } from "../styles/theme";
import { GridBg, LoadingCard, ResultBlock, Badge, FileUploadZone } from "../components/UIElements";
import { api } from "../services/api";

export function DigitalPage() {
  const [tab,setTab] = useState("cctv");
  const [loading,setLoading] = useState(false);
  const [result,setResult] = useState(null);
  const [error,setError] = useState(null);
  const [cctvLog,setCctvLog] = useState("");
  const [mobileData,setMobileData] = useState("");
  const [geoData,setGeoData] = useState("");
  const [combined,setCombined] = useState(false);

  const analyze = async () => {
    const parts = [];
    if (cctvLog.trim()) parts.push(`CCTV LOG:\\n${cctvLog}`);
    if (mobileData.trim()) parts.push(`MOBILE METADATA:\\n${mobileData}`);
    if (geoData.trim()) parts.push(`GEOLOCATION RECORDS:\\n${geoData}`);
    if (!parts.length) { setError("Provide at least one evidence source."); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const out = await api.correlateDigital(parts);
      setResult(out);
    } catch(e) { setError("Analysis failed."); }
    setLoading(false);
  };

  const samples = {
    cctv:`CAM-01 [ENTRANCE] 20:14:32 — Male individual enters, dark jacket, cap
CAM-03 [CORRIDOR] 20:15:48 — Same individual proceeds to floor 3
CAM-05 [STAIRWELL] 20:17:02 — Individual enters stairwell (camera feed cuts 20:17:45)
CAM-03 [CORRIDOR] 21:43:19 — Individual exits stairwell, no cap, jacket reversed
CAM-01 [ENTRANCE] 21:44:55 — Individual exits building
CAM-02 [LOBBY] 21:02:11 — Unrelated staff member seen (ALIBIS CONFIRMED)`,
    mobile:`Device: +91-XXXXX-89012 (Suspect A)
19:58:11 — Cell tower ping: Tower ID 4421 (500m from scene)
20:11:34 — Call made to +91-XXXXX-34567 (duration: 2 min 14 sec)
20:13:00 — Device enters airplane mode (NO PINGS UNTIL)
21:45:22 — Device exits airplane mode — Tower ID 4421
22:01:15 — WhatsApp message sent: "Left the place"
22:45:00 — Cell tower ping: Tower ID 8810 (12km from scene)`,
    geo:`GPS Data — Vehicle REG: TN09-AB-4521
19:45:00 — Location: Marina Beach parking (stationary 18 min)
20:03:22 — Vehicle begins moving NW direction
20:08:44 — Vehicle parked: 200m from scene building
20:10:00 — NO GPS SIGNAL (possible signal blocker)
21:47:30 — GPS resumes: 200m from scene building
21:51:00 — Vehicle moves SE at 65 km/h
22:00:00 — Vehicle: 14km from scene`
  };

  return (
    <div style={{...s.page}}>
      <GridBg/>
      <div style={{maxWidth:960,margin:"0 auto",padding:"48px 32px"}}>
        <div style={{marginBottom:32,animation:"fadeUp .4s both"}}>
          <div style={{...s.sectionTag,marginBottom:10,color:T.accent4}}>◈ MODULE 03</div>
          <h1 style={{...s.h1,fontSize:"1.8rem",marginBottom:10}}>DIGITAL EVIDENCE CORRELATION</h1>
          <p style={{...s.dim}}>Input CCTV logs, mobile metadata, or GPS records. AI builds a unified timeline and flags anomalies.</p>
        </div>

        <div style={{display:"flex",gap:0,marginBottom:0,borderBottom:`1px solid \${T.border}`}}>
          {[["cctv","📹 CCTV LOGS"],["mobile","📱 MOBILE METADATA"],["geo","📍 GEOLOCATION"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{...s.navBtn,...(tab===t?{...s.navBtnActive,color:T.accent4,borderColor:T.accent4+"66"}:{}),
                padding:"10px 18px",borderBottom:`2px solid \${tab===t?T.accent4:"transparent"}`}}>
              {l}
            </button>
          ))}
        </div>

        <div style={{...s.card,borderTopLeftRadius:0,borderTopRightRadius:0,animation:"fadeUp .4s .1s both"}}>
          <div style={{...s.cardAccent,background:`linear-gradient(90deg,\${T.accent4},\${T.accent3})`}}/>
          {tab==="cctv" && <>
            <label style={{...s.label,color:T.accent4}}>CCTV FOOTAGE LOG (timestamps + descriptions)</label>
            <textarea style={{...s.textarea,minHeight:180}} value={cctvLog} onChange={e=>setCctvLog(e.target.value)} placeholder="Paste CCTV observation log with timestamps..."/>
            <button onClick={()=>setCctvLog(samples.cctv)} style={{marginTop:6,background:"none",color:T.textDim,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:2,border:"none",cursor:"pointer",padding:"4px 0"}}>◈ LOAD SAMPLE LOG</button>
            <div style={{marginTop:16}}><FileUploadZone onFile={c=>setCctvLog(c)} label="OR UPLOAD CCTV LOG FILE"/></div>
          </>}
          {tab==="mobile" && <>
            <label style={{...s.label,color:T.accent4}}>MOBILE METADATA (call records, cell towers, app data)</label>
            <textarea style={{...s.textarea,minHeight:180}} value={mobileData} onChange={e=>setMobileData(e.target.value)} placeholder="Paste mobile metadata records..."/>
            <button onClick={()=>setMobileData(samples.mobile)} style={{marginTop:6,background:"none",color:T.textDim,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:2,border:"none",cursor:"pointer",padding:"4px 0"}}>◈ LOAD SAMPLE DATA</button>
            <div style={{marginTop:16}}><FileUploadZone onFile={c=>setMobileData(c)} label="OR UPLOAD METADATA FILE"/></div>
          </>}
          {tab==="geo" && <>
            <label style={{...s.label,color:T.accent4}}>GEOLOCATION RECORDS (GPS logs, check-ins, vehicle tracking)</label>
            <textarea style={{...s.textarea,minHeight:180}} value={geoData} onChange={e=>setGeoData(e.target.value)} placeholder="Paste GPS or location records..."/>
            <button onClick={()=>setGeoData(samples.geo)} style={{marginTop:6,background:"none",color:T.textDim,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:2,border:"none",cursor:"pointer",padding:"4px 0"}}>◈ LOAD SAMPLE GPS DATA</button>
            <div style={{marginTop:16}}><FileUploadZone onFile={c=>setGeoData(c)} label="OR UPLOAD GPS LOG FILE"/></div>
          </>}

          <div style={{marginTop:20,padding:"12px 16px",background:T.surface2,border:`1px solid \${T.border}`,display:"flex",alignItems:"center",gap:12}}>
            <input type="checkbox" id="comb" checked={combined} onChange={e=>setCombined(e.target.checked)}
              style={{accentColor:T.accent4,width:14,height:14}}/>
            <label htmlFor="comb" style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",letterSpacing:2,color:T.textDim,cursor:"pointer"}}>
              CROSS-CORRELATE ALL SOURCES SIMULTANEOUSLY (uses all loaded data)
            </label>
          </div>

          <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
            {cctvLog && <Badge color={T.accent4}>✓ CCTV LOADED</Badge>}
            {mobileData && <Badge color={T.accent2}>✓ MOBILE LOADED</Badge>}
            {geoData && <Badge color={T.accent}>✓ GEO LOADED</Badge>}
          </div>

          {error && <p style={{color:T.accent3,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",marginTop:12,letterSpacing:1}}>⚠ {error}</p>}
          <div style={{marginTop:20,display:"flex",gap:12}}>
            <button style={{...s.btnPrimary,background:T.accent4}} onClick={analyze}
              onMouseEnter={e=>e.target.style.boxShadow=`0 0 24px \${T.accent4}66`}
              onMouseLeave={e=>e.target.style.boxShadow=""}>
              {loading ? "CORRELATING..." : "◈ CORRELATE EVIDENCE"}
            </button>
            <button style={s.btnSecondary} onClick={()=>{setCctvLog("");setMobileData("");setGeoData("");setResult(null);setError(null)}}>CLEAR ALL</button>
          </div>
        </div>

        {loading && <LoadingCard message="CORRELATING DIGITAL EVIDENCE"/>}
        {result && <ResultBlock title="DIGITAL EVIDENCE CORRELATION REPORT" content={result} color={T.accent4}/>}
      </div>
    </div>
  );
}
