import React from 'react';
import {
  BookOpen,
  Cpu,
  Sparkles,
  Zap,
  CheckCircle,
  ShieldAlert,
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
          Learn how DevIllustrate AI integrates Cloudflare Workers AI FLUX.1 Schnell, prompt engineering techniques for software documentation,
          and how our parameter translation layer operates.
        </p>
      </div>

      {/* 1. Cloudflare Workers AI FLUX.1 Schnell Architecture */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="var(--accent-cyan)" />
          Cloudflare Workers AI FLUX.1 Schnell Pipeline
        </h3>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          DevIllustrate AI connects directly to Cloudflare's serverless AI infrastructure running Black Forest Labs'
          <strong> FLUX.1 Schnell</strong> model (a 12-billion parameter rectified flow diffusion transformer).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              4-Step Distilled Inference
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              FLUX.1 Schnell is distilled specifically for fast 1–8 step execution. 4 steps provide maximum visual fidelity in under 2 seconds.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-violet)', marginBottom: '4px' }}>
              Automatic Prompt Enhancement
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              The FastAPI backend automatically enriches your prompts with domain keywords (microservices, VPC subnets, Raft consensus) and stylistic guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Prompt Engineering Guidelines */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          Prompt Engineering for Technical Graphics
        </h3>

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

        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <ShieldAlert size={18} color="var(--accent-amber)" />
          <span>
            <strong>Note on Labels:</strong> While FLUX.1 Schnell possesses superior text rendering capabilities compared to older diffusion models, AI-generated images should be verified before inclusion in mission-critical architecture specifications.
          </span>
        </div>
      </section>

      {/* 3. Parameter Mapping Reference */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--accent-violet)" />
          Inference Parameter Mapping
        </h3>

        <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <li>
            <strong>Steps (1–8):</strong> FLUX.1 Schnell uses 4 steps by default. If the frontend sends values greater than 8, the backend automatically maps them to the optimal 4-step range.
          </li>
          <li>
            <strong>Seed:</strong> Deterministic seeds ensure exact reproducibility when you need identical diagrams across documentation versions.
          </li>
          <li>
            <strong>Guidance Scale:</strong> FLUX Schnell has built-in CFG guidance in its distilled weights.
          </li>
        </ul>
      </section>
    </div>
  );
};
