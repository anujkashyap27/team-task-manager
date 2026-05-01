import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { API.get('/projects').then(res => setProjects(res.data)); }, []);

  const createProject = async () => {
    if (!form.name) return;
    setLoading(true);
    const res = await API.post('/projects', form);
    setProjects([...projects, res.data]);
    setForm({ name: '', description: '' });
    setLoading(false);
  };

  const deleteProject = async (id) => {
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter(p => p.id !== id));
  };

  const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>{projects.length} active projects</p>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>+ New Project</h3>
          <div style={styles.formRow}>
            <input style={styles.input} placeholder="Project name..." value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Description..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <button style={styles.btn} onClick={createProject} disabled={loading}>
              {loading ? '...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {projects.map((p, i) => (
          <div key={p.id} style={{ ...styles.card, borderTop: `3px solid ${colors[i % colors.length]}` }}>
            <div style={styles.cardTop}>
              <div style={{ ...styles.projectIcon, background: colors[i % colors.length] + '20', color: colors[i % colors.length] }}>
                {p.name.charAt(0).toUpperCase()}
              </div>
              {user?.role === 'admin' && (
                <button style={styles.delBtn} onClick={() => deleteProject(p.id)}>🗑</button>
              )}
            </div>
            <h3 style={styles.projectName}>{p.name}</h3>
            <p style={styles.projectDesc}>{p.description || 'No description'}</p>
            <div style={styles.cardFooter}>
              <span style={styles.dateText}>📅 {new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <div style={styles.empty}><p>No projects yet. Create one above!</p></div>}
    </div>
  );
}

const styles = {
  container: { padding: '32px', maxWidth: '1200px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  formCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '28px' },
  formTitle: { color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '14px' },
  formRow: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', outline: 'none' },
  btn: { padding: '10px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  projectIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px' },
  delBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.5 },
  projectName: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' },
  projectDesc: { fontSize: '13px', color: '#64748b', marginBottom: '16px' },
  cardFooter: { borderTop: '1px solid #334155', paddingTop: '12px' },
  dateText: { fontSize: '12px', color: '#475569' },
  empty: { textAlign: 'center', color: '#475569', padding: '60px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }
};
