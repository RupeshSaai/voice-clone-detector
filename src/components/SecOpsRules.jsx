import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Cpu, 
  Check, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function SecOpsRules({ onRuleChange }) {
  const [rules, setRules] = useState({
    autoBlockHighRisk: true,
    torBlocker: true,
    mfaStepUp: true,
    rateLimitVal: 1200, // req/min
    aiSensitivity: 'BALANCED', // AGGRESSIVE, BALANCED, PERMISSIVE
    geoFencing: false,
  });

  const toggleRule = (key) => {
    const updated = { ...rules, [key]: !rules[key] };
    setRules(updated);
    if (onRuleChange) onRuleChange(updated);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Sliders size={22} color="#00f2fe" />
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Security Automation & AI Rule Engine Configuration
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Configure active mitigation policies, WAF thresholds & real-time botnet countermeasures
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Rule 1: Automated IP Blocking */}
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
              Auto-Block High Risk IPs
            </span>
            <button 
              onClick={() => toggleRule('autoBlockHighRisk')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: rules.autoBlockHighRisk ? '#00f2fe' : 'var(--text-dim)' }}
            >
              {rules.autoBlockHighRisk ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Instantly issue 24-hour WAF bans on IP addresses exceeding AI Risk Score of 85+.
          </p>
        </div>

        {/* Rule 2: Tor & Anonymizer Firewall */}
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
              Block Tor & Proxy Exit Nodes
            </span>
            <button 
              onClick={() => toggleRule('torBlocker')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: rules.torBlocker ? '#00f2fe' : 'var(--text-dim)' }}
            >
              {rules.torBlocker ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Automatically challenge transactions originating from known Tor relays & VPN servers.
          </p>
        </div>

        {/* Rule 3: Step-Up MFA Challenge */}
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
              Step-Up Adaptive MFA
            </span>
            <button 
              onClick={() => toggleRule('mfaStepUp')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: rules.mfaStepUp ? '#00f2fe' : 'var(--text-dim)' }}
            >
              {rules.mfaStepUp ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Trigger mandatory FIDO2 hardware / biometrics challenge on new device or location logins.
          </p>
        </div>

        {/* Rule 4: AI Model Sensitivity Selection */}
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.7)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            AI Anomaly Engine Sensitivity
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['PERMISSIVE', 'BALANCED', 'AGGRESSIVE'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  const updated = { ...rules, aiSensitivity: mode };
                  setRules(updated);
                  if (onRuleChange) onRuleChange(updated);
                }}
                style={{
                  flex: 1,
                  background: rules.aiSensitivity === mode ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.05)',
                  color: rules.aiSensitivity === mode ? '#000000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
