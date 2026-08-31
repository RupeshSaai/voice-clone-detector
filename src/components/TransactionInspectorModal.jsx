import React from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Smartphone, 
  Cpu, 
  DollarSign, 
  AlertOctagon, 
  CheckCircle, 
  Lock, 
  Globe, 
  UserCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { FRAUD_TRANSACTION_DETAILS } from '../data/mockSecurityData';

export default function TransactionInspectorModal({ event, onClose, onFreezeAccount, onApproveTx }) {
  const details = FRAUD_TRANSACTION_DETAILS;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        border: '1px solid rgba(255, 0, 85, 0.4)',
        boxShadow: '0 0 40px rgba(255, 0, 85, 0.25)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,0,85,0.2)',
            border: '1px solid #ff0055'
          }}>
            <AlertOctagon size={28} color="#ff0055" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Fraud Forensic Inspection
              </h2>
              <span className="badge badge-critical">
                CRITICAL ANOMALY
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Transaction ID: <strong className="font-mono" style={{ color: '#00f2fe' }}>{details.txId}</strong> • Event: {event ? event.id : 'SEC-9080'}
            </p>
          </div>
        </div>

        {/* Main Grid Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          {/* Card 1: Transaction Summary */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Transaction Value
            </div>
            <div className="gradient-text-danger" style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0' }}>
              ${details.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
              Merchant: <strong>{details.merchant}</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Time: {details.timestamp}
            </div>
          </div>

          {/* Card 2: Risk Score & Decision */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AI Confidence Risk Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ff0055', margin: '4px 0' }}>
              {details.riskScore}<span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/100</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ff3377', fontWeight: 600 }}>
              Status: {details.decision}
            </div>
          </div>

          {/* Card 3: Account Holder */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target Account Holder
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
              {details.accountHolder.name}
            </div>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {details.accountHolder.email}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <span className="glass-pill" style={{ fontSize: '0.68rem', color: '#00dfa2' }}>
                <UserCheck size={12} /> KYC Tier 3 Verified
              </span>
            </div>
          </div>

        </div>

        {/* ML Risk Factor Breakdown */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'rgba(15, 23, 42, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Cpu size={18} color="#00f2fe" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              AI Threat Neural Net Breakdown
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {details.mlRiskFactors.map((rf, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #ff0055'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{rf.factor}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {rf.detail}
                  </div>
                </div>
                <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ff3377' }}>
                  {rf.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device & IP Telemetry */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'rgba(15, 23, 42, 0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Smartphone size={18} color="#7928ca" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Device & Network Telemetry
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>IP Address:</span>
              <div className="font-mono" style={{ color: '#00f2fe', fontWeight: 600 }}>{details.deviceTelemetry.ipAddress}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Location:</span>
              <div style={{ color: '#fff', fontWeight: 500 }}>{details.deviceTelemetry.location}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>IP Reputation:</span>
              <div style={{ color: '#ff0055', fontWeight: 600 }}>{details.deviceTelemetry.ipReputation}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Emulator Detected:</span>
              <div style={{ color: '#ffb703', fontWeight: 600 }}>{details.deviceTelemetry.isEmulated ? 'YES (Genymotion)' : 'NO'}</div>
            </div>
          </div>
        </div>

        {/* Action Decision Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            className="btn-cyber btn-cyber-outline"
            onClick={onClose}
          >
            DISMISS / CLOSE
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-cyber btn-cyber-outline"
              style={{ color: '#00dfa2', borderColor: 'rgba(0,223,162,0.4)' }}
              onClick={() => {
                onApproveTx(details.txId);
                onClose();
              }}
            >
              <CheckCircle size={15} />
              <span>MARK FALSE POSITIVE & APPROVE</span>
            </button>

            <button
              className="btn-cyber btn-cyber-danger"
              onClick={() => {
                onFreezeAccount(details.accountHolder.email);
                onClose();
              }}
            >
              <Lock size={15} />
              <span>FREEZE ACCOUNT & ESCALATE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
