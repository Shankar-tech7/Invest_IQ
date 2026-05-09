import { s, T } from "../styles/theme";

export function Navigation({ page, setPage }) {
  const navItems = [
    {id:"home",label:"HOME"},
    {id:"autopsy",label:"01 AUTOPSY"},
    {id:"tod",label:"02 TIME OF DEATH"},
    {id:"digital",label:"03 DIGITAL EVIDENCE"},
    {id:"risk",label:"04 RISK SCORING"},
    {id:"dashboard",label:"05 DASHBOARD"},
  ];

  return (
    <nav style={s.nav}>
      <div style={{...s.logo,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("home")}>
        <span style={{width:7,height:7,background:T.accent3,borderRadius:"50%",animation:"pulse 1.5s infinite",boxShadow:`0 0 10px \${T.accent3}`}}/>
        FORENSIC<span style={{color:"#fff"}}>AI</span>
      </div>
      <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            style={{...s.navBtn,...(page===n.id?s.navBtnActive:{})}}
            onMouseEnter={e=>{if(page!==n.id){e.target.style.color=T.text}}}
            onMouseLeave={e=>{if(page!==n.id){e.target.style.color=T.textDim}}}>
            {n.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",color:T.accent2,letterSpacing:2}}>
        <span style={{width:6,height:6,background:T.accent2,borderRadius:"50%",animation:"pulse 2s infinite"}}/>
        SYSTEM ACTIVE
      </div>
    </nav>
  );
}
