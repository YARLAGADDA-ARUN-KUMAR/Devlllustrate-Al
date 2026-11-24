import React from 'react';
import {
  Wand2,
  Sparkles,
  Layers,
  BookmarkCheck,
  TrendingUp,
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  ShieldCheck,
  BrainCircuit,
  Network,
} from 'lucide-react';
import type { IllustrationCreation, NavigationPage, PromptTemplate } from '../types';
import { CreationCard } from '../components/CreationCard';

interface DashboardProps {
  creations: IllustrationCreation[];
  templates: PromptTemplate[];
  onNavigate: (page: NavigationPage) => void;
  onUseTemplate: (template: PromptTemplate) => void;
  onDeleteCreation: (id: string) => void;
  onPreviewCreation: (creation: IllustrationCreation) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  creations,
  templates,
  onNavigate,
  onUseTemplate,
  onDeleteCreation,
  onPreviewCreation,
}) => {
  const recentCreations = creations.slice(0, 3);

  const stats = [
    {
      label: 'Total Illustrations',
      value: (142 + creations.length).toLocaleString(),
      subtext: '+18% from last month',
      icon: Layers,
      color: 'var(--accent-cyan)',
    },
    {
      label: 'Generated This Week',
      value: '28',
      subtext: 'Across 6 technical domains',
      icon: TrendingUp,
      color: 'var(--accent-emerald)',
    },
    {
      label: 'Saved Creations',
      value: creations.length.toString(),
      subtext: 'Ready for doc export',
      icon: BookmarkCheck,
      color: 'var(--accent-violet)',
    },
  ];

  const quickCategories = [
    { name: 'Software Architecture', icon: Boxes, color: 'var(--accent-cyan)' },
    { name: 'Cloud Infrastructure', icon: Cloud, color: 'var(--accent-blue)' },
    { name: 'Database Systems', icon: Database, color: 'var(--accent-emerald)' },
    { name: 'Cybersecurity', icon: ShieldCheck, color: 'var(--accent-rose)' },
    { name: 'Artificial Intelligence', icon: BrainCircuit, color: 'var(--accent-violet)' },
    { name: 'Networking & Mesh', icon: Network, color: '#38bdf8' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Hero Welcome Section */}
      <section
        className="glass-card"
        style={{
          padding: '36px 40px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid var(--border-medium)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div
            className="badge badge-cyan"
            style={{ marginBottom: '14px', fontSize: '12px', padding: '4px 10px' }}
          >
            <Sparkles size={13} />
            Next-Gen Technical Graphic Synthesis
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            Turn Technical Ideas into Visual Stories
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '24px',
            }}
          >
            Generate professional technical illustrations for your documentation using AI.
            Designed specifically for software engineers, architects, and technical writing teams.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('generate')}
              style={{ fontSize: '15px', padding: '12px 24px' }}
            >
              <Wand2 size={18} />
              Create New Illustration
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate('templates')}
              style={{ fontSize: '15px', padding: '12px 20px' }}
            >
              Browse Templates
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Summary Statistics Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {stat.label}
                </p>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    margin: '2px 0',
                  }}
                >
                  {stat.value}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Technical Domain Shortcuts */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Explore Domains
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Quickly launch generation preconfigured for standard documentation domains
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {quickCategories.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate('generate')}
                className="glass-card"
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color={domain.color} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: '1.2' }}>{domain.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Recent Creations Section */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Creations
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Sample technical graphics generated and formatted for documentation
            </p>
          </div>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => onNavigate('creations')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            View All ({creations.length})
            <ArrowRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {recentCreations.map((creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              onDelete={onDeleteCreation}
              onPreview={onPreviewCreation}
            />
          ))}
        </div>
      </section>

      {/* 5. Spotlight Templates */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Featured Prompt Templates
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Start with pre-engineered prompts tailored for technical clarity
            </p>
          </div>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => onNavigate('templates')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            All Templates ({templates.length})
            <ArrowRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {templates.slice(0, 3).map((tpl) => (
            <div
              key={tpl.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '18px',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {tpl.name}
                  </h4>
                  <span className="badge badge-cyan" style={{ marginTop: '6px', fontSize: '11px' }}>
                    {tpl.category.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {tpl.description}
              </p>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => onUseTemplate(tpl)}
                style={{ marginTop: 'auto', fontSize: '13px', width: '100%' }}
              >
                <Sparkles size={14} color="var(--accent-cyan)" />
                Use This Template
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
