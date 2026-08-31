import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  Play, 
  Pause, 
  Ban, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Terminal,
  UserX,
  Radio
} from 'lucide-react';

export default function LiveLogFeed({ 
  events, 
  onInspectTransaction, 
  onBlockIP, 
  onQuarantineUser, 
  onResolveEvent,
  searchTerm
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Filter logic
  const filteredEvents = events.filter((ev) => {
    const matchesSeverity = filterSeverity === 'ALL' || ev.severity === filterSeverity;
    const matchesSearch = !searchTerm || 
      ev.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.affectedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={22} color="#00f2fe" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Live Security Event & Incident Stream
            </h2>
            {isLiveStreaming && (
              <span className="glass-pill" style={{ color: '#00dfa2', border: '1px solid rgba(0,223,162,0.3)', padding: '2px 8px' }}>
                <span className="dot-pulse dot-green"></span> STREAMING LIVE
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Real-time SIEM event logs, AI anomaly flags & automated firewall responses
          </p>
        </div>

        {/* Severity Filter Tabs & Pause/Play toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                style={{
                  background: filterSeverity === sev ? (
                    sev === 'CRITICAL' ? 'rgba(255,0,85,0.3)' :
                    sev === 'HIGH' ? 'rgba(255,183,3,0.3)' :
                    sev === 'MEDIUM' ? 'rgba(0,242,254,0.3)' : 'rgba(255,255,255,0.15)'
                  ) : 'transparent',
                  color: filterSeverity === sev ? '#ffffff' : 'var(--text-muted)',
                  border: filterSeverity === sev ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            className="btn-cyber btn-cyber-outline"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            {isLiveStreaming ? <Pause size={14} /> : <Play size={14} />}
            <span>{isLiveStreaming ? 'PAUSE FEED' : 'RESUME FEED'}</span>
          </button>
        </div>
      </div>

      {/* Log Feed Table */}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.9)', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px 16px' }}>TIME / ID</th>
              <th style={{ padding: '12px 16px' }}>SEVERITY</th>
              <th style={{ padding: '12px 16px' }}>EVENT TYPE & VECTOR</th>
              <th style={{ padding: '12px 16px' }}>SOURCE IP & LOCATION</th>
              <th style={{ padding: '12px 16px' }}>AFFECTED TARGET</th>
              <th style={{ padding: '12px 16px' }}>AI RISK SCORE</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>QUICK ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)' }}>
                  No security events match the active search filter.
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => (
                <tr 
                  key={ev.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: ev.severity === 'CRITICAL' ? 'rgba(255,0,85,0.03)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = ev.severity === 'CRITICAL' ? 'rgba(255,0,85,0.03)' : 'transparent'}
                >
                  {/* Time & ID */}
                  <td style={{ padding: '12px 16px' }}>
                    <div className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{ev.timestamp}</div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{ev.id}</div>
                  </td>

                  {/* Severity Badge */}
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${getSeverityBadgeClass(ev.severity)}`}>
                      {ev.severity}
                    </span>
                  </td>

                  {/* Event Type & Vector */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#ffffff', fontWeight: 600 }}>{ev.eventType}</div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: '#00f2fe' }}>{ev.vector}</div>
                  </td>

                  {/* IP & Location */}
                  <td style={{ padding: '12px 16px' }}>
                    <div className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{ev.ip}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ev.location}</div>
                  </td>

                  {/* Affected User / Target */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.8rem' }}>{ev.affectedUser}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{ev.device}</div>
                  </td>

                  {/* Risk Score */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ 
                        fontWeight: 700, 
                        color: ev.score >= 90 ? '#ff0055' : ev.score >= 75 ? '#ffb703' : '#00dfa2' 
                      }}>
                        {ev.score}/100
                      </span>
                      <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${ev.score}%`, 
                          height: '100%', 
                          background: ev.score >= 90 ? '#ff0055' : ev.score >= 75 ? '#ffb703' : '#00dfa2' 
                        }}></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      
                      <button
                        className="btn-cyber btn-cyber-outline"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => onInspectTransaction(ev)}
                        title="Open Deep Fraud Inspection Modal"
                      >
                        <Eye size={13} />
                        <span>INSPECT</span>
                      </button>

                      <button
                        className="btn-cyber btn-cyber-danger"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => onBlockIP(ev.ip)}
                        title="Instantly block IP on WAF / Firewall"
                      >
                        <Ban size={13} />
                        <span>BLOCK IP</span>
                      </button>

                      <button
                        className="btn-cyber btn-cyber-outline"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => onQuarantineUser(ev.affectedUser)}
                        title="Quarantine User Account & Suspend Sessions"
                      >
                        <UserX size={13} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
