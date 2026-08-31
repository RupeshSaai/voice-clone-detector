export const INITIAL_METRICS = {
  riskScore: 78, // Out of 100
  defconLevel: 2, // 1: CRITICAL, 2: ELEVATED, 3: GUARDED, 4: NORMAL
  defconText: 'ELEVATED THREAT',
  threatsBlockedToday: 14829,
  fraudPreventedValue: 1248500, // in USD
  activeAnomalies: 23,
  systemUptime: 99.98,
  avgResponseMs: 14,
  botTrafficRatio: 18.4, // %
};

export const THREAT_VELOCITY_SERIES = [
  { time: '00:00', normal: 4200, botnet: 450, fraudAttempts: 32 },
  { time: '02:00', normal: 3100, botnet: 620, fraudAttempts: 45 },
  { time: '04:00', normal: 2800, botnet: 890, fraudAttempts: 68 },
  { time: '06:00', normal: 3900, botnet: 1200, fraudAttempts: 110 },
  { time: '08:00', normal: 7500, botnet: 1850, fraudAttempts: 142 },
  { time: '10:00', normal: 11200, botnet: 2400, fraudAttempts: 215 },
  { time: '12:00', normal: 14500, botnet: 3100, fraudAttempts: 340 },
  { time: '14:00', normal: 13800, botnet: 2800, fraudAttempts: 290 },
  { time: '16:00', normal: 15200, botnet: 3950, fraudAttempts: 412 },
  { time: '18:00', normal: 12900, botnet: 3300, fraudAttempts: 318 },
  { time: '20:00', normal: 9800, botnet: 2100, fraudAttempts: 195 },
  { time: '22:00', normal: 6400, botnet: 1150, fraudAttempts: 88 },
];

export const FRAUD_VECTOR_BREAKDOWN = [
  { name: 'Account Takeover (ATO)', value: 38, color: '#ff0055' },
  { name: 'Credit Card BIN Attack', value: 26, color: '#7928ca' },
  { name: 'Credential Stuffing', value: 18, color: '#00f2fe' },
  { name: 'API Exploitation', value: 12, color: '#ffb703' },
  { name: 'Synthetic Identity Theft', value: 6, color: '#00dfa2' },
];

export const GEO_ATTACK_ORIGINS = [
  { country: 'Eastern Europe', regionCode: 'EE', attacks: 42300, risk: 'HIGH', ipCount: 342, flag: '🌐' },
  { country: 'East Asia', regionCode: 'EA', attacks: 38100, risk: 'HIGH', ipCount: 298, flag: '🌐' },
  { country: 'North America', regionCode: 'NA', attacks: 19400, risk: 'MEDIUM', ipCount: 145, flag: '🌐' },
  { country: 'South America', regionCode: 'SA', attacks: 14200, risk: 'MEDIUM', ipCount: 98, flag: '🌐' },
  { country: 'South Asia', regionCode: 'SA2', attacks: 11800, risk: 'ELEVATED', ipCount: 84, flag: '🌐' },
  { country: 'Western Europe', regionCode: 'WE', attacks: 6500, risk: 'LOW', ipCount: 41, flag: '🌐' },
];

export const INITIAL_LOG_EVENTS = [
  {
    id: 'SEC-9082',
    timestamp: '11:16:42',
    ip: '194.26.29.112',
    location: 'Kyiv, Ukraine',
    eventType: 'Brute Force ATO',
    vector: 'Auth Endpoint /v1/login',
    severity: 'CRITICAL',
    score: 94,
    status: 'ACTIVE',
    details: '1,420 failed login attempts in 30 seconds using stolen credential dump #42.',
    affectedUser: 'alex.vanderberg@enterprise.io',
    device: 'MacOS / Chrome 124 (Headless Puppeteer)',
  },
  {
    id: 'SEC-9081',
    timestamp: '11:15:58',
    ip: '185.220.101.5',
    location: 'Tor Exit Node (Frankfurt)',
    eventType: 'Carding / BIN Attack',
    vector: 'Checkout Gateway API',
    severity: 'HIGH',
    score: 88,
    status: 'BLOCKED',
    details: 'Rapid micro-transactions ($0.99) tested across 60 sequential credit card numbers.',
    affectedUser: 'checkout_guest_8492',
    device: 'Linux / Python Requests Script',
  },
  {
    id: 'SEC-9080',
    timestamp: '11:14:30',
    ip: '103.152.220.18',
    location: 'Ho Chi Minh City, Vietnam',
    eventType: 'Suspicious Geo Velocity',
    vector: 'Fund Transfer ($24,500)',
    severity: 'CRITICAL',
    score: 96,
    status: 'UNDER_INVESTIGATION',
    details: 'Account login in Mumbai followed 3 mins later by high-value transfer request from Vietnam.',
    affectedUser: 'corp_treasury_lead@globalfin.com',
    device: 'Android 14 / Mobile Safari',
  },
  {
    id: 'SEC-9079',
    timestamp: '11:12:10',
    ip: '45.146.164.110',
    location: 'Moscow, Russia',
    eventType: 'API Rate Limit Breach',
    vector: '/api/v2/users/search',
    severity: 'MEDIUM',
    score: 65,
    status: 'THROTTLED',
    details: 'Automated scraping of PII data exceeding 500 requests/min threshold.',
    affectedUser: 'API Key: pk_live_99a8b7',
    device: 'Custom Bot / Go-http-client',
  },
  {
    id: 'SEC-9078',
    timestamp: '11:09:45',
    ip: '202.62.16.44',
    location: 'Jakarta, Indonesia',
    eventType: 'MFA Bypass Attempt',
    vector: 'OAuth SSO Pipeline',
    severity: 'HIGH',
    score: 82,
    status: 'BLOCKED',
    details: 'Push notification fatigue attack: 28 push prompts sent to user device in 2 minutes.',
    affectedUser: 'david.miller@techcorp.com',
    device: 'Windows 11 / Firefox 125',
  },
  {
    id: 'SEC-9077',
    timestamp: '11:05:12',
    ip: '89.248.168.140',
    location: 'Amsterdam, Netherlands',
    eventType: 'Phishing Token Replay',
    vector: 'Session Cookie Hijack',
    severity: 'CRITICAL',
    score: 91,
    status: 'ACTIVE',
    details: 'Stolen session JWT presented from unverified IP & mismatched TLS fingerprint.',
    affectedUser: 'sarah.connor@cyberdefense.org',
    device: 'Linux / Chrome Canary',
  },
  {
    id: 'SEC-9076',
    timestamp: '11:01:00',
    ip: '114.119.130.22',
    location: 'Beijing, China',
    eventType: 'SQL Injection Probe',
    vector: '/search?query=UNION+SELECT',
    severity: 'LOW',
    score: 42,
    status: 'MITIGATED',
    details: 'WAF rules blocked SQL syntax injection payload in URL parameter.',
    affectedUser: 'Anonymous Visitor',
    device: 'Sqlmap/1.7.2#stable',
  }
];

export const FRAUD_TRANSACTION_DETAILS = {
  txId: 'TX-8830194',
  amount: 48950.00,
  currency: 'USD',
  timestamp: '2026-08-31 11:14:30 UTC',
  merchant: 'Global Crypto Vault Escrow',
  riskScore: 96,
  riskCategory: 'CRITICAL FRAUD RISK',
  decision: 'FLAGGED & FROZEN',
  
  accountHolder: {
    name: 'Vikramaditya Sharma',
    email: 'v.sharma@corp-bank.in',
    accountAgeMonths: 48,
    kycStatus: 'VERIFIED_TIER_3',
    typicalMonthlySpend: 3200.00,
    primaryLocation: 'Mumbai, Maharashtra, IN'
  },
  
  deviceTelemetry: {
    ipAddress: '103.152.220.18',
    ipReputation: 'MALICIOUS_PROXY (Score 98/100)',
    isp: 'VNPT Corp Datacenter',
    location: 'Ho Chi Minh City, Vietnam (Distance: 3,920 km from usual)',
    deviceId: 'DEV-FINGERPRINT-88A92-B',
    isEmulated: true,
    vpnDetected: true,
    torDetected: false,
    operatingSystem: 'Android 14 (Emulated via Genymotion)',
    browser: 'Chrome Mobile 123.0.0.0'
  },
  
  mlRiskFactors: [
    { factor: 'Impossible Travel Velocity', impact: '+35%', detail: 'Login from Mumbai at 11:11, Transfer from Vietnam at 11:14 (Speed required: 78,400 km/h)' },
    { factor: 'Known Fraudulent Datacenter IP', impact: '+25%', detail: 'IP subnet 103.152.220.0/24 flagged in 14 recent ATO attacks' },
    { factor: 'Amount Anomaly', impact: '+20%', detail: 'Transaction is 15.3x larger than user\'s 90-day average transaction size' },
    { factor: 'Device Fingerprint Swap', impact: '+16%', detail: 'New device seen for the first time in user history' }
  ]
};
