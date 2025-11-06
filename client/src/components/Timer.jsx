import React, { useEffect, useState, useRef } from 'react'

export default function Timer({ onSessionComplete, settings, currentTask }){
  const defaultDur = (settings?.pomodoro || 25) * 60;
  const [seconds, setSeconds] = useState(defaultDur);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, short_break, long_break
  const intervalRef = useRef();

  useEffect(()=>{
    setSeconds((settings?.pomodoro || 25) * 60);
  }, [settings?.pomodoro]);

  useEffect(()=>{
    if(running){
      intervalRef.current = setInterval(()=> setSeconds(s=> s-1), 1000);
    } else clearInterval(intervalRef.current);
    return ()=> clearInterval(intervalRef.current);
  }, [running]);

  useEffect(()=>{
    if(seconds <= 0){
      setRunning(false);
      // determine next mode
      const sessionMinutes = Math.round((settings?.pomodoro||25));
      onSessionComplete({ type: mode, duration_minutes: sessionMinutes, task_id: currentTask?.id||null });
      // simple cycle logic: after pomodoro -> short_break; after 4 pomodoros -> long_break
      if(mode === 'pomodoro') setMode('short_break');
      else setMode('pomodoro');
      // reset seconds based on mode
      const nextDur = mode === 'pomodoro' ? (settings?.short_break||5)*60 : (settings?.pomodoro||25)*60;
      setSeconds(nextDur);
    }
  }, [seconds, mode]);

  const mmss = ()=>{
    const m = Math.floor(seconds/60).toString().padStart(2,'0');
    const s = (seconds%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  return (
    <div className="card timer">
      <div className="header">
        <div>
          <div className="small">Modo</div>
          <strong>{mode.replace('_',' ')}</strong>
        </div>
        <div className="small">Tarefa: <em>{currentTask?.title||'—'}</em></div>
      </div>
      <div className="big-time">{mmss()}</div>
      <div className="controls">
        <button className="btn" onClick={()=> setRunning(r=>!r)}>{running? 'Pausar':'Iniciar'}</button>
        <button className="btn" onClick={()=>{ setRunning(false); setSeconds((settings?.pomodoro||25)*60); setMode('pomodoro'); }}>Reset</button>
      </div>
    </div>
  )
}