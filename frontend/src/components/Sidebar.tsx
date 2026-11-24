import React from 'react';
import {
  LayoutDashboard,
  Wand2,
  FolderHeart,
  FileCode2,
  Settings as SettingsIcon,
  HelpCircle,
  Sparkles,
  Cpu,
  ChevronRight,
  X,
} from 'lucide-react';
import type { NavigationPage } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpen: boolean;
  onToggle: () => void;
  creationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onToggle,
  creationsCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate' as NavigationPage, label: 'Generate Illustration', icon: Wand2, isHighlight: true },
    { id: 'creations' as NavigationPage, label: 'My Creations', icon: FolderHeart, badge: creationsCount > 0 ? creationsCount : undefined },
    { id: 'templates' as NavigationPage, label: 'Templates', icon: FileCode2 },
    { id: 'settings' as NavigationPage, label: 'Settings', icon: SettingsIcon },
    { id: 'help' as NavigationPage, label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 9, 16, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            display: 'block',
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexShrink: 0,
          transition: 'transform var(--transition-normal)',
        }}
      >
        {/* Brand Logo Header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            onClick={() => onNavigate('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
              }}
            >
              <Sparkles size={20} color="#080c14" strokeWidth={2.5} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                DevIllustrate<span style={{ color: 'var(--accent-cyan)' }}> AI</span>
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Technical Graphic Engine
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            className="mobile-close-btn btn-ghost"
            onClick={onToggle}
            style={{ display: 'none', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', padding: '4px 12px 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Main Menu
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth <= 768) {
                    onToggle();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13.5px',
                  position: 'relative',
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                />
                <span style={{ flex: 1 }}>{item.label}</span>

                {item.badge !== undefined && (
                  <span
                    className="badge badge-cyan"
                    style={{ fontSize: '11px', padding: '2px 7px', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight size={14} color="var(--accent-cyan)" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Model Engine Status Card */}
        <div style={{ padding: '0 12px 14px' }}>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={13} color="var(--accent-violet)" />
                ACTIVE ENGINE
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-emerald)',
                  boxShadow: '0 0 8px var(--accent-emerald)',
                }}
              />
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Stable Diffusion v1.4
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
              Self-Hosted · NVIDIA T4 GPU
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}
          >
            DA
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Dev Architect
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              documentation@company.io
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
