import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import AnalyticsSection from './components/AnalyticsSection';
import LiveLogFeed from './components/LiveLogFeed';
import TransactionInspectorModal from './components/TransactionInspectorModal';
import SimulatorControl from './components/SimulatorControl';
import SecOpsRules from './components/SecOpsRules';

import { 
  INITIAL_METRICS, 
  THREAT_VELOCITY_SERIES, 
  FRAUD_VECTOR_BREAKDOWN, 
  GEO_ATTACK_ORIGINS, 
  INITIAL_LOG_EVENTS 
} from './data/mockSecurityData';

import { ShieldCheck, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [threatSeries, setThreatSeries] = useState(THREAT_VELOCITY_SERIES);
  const [fraudVectors, setFraudVectors] = useState(FRAUD_VECTOR_BREAKDOWN);
  const [geoOrigins, setGeoOrigins] = useState(GEO_ATTACK_ORIGINS);
  const [events, setEvents] = useState(INITIAL_LOG_EVENTS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeAttackType, setActiveAttackType] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Real-time tick simulation for live metrics pulse
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSimulating) {
        // Minor background jitter to feel alive
        setMetrics((prev) => ({
          ...prev,
          threatsBlockedToday: prev.threatsBlockedToday + Math.floor(Math.random() * 3),
          avgResponseMs: 12 + Math.floor(Math.random() * 5),
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Trigger Cyber Attack Simulation
  const handleTriggerAttack = (attackType) => {
    setIsSimulating(true);
    setActiveAttackType(attackType);

    if (attackType === 'ddos') {
      showNotification('CRITICAL ALERT: 4,500 req/s Layer-7 DDoS Spike Detected from Botnet Subnet!', 'danger');
      setMetrics((prev) => ({
        ...prev,
        riskScore: 94,
        defconLevel: 1,
        defconText: 'CRITICAL THREAT',
        activeAnomalies: 89,
        threatsBlockedToday: prev.threatsBlockedToday + 3400,
        botTrafficRatio: 64.2
      }));

      // Update Chart Series with huge spike
      setThreatSeries((prev) => 
        prev.map((pt, idx) => idx > 7 ? { ...pt, botnet: pt.botnet * 3.5, fraudAttempts: pt.fraudAttempts * 2.5 } : pt)
      );

      // Prepend critical DDoS event
      const ddosEvent = {
        id: `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString(),
        ip: '185.220.101.99',
        location: 'Tor Exit Node / Global Botnet',
        eventType: 'Volumetric DDoS Attack',
        vector: 'WAF Rate Limit Breach',
        severity: 'CRITICAL',
        score: 98,
        status: 'ACTIVE',
        details: 'DDoS flooding attempt exceeding 15,000 UDP packets/sec.',
        affectedUser: 'Edge Gateway Node #4',
        device: 'Mirai Botnet Variant',
      };
      setEvents((prev) => [ddosEvent, ...prev]);

    } else if (attackType === 'ato_wave') {
      showNotification('SECURITY ALERT: Credential Stuffing Wave targeting SSO OAuth API!', 'warning');
      setMetrics((prev) => ({
        ...prev,
        riskScore: 86,
        defconLevel: 2,
        defconText: 'ELEVATED THREAT',
        activeAnomalies: 45
      }));
    } else if (attackType === 'bin_attack') {
      showNotification('FINANCIAL ALERT: High-Velocity Credit Carding Attack intercepted!', 'warning');
      setMetrics((prev) => ({
        ...prev,
        fraudPreventedValue: prev.fraudPreventedValue + 145000,
        threatsBlockedToday: prev.threatsBlockedToday + 890
      }));
    }
  };

  // Reset Simulation
  const handleResetSimulation = () => {
    setIsSimulating(false);
    setActiveAttackType(null);
    setMetrics(INITIAL_METRICS);
    setThreatSeries(THREAT_VELOCITY_SERIES);
    showNotification('System Threat Level returned to Normal Baseline.', 'success');
  };

  // Quick Action Handlers
  const handleBlockIP = (ip) => {
    showNotification(`IP Address [${ip}] successfully blocked on WAF edge rules.`, 'success');
    setEvents((prev) => prev.map(e => e.ip === ip ? { ...e, status: 'BLOCKED' } : e));
  };

  const handleQuarantineUser = (user) => {
    showNotification(`User account [${user}] placed in isolation. Active sessions revoked.`, 'warning');
  };

  const handleFreezeAccount = (email) => {
    showNotification(`Account ${email} frozen & funds transfer blocked by SecOps policy.`, 'danger');
  };

  const handleApproveTx = (txId) => {
    showNotification(`Transaction ${txId} verified & cleared by Analyst override.`, 'success');
  };

  const handleAuditClick = () => {
    showNotification('Firewall audit complete: 0 vulnerabilities, 100% rule compliance.', 'success');
  };

  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh', padding: '16px 24px 40px 24px' }}>
      
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: notification.type === 'danger' ? 'rgba(255,0,85,0.95)' : notification.type === 'warning' ? 'rgba(255,183,3,0.95)' : 'rgba(0,223,162,0.95)',
          color: notification.type === 'warning' ? '#000' : '#fff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 600,
          fontSize: '0.9rem',
          animation: 'pulse-ring 1s'
        }}>
          {notification.type === 'danger' ? <AlertOctagon size={20} /> : <CheckCircle2 size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Bar HUD */}
      <Header 
        metrics={metrics}
        onSimulateClick={() => setIsSimulating(!isSimulating)}
        onAuditClick={handleAuditClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSimulating={isSimulating}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* KPI Metrics Summary */}
        <MetricsOverview metrics={metrics} />

        {/* Attack Simulator Control Panel */}
        <SimulatorControl 
          onTriggerAttack={handleTriggerAttack}
          onResetSimulation={handleResetSimulation}
          isSimulating={isSimulating}
          activeAttackType={activeAttackType}
        />

        {/* Real-time Analytics & Visualizations */}
        <AnalyticsSection 
          threatSeries={threatSeries}
          fraudVectors={fraudVectors}
          geoOrigins={geoOrigins}
          onSelectCountry={(country) => setSearchTerm(country.country)}
        />

        {/* Live Security Log Feed */}
        <LiveLogFeed 
          events={events}
          onInspectTransaction={(ev) => setSelectedEventForModal(ev)}
          onBlockIP={handleBlockIP}
          onQuarantineUser={handleQuarantineUser}
          searchTerm={searchTerm}
        />

        {/* SecOps Rule Config */}
        <SecOpsRules onRuleChange={() => showNotification('Security Rule policies updated live!', 'info')} />

      </main>

      {/* Fraud Inspector Modal Popup */}
      {selectedEventForModal && (
        <TransactionInspectorModal 
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          onFreezeAccount={handleFreezeAccount}
          onApproveTx={handleApproveTx}
        />
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        <p>AegisShield Intelligence Engine • Enterprise Cyber Security & AI Fraud Protection System</p>
      </footer>

    </div>
  );
}
