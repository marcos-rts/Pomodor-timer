import React, { useEffect, useState } from 'react'
import { api } from './api'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import History from './components/History'
import Settings from './components/Settings'

export default function App(){
  const [settings, setSettings] = useState({pomodoro:25, short_break:5, long_break:15});
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{ const s = await api.getSettings(); setSettings({...settings, ...s}); }catch(e){console.warn('Não foi possível carregar settings', e)}
    })()
  },[])

  const onSessionComplete = async ({ type, duration_minutes, task_id })=>{
    try{
      await api.createSession({ type, duration_minutes, task_id });
      // simple local feedback
      console.log('Session saved');
    }catch(e){ console.error('Falha ao salvar sessão', e) }
  }

  return (
    <div className="app">
      <div>
        <TaskList api={api} onSelectTask={setCurrentTask} />
      </div>
      <div>
        <Timer settings={settings} onSessionComplete={onSessionComplete} currentTask={currentTask} />
        <div style={{height:12}}></div>
        <Settings api={api} onChange={setSettings} />
      </div>
      <div>
        <History api={api} />
      </div>
    </div>
  )
}