import { useState, useRef } from "react";
import { s, T } from "../styles/theme";

export function GridBg() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
      backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
      backgroundSize:"56px 56px",opacity:.5}}/>
  );
}

export function ScanLine() {
  return <div style={{position:"absolute",left:0,right:0,height:1,
    background:`linear-gradient(90deg,transparent,${T.accent},transparent)`,
    animation:"scanV 6s linear infinite",opacity:.15,pointerEvents:"none",zIndex:1}}/>;
}

export function Spinner() {
  return <div style={{width:20,height:20,border:`2px solid ${T.border2}`,
    borderTopColor:T.accent,borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>;
}

export function Badge({color=T.accent,children}) {
  return <span style={{background:`${color}18`,color,border:`1px solid ${color}44`,
    fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",letterSpacing:1,
    padding:"3px 10px",borderRadius:0}}>{children}</span>;
}

export function ResultBlock({title,content,color=T.accent}) {
  const lines = content.split("\\n").filter(Boolean);
  return (
    <div style={{...s.card,marginTop:20,animation:"fadeUp .5s both",borderColor:color+"33"}}>
      <div style={{...s.cardAccent,background:`linear-gradient(90deg,\${color},\${T.accent2})`}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div style={{width:8,height:8,background:color,borderRadius:"50%",animation:"pulse 2s infinite"}}/>
        <span style={{...s.h3,color,letterSpacing:2}}>{title}</span>
      </div>
      <div style={{background:T.surface2,border:`1px solid \${T.border}`,padding:"16px 20px"}}>
        {lines.map((l,i)=>(
          <p key={i} style={{...s.dim,marginBottom:i<lines.length-1?10:0,
            color: l.startsWith("•")||l.startsWith("-")||l.match(/^\\d\\./)?"#c8dff5":T.textDim}}>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

export function LoadingCard({message}) {
  return (
    <div style={{...s.card,marginTop:20,textAlign:"center",padding:"40px 28px",animation:"fadeUp .4s both"}}>
      <div style={{...s.cardAccent}}/>
      <Spinner/>
      <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",letterSpacing:3,
        color:T.accent,marginTop:16}}>{message}</p>
      <p style={{...s.dim,marginTop:8,fontSize:"0.78rem"}}>AI analysis in progress...</p>
    </div>
  );
}

export function FileUploadZone({onFile, label="ATTACH REPORT FILE"}) {
  const ref = useRef();
  const [name,setName] = useState(null);
  const [drag,setDrag] = useState(false);
  const handle = e => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = ev => onFile(ev.target.result, file.name);
    reader.readAsText(file);
  };
  return (
    <div onClick={()=>ref.current.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true)}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);handle(e)}}
      style={{border:`1px dashed \${drag?T.accent:T.border2}`,padding:"22px 20px",
        textAlign:"center",cursor:"pointer",background:drag?"rgba(0,212,255,0.04)":T.surface2,
        transition:"all .25s",marginTop:10}}>
      <input ref={ref} type="file" style={{display:"none"}} accept=".txt,.pdf,.doc,.docx,.csv" onChange={handle}/>
      <div style={{fontSize:"1.4rem",marginBottom:8}}>📎</div>
      <span style={{...s.label,marginBottom:4}}>{label}</span>
      {name
        ? <p style={{color:T.accent2,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",letterSpacing:1}}>✓ {name}</p>
        : <p style={{...s.dim,fontSize:"0.78rem"}}>Drag & drop or click to browse · .txt .pdf .doc .csv</p>
      }
    </div>
  );
}
