import React from 'react';
import { 
  Zap, 
  Flame, 
  ShieldOff, 
  RefreshCw, 
  Sliders, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

export default function SimulatorControl({ 
  onTriggerAttack, 
  onResetSimulation, 
  isSimulating, 
  activeAttackType 
}) {
  const attackScenarios = [
    {
      id: 'ddos',
      name: 'Distributed Denial of Service (DDoS)',
      impact: '+4,500 req/s Botnet Surge',
      severity: 'CRITICAL',
      color: '#ff0055'
    },
    {
      id: 'ato_wave',
      name: 'Mass Credential Stuffing / ATO',
      impact: '+950 Failed Auth Probes',
      severity: 'CRITICAL',
      color: '#7928ca'
    },
    {
      id: 'bin_attack',
      name: 'Credit Card BIN Carding Wave',
      impact: '+$140k Fraud Attempted',
      severity: 'HIGH',
      color: '#ffb703'
    },
    {
      id: 'api_abuse',
      name: 'Automated PII Scraping Botnet',
      impact: '+1,200 Rate Limit Violations',
      severity: 'MEDIUM',
      color: '#00f2fe'
    }
  ];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '24px',
      border: isSimulating ? '1px solid rgba(255,0,85,0.5)' : '1px solid var(--border-glass)',
      background: isSimulating ? 'rgba(255,0,85,0.04)' : 'var(--bg-card)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={22} color={isSimulating ? '#ff0055' : '#00f2fe'} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Live Cyber Attack & Threat Stress Simulator
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Inject artificial cyber threat scenarios to evaluate dashboard reactivity, alert HUD & firewall mitigation
            </p>
          </div>
        </div>

        {isSimulating && (
          <button 
            className="btn-cyber btn-cyber-outline"
            onClick={onResetSimulation}
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={14} />
            <span>RESET TO NORMAL</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {attackScenarios.map((scenario) => {
          const isActive = isSimulating && activeAttackType === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => onTriggerAttack(scenario.id)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '16px',
                background: isActive ? 'rgba(255,0,85,0.15)' : 'rgba(15,23,42,0.7)',
                borderColor: isActive ? '#ff0055' : 'rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge ${scenario.severity === 'CRITICAL' ? 'badge-critical' : scenario.severity === 'HIGH' ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '0.65rem' }}>
                  {scenario.severity}
                </span>
                <Play size={14} color={scenario.color} />
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {scenario.name}
              </div>

              <div style={{ fontSize: '0.75rem', color: scenario.color, fontWeight: 600 }}>
                {scenario.impact}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <Flame size={12} color="var(--text-dim)" />
                <span>{isActive ? 'SIMULATION ACTIVE' : 'Click to Launch Test'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
