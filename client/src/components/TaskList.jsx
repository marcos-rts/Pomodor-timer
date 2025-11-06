import React, { useEffect, useState } from 'react'

export default function TaskList({ api, onSelectTask }){
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({title:'', estimate_minutes:25});

  const load = async ()=>{
    try{ const res = await api.getTasks(); setTasks(res); }catch(e){ console.error(e) }
  }
  useEffect(()=>{ load() },[]);

  const add = async ()=>{
    if(!form.title) return;
    await api.createTask(form);
    setForm({title:'', estimate_minutes:25});
    load();
  }

  return (
    <div className="card">
      <div className="header"><strong>Tarefas</strong><div className="small">Meta: priorize</div></div>
      <div>
        {tasks.map(t=> (
          <div key={t.id} className="task" onClick={()=> onSelectTask(t)}>
            <div className="left">
              <div>
                <div style={{fontWeight:700}}>{t.title}</div>
                <div className="small">{t.estimate_minutes} min • {t.completed_count} concluídas</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
              <button className="btn small" onClick={(e)=>{ e.stopPropagation(); api.deleteTask(t.id).then(()=>load()) }}>Del</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10}}>
        <input placeholder="Nova tarefa" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input style={{width:80, marginLeft:6}} type="number" value={form.estimate_minutes} onChange={e=>setForm({...form, estimate_minutes: Number(e.target.value) })} />
        <button className="btn" onClick={add}>Adicionar</button>
      </div>
    </div>
  )
}