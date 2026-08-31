import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Bell, 
  Zap, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  Radio, 
  Activity 
} from 'lucide-react';

export default function Header({ 
  metrics, 
  onSimulateClick, 
  onAuditClick, 
  searchTerm, 
  setSearchTerm,
  isSimulating
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDefconBadge = () => {
    switch (metrics.defconLevel) {
      case 1:
        return { label: 'DEFCON 1 : CRITICAL', class: 'badge-critical', dot: 'dot-red' };
      case 2:
        return { label: 'DEFCON 2 : ELEVATED', class: 'badge-high', dot: 'dot-amber' };
      case 3:
        return { label: 'DEFCON 3 : GUARDED', class: 'badge-medium', dot: 'dot-cyan' };
      default:
        return { label: 'DEFCON 4 : NORMAL', class: 'badge-low', dot: 'dot-green' };
    }
  };

  const defconInfo = getDefconBadge();

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', position: 'sticky', top: '12px', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(121,40,202,0.3))',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)'
          }}>
            <ShieldAlert size={26} color="#00f2fe" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                AEGIS<span className="gradient-text-cyan">SHIELD</span>
              </h1>
              <span className="glass-pill font-mono" style={{ fontSize: '0.7rem', color: '#00dfa2' }}>
                v4.2 SEC-AI
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Cyber Threat & AI Fraud Intelligence Operating System
            </p>
          </div>
        </div>

        {/* Live DEFCON HUD Status & Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          <div className={`badge ${defconInfo.class}`} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <span className={`dot-pulse ${defconInfo.dot}`}></span>
            <span>{defconInfo.label}</span>
          </div>

          <div className="glass-pill font-mono" style={{ gap: '8px', padding: '6px 14px' }}>
            <Radio size={14} className="gradient-text-cyan" style={{ animation: 'pulse-ring 2s infinite' }} />
            <span style={{ color: 'var(--text-muted)' }}>UTC CLOCK:</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{time}</span>
          </div>

          {/* Global Search Bar */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search IP, User, Event ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input"
              style={{ width: '100%', paddingLeft: '36px', height: '38px' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className={`btn-cyber ${isSimulating ? 'btn-cyber-danger' : ''}`}
              onClick={onSimulateClick}
              title="Launch Live Attack Simulation to test UI response"
            >
              <Zap size={16} />
              <span>{isSimulating ? 'SIMULATING...' : 'ATTACK SIMULATOR'}</span>
            </button>

            <button 
              className="btn-cyber btn-cyber-outline"
              onClick={onAuditClick}
              title="Run System Integrity & Firewall Audit"
            >
              <RefreshCw size={16} />
              <span>SYSTEM AUDIT</span>
            </button>
          </div>

          {/* User Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '12px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7928ca, #ff0055)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              SA
            </div>
            <div style={{ display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>SecOps Analyst</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Level-3 Authorization</div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
