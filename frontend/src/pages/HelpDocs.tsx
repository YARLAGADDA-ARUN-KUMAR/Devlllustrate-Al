import React from 'react';
import {
  BookOpen,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const HelpDocs: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '880px' }}>
      {/* Intro Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={18} color="var(--accent-cyan)" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            DevIllustrate AI Technical Guide
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Learn best practices for prompting technical documentation illustrations, configuring diffusion inference parameters,
          and understanding our planned FastAPI and GPU architecture.
        </p>
      </div>

      {/* 1. Prompt Engineering Guide */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          Prompt Engineering for Technical Graphics
        </h3>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Unlike creative artwork prompts, technical illustrations require concise architectural semantics:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} /> Recommended Pattern
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              "A modern software architecture diagram showing a React frontend communicating with a FastAPI backend and a MySQL database with Redis caching and Kafka message stream."
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-rose)', marginBottom: '8px' }}>
              Avoid Vague Descriptions
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              "Draw a cool computer app diagram with servers and cool graphics." (Lacks domain topology, protocols, and data layers).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Key Structural Keywords to Include:
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <li><strong>Nodes:</strong> Clients, API Gateways, Load Balancers, Microservices, Worker Pods, Storage Buckets.</li>
            <li><strong>Protocols:</strong> HTTPS, REST, gRPC, WebSocket, TCP/UDP, Kafka streaming.</li>
            <li><strong>Topology:</strong> VPC Subnet, Multi-region peering, DMZ, Ingress / Egress, Shard ring.</li>
          </ul>
        </div>
      </section>

      {/* 2. Diffusion Parameters Explained */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--accent-violet)" />
          Inference Parameters Explained
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              Inference Steps (10 - 50, Default: 25)
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Controls the number of denoising iterations Euler Ancestral runs over the latent Gaussian tensor.
              25 steps provide optimal clarity without diminishing returns.
            </p>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-violet)' }}>
              Guidance Scale / CFG (1.0 - 15.0, Default: 7.5)
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Classifier-Free Guidance determines how strictly the UNet adheres to your prompt tokens.
              A scale between 7.0 and 8.5 produces well-aligned technical diagrams.
            </p>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-emerald)' }}>
              Deterministic Seed
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Setting the same seed with the same prompt reproduces the exact layout and vector topology,
              essential for maintaining consistent illustration styles across documentation pages.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Future FastAPI & Stable Diffusion v1.4 Roadmap */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="var(--accent-cyan)" />
          Future FastAPI Backend Architecture
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          The backend service will be implemented using Python FastAPI, exposing a unified <code>/api/generate</code> endpoint.
          It will dispatch inference tasks to either:
        </p>

        <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>
            <strong>Hosted Diffusion API:</strong> For low-latency cloud inference without local GPU requirements.
          </li>
          <li>
            <strong>Self-Hosted Stable Diffusion v1.4:</strong> Hugging Face Diffusers + PyTorch deployed on Google Colab
            (NVIDIA T4 16GB VRAM) or local workstation (NVIDIA RTX 2050 4GB).
          </li>
        </ul>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          POST /api/generate &#123; prompt, category, style, dimensions, steps, cfg, seed &#125;
        </div>
      </section>
    </div>
  );
};
