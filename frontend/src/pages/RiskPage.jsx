import { useState } from "react";
import { s, T } from "../styles/theme";
import { GridBg, LoadingCard, ResultBlock, Badge } from "../components/UIElements";
import { api } from "../services/api";

export function RiskPage() {
  const [form,setForm] = useState({
    caseId:"", caseType:"homicide", victimCount:1, suspectCount:0,
    weaponFound:"unknown", evidenceQuality:"moderate", priorCriminal:"no",
    digitalEvidence:"partial", witnessAvail:"none", sceneIntegrity:"intact",
    autopsyDone:"no", contradictions:"", additionalContext:""
  });
  const [loading,setLoading] = useState(false);
  const [result,setResult] = useState(null);
  const [score,setScore] = useState(null);
  const [error,setError] = useState(null);

  const score_case = async () => {
    if (!form.caseId.trim()) { setError("Enter a Case ID."); return; }
    setError(null); setLoading(true); setResult(null); setScore(null);
    const prompt = `Assess this forensic case:
Case ID: ${form.caseId}
Case Type: ${form.caseType}
Victim Count: ${form.victimCount}
Known Suspects: ${form.suspectCount}
Weapon Found: ${form.weaponFound}
Evidence Quality: ${form.evidenceQuality}
Suspect Prior Criminal History: ${form.priorCriminal}
Digital Evidence Available: ${form.digitalEvidence}
Witness Availability: ${form.witnessAvail}
Scene Integrity: ${form.sceneIntegrity}
Autopsy Completed: ${form.autopsyDone}
Known Contradictions/Inconsistencies: ${form.contradictions || "None reported"}
Additional Context: ${form.additionalContext || "None"}`;
    try {
      const out = await api.scoreRisk(prompt);
      setScore(out.score);
      setResult(out.result);
    } catch(e) { setError("Scoring failed."); }
    setLoading(false);
  };

  const riskColor = score !== null ? (score>=75?T.accent3:score>=50?T.accent4:score>=25?T.accent:T.accent2) : T.accent;
  const riskLabel = score !== null ? (score>=75?"CRITICAL":score>=50?"HIGH":score>=25?"MEDIUM":"LOW") : "—";

  const Sel = ({label,field,opts})=>(
    <div style={{marginBottom:14}}>
      <label style={s.label}>{label}</label>
      <select style={s.select} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}>
        {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{...s.page}}>
      <GridBg/>
      <div style={{maxWidth:960,margin:"0 auto",padding:"48px 32px"}}>
        <div style={{marginBottom:32,animation:"fadeUp .4s both"}}>
          <div style={{...s.sectionTag,marginBottom:10,color:T.accent3}}>◈ MODULE 04</div>
          <h1 style={{...s.h1,fontSize:"1.8rem",marginBottom:10}}>RISK SCORING & ANOMALY DETECTION</h1>
          <p style={{...s.dim}}>Input case parameters. AI generates a risk score, anomaly flags, and prioritized investigative actions.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,animation:"fadeUp .4s .1s both"}}>
          <div style={{...s.card,gridColumn:"1/-1"}}>
            <div style={{...s.cardAccent,background:`linear-gradient(90deg,\${T.accent3},\${T.accent4})`}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 24px"}}>
              <div style={{marginBottom:14}}>
                <label style={{...s.label,color:T.accent3}}>CASE ID</label>
                <input style={s.input} value={form.caseId} onChange={e=>setForm({...form,caseId:e.target.value})}
                  placeholder="e.g. CASE-2024-089"
                  onFocus={e=>e.target.style.borderColor=T.accent3}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={s.label}>VICTIM COUNT</label>
                <input type="number" style={s.input} value={form.victimCount} min={1}
                  onChange={e=>setForm({...form,victimCount:e.target.value})}/>
              </div>
              <Sel label="CASE TYPE" field="caseType" opts={[
                {v:"homicide",l:"Homicide"},{v:"suspicious_death",l:"Suspicious Death"},
                {v:"accident",l:"Accidental Death"},{v:"missing_person",l:"Missing Person"},
                {v:"assault",l:"Assault / Battery"},{v:"robbery",l:"Robbery / Theft"},
                {v:"fraud",l:"Fraud / Financial Crime"},{v:"cybercrime",l:"Cybercrime"}]}/>
              <div style={{marginBottom:14}}>
                <label style={s.label}>KNOWN SUSPECTS</label>
                <input type="number" style={s.input} value={form.suspectCount} min={0}
                  onChange={e=>setForm({...form,suspectCount:e.target.value})}/>
              </div>
              <Sel label="WEAPON FOUND" field="weaponFound" opts={[
                {v:"yes",l:"Yes — Recovered at scene"},{v:"partial",l:"Partial — Fragments found"},
                {v:"no",l:"No — Not found"},{v:"unknown",l:"Unknown"}]}/>
              <Sel label="EVIDENCE QUALITY" field="evidenceQuality" opts={[
                {v:"strong",l:"Strong — Multiple corroborated sources"},{v:"moderate",l:"Moderate — Some gaps"},
                {v:"weak",l:"Weak — Limited / contaminated"},{v:"minimal",l:"Minimal — Almost none"}]}/>
              <Sel label="DIGITAL EVIDENCE" field="digitalEvidence" opts={[
                {v:"full",l:"Full — CCTV + Mobile + GPS"},{v:"partial",l:"Partial — Some sources"},
                {v:"none",l:"None"},{v:"deleted",l:"Detected but deleted/wiped"}]}/>
              <Sel label="WITNESS AVAILABILITY" field="witnessAvail" opts={[
                {v:"multiple",l:"Multiple — Corroborating"},{v:"single",l:"Single witness"},
                {v:"none",l:"No witnesses"},{v:"hostile",l:"Witnesses uncooperative"}]}/>
              <Sel label="SCENE INTEGRITY" field="sceneIntegrity" opts={[
                {v:"intact",l:"Intact — Properly secured"},{v:"partial",l:"Partially compromised"},
                {v:"contaminated",l:"Contaminated"},{v:"destroyed",l:"Deliberately altered/destroyed"}]}/>
              <Sel label="AUTOPSY COMPLETED" field="autopsyDone" opts={[
                {v:"yes",l:"Yes — Report available"},{v:"pending",l:"Pending"},{v:"no",l:"Not yet initiated"}]}/>
              <Sel label="SUSPECT PRIOR CRIMINAL HISTORY" field="priorCriminal" opts={[
                {v:"yes",l:"Yes — Relevant priors"},{v:"minor",l:"Minor offenses only"},
                {v:"no",l:"No prior record"},{v:"unknown",l:"Unknown"}]}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={s.label}>KNOWN CONTRADICTIONS / INCONSISTENCIES</label>
              <textarea style={{...s.textarea,minHeight:80}} value={form.contradictions}
                onChange={e=>setForm({...form,contradictions:e.target.value})}
                placeholder="Describe any contradictions in evidence, witness statements, or timelines..."/>
            </div>
            <div>
              <label style={s.label}>ADDITIONAL CASE CONTEXT</label>
              <textarea style={{...s.textarea,minHeight:80}} value={form.additionalContext}
                onChange={e=>setForm({...form,additionalContext:e.target.value})}
                placeholder="Any additional relevant case details..."/>
            </div>
            {error && <p style={{color:T.accent3,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",marginTop:12,letterSpacing:1}}>⚠ {error}</p>}
            <div style={{marginTop:20,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <button style={{...s.btnPrimary,background:T.accent3}} onClick={score_case}
                onMouseEnter={e=>e.target.style.boxShadow=`0 0 24px \${T.accent3}66`}
                onMouseLeave={e=>e.target.style.boxShadow=""}>
                {loading ? "SCORING..." : "◈ GENERATE RISK SCORE"}
              </button>
              <button style={s.btnSecondary} onClick={()=>{setResult(null);setScore(null);setError(null);setForm({...form,caseId:"",contradictions:"",additionalContext:""})}}>CLEAR</button>
              {score !== null && (
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:"2.5rem",fontWeight:900,color:riskColor,
                      textShadow:`0 0 20px \${riskColor}66`,lineHeight:1}}>{score}</div>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:2,color:riskColor}}>RISK INDEX</div>
                  </div>
                  <Badge color={riskColor}>{riskLabel} PRIORITY</Badge>
                </div>
              )}
            </div>
            {score !== null && (
              <div style={{marginTop:16,height:6,background:T.surface2,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`\${score}%`,background:`linear-gradient(90deg,\${T.accent2},\${score>=50?T.accent4:T.accent},\${score>=75?T.accent3:T.accent4})`,transition:"width 1s ease"}}/>
              </div>
            )}
          </div>
        </div>

        {loading && <LoadingCard message="COMPUTING RISK SCORE & ANOMALY FLAGS"/>}
        {result && <ResultBlock title="CASE RISK ASSESSMENT REPORT" content={result} color={T.accent3}/>}
      </div>
    </div>
  );
}
