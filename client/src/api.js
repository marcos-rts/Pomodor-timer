const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
async function request(path, opts={}){
  const res = await fetch(`${BASE}${path}`, { headers: {'Content-Type':'application/json'}, ...opts});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
export const api = {
  getTasks: ()=> request('/tasks'),
  createTask: (t)=> request('/tasks', { method: 'POST', body: JSON.stringify(t)}),
  updateTask: (id,t)=> request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(t)}),
  deleteTask: (id)=> request(`/tasks/${id}`, { method: 'DELETE'}),
  getSessions: ()=> request('/sessions'),
  createSession: (s)=> request('/sessions', { method: 'POST', body: JSON.stringify(s)}),
  getGoals: ()=> request('/goals'),
  createGoal: (g)=> request('/goals', { method: 'POST', body: JSON.stringify(g)}),
  getSettings: ()=> request('/settings'),
  saveSettings: (s)=> request('/settings', { method: 'POST', body: JSON.stringify(s)})
}