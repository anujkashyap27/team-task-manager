import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', project_id: '', due_date: '', status: 'todo' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/tasks').then(res => setTasks(res.data));
    API.get('/projects').then(res => setProjects(res.data));
  }, []);

  const createTask = async () => {
    if (!form.title) return;
    const res = await API.post('/tasks', form);
    setTasks([...tasks, res.data]);
    setForm({ title: '', description: '', project_id: '', due_date: '', status: 'todo' });
  };

  const updateStatus = async (task, status) => {
    const res = await API.put(`/tasks/${task.id}`, { ...task, status });
    setTasks(tasks.map(t => t.id === task.id ? res.data : t));
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const statusConfig = {
    'todo': { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', label: 'Todo' },
    'in-progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'In Progress' },
    'done': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Done' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>
          <p style={styles.subtitle}>{tasks.length} total tasks</p>
        </div>
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>+ New Task</h3>
        <div style={styles.formRow}>
          <input style={styles.input} placeholder="Task title..." value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <input style={styles.input} placeholder="Description..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <select style={styles.input} value={form.project_id}
            onChange={e => setForm({ ...form, project_id: e.target.value })}>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input style={styles.input} type="date" value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })} />
          <button style={styles.btn} onClick={createTask}>Add</button>
        </div>
      </div>

      <div style={styles.filters}>
        {['all', 'todo', 'in-progress', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, background: filter === f ? '#6366f1' : '#1e293b', color: filter === f ? 'white' : '#64748b', border: `1px solid ${filter === f ? '#6366f1' : '#334155'}` }}>
            {f === 'all' ? 'All' : f === 'todo' ? 'Todo' : f === 'in-progress' ? 'In Progress' : 'Done'}
            <span style={styles.count}>{f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length}</span>
          </button>
        ))}
      </div>

      <div style={styles.taskList}>
        {filtered.map(t => (
          <div key={t.id} style={styles.taskCard}>
            <div style={{ ...styles.statusDot, background: statusConfig[t.status]?.color }} />
            <div style={styles.taskInfo}>
              <div style={styles.taskTitle}>{t.title}</div>
              {t.description && <div style={styles.taskDesc}>{t.description}</div>}
              <div style={styles.taskMeta}>
                {t.project_name && <span style={styles.metaTag}>📁 {t.project_name}</span>}
                {t.due_date && <span style={styles.metaTag}>📅 {t.due_date?.slice(0,10)}</span>}
              </div>
            </div>
            <div style={styles.taskActions}>
              <select value={t.status} onChange={e => updateStatus(t, e.target.value)}
                style={{ ...styles.statusSelect, color: statusConfig[t.status]?.color, background: statusConfig[t.status]?.bg, border: `1px solid ${statusConfig[t.status]?.color}40` }}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button style={styles.delBtn} onClick={() => deleteTask(t.id)}>🗑</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={styles.empty}>No tasks found!</div>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px', maxWidth: '1200px' },
  header: { marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  formCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
  formTitle: { color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '14px' },
  formRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '150px', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none' },
  btn: { padding: '10px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  filters: { display: 'flex', gap: '10px', marginBottom: '20px' },
  filterBtn: { padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' },
  count: { background: 'rgba(255,255,255,0.1)', padding: '1px 7px', borderRadius: '999px', fontSize: '11px' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  taskCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: '15px', fontWeight: '500', color: '#f1f5f9', marginBottom: '4px' },
  taskDesc: { fontSize: '13px', color: '#64748b', marginBottom: '6px' },
  taskMeta: { display: 'flex', gap: '10px' },
  metaTag: { fontSize: '12px', color: '#475569', background: '#0f172a', padding: '2px 8px', borderRadius: '4px' },
  taskActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusSelect: { padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', outline: 'none' },
  delBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.4 },
  empty: { textAlign: 'center', color: '#475569', padding: '40px', background: '#1e293b', borderRadius: '12px' }
};
