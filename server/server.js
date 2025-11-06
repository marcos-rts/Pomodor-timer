const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helpers
const run = (sql, params=[]) => db.prepare(sql).run(...params);
const all = (sql, params=[]) => db.prepare(sql).all(...params);
const get = (sql, params=[]) => db.prepare(sql).get(...params);

// Tasks
app.get('/api/tasks', (req, res) => {
  const rows = all('SELECT * FROM tasks ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, estimate_minutes } = req.body;
  const info = run('INSERT INTO tasks (title,description,estimate_minutes) VALUES (?,?,?)', [title, description||'', estimate_minutes||25]);
  res.json({ id: info.lastInsertRowid });
});

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, estimate_minutes } = req.body;
  run('UPDATE tasks SET title=?,description=?,estimate_minutes=? WHERE id=?', [title, description||'', estimate_minutes||25, id]);
  res.json({ ok: true });
});

app.delete('/api/tasks/:id', (req, res) => {
  run('DELETE FROM tasks WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

// Goals
app.get('/api/goals', (req, res) => res.json(all('SELECT * FROM goals ORDER BY created_at DESC')));
app.post('/api/goals', (req, res) => {
  const { title, description, target } = req.body;
  const info = run('INSERT INTO goals (title,description,target) VALUES (?,?,?)', [title,description||'', target||1]);
  res.json({ id: info.lastInsertRowid });
});
app.put('/api/goals/:id', (req,res)=>{
  const { title, description, target, progress } = req.body;
  run('UPDATE goals SET title=?,description=?,target=?,progress=? WHERE id=?', [title,description||'', target||1, progress||0, req.params.id]);
  res.json({ ok:true });
});

// Sessions (history)
app.post('/api/sessions', (req, res) => {
  const { task_id, duration_minutes, type } = req.body;
  const info = run('INSERT INTO sessions (task_id,duration_minutes,type) VALUES (?,?,?)', [task_id||null, duration_minutes, type]);
  if (task_id) {
    run('UPDATE tasks SET completed_count = completed_count + 1 WHERE id=?', [task_id]);
    // also increment goals progress heuristically (e.g., first goal)
  }
  res.json({ id: info.lastInsertRowid });
});

app.get('/api/sessions', (req,res)=>{
  const rows = all('SELECT s.*, t.title as task_title FROM sessions s LEFT JOIN tasks t ON t.id = s.task_id ORDER BY completed_at DESC LIMIT 500');
  res.json(rows);
});

// Settings
app.get('/api/settings', (req,res)=>{
  const rows = all('SELECT key, value FROM settings');
  const out = {};
  rows.forEach(r=> out[r.key]=r.value);
  res.json(out);
});
app.post('/api/settings', (req,res)=>{
  const entries = req.body; // {key: value}
  const insert = db.prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)');
  const tx = db.transaction((items)=>{
    for(const k in items) insert.run(k, String(items[k]));
  });
  tx(entries);
  res.json({ ok:true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));