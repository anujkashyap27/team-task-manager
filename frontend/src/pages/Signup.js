import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await API.post('/auth/signup', form);
      navigate('/login');
    } catch {
      setError('Email already exists');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ TaskFlow</div>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.sub}>Start managing your team today</p>
        {error && <div style={styles.error}>{error}</div>}
        <label style={styles.label}>Full Name</label>
        <input style={styles.input} placeholder="John Doe" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <label style={styles.label}>Email</label>
        <input style={styles.input} placeholder="you@example.com" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" placeholder="••••••••" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <label style={styles.label}>Role</label>
        <select style={styles.input} value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Account →'}
        </button>
        <p style={styles.link}>Have account? <Link to="/login" style={{ color: '#818cf8' }}>Sign in</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  card: { width: '400px', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px' },
  logo: { fontSize: '20px', fontWeight: '700', color: '#818cf8', marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' },
  sub: { color: '#64748b', marginBottom: '24px', fontSize: '14px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '14px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginBottom: '16px' },
  link: { textAlign: 'center', color: '#475569', fontSize: '14px' }
};
