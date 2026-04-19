import { useState } from "react";

const C = {
  purple: { bg:'#EEEDFE', text:'#3C3489', bd:'#AFA9EC' },
  teal:   { bg:'#E1F5EE', text:'#085041', bd:'#5DCAA5' },
  amber:  { bg:'#FAEEDA', text:'#633806', bd:'#EF9F27' },
  coral:  { bg:'#FAECE7', text:'#711B13', bd:'#F0997B' },
  blue:   { bg:'#E6F1FB', text:'#0C447C', bd:'#85B7EB' },
  pink:   { bg:'#FBEAF0', text:'#72243E', bd:'#ED93B1' },
  gray:   { bg:'#F1EFE8', text:'#444441', bd:'#B4B2A9' },
};
const PRI  = { Critical:C.coral, High:C.amber, Medium:C.blue, Low:C.teal };
const STAT = { Backlog:C.gray, 'To Do':C.blue, 'In Progress':C.amber, 'In Review':C.purple, Done:C.teal };
const MCOL = [C.purple,C.teal,C.amber,C.coral,C.blue,C.pink];
const SCOL = s => s==='Completed'?C.teal:s==='Active'?C.blue:C.gray;
const COLS = ['Backlog','To Do','In Progress','In Review','Done'];
const TABS = ['User Stories','Sprint Planning','Sprint Board','Sprint Review','Retrospective','Team','Export'];

const TEAM_INIT = [
  { id:1, name:'Dhruv Arora',   role:'Business Analyst', init:'DA', resp:'Requirements gathering, BRD authoring, UAT coordination, stakeholder communication' },
  { id:2, name:"Sarah O'Brien", role:'Product Owner',    init:'SO', resp:'Backlog grooming, priority decisions, sprint review sign-off, roadmap ownership' },
  { id:3, name:'Liam Murphy',   role:'Scrum Master',     init:'LM', resp:'Facilitate ceremonies, remove blockers, track velocity, run retrospectives' },
  { id:4, name:'Priya Nair',    role:'Developer',        init:'PN', resp:'Frontend development, API integration, code review, technical documentation' },
  { id:5, name:'Conor Walsh',   role:'Developer',        init:'CW', resp:'Backend services, database design, DevOps, CI/CD pipeline' },
  { id:6, name:'Emma Byrne',    role:'QA Engineer',      init:'EB', resp:'Test plans, UAT execution, bug reporting, regression testing' },
];
const SPRINTS_INIT = [
  { id:1, name:'Sprint 1', goal:'Core authentication and user onboarding',       dates:'07–18 Apr 2025', status:'Completed' },
  { id:2, name:'Sprint 2', goal:'Project dashboard and reporting MVP',            dates:'21 Apr–02 May',  status:'Active'    },
  { id:3, name:'Sprint 3', goal:'Notifications, integrations and mobile polish',  dates:'05–16 May 2025', status:'Planned'   },
];
const S0 = [
  { id:1,  title:'User Registration & Login',  asA:'end user',         iWant:'register and log in securely',              soThat:'I can access my project dashboard',          pts:5, pri:'Critical', sprint:1, status:'Done',        assignee:4, ac:['Email + password auth','Google OAuth option','JWT token handling'] },
  { id:2,  title:'User Profile Setup',          asA:'end user',         iWant:'set up my profile with role and team',      soThat:'my teammates can identify me',               pts:3, pri:'High',     sprint:1, status:'Done',        assignee:5, ac:['Avatar upload','Role dropdown','Team assignment'] },
  { id:3,  title:'BA Requirements Intake',      asA:'business analyst', iWant:'capture requirements in a structured form', soThat:'nothing is missed during discovery',         pts:5, pri:'High',     sprint:1, status:'Done',        assignee:1, ac:['Custom fields per project','Priority tagging','Stakeholder linking'] },
  { id:4,  title:'Project Dashboard',           asA:'project manager',  iWant:'see all active projects on one screen',     soThat:'I can track delivery status at a glance',    pts:8, pri:'Critical', sprint:2, status:'In Progress', assignee:4, ac:['Status widgets','Sprint progress bar','Burndown chart'] },
  { id:5,  title:'Sprint Velocity Report',      asA:'scrum master',     iWant:'view team velocity across sprints',         soThat:'I can improve sprint planning accuracy',     pts:5, pri:'High',     sprint:2, status:'In Review',  assignee:5, ac:['Bar chart by sprint','Filter by team member','Export to CSV'] },
  { id:6,  title:'Kanban Story Board',          asA:'developer',        iWant:'move stories between columns',              soThat:'I can update status without manual forms',   pts:8, pri:'High',     sprint:2, status:'In Progress', assignee:4, ac:['Column movement','WIP limits visible','Story point badge'] },
  { id:7,  title:'Email Notifications',         asA:'end user',         iWant:'receive email alerts on story updates',     soThat:'I do not miss critical changes',             pts:3, pri:'Medium',   sprint:3, status:'Backlog',    assignee:null, ac:['Configurable triggers','HTML email template','Unsubscribe link'] },
  { id:8,  title:'Slack Integration',           asA:'scrum master',     iWant:'push sprint updates to Slack',              soThat:'the team is informed without switching tools',pts:5, pri:'Medium',  sprint:3, status:'Backlog',    assignee:null, ac:['OAuth Slack app','Channel selection','Event-based triggers'] },
  { id:9,  title:'Mobile Responsive UI',        asA:'end user',         iWant:'use the platform on mobile',                soThat:'I can check project status on the go',       pts:8, pri:'Low',      sprint:null,status:'Backlog',  assignee:null, ac:['Responsive breakpoints','Touch-friendly UI','PWA support'] },
];
const RV0 = {
  1:{ demo:'Completed auth flow demo with PO. All login scenarios passed. Minor UX tweaks logged for Sprint 2.', accepted:true,  notes:'PO signed off on Sprint 1. Email delivery delay to be addressed in Sprint 2 backlog.' },
  2:{ demo:'', accepted:false, notes:'' }, 3:{ demo:'', accepted:false, notes:'' },
};
const RT0 = {
  1:{ well:['Auth module delivered ahead of schedule','Clear acceptance criteria accelerated QA','Strong cross-functional collaboration'], improve:['Story point estimation was off for profile setup','PO feedback loop came too late in the sprint'], actions:['Introduce planning poker from Sprint 2','Schedule mid-sprint PO demo on Day 6'] },
  2:{ well:[], improve:[], actions:[] }, 3:{ well:[], improve:[], actions:[] },
};

const pill = (label,c) => <span style={{ background:c.bg,color:c.text,border:`1px solid ${c.bd}`,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:500,whiteSpace:'nowrap' }}>{label}</span>;
const av = (m,size=26) => { const c=MCOL[(m.id-1)%MCOL.length]; return <div title={m.name} style={{ width:size,height:size,borderRadius:'50%',background:c.bd,color:c.text,display:'flex',alignItems:'center',justifyContent:'center',fontSize:Math.round(size*0.34),fontWeight:500,flexShrink:0 }}>{m.init}</div>; };

export default function AgilePipeline() {
  const [tab,setTab]           = useState('User Stories');
  const [stories,setStories]   = useState(S0);
  const [team,setTeam]         = useState(TEAM_INIT);
  const [sprints,setSprints]   = useState(SPRINTS_INIT);
  const [asp,setAsp]           = useState(2);
  const [reviews,setReviews]   = useState(RV0);
  const [retros,setRetros]     = useState(RT0);
  const [showForm,setShowForm] = useState(false);
  const [editId,setEditId]     = useState(null);
  const [form,setForm]         = useState({});
  const [showAI,setShowAI]     = useState(false);
  const [aiMode,setAiMode]     = useState('stories');
  const [aiPrompt,setAiPrompt] = useState('');
  const [aiResult,setAiResult] = useState('');
  const [aiLoad,setAiLoad]     = useState(false);
  const [ri,setRi]             = useState({ well:'',improve:'',actions:'' });
  // sprint edit
  const [editSpId,setEditSpId] = useState(null);
  const [spF,setSpF]           = useState({});
  // team edit
  const [editMId,setEditMId]   = useState(null);
  const [mF,setMF]             = useState({});
  const [showAddM,setShowAddM] = useState(false);
  const [addMF,setAddMF]       = useState({ name:'',role:'',init:'',resp:'' });
  // retro item edit
  const [editRi,setEditRi]     = useState(null); // {spId,key,idx}
  const [editRiVal,setEditRiVal]=useState('');
  const [showAddSp,setShowAddSp]=useState(false);
  const [addSpF,setAddSpF]     =useState({name:'',goal:'',dates:'',status:'Planned'});
  const [dragId,setDragId]     =useState(null);
  const [dragCol,setDragCol]   =useState(null);

  const byId   = id => team.find(m=>m.id===id);
  const spById = id => sprints.find(s=>s.id===id);
  const spSt   = id => stories.filter(s=>s.sprint===id);

  // story CRUD
  const openAdd  = () => { setForm({title:'',asA:'',iWant:'',soThat:'',pts:3,pri:'Medium',sprint:asp||'',assignee:'',acRaw:''}); setEditId(null); setShowForm(true); };
  const openEdit = s  => { setForm({...s,sprint:s.sprint||'',assignee:s.assignee||'',acRaw:s.ac.join('\n')}); setEditId(s.id); setShowForm(true); };
  const saveStory= () => {
    const s={...form,pts:Number(form.pts)||3,sprint:form.sprint?Number(form.sprint):null,assignee:form.assignee?Number(form.assignee):null,ac:(form.acRaw||'').split('\n').map(x=>x.trim()).filter(Boolean)};
    delete s.acRaw;
    if(editId) setStories(p=>p.map(x=>x.id===editId?{...x,...s}:x));
    else setStories(p=>[...p,{...s,id:Date.now(),status:'Backlog'}]);
    setShowForm(false);
  };
  const delStory = id => setStories(p=>p.filter(x=>x.id!==id));
  const move     = (id,d) => setStories(p=>p.map(x=>{ if(x.id!==id)return x; const i=COLS.indexOf(x.status),ni=Math.max(0,Math.min(COLS.length-1,i+d)); return {...x,status:COLS[ni]}; }));

  // sprint CRUD
  const openSpEdit = sp => { setSpF({name:sp.name,goal:sp.goal,dates:sp.dates,status:sp.status}); setEditSpId(sp.id); };
  const saveSprint = () => { setSprints(p=>p.map(x=>x.id===editSpId?{...x,...spF}:x)); setEditSpId(null); };

  // team CRUD
  const openMEdit  = m  => { setMF({name:m.name,role:m.role,init:m.init,resp:m.resp}); setEditMId(m.id); };
  const saveMember = () => { setTeam(p=>p.map(x=>x.id===editMId?{...x,...mF}:x)); setEditMId(null); };
  const delMember  = id => { setTeam(p=>p.filter(x=>x.id!==id)); setStories(p=>p.map(x=>x.assignee===id?{...x,assignee:null}:x)); };
  const addMember  = () => { setTeam(p=>[...p,{...addMF,id:Date.now()}]); setAddMF({name:'',role:'',init:'',resp:''}); setShowAddM(false); };
  const addSprint  = () => {
    const nid=Date.now();
    setSprints(p=>[...p,{...addSpF,id:nid}]);
    setReviews(p=>({...p,[nid]:{demo:'',accepted:false,notes:''}}));
    setRetros(p=>({...p,[nid]:{well:[],improve:[],actions:[]}}));
    setAddSpF({name:'',goal:'',dates:'',status:'Planned'});
    setShowAddSp(false);
  };
  const deleteSprint = id => { setSprints(p=>p.filter(x=>x.id!==id)); if(asp===id) setAsp(sprints[0]?.id||1); };
  const dropStory    = col => { if(dragId) setStories(p=>p.map(x=>x.id===dragId?{...x,status:col}:x)); setDragId(null); setDragCol(null); };

  // retro item edit
  const saveRetroEdit = (spId,retro,key,idx) => {
    const updated=[...retro[key]]; updated[idx]=editRiVal;
    setRetros(p=>({...p,[spId]:{...retro,[key]:updated}})); setEditRi(null);
  };
  const addRetro = (spId,retro,key) => {
    if(!ri[key].trim())return;
    setRetros(p=>({...p,[spId]:{...retro,[key]:[...retro[key],ri[key].trim()]}})); setRi(p=>({...p,[key]:''}));
  };

  // AI
  const runAI = async () => {
    setAiLoad(true); setAiResult('');
    try {
      const prompt = aiMode==='stories'
        ? `You are a Business Analyst. Based on: "${aiPrompt}"\nGenerate 3 user stories. Return ONLY a JSON array:\n[{"title":"...","asA":"...","iWant":"...","soThat":"...","pts":5,"pri":"High","ac":["c1","c2","c3"]}]`
        : `Write a LinkedIn post (max 240 words) for Dhruv Arora, a Business Analyst in Dublin. He built an interactive Agile BA pipeline tool called Delivered that documents the full BA-to-delivery journey: user stories, sprint planning, kanban board, sprint reviews, retrospectives, with full team roles (BA, PO, SM, Dev, QA) and AI generation. Mention his real metrics: 35% reporting cycle time reduction, 98% defect-free deployments across 8+ releases. Use paragraph breaks, casual but professional tone, 2-3 hashtags at end. Make it feel human, not corporate.`;
      const res  = await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:prompt}]})});
      const data = await res.json();
      const text = (data.content||[]).map(b=>b.text||'').join('');
      if(aiMode==='stories'){
        try{ const p=JSON.parse(text.replace(/```json|```/g,'').trim()); setStories(prev=>[...prev,...p.map(s=>({...s,id:Date.now()+Math.random(),sprint:null,assignee:null,status:'Backlog'}))]); setAiResult(`Added ${p.length} user stories to your backlog.`); }
        catch{ setAiResult('Could not parse stories — try again with more detail.'); }
      } else setAiResult(text);
    } catch{ setAiResult('API error — please try again.'); }
    setAiLoad(false);
  };

  const f    = { fontFamily:'var(--font-sans)' };
  const card = { background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',borderRadius:'var(--border-radius-lg)',padding:'1rem 1.25rem' };
  const lbl  = { fontSize:11,fontWeight:500,color:'var(--color-text-secondary)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em' };
  const inp  = { width:'100%',boxSizing:'border-box',fontFamily:'var(--font-sans)' };
  const btn  = { border:'0.5px solid var(--color-border-secondary)',borderRadius:'var(--border-radius-md)',padding:'6px 14px',background:'transparent',cursor:'pointer',fontSize:13,color:'var(--color-text-primary)',...f };
  const btnP = { border:'none',borderRadius:'var(--border-radius-md)',padding:'7px 16px',background:'#3C3489',cursor:'pointer',fontSize:13,color:'#EEEDFE',fontWeight:500,...f };
  const btnSm= { ...btn, padding:'3px 9px', fontSize:12 };

  return (
    <div style={{ minHeight:'100vh',background:'var(--color-background-tertiary)',...f }}>
      <h2 className="sr-only">Delivered — interactive Agile BA pipeline for the project tracking platform</h2>

      {/* Header */}
      <div style={{ background:'#26215C',padding:'16px 20px 0' }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14,flexWrap:'wrap' }}>
          <span style={{ background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'5px 10px',color:'#EEEDFE',fontSize:14,fontWeight:500 }}>Delivered</span>
          <span style={{ color:'rgba(255,255,255,0.4)',fontSize:12 }}>Agile BA pipeline · Project tracking platform</span>
          <div style={{ marginLeft:'auto' }}>
            <button onClick={()=>{ setShowAI(!showAI); setAiMode('stories'); }} style={{ background:'rgba(99,88,185,0.35)',border:'0.5px solid rgba(174,169,236,0.4)',color:'#C7C3F0',borderRadius:8,padding:'6px 14px',fontSize:12,cursor:'pointer',...f }}>Generate with AI</button>
          </div>
        </div>
        <div style={{ display:'flex',overflowX:'auto' }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?'var(--color-background-tertiary)':'transparent',color:tab===t?'var(--color-text-primary)':'rgba(255,255,255,0.5)',border:'none',borderRadius:'8px 8px 0 0',padding:'8px 13px',fontSize:12,cursor:'pointer',whiteSpace:'nowrap',fontWeight:tab===t?500:400,...f }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:'20px',maxWidth:1100,margin:'0 auto' }}>

        {/* AI panel */}
        {showAI && (
          <div style={{ ...card,marginBottom:20,borderColor:C.purple.bd }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
              <span style={{ fontSize:15,fontWeight:500 }}>AI generator</span>
              <button onClick={()=>{ setShowAI(false); setAiResult(''); setAiPrompt(''); }} style={{ ...btnSm }}>x</button>
            </div>
            <div style={{ display:'flex',gap:8,marginBottom:14 }}>
              {[['stories','Generate stories'],['linkedin','LinkedIn post']].map(([k,l])=>(
                <button key={k} onClick={()=>setAiMode(k)} style={aiMode===k?btnP:btn}>{l}</button>
              ))}
            </div>
            {aiMode==='stories' && (
              <div style={{ marginBottom:12 }}>
                <label style={lbl}>Describe your project feature or epic</label>
                <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder="e.g. A reporting module where managers can generate monthly performance reports..." style={{ ...inp,minHeight:70,resize:'vertical',fontSize:13 }} />
              </div>
            )}
            <button onClick={runAI} disabled={aiLoad||(aiMode==='stories'&&!aiPrompt.trim())} style={{ ...btnP,opacity:aiLoad?0.6:1 }}>
              {aiLoad?'Generating...':aiMode==='stories'?'Generate user stories':'Generate LinkedIn post'}
            </button>
            {aiResult && <div style={{ marginTop:14,background:'var(--color-background-secondary)',borderRadius:8,padding:'12px 14px',fontSize:13,lineHeight:1.7,whiteSpace:'pre-wrap',maxHeight:260,overflowY:'auto',color:'var(--color-text-primary)' }}>{aiResult}</div>}
          </div>
        )}

        {/* Story form */}
        {showForm && (
          <div style={{ ...card,marginBottom:20,borderColor:C.purple.bd }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
              <span style={{ fontSize:15,fontWeight:500 }}>{editId?'Edit user story':'New user story'}</span>
              <button onClick={()=>setShowForm(false)} style={btnSm}>x</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Story title</label>
                <input value={form.title||''} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={inp} placeholder="e.g. User login with OAuth" />
              </div>
              {[['asA','As a...','end user, business analyst, etc.'],['iWant','I want to...','perform an action or achieve a goal'],['soThat','So that...','describe the business value']].map(([k,la,ph])=>(
                <div key={k}>
                  <label style={lbl}>{la}</label>
                  <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={inp} placeholder={ph} />
                </div>
              ))}
              <div><label style={lbl}>Story points</label>
                <select value={form.pts||3} onChange={e=>setForm(p=>({...p,pts:e.target.value}))} style={inp}>{[1,2,3,5,8,13].map(n=><option key={n} value={n}>{n}</option>)}</select>
              </div>
              <div><label style={lbl}>Priority</label>
                <select value={form.pri||'Medium'} onChange={e=>setForm(p=>({...p,pri:e.target.value}))} style={inp}>{['Critical','High','Medium','Low'].map(x=><option key={x}>{x}</option>)}</select>
              </div>
              <div><label style={lbl}>Sprint</label>
                <select value={form.sprint||''} onChange={e=>setForm(p=>({...p,sprint:e.target.value}))} style={inp}>
                  <option value="">Backlog (unassigned)</option>
                  {sprints.map(sp=><option key={sp.id} value={sp.id}>{sp.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Assignee</label>
                <select value={form.assignee||''} onChange={e=>setForm(p=>({...p,assignee:e.target.value}))} style={inp}>
                  <option value="">Unassigned</option>
                  {team.map(m=><option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Acceptance criteria (one per line)</label>
                <textarea value={form.acRaw||''} onChange={e=>setForm(p=>({...p,acRaw:e.target.value}))} placeholder={"Criteria one\nCriteria two\nCriteria three"} style={{ ...inp,minHeight:70,resize:'vertical',fontSize:13 }} />
              </div>
            </div>
            <div style={{ display:'flex',gap:10,marginTop:16,justifyContent:'flex-end' }}>
              <button onClick={()=>setShowForm(false)} style={btn}>Cancel</button>
              <button onClick={saveStory} style={btnP}>{editId?'Save changes':'Add story'}</button>
            </div>
          </div>
        )}

        {/* USER STORIES */}
        {tab==='User Stories' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
              <div>
                <h2 style={{ fontSize:18,fontWeight:500,margin:'0 0 3px' }}>User stories</h2>
                <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:0 }}>{stories.length} stories · {stories.reduce((a,s)=>a+s.pts,0)} total story points</p>
              </div>
              <button onClick={openAdd} style={btnP}>+ Add story</button>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {stories.map(s=>{
                const m=s.assignee?byId(s.assignee):null; const sp=s.sprint?spById(s.sprint):null;
                return (
                  <div key={s.id} style={{ ...card,display:'flex',gap:14 }}>
                    <div style={{ background:C.purple.bg,color:C.purple.text,borderRadius:8,padding:'6px 10px',fontWeight:500,fontSize:14,minWidth:32,textAlign:'center',alignSelf:'flex-start' }}>{s.pts}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:6 }}>
                        <span style={{ fontWeight:500,fontSize:14 }}>{s.title}</span>
                        {pill(s.pri,PRI[s.pri])}{pill(s.status,STAT[s.status])}
                        {sp&&pill(sp.name,C.gray)}
                      </div>
                      <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 8px',lineHeight:1.6 }}>
                        As a <strong style={{ color:'var(--color-text-primary)',fontWeight:500 }}>{s.asA}</strong>, I want to {s.iWant}, so that {s.soThat}.
                      </p>
                      <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                        {s.ac.map((c,i)=><span key={i} style={{ background:'var(--color-background-secondary)',color:'var(--color-text-secondary)',borderRadius:6,padding:'2px 8px',fontSize:11 }}>&#10003; {c}</span>)}
                      </div>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
                      {m&&av(m)}
                      <button onClick={()=>openEdit(s)} style={btnSm}>Edit</button>
                      <button onClick={()=>delStory(s.id)} style={{ ...btnSm,color:'var(--color-text-danger)',borderColor:'var(--color-border-danger)' }}>Del</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SPRINT PLANNING */}
        {tab==='Sprint Planning' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4 }}>
              <h2 style={{ fontSize:18,fontWeight:500,margin:0 }}>Sprint planning</h2>
              <button onClick={()=>setShowAddSp(!showAddSp)} style={btnP}>+ Add sprint</button>
            </div>
            <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 16px' }}>Facilitated by Scrum Master · Prioritised by Product Owner · Scoped by BA</p>
            {showAddSp && (
              <div style={{ ...card,marginBottom:16,borderColor:C.blue.bd }}>
                <span style={{ fontSize:14,fontWeight:500,display:'block',marginBottom:14 }}>New sprint</span>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                  <div><label style={lbl}>Sprint name</label><input value={addSpF.name} onChange={e=>setAddSpF(p=>({...p,name:e.target.value}))} style={inp} placeholder={`Sprint ${sprints.length+1}`} /></div>
                  <div><label style={lbl}>Dates</label><input value={addSpF.dates} onChange={e=>setAddSpF(p=>({...p,dates:e.target.value}))} style={inp} placeholder="e.g. 19–30 May 2025" /></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Sprint goal</label><input value={addSpF.goal} onChange={e=>setAddSpF(p=>({...p,goal:e.target.value}))} style={inp} placeholder="What will this sprint deliver?" /></div>
                  <div><label style={lbl}>Status</label>
                    <select value={addSpF.status} onChange={e=>setAddSpF(p=>({...p,status:e.target.value}))} style={inp}>
                      {['Planned','Active','Completed'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:'flex',gap:8,marginTop:14,justifyContent:'flex-end' }}>
                  <button onClick={()=>setShowAddSp(false)} style={btn}>Cancel</button>
                  <button onClick={addSprint} disabled={!addSpF.name||!addSpF.goal} style={{ ...btnP,opacity:(!addSpF.name||!addSpF.goal)?0.5:1 }}>Create sprint</button>
                </div>
              </div>
            )}
            <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
              {sprints.map(sp=>{
                const ss=spSt(sp.id),tot=ss.reduce((a,x)=>a+x.pts,0),dn=ss.filter(x=>x.status==='Done').reduce((a,x)=>a+x.pts,0);
                const pct=tot?Math.round(dn/tot*100):0,sc=SCOL(sp.status);
                const isEditing=editSpId===sp.id;
                return (
                  <div key={sp.id} style={card}>
                    {isEditing ? (
                      <div>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
                          <div><label style={lbl}>Sprint name</label><input value={spF.name||''} onChange={e=>setSpF(p=>({...p,name:e.target.value}))} style={inp} /></div>
                          <div><label style={lbl}>Dates</label><input value={spF.dates||''} onChange={e=>setSpF(p=>({...p,dates:e.target.value}))} style={inp} /></div>
                          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Sprint goal</label><input value={spF.goal||''} onChange={e=>setSpF(p=>({...p,goal:e.target.value}))} style={inp} /></div>
                          <div><label style={lbl}>Status</label>
                            <select value={spF.status||'Planned'} onChange={e=>setSpF(p=>({...p,status:e.target.value}))} style={inp}>
                              {['Planned','Active','Completed'].map(s=><option key={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div style={{ display:'flex',gap:8,justifyContent:'flex-end' }}>
                          <button onClick={()=>setEditSpId(null)} style={btn}>Cancel</button>
                          <button onClick={saveSprint} style={btnP}>Save sprint</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:'flex',gap:12,marginBottom:12 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4 }}>
                              <h3 style={{ fontSize:16,fontWeight:500,margin:0 }}>{sp.name}</h3>
                              {pill(sp.status,sc)}
                            </div>
                            <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 2px' }}>Goal: {sp.goal}</p>
                            <p style={{ fontSize:12,color:'var(--color-text-tertiary)',margin:0 }}>{sp.dates}</p>
                          </div>
                          <div style={{ display:'flex',alignItems:'flex-start',gap:8 }}>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:22,fontWeight:500 }}>{tot}</div>
                              <div style={{ fontSize:11,color:'var(--color-text-secondary)' }}>story pts</div>
                            </div>
                            <button onClick={()=>openSpEdit(sp)} style={btnSm}>Edit sprint</button>
                          </div>
                        </div>
                        <div style={{ height:4,background:'var(--color-background-secondary)',borderRadius:2,marginBottom:14 }}>
                          <div style={{ height:'100%',width:`${pct}%`,background:sc.bd,borderRadius:2 }} />
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                          {ss.map(st=>{
                            const m=st.assignee?byId(st.assignee):null;
                            return (
                              <div key={st.id} style={{ display:'flex',alignItems:'center',gap:10,padding:'7px 10px',background:'var(--color-background-secondary)',borderRadius:8 }}>
                                <span style={{ background:C.purple.bg,color:C.purple.text,borderRadius:6,padding:'1px 7px',fontSize:12,fontWeight:500 }}>{st.pts}</span>
                                <span style={{ flex:1,fontSize:13 }}>{st.title}</span>
                                {pill(st.pri,PRI[st.pri])}{pill(st.status,STAT[st.status])}
                                {m&&av(m,22)}
                                <button onClick={()=>openEdit(st)} style={btnSm}>Edit</button>
                              </div>
                            );
                          })}
                          {ss.length===0&&<p style={{ fontSize:13,color:'var(--color-text-tertiary)',textAlign:'center',padding:'10px 0' }}>No stories assigned to this sprint.</p>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SPRINT BOARD */}
        {tab==='Sprint Board' && (
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap' }}>
              <h2 style={{ fontSize:18,fontWeight:500,margin:0 }}>Sprint board</h2>
              {sprints.map(sp=>(
                <button key={sp.id} onClick={()=>setAsp(sp.id)} style={{ ...btn,...(asp===sp.id?{background:C.blue.bg,borderColor:C.blue.bd,color:C.blue.text}:{}) }}>{sp.name}</button>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10 }}>
              {COLS.map(col=>{
                const cs=spSt(asp).filter(x=>x.status===col),cc=STAT[col],isOver=dragCol===col&&dragId;
                return (
                  <div key={col}
                    onDragOver={e=>{e.preventDefault();setDragCol(col);}}
                    onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragCol(null);}}
                    onDrop={e=>{e.preventDefault();dropStory(col);}}
                    style={{ background:isOver?C.blue.bg:'var(--color-background-primary)',border:`0.5px solid ${isOver?C.blue.bd:'var(--color-border-tertiary)'}`,borderRadius:'var(--border-radius-lg)',overflow:'hidden',transition:'background 0.15s,border 0.15s' }}>
                    <div style={{ padding:'9px 12px',background:cc.bg,borderBottom:`0.5px solid ${cc.bd}`,display:'flex',justifyContent:'space-between' }}>
                      <span style={{ fontSize:12,fontWeight:500,color:cc.text }}>{col}</span>
                      <span style={{ fontSize:11,color:cc.text }}>{cs.length}</span>
                    </div>
                    <div style={{ padding:8,display:'flex',flexDirection:'column',gap:8,minHeight:140 }}>
                      {cs.map(st=>{
                        const m=st.assignee?byId(st.assignee):null,pc=PRI[st.pri],isDragging=dragId===st.id;
                        return (
                          <div key={st.id}
                            draggable
                            onDragStart={e=>{e.dataTransfer.effectAllowed='move';setDragId(st.id);}}
                            onDragEnd={()=>{setDragId(null);setDragCol(null);}}
                            style={{ background:isDragging?C.gray.bg:'var(--color-background-secondary)',borderRadius:8,padding:10,cursor:'grab',opacity:isDragging?0.4:1,transition:'opacity 0.15s',userSelect:'none' }}>
                            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                              {pill(st.pri,pc)}
                              <span style={{ background:C.purple.bg,color:C.purple.text,fontSize:10,borderRadius:6,padding:'1px 6px',fontWeight:500 }}>{st.pts}pt</span>
                            </div>
                            <p style={{ fontSize:12,fontWeight:500,margin:'0 0 8px',lineHeight:1.4 }}>{st.title}</p>
                            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                              {m?av(m,20):<span/>}
                              <div style={{ display:'flex',gap:4 }}>
                                <button onClick={e=>{e.stopPropagation();openEdit(st);}} style={{ ...btnSm,fontSize:10,padding:'1px 6px' }}>Edit</button>
                                {col!=='Backlog'&&<button onClick={e=>{e.stopPropagation();move(st.id,-1);}} style={{ ...btnSm,fontSize:10,padding:'1px 6px' }}>&#8592;</button>}
                                {col!=='Done'&&<button onClick={e=>{e.stopPropagation();move(st.id,1);}} style={{ ...btnSm,fontSize:10,padding:'1px 6px',background:C.purple.bg,borderColor:C.purple.bd,color:C.purple.text }}>&#8594;</button>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {isOver&&<div style={{ border:`2px dashed ${C.blue.bd}`,borderRadius:8,padding:16,textAlign:'center',fontSize:12,color:C.blue.text }}>Drop here</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SPRINT REVIEW */}
        {tab==='Sprint Review' && (
          <div>
            <h2 style={{ fontSize:18,fontWeight:500,margin:'0 0 4px' }}>Sprint review</h2>
            <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 20px' }}>PO reviews completed work · Demo findings recorded · Stakeholder sign-off</p>
            <div style={{ display:'flex',gap:8,marginBottom:20 }}>
              {sprints.map(sp=>(
                <button key={sp.id} onClick={()=>setAsp(sp.id)} style={{ ...btn,...(asp===sp.id?{background:C.purple.bg,borderColor:C.purple.bd,color:C.purple.text}:{}) }}>{sp.name}</button>
              ))}
            </div>
            {(()=>{
              const sp=spById(asp),rv=reviews[asp]||{demo:'',accepted:false,notes:''};
              const all=spSt(asp);
              return (
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
                  <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                    <div style={card}>
                      <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 12px' }}>Sprint summary</h3>
                      {[['Goal',sp.goal],['Stories completed',`${all.filter(x=>x.status==='Done').length} / ${all.length}`],['Points delivered',`${all.filter(x=>x.status==='Done').reduce((a,x)=>a+x.pts,0)} / ${all.reduce((a,x)=>a+x.pts,0)}`]].map(([l,v])=>(
                        <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'0.5px solid var(--color-border-tertiary)',fontSize:13 }}>
                          <span style={{ color:'var(--color-text-secondary)' }}>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={card}>
                      <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 12px' }}>Stories in this sprint</h3>
                      {all.length===0?<p style={{ fontSize:13,color:'var(--color-text-secondary)' }}>No stories assigned.</p>:
                        all.map(x=>{
                          const sc=STAT[x.status];
                          return (
                            <div key={x.id} style={{ display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                              <span style={{ flex:1,fontSize:13 }}>{x.title}</span>
                              {pill(x.status,sc)}
                              <select value={x.status} onChange={e=>setStories(p=>p.map(s=>s.id===x.id?{...s,status:e.target.value}:s))} style={{ fontSize:11,borderRadius:6,border:'0.5px solid var(--color-border-secondary)',padding:'2px 6px',background:'transparent',...f }}>
                                {COLS.map(c=><option key={c}>{c}</option>)}
                              </select>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  <div style={card}>
                    <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 16px' }}>Review notes</h3>
                    <label style={lbl}>Demo outcome</label>
                    <textarea value={rv.demo} onChange={e=>setReviews(p=>({...p,[asp]:{...rv,demo:e.target.value}}))} placeholder="What was demoed and what was the result..." style={{ ...inp,minHeight:80,resize:'vertical',fontSize:13,marginBottom:14 }} />
                    <label style={lbl}>Stakeholder notes</label>
                    <textarea value={rv.notes} onChange={e=>setReviews(p=>({...p,[asp]:{...rv,notes:e.target.value}}))} placeholder="Feedback from PO and stakeholders..." style={{ ...inp,minHeight:80,resize:'vertical',fontSize:13,marginBottom:14 }} />
                    <div style={{ display:'flex',alignItems:'center',gap:10,padding:12,background:rv.accepted?C.teal.bg:'var(--color-background-secondary)',borderRadius:8,border:`0.5px solid ${rv.accepted?C.teal.bd:'var(--color-border-tertiary)'}` }}>
                      <input type="checkbox" id="po" checked={rv.accepted} onChange={e=>setReviews(p=>({...p,[asp]:{...rv,accepted:e.target.checked}}))} />
                      <label htmlFor="po" style={{ fontSize:13,fontWeight:500,cursor:'pointer',color:rv.accepted?C.teal.text:'var(--color-text-primary)' }}>
                        {rv.accepted?'Sprint accepted by Product Owner':'PO acceptance sign-off'}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* RETROSPECTIVE */}
        {tab==='Retrospective' && (
          <div>
            <h2 style={{ fontSize:18,fontWeight:500,margin:'0 0 4px' }}>Sprint retrospective</h2>
            <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 20px' }}>Facilitated by Scrum Master · Full team participation · Continuous improvement</p>
            <div style={{ display:'flex',gap:8,marginBottom:20 }}>
              {sprints.map(sp=>(
                <button key={sp.id} onClick={()=>setAsp(sp.id)} style={{ ...btn,...(asp===sp.id?{background:C.coral.bg,borderColor:C.coral.bd,color:C.coral.text}:{}) }}>{sp.name}</button>
              ))}
            </div>
            {(()=>{
              const retro=retros[asp]||{well:[],improve:[],actions:[]};
              const cols=[
                {k:'well',   label:'Went well',    color:C.teal,  ph:'Something that worked well...'},
                {k:'improve',label:'To improve',   color:C.amber, ph:'Something to change...'},
                {k:'actions',label:'Action items', color:C.purple,ph:'A concrete action...'},
              ];
              return (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }}>
                  {cols.map(col=>(
                    <div key={col.k} style={card}>
                      <div style={{ background:col.color.bg,borderRadius:8,padding:'8px 12px',marginBottom:12 }}>
                        <h3 style={{ fontSize:14,fontWeight:500,color:col.color.text,margin:0 }}>{col.label}</h3>
                      </div>
                      <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:12 }}>
                        {retro[col.k].map((item,i)=>{
                          const isEditingThis=editRi&&editRi.spId===asp&&editRi.key===col.k&&editRi.idx===i;
                          return isEditingThis ? (
                            <div key={i} style={{ display:'flex',gap:6 }}>
                              <input value={editRiVal} onChange={e=>setEditRiVal(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') saveRetroEdit(asp,retro,col.k,i); }} style={{ flex:1,fontSize:12,...f }} autoFocus />
                              <button onClick={()=>saveRetroEdit(asp,retro,col.k,i)} style={{ ...btnSm,background:col.color.bg,borderColor:col.color.bd,color:col.color.text,fontSize:11 }}>Save</button>
                              <button onClick={()=>setEditRi(null)} style={{ ...btnSm,fontSize:11 }}>x</button>
                            </div>
                          ) : (
                            <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:8,background:col.color.bg,borderRadius:8,padding:'8px 10px' }}>
                              <span style={{ flex:1,fontSize:13,color:col.color.text,lineHeight:1.5 }}>{item}</span>
                              <button onClick={()=>{ setEditRi({spId:asp,key:col.k,idx:i}); setEditRiVal(item); }} style={{ background:'none',border:'none',color:col.color.text,cursor:'pointer',fontSize:11,padding:0,opacity:0.6 }}>Edit</button>
                              <button onClick={()=>setRetros(p=>({...p,[asp]:{...retro,[col.k]:retro[col.k].filter((_,j)=>j!==i)}}))} style={{ background:'none',border:'none',color:col.color.text,cursor:'pointer',fontSize:14,padding:0,opacity:0.6,lineHeight:1 }}>x</button>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display:'flex',gap:6 }}>
                        <input value={ri[col.k]} onChange={e=>setRi(p=>({...p,[col.k]:e.target.value}))} onKeyDown={e=>{ if(e.key==='Enter') addRetro(asp,retro,col.k); }} placeholder={col.ph} style={{ flex:1,fontSize:13,...f }} />
                        <button onClick={()=>addRetro(asp,retro,col.k)} style={{ ...btn,padding:'6px 10px',background:col.color.bg,borderColor:col.color.bd,color:col.color.text }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TEAM */}
        {tab==='Team' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4 }}>
              <h2 style={{ fontSize:18,fontWeight:500,margin:0 }}>Team and roles</h2>
              <button onClick={()=>{ setShowAddM(!showAddM); setAddMF({name:'',role:'',init:'',resp:''}); }} style={btnP}>+ Add member</button>
            </div>
            <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 20px' }}>Cross-functional Agile team · Click Edit to update any member's details</p>
            {showAddM && (
              <div style={{ ...card,marginBottom:16,borderColor:C.teal.bd }}>
                <span style={{ fontSize:14,fontWeight:500,display:'block',marginBottom:14 }}>New team member</span>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                  <div><label style={lbl}>Full name</label><input value={addMF.name} onChange={e=>setAddMF(p=>({...p,name:e.target.value}))} style={inp} placeholder="e.g. Niamh Kelly" /></div>
                  <div><label style={lbl}>Role</label><input value={addMF.role} onChange={e=>setAddMF(p=>({...p,role:e.target.value}))} style={inp} placeholder="e.g. UX Designer" /></div>
                  <div><label style={lbl}>Initials (2 chars)</label><input value={addMF.init} onChange={e=>setAddMF(p=>({...p,init:e.target.value.slice(0,2).toUpperCase()}))} style={inp} placeholder="NK" maxLength={2} /></div>
                  <div><label style={lbl}>Responsibilities</label><input value={addMF.resp} onChange={e=>setAddMF(p=>({...p,resp:e.target.value}))} style={inp} placeholder="Key responsibilities..." /></div>
                </div>
                <div style={{ display:'flex',gap:8,marginTop:14,justifyContent:'flex-end' }}>
                  <button onClick={()=>setShowAddM(false)} style={btn}>Cancel</button>
                  <button onClick={addMember} disabled={!addMF.name||!addMF.role||!addMF.init} style={{ ...btnP,opacity:(!addMF.name||!addMF.role||!addMF.init)?0.5:1 }}>Add member</button>
                </div>
              </div>
            )}
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(0,1fr))',gap:14,marginBottom:20 }}>
              {team.map(m=>{
                const c=MCOL[(team.indexOf(m))%MCOL.length];
                const cnt=stories.filter(x=>x.assignee===m.id).length,pts=stories.filter(x=>x.assignee===m.id).reduce((a,x)=>a+x.pts,0);
                const isEd=editMId===m.id;
                return (
                  <div key={m.id} style={card}>
                    {isEd ? (
                      <div>
                        <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:12 }}>
                          <div><label style={lbl}>Full name</label><input value={mF.name} onChange={e=>setMF(p=>({...p,name:e.target.value}))} style={inp} /></div>
                          <div><label style={lbl}>Role</label><input value={mF.role} onChange={e=>setMF(p=>({...p,role:e.target.value}))} style={inp} /></div>
                          <div><label style={lbl}>Initials</label><input value={mF.init} onChange={e=>setMF(p=>({...p,init:e.target.value.slice(0,2).toUpperCase()}))} style={inp} maxLength={2} /></div>
                          <div><label style={lbl}>Responsibilities</label><textarea value={mF.resp} onChange={e=>setMF(p=>({...p,resp:e.target.value}))} style={{ ...inp,minHeight:60,resize:'vertical',fontSize:13 }} /></div>
                        </div>
                        <div style={{ display:'flex',gap:8,justifyContent:'flex-end' }}>
                          <button onClick={()=>setEditMId(null)} style={btn}>Cancel</button>
                          <button onClick={saveMember} style={btnP}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                          <div style={{ width:40,height:40,borderRadius:'50%',background:c.bd,color:c.text,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:500,flexShrink:0 }}>{m.init}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:500,fontSize:14 }}>{m.name}</div>
                            <div style={{ fontSize:12,color:'var(--color-text-secondary)' }}>{m.role}</div>
                          </div>
                        </div>
                        <p style={{ fontSize:12,color:'var(--color-text-secondary)',lineHeight:1.6,margin:'0 0 10px' }}>{m.resp}</p>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                          <div style={{ display:'flex',gap:6 }}>
                            {pill(`${cnt} stories`,C.purple)}{pill(`${pts} pts`,C.teal)}
                          </div>
                          <div style={{ display:'flex',gap:6 }}>
                            <button onClick={()=>openMEdit(m)} style={btnSm}>Edit</button>
                            <button onClick={()=>delMember(m.id)} style={{ ...btnSm,color:'var(--color-text-danger)',borderColor:'var(--color-border-danger)' }}>Del</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={card}>
              <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 14px' }}>Ceremony ownership</h3>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13,tableLayout:'fixed' }}>
                  <thead><tr style={{ background:'var(--color-background-secondary)' }}>
                    <th style={{ textAlign:'left',padding:'8px 12px',color:'var(--color-text-secondary)',fontWeight:500,borderBottom:'0.5px solid var(--color-border-tertiary)' }}>Ceremony</th>
                    {['BA','PO','SM','Dev','QA'].map(r=><th key={r} style={{ padding:'8px',color:'var(--color-text-secondary)',fontWeight:500,borderBottom:'0.5px solid var(--color-border-tertiary)' }}>{r}</th>)}
                  </tr></thead>
                  <tbody>
                    {[{c:'Sprint planning',v:['R','A','F','P','P']},{c:'Daily stand-up',v:['P','O','F','R','R']},{c:'Backlog grooming',v:['R','A','F','C','C']},{c:'Sprint review',v:['C','A','F','R','R']},{c:'Retrospective',v:['P','P','F','P','P']},{c:'UAT sign-off',v:['A','R','O','C','R']}].map((row,i)=>{
                      const vc={R:C.purple,A:C.amber,F:C.teal,P:C.blue,C:C.pink,O:C.gray};
                      return (<tr key={i} style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                        <td style={{ padding:'9px 12px' }}>{row.c}</td>
                        {row.v.map((v,j)=><td key={j} style={{ padding:'9px 8px',textAlign:'center' }}><span style={{ background:vc[v]?.bg,color:vc[v]?.text,borderRadius:6,padding:'2px 7px',fontWeight:500,fontSize:11 }}>{v}</span></td>)}
                      </tr>);
                    })}
                  </tbody>
                </table>
                <p style={{ fontSize:11,color:'var(--color-text-tertiary)',marginTop:8 }}>R = Responsible · A = Accountable · F = Facilitates · P = Participates · C = Consulted · O = Optional</p>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT */}
        {tab==='Export' && (()=>{
          const totalPts=stories.reduce((a,s)=>a+s.pts,0),donePts=stories.filter(s=>s.status==='Done').reduce((a,s)=>a+s.pts,0);
          const doneCnt=stories.filter(s=>s.status==='Done').length,inProgCnt=stories.filter(s=>s.status==='In Progress').length;
          const reviewCnt=stories.filter(s=>s.status==='In Review').length,backCnt=stories.filter(s=>s.status==='Backlog'||s.status==='To Do').length;
          const downloadReport = () => {
            const ts=new Date().toLocaleDateString('en-IE',{day:'2-digit',month:'long',year:'numeric'});
            const sprintRows=sprints.map(sp=>{
              const ss=spSt(sp.id),tot=ss.reduce((a,x)=>a+x.pts,0),dn=ss.filter(x=>x.status==='Done').reduce((a,x)=>a+x.pts,0);
              const pct=tot?Math.round(dn/tot*100):0,rv=reviews[sp.id]||{},rt=retros[sp.id]||{well:[],improve:[],actions:[]};
              return `<section style="margin-bottom:32px;padding:20px 24px;border:1px solid #e2e8f0;border-radius:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><h3 style="margin:0;font-size:16px;color:#1e293b;">${sp.name} — ${sp.status}</h3><span style="font-size:13px;color:#64748b;">${sp.dates}</span></div>
                <p style="margin:0 0 6px;font-size:13px;color:#475569;">Goal: ${sp.goal}</p>
                <p style="margin:0 0 14px;font-size:13px;color:#475569;">Points delivered: <strong>${dn}/${tot}</strong> (${pct}%)</p>
                <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px;">
                  <thead><tr style="background:#f8fafc;"><th style="text-align:left;padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#64748b;">Story</th><th style="padding:6px;border-bottom:1px solid #e2e8f0;color:#64748b;">Pts</th><th style="padding:6px;border-bottom:1px solid #e2e8f0;color:#64748b;">Priority</th><th style="padding:6px;border-bottom:1px solid #e2e8f0;color:#64748b;">Status</th><th style="padding:6px;border-bottom:1px solid #e2e8f0;color:#64748b;">Assignee</th></tr></thead>
                  <tbody>${ss.map(x=>{ const m=x.assignee?team.find(t=>t.id===x.assignee):null; return `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:6px 10px;">${x.title}</td><td style="padding:6px;text-align:center;">${x.pts}</td><td style="padding:6px;text-align:center;">${x.pri}</td><td style="padding:6px;text-align:center;">${x.status}</td><td style="padding:6px;text-align:center;">${m?m.name:'—'}</td></tr>`; }).join('')}</tbody>
                </table>
                ${rv.demo?`<p style="font-size:12px;color:#475569;margin:0 0 4px;"><strong>Sprint review:</strong> ${rv.demo}</p>`:''}
                ${rv.accepted?`<p style="font-size:12px;color:#16a34a;margin:0 0 10px;">&#10003; Accepted by Product Owner</p>`:''}
                ${rt.well.length||rt.improve.length||rt.actions.length?`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px;">${[['Went well',rt.well,'#085041','#E1F5EE'],['To improve',rt.improve,'#633806','#FAEEDA'],['Actions',rt.actions,'#3C3489','#EEEDFE']].map(([h,items,tc,bg])=>`<div style="background:${bg};border-radius:8px;padding:10px;"><p style="font-size:11px;font-weight:600;color:${tc};margin:0 0 6px;text-transform:uppercase;">${h}</p>${items.map(i=>`<p style="font-size:11px;color:${tc};margin:2px 0;">&#8226; ${i}</p>`).join('')}</div>`).join('')}</div>`:''}
              </section>`;
            }).join('');
            const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Delivered — Project Report</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 24px;color:#1e293b;}h1,h2,h3{font-weight:600;}table{width:100%;}</style></head><body>
              <div style="border-bottom:2px solid #6366f1;padding-bottom:16px;margin-bottom:28px;"><h1 style="margin:0 0 4px;font-size:26px;color:#1e1b4b;">Delivered</h1><p style="margin:0;font-size:14px;color:#64748b;">Agile BA Pipeline — Project Summary Report &nbsp;|&nbsp; Generated ${ts}</p></div>
              <section style="margin-bottom:28px;padding:18px 24px;background:#f8fafc;border-radius:10px;display:flex;gap:32px;flex-wrap:wrap;">${[['Total stories',stories.length],['Story points',totalPts],['Done',`${doneCnt} / ${donePts}pts`],['In progress',inProgCnt],['Sprints',sprints.length],['Team',team.length]].map(([l,v])=>`<div><p style="font-size:11px;color:#64748b;margin:0 0 2px;text-transform:uppercase;">${l}</p><p style="font-size:20px;font-weight:700;color:#1e293b;margin:0;">${v}</p></div>`).join('')}</section>
              <h2 style="font-size:18px;color:#1e293b;margin:0 0 12px;">Team</h2>
              <table style="border-collapse:collapse;font-size:13px;margin-bottom:28px;width:100%;"><thead><tr style="background:#f8fafc;"><th style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;">Name</th><th style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:left;">Role</th><th style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b;">Stories</th><th style="padding:8px;border-bottom:1px solid #e2e8f0;color:#64748b;">Points</th></tr></thead><tbody>${team.map(m=>{ const cnt=stories.filter(x=>x.assignee===m.id).length,pts=stories.filter(x=>x.assignee===m.id).reduce((a,x)=>a+x.pts,0); return`<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px 12px;">${m.name}</td><td style="padding:8px 12px;">${m.role}</td><td style="padding:8px;text-align:center;">${cnt}</td><td style="padding:8px;text-align:center;">${pts}</td></tr>`; }).join('')}</tbody></table>
              <h2 style="font-size:18px;color:#1e293b;margin:0 0 16px;">Sprints</h2>${sprintRows}
            </body></html>`;
            const blob=new Blob([html],{type:'text/html'}),url=URL.createObjectURL(blob),a=document.createElement('a');
            a.href=url; a.download='delivered-project-report.html'; a.click(); URL.revokeObjectURL(url);
          };
          return (
            <div>
              <h2 style={{ fontSize:18,fontWeight:500,margin:'0 0 4px' }}>Export</h2>
              <p style={{ fontSize:13,color:'var(--color-text-secondary)',margin:'0 0 20px' }}>Download a full project report with all stories, sprints, reviews and retrospectives</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
                <div style={card}>
                  <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 16px' }}>Project snapshot</h3>
                  {[['Total user stories',stories.length,C.purple],['Total story points',totalPts,C.blue],['Stories done',doneCnt,C.teal],['In progress',inProgCnt,C.amber],['In review',reviewCnt,C.purple],['Backlog / To Do',backCnt,C.gray],['Sprints',sprints.length,C.coral],['Team members',team.length,C.blue]].map(([l,v,c])=>(
                    <div key={l} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                      <span style={{ fontSize:13,color:'var(--color-text-secondary)' }}>{l}</span>
                      <span style={{ background:c.bg,color:c.text,borderRadius:8,padding:'3px 10px',fontSize:13,fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div style={card}>
                    <h3 style={{ fontSize:15,fontWeight:500,margin:'0 0 8px' }}>Download project report</h3>
                    <p style={{ fontSize:13,color:'var(--color-text-secondary)',lineHeight:1.7,margin:'0 0 16px' }}>Self-contained HTML file with your full project summary — all sprints, stories, reviews, retrospectives, and team assignments in one shareable document.</p>
                    <div style={{ background:'var(--color-background-secondary)',borderRadius:8,padding:'12px 14px',marginBottom:16 }}>
                      {['Project overview and team roster','All user stories with status and assignees','Sprint-by-sprint progress and velocity','Sprint review notes and PO sign-off','Retrospective items per sprint'].map((item,i)=>(
                        <div key={i} style={{ display:'flex',gap:8,padding:'5px 0',borderBottom:i<4?'0.5px solid var(--color-border-tertiary)':'none',fontSize:13 }}>
                          <span style={{ color:C.teal.text,flexShrink:0 }}>&#10003;</span>
                          <span style={{ color:'var(--color-text-secondary)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={downloadReport} style={{ ...btnP,width:'100%',padding:'10px' }}>Download report as HTML</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}