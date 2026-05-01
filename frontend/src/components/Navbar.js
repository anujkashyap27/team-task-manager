import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const navItem = (path, label, icon) => (
    <Link to={path} style={{
      ...styles.link,
      background: location.pathname === path ? 'rgba(99,102,241,0.2)' : 'transparent',
      color: location.pathname === path ? '#818cf8' : '#94a3b8',
      borderLeft: location.pathname === path ? '3px solid #818cf8' : '3px solid transparent'
    }}>{icon} {label}</Link>
  );

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>⚡</span>
        <span style={styles.brandText}>TaskFlow</span>
      </div>
      <div style={styles.links}>
        {navItem('/dashboard', 'Dashboard', '📊')}
        {navItem('/projects', 'Projects', '📁')}
        {navItem('/tasks', 'Tasks', '✅')}
      </div>
      <div style={styles.userSection}>
        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <div style={styles.userName}>{user?.name}</div>
          <div style={styles.userRole}>{user?.role}</div>
        </div>
        <button style={styles.logout} onClick={logout}>↩</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#1e293b', width: '220px', height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', padding: '24px 0', borderRight: '1px solid #334155', zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 30px' },
  logo: { fontSize: '24px' },
  brandText: { fontSize: '20px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.5px' },
  links: { display: 'flex', flexDirection: 'column', flex: 1, gap: '4px', padding: '0 12px' },
  link: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
  userSection: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', borderTop: '1px solid #334155' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#f1f5f9' },
  userRole: { fontSize: '11px', color: '#64748b', textTransform: 'capitalize' },
  logout: { marginLeft: 'auto', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', padding: '4px' }
};
