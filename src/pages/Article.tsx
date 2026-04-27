import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteHeader from '@/components/theme-preview/SiteHeader';
import SiteFooter from '@/components/theme-preview/SiteFooter';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';

const sidebarSections = [
  {
    title: 'Getting Started',
    expanded: true,
    items: ['Introduction', 'Quick Start', 'Installation', 'Configuration'],
  },
  { title: 'Core Concepts', expanded: false, items: ['Architecture', 'Data Model', 'Authentication'] },
  { title: 'Advanced', expanded: false, items: ['Performance', 'Customization', 'Migrations'] },
];

const tocItems = [
  { label: 'Introduction', children: [] },
  { label: 'What is the product?', children: ['Overview', 'Core Principles'] },
  { label: 'Key Features', children: ['Real-time Collaboration', 'Version Control'] },
  { label: 'Getting Help', children: [] },
];

const Article: React.FC = () => {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const { preset } = useTheme();
  const config = presets[preset];
  const s = config.styles;
  const decoded = decodeURIComponent(appName || config.apps[0].name);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader variant="article" appName={decoded} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          background: s.articleCanvasBackground,
          fontFamily: 'var(--K15t-font-family-body)',
        }}
      >
        {/* Left sidebar */}
        <aside
          style={{
            width: 320,
            minWidth: 320,
            borderRight: '1px solid var(--K15t-border-brand-strong)',
            padding: s.sidebarPadding,
            flexShrink: 0,
            fontSize: 'var(--K15t-font-size-sm)',
            overflow: 'auto',
          }}
        >
          {sidebarSections.map(section => (
            <div key={section.title} style={{ marginBottom: 8 }}>
              <div
                style={{
                  padding: '8px 12px 8px 24px',
                  fontWeight: 'var(--K15t-font-weight-medium)' as any,
                  color: 'var(--K15t-foreground)',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.5, lineHeight: 1 }}>
                  {section.expanded ? 'expand_more' : 'chevron_right'}
                </span>
                {section.title}
              </div>
              {section.expanded &&
                section.items.map((item, i) => (
                  <div
                    key={item}
                    style={{
                      margin: '1px 8px 1px 24px',
                      padding: '5px 12px',
                      cursor: 'pointer',
                      color: i === 0 ? s.sidebarSelectedColor : s.sidebarItemColor,
                      background: i === 0 ? s.sidebarSelectedBackground : 'transparent',
                      borderLeft: i === 0 ? s.sidebarSelectedBorder : '2px solid transparent',
                      borderRadius: 'var(--K15t-radius-small)',
                      transition: 'background 0.22s ease',
                      fontSize: 13,
                    }}
                    onMouseEnter={e => {
                      if (i !== 0)
                        (e.currentTarget as HTMLElement).style.background = s.sidebarItemHoverBackground;
                    }}
                    onMouseLeave={e => {
                      if (i !== 0) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
          ))}
        </aside>

        {/* Center wrapper for main content */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: s.contentPadding,
            maxWidth: 'var(--theme-content-width)',
            lineHeight: 'var(--theme-content-line-height)',
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              fontSize: 'var(--K15t-font-size-sm)',
              color: 'var(--K15t-foreground-subtle)',
              marginBottom: 24,
              display: 'flex',
              gap: 6,
            }}
          >
            <span
              style={{ color: 'var(--K15t-link)', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Home
            </span>
            <span>/</span>
            <span>{decoded} Home</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--K15t-font-family-headline)',
              fontSize: 'var(--K15t-font-size-2xl)',
              fontWeight: 'var(--K15t-font-weight-medium)',
              color: 'var(--theme-headline-color)',
              marginBottom: 'var(--theme-content-spacing)',
            }}
          >
            Introduction
          </h1>
          <p
            style={{
              color: 'var(--K15t-foreground-subtle)',
              fontSize: 'var(--K15t-font-size-lg)',
              marginBottom: 'calc(var(--theme-content-spacing) * 2)',
            }}
          >
            Welcome to {decoded}. This guide covers everything you need to get started with the platform,
            from initial setup to advanced configuration options.
          </p>

          <h2
            style={{
              fontFamily: 'var(--K15t-font-family-headline)',
              fontSize: 'var(--K15t-font-size-xl)',
              fontWeight: 'var(--K15t-font-weight-medium)',
              color: 'var(--theme-headline-color)',
              marginBottom: 'var(--theme-content-spacing)',
            }}
          >
            What is the product?
          </h2>
          <p style={{ marginBottom: 'var(--theme-content-spacing)' }}>
            {decoded} is a comprehensive platform designed to help teams collaborate more effectively.
            It provides a unified interface for managing documentation, tracking progress, and sharing knowledge
            across your organization.
          </p>
          <ul
            style={{
              marginBottom: 'var(--theme-content-spacing)',
              paddingLeft: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <li>Real-time collaboration with automatic conflict resolution</li>
            <li>Version control for all documentation with full audit history</li>
            <li>Customizable workflows to match your team's process</li>
            <li>Seamless integrations with popular development tools</li>
          </ul>

          <p style={{ marginBottom: 'calc(var(--theme-content-spacing) * 2)' }}>
            Whether you're a small startup or a large enterprise, {decoded} scales to meet your needs
            with flexible deployment options and enterprise-grade security features.
          </p>

          {/* Screenshot placeholder */}
          <div
            style={{
              background: 'var(--K15t-background-neutral)',
              border: '1px solid var(--K15t-border-brand-strong)',
              borderRadius: 'var(--K15t-radius-medium)',
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--theme-content-spacing)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 48, color: 'var(--K15t-foreground-subtle)', opacity: 0.4 }}
            >
              image
            </span>
          </div>
        </main>

        </div>{/* end center wrapper */}

        {/* Right sidebar — TOC (aligned to far right) */}
        <nav
          aria-label="On this Page"
          style={{
            width: 320,
            minWidth: 320,
            padding: s.tocPadding,
            flexShrink: 0,
            fontSize: 'var(--K15t-font-size-sm)',
          }}
        >
          <div
            style={{
              width: 280,
              boxSizing: 'border-box' as const,
              border: s.tocBoxBorder,
              borderRadius: 'var(--K15t-radius-medium)',
              padding: s.tocBoxPadding,
            }}
          >
          <h2
            style={{
              fontSize: 12,
              fontWeight: 'var(--K15t-font-weight-medium)' as any,
              color: 'var(--K15t-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 10px 0',
            }}
          >
            On this Page
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tocItems.map((item, i) => (
              <li key={item.label} style={{ margin: '0 0 2px 0' }}>
                <a
                  href={`#${item.label.replace(/\s+/g, '-')}`}
                  style={{
                    display: 'block',
                    padding: '4px 8px',
                    borderLeft: i === 0
                      ? s.tocSelectedBorder
                      : '2px solid transparent',
                    color: i === 0
                      ? s.tocSelectedColor
                      : s.tocItemColor,
                    fontWeight: i === 0 ? ('var(--K15t-font-weight-medium)' as any) : 'normal',
                    fontSize: 13,
                    textDecoration: 'none',
                    borderRadius: '0 var(--K15t-radius-small) var(--K15t-radius-small) 0',
                    transition: 'color 0.22s ease, background 0.22s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = s.tocItemHoverColor;
                    el.style.background = s.tocItemHoverBackground;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = i === 0 ? s.tocSelectedColor : s.tocItemColor;
                    el.style.background = 'transparent';
                  }}
                >
                  {item.label}
                </a>
                {item.children.length > 0 && (
                  <ol style={{ listStyle: 'none', padding: '0 0 0 12px', margin: '2px 0' }}>
                    {item.children.map(child => (
                      <li key={child}>
                        <a
                          href={`#${child.replace(/\s+/g, '-')}`}
                          style={{
                            display: 'block',
                            padding: '3px 8px',
                            color: s.tocItemColor,
                            fontSize: 12,
                            textDecoration: 'none',
                            borderRadius: 'var(--K15t-radius-small)',
                            transition: 'color 0.22s ease, background 0.22s ease',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = s.tocItemHoverColor;
                            el.style.background = s.tocItemHoverBackground;
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = s.tocItemColor;
                            el.style.background = 'transparent';
                          }}
                        >
                          {child}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
          </div>{/* end border wrapper */}
        </nav>
      </div>
      <SiteFooter />
    </div>
  );
};

export default Article;
