import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, ShieldAlert, Globe, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';

export default function AnalyticsSection({ 
  threatSeries, 
  fraudVectors, 
  geoOrigins,
  onSelectCountry 
}) {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');

  // Custom Glass Tooltip for Area Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <p className="font-mono" style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}>
            TIMESTAMP: {label} UTC
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
            <div style={{ color: '#00f2fe', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Legitimate Traffic:</span>
              <strong className="font-mono">{payload[0]?.value?.toLocaleString()} req/s</strong>
            </div>
            <div style={{ color: '#7928ca', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Botnet Scans:</span>
              <strong className="font-mono">{payload[1]?.value?.toLocaleString()} req/s</strong>
            </div>
            <div style={{ color: '#ff0055', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span>Fraud Spikes:</span>
              <strong className="font-mono">{payload[2]?.value?.toLocaleString()} attempts</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '20px',
      marginBottom: '24px'
    }}>
      
      {/* 1. Threat Velocity & Traffic Volume Timeline (8 Columns) */}
      <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="#00f2fe" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Real-Time Threat & Traffic Velocity
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Monitored requests/sec across API gateways, firewall edge nodes & auth endpoints
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
            {['1h', '6h', '24h', '7d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                style={{
                  background: activeTimeframe === tf ? 'var(--primary-cyan)' : 'transparent',
                  color: activeTimeframe === tf ? '#000000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div style={{ width: '100%', height: '300px', marginTop: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={threatSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorBotnet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7928ca" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#7928ca" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff0055" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#ff0055" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />

              <Area type="monotone" dataKey="normal" name="Normal Traffic" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" />
              <Area type="monotone" dataKey="botnet" name="Botnet Traffic" stroke="#7928ca" strokeWidth={2} fillOpacity={1} fill="url(#colorBotnet)" />
              <Area type="monotone" dataKey="fraudAttempts" name="Fraud Attempts" stroke="#ff0055" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Footer */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', justifyContent: 'center', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#00f2fe' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Legitimate Web & Mobile</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7928ca' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Botnet & Automated Scans</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ff0055' }}></span>
            <span style={{ color: '#ff3377', fontWeight: 600 }}>Fraud & Exploit Spikes</span>
          </div>
        </div>
      </div>

      {/* 2. Fraud Vector Breakdown Donut Chart (4 Columns) */}
      <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <PieIcon size={20} color="#9d4edd" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            Fraud Vector Breakdown
          </h2>
        </div>

        <div style={{ width: '100%', height: '210px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fraudVectors}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {fraudVectors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>100%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>VECTORS</div>
          </div>
        </div>

        {/* Vector Custom Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          {fraudVectors.map((item) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
              </div>
              <strong className="font-mono" style={{ color: '#fff' }}>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Geographic Attack Origins Matrix (Full Row - 12 Columns) */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="#00dfa2" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Geographic Attack Origin Matrix & High-Risk IP Clusters
            </h2>
          </div>
          <span className="glass-pill" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Live Geo-IP BGP Routing Feed
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {geoOrigins.map((origin) => (
            <div 
              key={origin.country}
              onClick={() => onSelectCountry && onSelectCountry(origin)}
              className="glass-panel glass-panel-interactive"
              style={{ padding: '16px', borderLeft: `4px solid ${origin.risk === 'HIGH' ? '#ff0055' : origin.risk === 'ELEVATED' ? '#ffb703' : '#00f2fe'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{origin.flag}</span>
                <span className={`badge ${origin.risk === 'HIGH' ? 'badge-critical' : origin.risk === 'ELEVATED' ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '0.65rem' }}>
                  {origin.risk}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{origin.country}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Threats: <strong style={{ color: '#fff' }}>{(origin.attacks / 1000).toFixed(1)}k</strong></span>
                <span>Active IPs: <strong style={{ color: '#00f2fe' }}>{origin.ipCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
