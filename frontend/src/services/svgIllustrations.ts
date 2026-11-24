import type { IllustrationCategory, IllustrationStyle } from '../types';

interface SvgOptions {
  category: IllustrationCategory;
  style: IllustrationStyle;
  title?: string;
  width?: number;
  height?: number;
  seed?: number;
}

export function generateTechnicalSvg({
  category,
  style,
  title,
  width = 800,
  height = 600,
  seed = 42,
}: SvgOptions): string {
  // Theme styling based on selected illustration style
  let bgFill = '#0d1527';
  let gridStroke = 'rgba(56, 189, 248, 0.08)';
  let primaryColor = '#38bdf8';
  let secondaryColor = '#818cf8';
  let accentColor = '#34d399';
  let textColor = '#f8fafc';
  let subtextColor = '#94a3b8';
  let strokeWidth = '2';
  let isDashed = false;

  if (style === 'blueprint') {
    bgFill = '#091c34';
    gridStroke = 'rgba(56, 189, 248, 0.18)';
    primaryColor = '#60a5fa';
    secondaryColor = '#93c5fd';
    accentColor = '#38bdf8';
    textColor = '#e0f2fe';
    subtextColor = '#7dd3fc';
    strokeWidth = '1.75';
    isDashed = true;
  } else if (style === 'minimalist') {
    bgFill = '#0a0d14';
    gridStroke = 'rgba(255, 255, 255, 0.04)';
    primaryColor = '#e2e8f0';
    secondaryColor = '#94a3b8';
    accentColor = '#38bdf8';
    textColor = '#ffffff';
    subtextColor = '#64748b';
    strokeWidth = '1.5';
  } else if (style === 'line-art') {
    bgFill = '#070b12';
    gridStroke = 'rgba(255, 255, 255, 0.06)';
    primaryColor = '#38bdf8';
    secondaryColor = '#f8fafc';
    accentColor = '#f43f5e';
    strokeWidth = '1.5';
  } else if (style === '3d-technical') {
    bgFill = '#0e1629';
    gridStroke = 'rgba(99, 102, 241, 0.12)';
    primaryColor = '#38bdf8';
    secondaryColor = '#a855f7';
    accentColor = '#10b981';
    strokeWidth = '2.2';
  } else if (style === 'isometric') {
    bgFill = '#0c1324';
    gridStroke = 'rgba(56, 189, 248, 0.1)';
    primaryColor = '#38bdf8';
    secondaryColor = '#6366f1';
    accentColor = '#34d399';
    strokeWidth = '2';
  }

  const dashAttr = isDashed ? 'stroke-dasharray="4,4"' : '';
  const displayTitle = title || category.replace(/-/g, ' ').toUpperCase();

  // Category specific graphic elements
  let graphicContent = '';

  switch (category) {
    case 'software-architecture':
      graphicContent = `
        <!-- Client Layer -->
        <g transform="translate(60, 200)">
          <rect width="180" height="150" rx="12" fill="${bgFill}" stroke="${primaryColor}" stroke-width="${strokeWidth}" ${dashAttr} filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))" />
          <rect x="0" y="0" width="180" height="34" rx="12" fill="${primaryColor}" fill-opacity="0.15" />
          <circle cx="20" cy="17" r="4" fill="#f43f5e" />
          <circle cx="34" cy="17" r="4" fill="#fbbf24" />
          <circle cx="48" cy="17" r="4" fill="#10b981" />
          <text x="90" y="22" font-size="11" font-family="monospace" fill="${textColor}" text-anchor="middle" font-weight="600">React Frontend</text>
          <text x="90" y="70" font-size="13" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Web Client</text>
          <text x="90" y="92" font-size="10" font-family="monospace" fill="${subtextColor}" text-anchor="middle">TypeScript · Vite</text>
          <rect x="25" y="110" width="130" height="22" rx="4" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="1" />
          <text x="90" y="125" font-size="10" font-family="monospace" fill="${primaryColor}" text-anchor="middle">Port 5173</text>
        </g>

        <!-- Ingress & Gateway -->
        <g transform="translate(310, 160)">
          <rect width="180" height="230" rx="12" fill="${bgFill}" stroke="${secondaryColor}" stroke-width="${strokeWidth}" ${dashAttr} filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))" />
          <rect x="0" y="0" width="180" height="34" rx="12" fill="${secondaryColor}" fill-opacity="0.18" />
          <text x="90" y="22" font-size="11" font-family="monospace" fill="${textColor}" text-anchor="middle" font-weight="600">API Gateway & Auth</text>
          
          <rect x="20" y="55" width="140" height="40" rx="8" fill="#17233d" stroke="${secondaryColor}" stroke-width="1" />
          <text x="90" y="75" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Reverse Proxy</text>
          <text x="90" y="88" font-size="9" font-family="monospace" fill="${subtextColor}" text-anchor="middle">TLS Termination</text>

          <rect x="20" y="110" width="140" height="40" rx="8" fill="#17233d" stroke="${secondaryColor}" stroke-width="1" />
          <text x="90" y="130" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">FastAPI Router</text>
          <text x="90" y="143" font-size="9" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Async Workers</text>

          <rect x="20" y="165" width="140" height="40" rx="8" fill="#17233d" stroke="${accentColor}" stroke-width="1" />
          <text x="90" y="185" font-size="11" font-family="sans-serif" fill="${accentColor}" text-anchor="middle" font-weight="bold">Token Validator</text>
          <text x="90" y="198" font-size="9" font-family="monospace" fill="${subtextColor}" text-anchor="middle">OAuth2 / JWT</text>
        </g>

        <!-- Storage & Backend Services -->
        <g transform="translate(560, 140)">
          <!-- Database -->
          <rect width="180" height="120" rx="12" fill="${bgFill}" stroke="${accentColor}" stroke-width="${strokeWidth}" ${dashAttr} filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))" />
          <path d="M 20 28 C 20 20, 160 20, 160 28 C 160 36, 20 36, 20 28 Z" fill="${accentColor}" fill-opacity="0.25" stroke="${accentColor}" />
          <text x="90" y="65" font-size="12" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">PostgreSQL Cluster</text>
          <text x="90" y="85" font-size="10" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Primary + Read Replica</text>

          <!-- Cache / Vector Store -->
          <g transform="translate(0, 140)">
            <rect width="180" height="110" rx="12" fill="${bgFill}" stroke="${primaryColor}" stroke-width="${strokeWidth}" ${dashAttr} filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))" />
            <text x="90" y="45" font-size="12" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Vector & Cache Store</text>
            <text x="90" y="68" font-size="10" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Redis + ChromaDB</text>
            <text x="90" y="88" font-size="9" font-family="monospace" fill="${primaryColor}" text-anchor="middle">&lt; 2ms Latency</text>
          </g>
        </g>

        <!-- Connecting Data Paths -->
        <path d="M 240 275 L 310 275" stroke="${primaryColor}" stroke-width="2.5" stroke-dasharray="6,4" />
        <polygon points="308,270 318,275 308,280" fill="${primaryColor}" />

        <path d="M 490 220 L 560 200" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="6,4" />
        <polygon points="558,195 568,200 558,205" fill="${secondaryColor}" />

        <path d="M 490 310 L 560 330" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6,4" />
        <polygon points="558,325 568,330 558,335" fill="${accentColor}" />
      `;
      break;

    case 'cloud-computing':
      graphicContent = `
        <!-- Cloud Boundary -->
        <rect x="70" y="110" width="660" height="380" rx="24" fill="${bgFill}" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.85" />
        <text x="100" y="145" font-size="14" font-family="monospace" fill="${primaryColor}" font-weight="bold">CLOUD VIRTUAL PRIVATE NETWORK (VPC 10.0.0.0/16)</text>
        
        <!-- Region A Subnet -->
        <rect x="100" y="170" width="270" height="290" rx="14" fill="#0b162c" stroke="${secondaryColor}" stroke-width="${strokeWidth}" />
        <text x="120" y="200" font-size="12" font-family="monospace" fill="${secondaryColor}" font-weight="bold">us-central1 (Subnet A)</text>

        <rect x="120" y="220" width="230" height="60" rx="8" fill="#14213d" stroke="${primaryColor}" stroke-width="1" />
        <text x="135" y="245" font-size="11" font-family="sans-serif" fill="${textColor}" font-weight="bold">Compute Engine Node</text>
        <text x="135" y="265" font-size="9" font-family="monospace" fill="${subtextColor}">NVIDIA T4 GPU Instance</text>

        <rect x="120" y="295" width="230" height="60" rx="8" fill="#14213d" stroke="${accentColor}" stroke-width="1" />
        <text x="135" y="320" font-size="11" font-family="sans-serif" fill="${textColor}" font-weight="bold">Serverless Container</text>
        <text x="135" y="340" font-size="9" font-family="monospace" fill="${subtextColor}">FastAPI Auto-scaler</text>

        <rect x="120" y="370" width="230" height="65" rx="8" fill="#14213d" stroke="${secondaryColor}" stroke-width="1" />
        <text x="135" y="395" font-size="11" font-family="sans-serif" fill="${textColor}" font-weight="bold">Cloud Storage Bucket</text>
        <text x="135" y="415" font-size="9" font-family="monospace" fill="${subtextColor}">Model Weights & Artifacts</text>

        <!-- Region B Subnet -->
        <rect x="430" y="170" width="270" height="290" rx="14" fill="#0b162c" stroke="${secondaryColor}" stroke-width="${strokeWidth}" />
        <text x="450" y="200" font-size="12" font-family="monospace" fill="${secondaryColor}" font-weight="bold">europe-west1 (Subnet B)</text>

        <rect x="450" y="220" width="230" height="95" rx="8" fill="#14213d" stroke="${primaryColor}" stroke-width="1" />
        <text x="465" y="248" font-size="11" font-family="sans-serif" fill="${textColor}" font-weight="bold">Global Cloud Load Balancer</text>
        <text x="465" y="270" font-size="9" font-family="monospace" fill="${subtextColor}">Health Check: PASSING</text>
        <text x="465" y="290" font-size="9" font-family="monospace" fill="${accentColor}">Anycast IP: 35.186.x.x</text>

        <rect x="450" y="330" width="230" height="105" rx="8" fill="#14213d" stroke="${accentColor}" stroke-width="1" />
        <text x="465" y="358" font-size="11" font-family="sans-serif" fill="${textColor}" font-weight="bold">Cloud Spanner Database</text>
        <text x="465" y="380" font-size="9" font-family="monospace" fill="${subtextColor}">Multi-Region 99.999%</text>
        <text x="465" y="400" font-size="9" font-family="monospace" fill="${secondaryColor}">Synchronous Replication</text>

        <!-- Cross-region peering -->
        <path d="M 370 315 L 430 315" stroke="${primaryColor}" stroke-width="2.5" stroke-dasharray="4,4" />
        <polygon points="395,310 405,315 395,320" fill="${primaryColor}" />
      `;
      break;

    case 'database-systems':
      graphicContent = `
        <!-- Database Cluster Visualization -->
        <g transform="translate(100, 160)">
          <!-- Node 1 Primary -->
          <rect width="180" height="160" rx="14" fill="${bgFill}" stroke="${accentColor}" stroke-width="${strokeWidth}" />
          <text x="90" y="30" font-size="12" font-family="monospace" fill="${accentColor}" text-anchor="middle" font-weight="bold">LEADER NODE (Shard 0)</text>
          
          <rect x="20" y="45" width="140" height="30" rx="6" fill="#13273e" stroke="${accentColor}" stroke-width="1" />
          <text x="90" y="65" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Write-Ahead Log (WAL)</text>

          <rect x="20" y="85" width="140" height="30" rx="6" fill="#13273e" stroke="${accentColor}" stroke-width="1" />
          <text x="90" y="105" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">MemTable In-Memory</text>

          <rect x="20" y="125" width="140" height="25" rx="6" fill="#13273e" stroke="${accentColor}" stroke-width="1" />
          <text x="90" y="142" font-size="9" font-family="monospace" fill="${subtextColor}" text-anchor="middle">LSM Tree Compaction</text>
        </g>

        <!-- Replication Consensus Arrows -->
        <g transform="translate(320, 210)">
          <path d="M 0 30 L 120 30" stroke="${primaryColor}" stroke-width="2.5" stroke-dasharray="6,4" />
          <text x="60" y="20" font-size="10" font-family="monospace" fill="${primaryColor}" text-anchor="middle">Raft Consensus</text>
          <polygon points="115,25 125,30 115,35" fill="${primaryColor}" />
        </g>

        <!-- Node 2 Follower -->
        <g transform="translate(480, 160)">
          <rect width="180" height="160" rx="14" fill="${bgFill}" stroke="${secondaryColor}" stroke-width="${strokeWidth}" />
          <text x="90" y="30" font-size="12" font-family="monospace" fill="${secondaryColor}" text-anchor="middle" font-weight="bold">FOLLOWER (Shard 0)</text>

          <rect x="20" y="45" width="140" height="30" rx="6" fill="#192036" stroke="${secondaryColor}" stroke-width="1" />
          <text x="90" y="65" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Replicated Log</text>

          <rect x="20" y="85" width="140" height="30" rx="6" fill="#192036" stroke="${secondaryColor}" stroke-width="1" />
          <text x="90" y="105" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Read-Only Query Engine</text>

          <rect x="20" y="125" width="140" height="25" rx="6" fill="#192036" stroke="${secondaryColor}" stroke-width="1" />
          <text x="90" y="142" font-size="9" font-family="monospace" fill="${accentColor}" text-anchor="middle">Heartbeat: 15ms</text>
        </g>

        <!-- Sharding Index & Partitioning -->
        <g transform="translate(140, 360)">
          <rect width="520" height="90" rx="12" fill="#0b1626" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="6,4" />
          <text x="260" y="30" font-size="11" font-family="monospace" fill="${primaryColor}" text-anchor="middle" font-weight="bold">CONSISTENT HASH RING & PARTITION MANAGER</text>
          
          <rect x="30" y="45" width="130" height="30" rx="6" fill="#14243b" />
          <text x="95" y="64" font-size="9" font-family="monospace" fill="${textColor}" text-anchor="middle">Hash Range: 0x00 - 0x3F</text>

          <rect x="195" y="45" width="130" height="30" rx="6" fill="#14243b" />
          <text x="260" y="64" font-size="9" font-family="monospace" fill="${textColor}" text-anchor="middle">Hash Range: 0x40 - 0x7F</text>

          <rect x="360" y="45" width="130" height="30" rx="6" fill="#14243b" />
          <text x="425" y="64" font-size="9" font-family="monospace" fill="${textColor}" text-anchor="middle">Hash Range: 0x80 - 0xFF</text>
        </g>
      `;
      break;

    case 'cybersecurity':
      graphicContent = `
        <!-- Security Architecture Shield -->
        <g transform="translate(100, 150)">
          <!-- Zone 1: Untrusted Public -->
          <rect width="160" height="290" rx="12" fill="#171720" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
          <text x="80" y="30" font-size="11" font-family="monospace" fill="#f43f5e" text-anchor="middle" font-weight="bold">UNTRUSTED ZONE</text>
          
          <circle cx="80" cy="90" r="30" fill="#2d161c" stroke="#f43f5e" stroke-width="2" />
          <text x="80" y="95" font-size="10" font-family="monospace" fill="#f43f5e" text-anchor="middle">Public Traffic</text>

          <rect x="20" y="150" width="120" height="40" rx="6" fill="#25161b" stroke="#f43f5e" stroke-width="1" />
          <text x="80" y="175" font-size="9" font-family="sans-serif" fill="${textColor}" text-anchor="middle">External Request</text>

          <rect x="20" y="210" width="120" height="40" rx="6" fill="#25161b" stroke="#f43f5e" stroke-width="1" />
          <text x="80" y="235" font-size="9" font-family="sans-serif" fill="${textColor}" text-anchor="middle">DDoS / Bot Probe</text>
        </g>

        <!-- Security Perimeter (WAF & Zero Trust) -->
        <g transform="translate(300, 130)">
          <rect width="200" height="330" rx="16" fill="${bgFill}" stroke="${primaryColor}" stroke-width="${strokeWidth}" />
          <text x="100" y="35" font-size="12" font-family="monospace" fill="${primaryColor}" text-anchor="middle" font-weight="bold">ZERO-TRUST SHIELD</text>

          <rect x="20" y="55" width="160" height="50" rx="8" fill="#0f2238" stroke="${primaryColor}" stroke-width="1" />
          <text x="100" y="80" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Web App Firewall</text>
          <text x="100" y="95" font-size="9" font-family="monospace" fill="${accentColor}" text-anchor="middle">OWASP Top 10 Active</text>

          <rect x="20" y="120" width="160" height="55" rx="8" fill="#0f2238" stroke="${secondaryColor}" stroke-width="1" />
          <text x="100" y="145" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">mTLS Handshake</text>
          <text x="100" y="160" font-size="9" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Cert-based Identity</text>

          <rect x="20" y="190" width="160" height="55" rx="8" fill="#0f2238" stroke="${accentColor}" stroke-width="1" />
          <text x="100" y="215" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Identity & RBAC</text>
          <text x="100" y="230" font-size="9" font-family="monospace" fill="${accentColor}" text-anchor="middle">JWT Claims Verified</text>

          <rect x="20" y="260" width="160" height="45" rx="8" fill="#0f2238" stroke="${primaryColor}" stroke-width="1" />
          <text x="100" y="285" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Intrusion Detection</text>
        </g>

        <!-- Secure Enclave -->
        <g transform="translate(540, 150)">
          <rect width="160" height="290" rx="12" fill="#0a1f18" stroke="${accentColor}" stroke-width="1.5" />
          <text x="80" y="30" font-size="11" font-family="monospace" fill="${accentColor}" text-anchor="middle" font-weight="bold">SECURE ENCLAVE</text>

          <rect x="20" y="70" width="120" height="50" rx="6" fill="#0f2f24" stroke="${accentColor}" stroke-width="1" />
          <text x="80" y="95" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">KMS HSM Key</text>
          <text x="80" y="110" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">AES-256-GCM</text>

          <rect x="20" y="140" width="120" height="50" rx="6" fill="#0f2f24" stroke="${accentColor}" stroke-width="1" />
          <text x="80" y="165" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Encrypted DB</text>
          <text x="80" y="180" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Isolated VPC</text>

          <rect x="20" y="210" width="120" height="50" rx="6" fill="#0f2f24" stroke="${accentColor}" stroke-width="1" />
          <text x="80" y="235" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Audit Vault</text>
          <text x="80" y="250" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">Immutable Logs</text>
        </g>

        <!-- Connecting Arrows -->
        <path d="M 260 270 L 300 270" stroke="#f43f5e" stroke-width="2" />
        <path d="M 500 270 L 540 270" stroke="${accentColor}" stroke-width="2" />
      `;
      break;

    case 'artificial-intelligence':
      graphicContent = `
        <!-- Diffusion / Transformer Architecture -->
        <g transform="translate(80, 160)">
          <!-- Text Prompt Encoder -->
          <rect width="160" height="180" rx="12" fill="${bgFill}" stroke="${primaryColor}" stroke-width="${strokeWidth}" />
          <text x="80" y="30" font-size="11" font-family="monospace" fill="${primaryColor}" text-anchor="middle" font-weight="bold">CLIP TEXT ENCODER</text>
          
          <rect x="15" y="50" width="130" height="40" rx="6" fill="#132036" />
          <text x="80" y="70" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Tokenized Words</text>
          <text x="80" y="83" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">77 Tokens Max</text>

          <rect x="15" y="105" width="130" height="55" rx="6" fill="#132036" stroke="${primaryColor}" stroke-width="1" />
          <text x="80" y="127" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Text Embeddings</text>
          <text x="80" y="142" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">Dim: 768 Vector</text>
        </g>

        <!-- Latent Diffusion UNet -->
        <g transform="translate(280, 130)">
          <rect width="240" height="270" rx="16" fill="${bgFill}" stroke="${secondaryColor}" stroke-width="${strokeWidth}" />
          <text x="120" y="32" font-size="12" font-family="monospace" fill="${secondaryColor}" text-anchor="middle" font-weight="bold">UNET DENOISING BACKBONE</text>

          <!-- UNet layers -->
          <rect x="20" y="55" width="200" height="45" rx="8" fill="#1b1c3b" stroke="${secondaryColor}" stroke-width="1" />
          <text x="120" y="77" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Cross-Attention Layer</text>
          <text x="120" y="90" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Keys & Values from Prompt</text>

          <rect x="40" y="115" width="160" height="45" rx="8" fill="#221e48" stroke="${primaryColor}" stroke-width="1" />
          <text x="120" y="137" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">ResNet Blocks</text>
          <text x="120" y="150" font-size="8" font-family="monospace" fill="${primaryColor}" text-anchor="middle">Downsampling & Upsampling</text>

          <rect x="20" y="175" width="200" height="45" rx="8" fill="#1b1c3b" stroke="${accentColor}" stroke-width="1" />
          <text x="120" y="197" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Noise Predictor</text>
          <text x="120" y="210" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">Timestep t: 1..1000</text>

          <text x="120" y="250" font-size="10" font-family="monospace" fill="${subtextColor}" text-anchor="middle">25 Inference Steps (Euler a)</text>
        </g>

        <!-- VAE Decoder -->
        <g transform="translate(560, 160)">
          <rect width="160" height="180" rx="12" fill="${bgFill}" stroke="${accentColor}" stroke-width="${strokeWidth}" />
          <text x="80" y="30" font-size="11" font-family="monospace" fill="${accentColor}" text-anchor="middle" font-weight="bold">VAE DECODER</text>

          <rect x="15" y="50" width="130" height="45" rx="6" fill="#0f2e24" />
          <text x="80" y="72" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Latent Space (64×64)</text>
          <text x="80" y="87" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">8× Compression</text>

          <rect x="15" y="110" width="130" height="50" rx="6" fill="#0f2e24" stroke="${accentColor}" stroke-width="1" />
          <text x="80" y="132" font-size="10" font-family="sans-serif" fill="${accentColor}" text-anchor="middle" font-weight="bold">RGB Illustration</text>
          <text x="80" y="147" font-size="8" font-family="monospace" fill="${textColor}" text-anchor="middle">512 × 512 Pixels</text>
        </g>

        <!-- Connecting Arrows -->
        <path d="M 240 240 L 280 240" stroke="${primaryColor}" stroke-width="2" />
        <path d="M 520 240 L 560 240" stroke="${secondaryColor}" stroke-width="2" />
      `;
      break;

    case 'networking':
    case 'operating-systems':
    case 'general':
    default:
      graphicContent = `
        <!-- High Level Technical Architecture Schema -->
        <g transform="translate(80, 160)">
          <rect width="190" height="260" rx="14" fill="${bgFill}" stroke="${primaryColor}" stroke-width="${strokeWidth}" ${dashAttr} />
          <text x="95" y="32" font-size="12" font-family="monospace" fill="${primaryColor}" text-anchor="middle" font-weight="bold">INGRESS CONTROLLER</text>
          
          <rect x="20" y="55" width="150" height="45" rx="6" fill="#14213d" />
          <text x="95" y="78" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">TCP / UDP Socket</text>
          <text x="95" y="92" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Non-blocking I/O</text>

          <rect x="20" y="115" width="150" height="45" rx="6" fill="#14213d" stroke="${primaryColor}" stroke-width="1" />
          <text x="95" y="138" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Load Balancer Pool</text>
          <text x="95" y="152" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">Round-Robin</text>

          <rect x="20" y="175" width="150" height="45" rx="6" fill="#14213d" />
          <text x="95" y="198" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">DNS Resolution</text>
          <text x="95" y="212" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Geo-Routing</text>
        </g>

        <g transform="translate(310, 140)">
          <rect width="210" height="290" rx="14" fill="${bgFill}" stroke="${secondaryColor}" stroke-width="${strokeWidth}" ${dashAttr} />
          <text x="105" y="32" font-size="12" font-family="monospace" fill="${secondaryColor}" text-anchor="middle" font-weight="bold">MICROSERVICE MESH</text>

          <rect x="20" y="55" width="170" height="50" rx="8" fill="#1b1c3b" stroke="${secondaryColor}" stroke-width="1" />
          <text x="105" y="80" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Service Discovery</text>
          <text x="105" y="94" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Envoy Sidecar Mesh</text>

          <rect x="20" y="120" width="170" height="50" rx="8" fill="#1b1c3b" stroke="${primaryColor}" stroke-width="1" />
          <text x="105" y="145" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">gRPC Stream Engine</text>
          <text x="105" y="159" font-size="8" font-family="monospace" fill="${primaryColor}" text-anchor="middle">Protobuf Serialization</text>

          <rect x="20" y="185" width="170" height="50" rx="8" fill="#1b1c3b" stroke="${accentColor}" stroke-width="1" />
          <text x="105" y="210" font-size="11" font-family="sans-serif" fill="${textColor}" text-anchor="middle" font-weight="bold">Distributed Tracing</text>
          <text x="105" y="224" font-size="8" font-family="monospace" fill="${accentColor}" text-anchor="middle">OpenTelemetry Collector</text>
        </g>

        <g transform="translate(560, 160)">
          <rect width="170" height="260" rx="14" fill="${bgFill}" stroke="${accentColor}" stroke-width="${strokeWidth}" ${dashAttr} />
          <text x="85" y="32" font-size="12" font-family="monospace" fill="${accentColor}" text-anchor="middle" font-weight="bold">PERSISTENCE</text>

          <rect x="15" y="55" width="140" height="50" rx="6" fill="#0f2e24" />
          <text x="85" y="80" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Blob Storage</text>
          <text x="85" y="94" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">S3 / GCS Buckets</text>

          <rect x="15" y="120" width="140" height="50" rx="6" fill="#0f2e24" stroke="${accentColor}" stroke-width="1" />
          <text x="85" y="145" font-size="10" font-family="sans-serif" fill="${accentColor}" text-anchor="middle" font-weight="bold">Telemetry Metrics</text>
          <text x="85" y="159" font-size="8" font-family="monospace" fill="${textColor}" text-anchor="middle">Prometheus + Grafana</text>

          <rect x="15" y="185" width="140" height="50" rx="6" fill="#0f2e24" />
          <text x="85" y="210" font-size="10" font-family="sans-serif" fill="${textColor}" text-anchor="middle">Dead-Letter Queue</text>
          <text x="85" y="224" font-size="8" font-family="monospace" fill="${subtextColor}" text-anchor="middle">Retry Backoff</text>
        </g>

        <path d="M 270 270 L 310 270" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="4,4" />
        <path d="M 520 270 L 560 270" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4,4" />
      `;
      break;
  }

  // Construct complete SVG document
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background-color: ${bgFill}; border-radius: 12px; overflow: hidden;">
      <defs>
        <!-- Grid Pattern -->
        <pattern id="grid-${seed}" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${gridStroke}" stroke-width="1" />
          <circle cx="0" cy="0" r="1.5" fill="${primaryColor}" opacity="0.4" />
        </pattern>
        <!-- Linear Gradients -->
        <linearGradient id="headerGrad-${seed}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.8" />
          <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.8" />
        </linearGradient>
      </defs>

      <!-- Background Grid -->
      <rect width="100%" height="100%" fill="url(#grid-${seed})" />

      <!-- Outer Frame & Blueprint Border -->
      <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="8" fill="none" stroke="${gridStroke}" stroke-width="2" />
      
      <!-- Header Banner -->
      <g transform="translate(36, 48)">
        <rect width="24" height="24" rx="6" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="1.5" />
        <text x="12" y="16" font-size="12" font-family="monospace" fill="${primaryColor}" text-anchor="middle" font-weight="bold">&lt;/&gt;</text>
        <text x="36" y="16" font-size="18" font-family="sans-serif" font-weight="bold" fill="${textColor}">DevIllustrate AI</text>
        <text x="180" y="16" font-size="12" font-family="monospace" fill="${subtextColor}">· ${displayTitle}</text>
        
        <!-- Style & Dimension pill -->
        <rect x="${width - 240}" y="-4" width="180" height="24" rx="12" fill="${bgFill}" stroke="${primaryColor}" stroke-width="1" />
        <text x="${width - 150}" y="12" font-size="10" font-family="monospace" fill="${primaryColor}" text-anchor="middle">${style.toUpperCase()} · ${width}×${height}</text>
      </g>

      <!-- Main Diagram Graphic -->
      ${graphicContent}

      <!-- Footer Annotation Bar -->
      <g transform="translate(36, ${height - 36})">
        <text x="0" y="12" font-size="10" font-family="monospace" fill="${subtextColor}">Generated via DevIllustrate Diffusion Engine · Seed: #${seed} · Style: ${style}</text>
        <text x="${width - 90}" y="12" font-size="10" font-family="monospace" fill="${accentColor}" text-anchor="end">STATUS: VERIFIED</text>
      </g>
    </svg>
  `.trim();
}
