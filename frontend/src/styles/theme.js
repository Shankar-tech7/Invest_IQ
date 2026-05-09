export const T = {
  bg: "#02050e", bg2: "#060c1a", surface: "#0a1628", surface2: "#0d1e38",
  accent: "#00d4ff", accent2: "#00ff9d", accent3: "#ff3a6e", accent4: "#f5a623",
  text: "#c8dff5", textDim: "#3d5878", border: "rgba(0,212,255,0.12)",
  border2: "rgba(0,212,255,0.35)",
};

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:${T.bg};color:${T.text};font-family:'Rajdhani',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:${T.bg2}}
  ::-webkit-scrollbar-thumb{background:${T.accent};border-radius:2px}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.4)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scanV{0%{top:0}100%{top:100%}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(0,212,255,.3)}50%{box-shadow:0 0 24px rgba(0,212,255,.7)}}
  @keyframes barGrow{from{width:0}to{width:var(--w)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  textarea,input,select{outline:none;border:none}
  button{cursor:pointer;border:none;outline:none}
`;

export const s = {
  nav: {
    position:"fixed",top:0,left:0,right:0,zIndex:1000,
    display:"flex",alignItems:"center",justifyContent:"space-between",
    padding:"14px 32px",
    background:"rgba(2,5,14,0.92)",backdropFilter:"blur(20px)",
    borderBottom:`1px solid ${T.border}`,
  },
  logo:{fontFamily:"'Orbitron',monospace",fontSize:"1rem",fontWeight:700,color:T.accent,letterSpacing:3},
  navBtn:{
    fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",letterSpacing:2,
    color:T.textDim,background:"none",padding:"6px 14px",
    border:`1px solid transparent`,transition:"all .25s",borderRadius:0,
  },
  navBtnActive:{
    color:T.accent,borderColor:T.border2,background:"rgba(0,212,255,0.06)",
  },
  page:{minHeight:"100vh",paddingTop:64,background:T.bg,position:"relative",overflow:"hidden"},
  card:{background:T.surface,border:`1px solid ${T.border}`,padding:28,position:"relative",overflow:"hidden"},
  cardAccent:{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.accent},${T.accent2})`},
  label:{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",letterSpacing:3,color:T.accent,marginBottom:8,display:"block"},
  textarea:{
    width:"100%",background:T.surface2,border:`1px solid ${T.border}`,
    color:T.text,fontFamily:"'Rajdhani',sans-serif",fontSize:"0.95rem",
    padding:"14px 16px",resize:"vertical",minHeight:130,
    transition:"border-color .25s",lineHeight:1.6,
    borderRadius:0,
  },
  input:{
    width:"100%",background:T.surface2,border:`1px solid ${T.border}`,
    color:T.text,fontFamily:"'Rajdhani',sans-serif",fontSize:"0.95rem",
    padding:"12px 16px",transition:"border-color .25s",borderRadius:0,
  },
  select:{
    width:"100%",background:T.surface2,border:`1px solid ${T.border}`,
    color:T.text,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.72rem",
    padding:"12px 16px",letterSpacing:1,borderRadius:0,
    appearance:"none",
  },
  btnPrimary:{
    background:T.accent,color:T.bg,fontFamily:"'Orbitron',monospace",
    fontSize:"0.72rem",fontWeight:700,letterSpacing:2,padding:"13px 28px",
    clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
    transition:"all .3s",border:"none",
  },
  btnSecondary:{
    background:"transparent",color:T.accent,fontFamily:"'Orbitron',monospace",
    fontSize:"0.72rem",fontWeight:700,letterSpacing:2,padding:"12px 26px",
    border:`1px solid ${T.accent}`,transition:"all .3s",
    clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
  },
  sectionTag:{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",letterSpacing:4,color:T.accent},
  h1:{fontFamily:"'Orbitron',monospace",fontWeight:900,color:"#fff"},
  h2:{fontFamily:"'Orbitron',monospace",fontWeight:700,color:"#fff"},
  h3:{fontFamily:"'Orbitron',monospace",fontWeight:600,color:"#fff",fontSize:"0.9rem"},
  tag:{
    fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",letterSpacing:2,
    color:T.accent,border:`1px solid ${T.border}`,padding:"3px 9px",
    background:"rgba(0,212,255,0.05)",display:"inline-block",
  },
  dim:{color:T.textDim,fontSize:"0.88rem",lineHeight:1.7},
};
