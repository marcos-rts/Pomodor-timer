import React, { useEffect, useState } from 'react'

export default function Settings({ api, onChange }){
  const [s, setS] = useState({pomodoro:25, short_break:5, long_break:15});
  useEffect(()=>{
    (async ()=>{ try{ const remote = await api.getSettings(); setS({...s, ...remote}); }catch(e){ console.warn(e) } })()
  },[])
  const save = async ()=>{ await api.saveSettings(s); onChange(s); }
  return (
    <div className="card">
      <div className="header"><strong>Configurações</strong></div>
      <div style={{display:'grid',gap:6}}>
        <label>Pomodoro (min)<input type="number" value={s.pomodoro} onChange={e=>setS({...s,pomodoro: Number(e.target.value)})} /></label>
        <label>Short break (min)<input type="number" value={s.short_break} onChange={e=>setS({...s,short_break: Number(e.target.value)})} /></label>
        <label>Long break (min)<input type="number" value={s.long_break} onChange={e=>setS({...s,long_break: Number(e.target.value)})} /></label>
        <button className="btn" onClick={save}>Salvar</button>
      </div>
    </div>
  )
}