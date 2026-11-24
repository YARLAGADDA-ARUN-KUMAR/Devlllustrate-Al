import React from 'react';
import {
  Boxes,
  Cloud,
  Database,
  ShieldCheck,
  BrainCircuit,
  Network,
  Cpu,
  Layers,
} from 'lucide-react';
import type { IllustrationCategory } from '../types';

interface CategorySelectorProps {
  selected: IllustrationCategory;
  onSelect: (category: IllustrationCategory) => void;
  disabled?: boolean;
}

interface CategoryOption {
  id: IllustrationCategory;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'software-architecture', label: 'Software Architecture', icon: Boxes, color: 'var(--accent-cyan)' },
  { id: 'cloud-computing', label: 'Cloud Computing', icon: Cloud, color: 'var(--accent-blue)' },
  { id: 'database-systems', label: 'Database Systems', icon: Database, color: 'var(--accent-emerald)' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck, color: 'var(--accent-rose)' },
  { id: 'artificial-intelligence', label: 'Artificial Intelligence', icon: BrainCircuit, color: 'var(--accent-violet)' },
  { id: 'networking', label: 'Networking', icon: Network, color: '#38bdf8' },
  { id: 'operating-systems', label: 'Operating Systems', icon: Cpu, color: 'var(--accent-amber)' },
  { id: 'general', label: 'General Technical', icon: Layers, color: 'var(--text-secondary)' },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Illustration Category
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Select the technical domain to tune icon sets, layouts, and component abstractions.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '10px',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              disabled={disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.2)' : 'none',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={isSelected ? 'var(--accent-cyan)' : cat.color} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500, lineHeight: 1.2 }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
