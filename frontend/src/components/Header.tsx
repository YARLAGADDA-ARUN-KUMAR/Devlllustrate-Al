import React from 'react';
import { Menu, Wand2 } from 'lucide-react';
import type { NavigationPage } from '../types';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onToggleSidebar,
}) => {
  const getPageInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your technical illustration workspace & generation stats',
        };
      case 'generate':
        return {
          title: 'Generate Illustration',
          subtitle: 'Create documentation graphics with diffusion models & vector synthesis',
        };
      case 'creations':
        return {
          title: 'My Creations',
          subtitle: 'Library of previously synthesized technical documentation graphics',
        };
      case 'templates':
        return {
          title: 'Prompt Templates',
          subtitle: 'Ready-to-use architecture, cloud, and database illustration recipes',
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Configure inference parameters, defaults, and API endpoints',
        };
      case 'help':
        return {
          title: 'Help & Documentation',
          subtitle: 'Technical guide to prompt engineering and diffusion architecture',
        };
      default:
        return { title: 'DevIllustrate AI', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header
      style={{
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(8, 12, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          className="btn-ghost mobile-menu-btn"
          onClick={onToggleSidebar}
          style={{ display: 'none', padding: '6px' }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentPage !== 'generate' && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('generate')}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Wand2 size={15} />
            Create New Illustration
          </button>
        )}
      </div>
    </header>
  );
};
