import React, { useEffect, useState } from 'react'

export default function History({ api }){
  const [list, setList] = useState([]);
  const load = async ()=>{ try{ setList(await api.getSessions()) }catch(e){console.error(e)} }
  useEffect(()=>{ load() },[]);
  return (
    <div className="card">
      <div className="header"><strong>Histórico</strong><div className="small">Últimas sessões</div></div>
      <div>
        {list.map(s=> (
          <div key={s.id} className="history-item">
            <div style={{fontWeight:700}}>{s.type} — {s.duration_minutes} min</div>
            <div className="small">{s.task_title || '—'} • {new Date(s.completed_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}