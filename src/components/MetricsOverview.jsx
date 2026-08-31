import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Cpu, 
  Activity, 
  Zap, 
  Server 
} from 'lucide-react';

export default function MetricsOverview({ metrics }) {
  const getRiskColor = (score) => {
    if (score >= 80) return '#ff0055';
    if (score >= 60) return '#ffb703';
    return '#00dfa2';
  };

  const riskColor = getRiskColor(metrics.riskScore);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      
      {/* Metric 1: System Threat Risk Score */}
      <div className="glass-panel glass-panel-interactive" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Threat Index Score
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: riskColor, marginTop: '4px' }}>
              {metrics.riskScore}<span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/100</span>
            </div>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: `rgba(${metrics.riskScore >= 80 ? '255,0,85' : '0,242,254'}, 0.15)`,
            border: `1px solid ${riskColor}`
          }}>
            <ShieldAlert size={22} color={riskColor} />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${metrics.riskScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, #00dfa2 0%, #ffb703 60%, ${riskColor} 100%)`,
            boxShadow: `0 0 10px ${riskColor}`,
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Risk Level: {metrics.riskScore >= 80 ? 'CRITICAL' : metrics.riskScore >= 60 ? 'HIGH' : 'NORMAL'}</span>
          <span>Target &lt; 30</span>
        </div>
      </div>

      {/* Metric 2: Threats Blocked Today */}
      <div className="glass-panel glass-panel-interactive" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Threats Intercepted
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {metrics.threatsBlockedToday.toLocaleString()}
            </div>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid var(--primary-cyan)'
          }}>
            <ShieldCheck size={22} color="var(--primary-cyan)" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
            <TrendingUp size={14} style={{ marginRight: '2px' }} /> +14.2%
          </span>
          <span style={{ color: 'var(--text-dim)' }}>vs past 24h baseline</span>
        </div>
      </div>

      {/* Metric 3: Fraud Financial Loss Prevented */}
      <div className="glass-panel glass-panel-interactive" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Fraud Prevented (USD)
            </span>
            <div className="gradient-text-cyan" style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
              ${(metrics.fraudPreventedValue / 1000000).toFixed(2)}M
            </div>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(157, 78, 221, 0.15)',
            border: '1px solid var(--accent-purple)'
          }}>
            <DollarSign size={22} color="var(--accent-purple)" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span className="glass-pill" style={{ fontSize: '0.7rem', color: '#00dfa2', padding: '2px 8px' }}>
            99.4% AI Accuracy
          </span>
          <span style={{ color: 'var(--text-dim)' }}>Auto-frozen accounts</span>
        </div>
      </div>

      {/* Metric 4: Active Anomalies & Incident Count */}
      <div className="glass-panel glass-panel-interactive" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Anomalies
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffb703', marginTop: '4px' }}>
              {metrics.activeAnomalies}
            </div>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(255, 183, 3, 0.15)',
            border: '1px solid var(--accent-warning)'
          }}>
            <AlertTriangle size={22} color="var(--accent-warning)" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: '#ff3377', fontWeight: 600 }}>5 Critical</span>
          <span style={{ color: 'var(--text-dim)' }}>• 18 Under Investigation</span>
        </div>
      </div>

      {/* Metric 5: Firewall Uptime & Latency */}
      <div className="glass-panel glass-panel-interactive" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              System Latency
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00dfa2', marginTop: '4px' }}>
              {metrics.avgResponseMs} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>ms</span>
            </div>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(0, 223, 162, 0.15)',
            border: '1px solid var(--accent-emerald)'
          }}>
            <Server size={22} color="var(--accent-emerald)" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: '#00dfa2', fontWeight: 600 }}>{metrics.systemUptime}%</span>
          <span style={{ color: 'var(--text-dim)' }}>Uptime • 0 Dropped Packets</span>
        </div>
      </div>

    </div>
  );
}
