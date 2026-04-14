import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import {
  alphaVariantMatchingSolid,
  generateDarkScale,
  generateScale,
  materialPinnedPrimaryStep,
  neutralSolidsForMode,
} from '@/lib/color-engine';
import {
  CMS,
  PANEL_ISLAND_INSET,
  PANEL_SHELL_WIDTH,
  PLAYGROUND_HEX_KEY,
  PLAYGROUND_INPUT_KEY,
  PLAYGROUND_IS_DARK_KEY,
  PANEL_POSITION_KEY,
  SIDEBAR_WIDTH,
} from './constants';
import { getSessionBool, getSessionString, readPanelPosition } from './storage';
import { CmsCollapsibleCard, CmsNavItem } from './cms-ui';
import { MoonIcon, SunIcon } from './mode-toggle';
import { DesignAppearanceCard } from './DesignAppearanceCard';
import { DesignColorCard } from './DesignColorCard';
import { PagesTab } from './PagesTab';
import { SiteTab } from './SiteTab';

export const ThemeSidePanel: React.FC<{
  showDescription: boolean;
  setShowDescription: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
}> = ({ showDescription, setShowDescription, showDebug, setShowDebug }) => {
  const playgroundConfig = presets.playground;
  const {
    playgroundHex,
    setPlaygroundHex,
    playgroundIsDark,
    setPlaygroundIsDark,
    mode,
    toggleMode,
    colorModeSetting,
    themeRadiusTier,
    setThemeRadiusTier,
    spacingScheme,
    setSpacingScheme,
    cardLayout,
    setCardLayout,
    iconSize,
    setIconSize,
    portalBannerStyle,
    setPortalBannerStyle,
    portalBannerImage,
    setPortalBannerImage,
    bannerPaddingX,
    setBannerPaddingX,
    portalBannerHeadingColor,
    setPortalBannerHeadingColor,
    applyBrandColor,
    setApplyBrandColor,
    panelBackgroundMode,
    setPanelBackgroundMode,
  } = useTheme();

  const [inputValue, setInputValue] = useState(() =>
    getSessionString(PLAYGROUND_INPUT_KEY, playgroundHex),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeNav, setActiveNav] = useState<'design' | 'pages' | 'site'>('design');
  const [designColorOpen, setDesignColorOpen] = useState(true);
  const [designAppearanceOpen, setDesignAppearanceOpen] = useState(true);
  const [panelPos, setPanelPos] = useState(readPanelPosition);
  const shellRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const lastPanelPosRef = useRef(panelPos);
  lastPanelPosRef.current = panelPos;

  const clampPanelPos = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    const m = PANEL_ISLAND_INSET;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(PANEL_SHELL_WIDTH, vw - 2 * m);
    const h = shellRef.current?.offsetHeight ?? 420;
    return {
      x: Math.round(Math.min(Math.max(m, x), Math.max(m, vw - w - m))),
      y: Math.round(Math.min(Math.max(m, y), Math.max(m, vh - h - m))),
    };
  }, []);

  useLayoutEffect(() => {
    setPanelPos(p => clampPanelPos(p.x, p.y));
  }, [clampPanelPos]);

  useEffect(() => {
    const onResize = () => setPanelPos(p => clampPanelPos(p.x, p.y));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampPanelPos]);

  const onDragPointerMove = useCallback(
    (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const next = clampPanelPos(
        d.startX + e.clientX - d.startClientX,
        d.startY + e.clientY - d.startClientY,
      );
      lastPanelPosRef.current = next;
      setPanelPos(next);
    },
    [clampPanelPos],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onDragPointerMove);
    window.removeEventListener('pointerup', endDrag);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(lastPanelPosRef.current));
    }
  }, [onDragPointerMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onDragPointerMove);
      window.removeEventListener('pointerup', endDrag);
    };
  }, [onDragPointerMove, endDrag]);

  const onHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    e.preventDefault();
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: panelPos.x,
      startY: panelPos.y,
    };
    window.addEventListener('pointermove', onDragPointerMove);
    window.addEventListener('pointerup', endDrag);
  };

  const hex = playgroundHex;
  const isDark = playgroundIsDark;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_INPUT_KEY, inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_HEX_KEY, playgroundHex);
  }, [playgroundHex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(PLAYGROUND_IS_DARK_KEY, String(playgroundIsDark));
  }, [playgroundIsDark]);

  useEffect(() => {
    const savedHex = getSessionString(PLAYGROUND_HEX_KEY, playgroundHex);
    const savedDark = getSessionBool(PLAYGROUND_IS_DARK_KEY, playgroundIsDark);
    if (savedHex !== playgroundHex) setPlaygroundHex(savedHex);
    if (savedDark !== playgroundIsDark) setPlaygroundIsDark(savedDark);
    if (inputValue !== savedHex) setInputValue(savedHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { diagnostics, brandStep } = useMemo(() => {
    if (isDark) {
      const { diagnostics: steps } = generateDarkScale(hex);
      return { diagnostics: steps, brandStep: materialPinnedPrimaryStep(hex) };
    }
    const { diagnostics: rows } = generateScale(hex);
    return { diagnostics: rows, brandStep: materialPinnedPrimaryStep(hex) };
  }, [hex, isDark]);

  const alphaOnBg = useMemo(() => {
    if (diagnostics.length < 1) return [];
    const step1 = diagnostics[0].hex;
    const primaryPin = materialPinnedPrimaryStep(hex);
    return [3, primaryPin, 11]
      .filter(step => step <= diagnostics.length)
      .map(step => {
        const solid = diagnostics[step - 1].hex;
        return {
          step,
          a50: alphaVariantMatchingSolid(solid, step1, 0.5),
          a15: alphaVariantMatchingSolid(solid, step1, 0.15),
        };
      });
  }, [diagnostics, hex]);

  const neutralScaleHexes = neutralSolidsForMode(isDark);

  const panelBorder = '#e4e4e7';
  const panelFg = '#18181b';
  const panelMuted = '#71717a';
  const panelDrawerBg = 'rgba(250, 250, 250, 0.98)';
  const showcaseRampDivider = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';

  function handleHexInput(val: string) {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setPlaygroundHex(val);
  }

  const normalizedHex = hex.replace(/^#/, '').toLowerCase();
  const accentSelectedStep = useMemo(() => {
    const idx = diagnostics.findIndex(s => s.hex.replace(/^#/, '').toLowerCase() === normalizedHex);
    if (idx >= 0) return diagnostics[idx].step;
    return brandStep;
  }, [diagnostics, normalizedHex, brandStep]);

  if (diagnostics.length < 12) return null;

  const panelFillHeight = `max(280px, calc(100vh - ${panelPos.y + PANEL_ISLAND_INSET}px))`;

  return (
    <div
      ref={shellRef}
      style={{
        position: 'fixed',
        top: panelPos.y,
        left: panelPos.x,
        width: PANEL_SHELL_WIDTH,
        maxWidth: `calc(100vw - ${PANEL_ISLAND_INSET * 2}px)`,
        height: panelFillHeight,
        maxHeight: panelFillHeight,
        minHeight: 280,
        zIndex: 9998,
        display: 'flex',
        fontFamily: "'Inter', ui-sans-serif, sans-serif",
        borderRadius: 12,
        border: `1px solid ${CMS.border}`,
        overflow: 'hidden',
        boxShadow:
          '0 4px 6px rgba(9, 30, 66, 0.04), 0 12px 32px rgba(9, 30, 66, 0.12), 0 24px 48px rgba(9, 30, 66, 0.06)',
      }}
    >
      <nav
        aria-label="Site, Design, and Pages settings"
        style={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          background: CMS.sidebarBg,
          borderRight: `1px solid ${CMS.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '12px 0',
        }}
      >
        <CmsNavItem
          icon="public"
          label="Site"
          active={activeNav === 'site'}
          onClick={() => setActiveNav('site')}
        />
        <CmsNavItem
          icon="palette"
          label="Design"
          active={activeNav === 'design'}
          onClick={() => setActiveNav('design')}
        />
        <CmsNavItem
          icon="dashboard"
          label="Pages"
          active={activeNav === 'pages'}
          onClick={() => setActiveNav('pages')}
        />
        <div style={{ flex: 1 }} />
        <button
          type="button"
          title="Help"
          aria-label="Help"
          style={{
            alignSelf: 'center',
            width: 40,
            height: 40,
            marginBottom: 8,
            borderRadius: '50%',
            border: `1px solid ${CMS.border}`,
            background: CMS.pageBg,
            color: CMS.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            help
          </span>
        </button>
      </nav>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: CMS.pageBg,
        }}
      >
        <header
          onPointerDown={onHeaderPointerDown}
          title="Drag to move panel"
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${CMS.border}`,
            flexShrink: 0,
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 600,
              color: CMS.text,
              letterSpacing: '-0.02em',
              pointerEvents: 'none',
              flex: 1,
              minWidth: 0,
            }}
          >
            {activeNav === 'site' ? 'Site' : activeNav === 'design' ? 'Design' : 'Pages'}
          </h1>
          {activeNav === 'design' && colorModeSetting === 'light-and-dark' ? (
            <button
              type="button"
              title={mode === 'light' ? 'Switch preview to dark mode' : 'Switch preview to light mode'}
              aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => {
                e.stopPropagation();
                toggleMode();
              }}
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${CMS.border}`,
                borderRadius: 8,
                background: CMS.inputBg,
                cursor: 'pointer',
                color: CMS.text,
                padding: 0,
                pointerEvents: 'auto',
              }}
            >
              {mode === 'light' ? (
                <SunIcon muted={CMS.primary} />
              ) : (
                <MoonIcon muted={CMS.primary} />
              )}
            </button>
          ) : null}
        </header>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              gap: 12,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {activeNav === 'design' ? (
              <>
                <CmsCollapsibleCard
                  title="Color"
                  expanded={designColorOpen}
                  onToggle={() => setDesignColorOpen(o => !o)}
                >
                  <DesignColorCard
                    hex={hex}
                    isDark={isDark}
                    inputValue={inputValue}
                    handleHexInput={handleHexInput}
                    setPlaygroundHex={setPlaygroundHex}
                    setInputValue={setInputValue}
                    diagnostics={diagnostics}
                    accentSelectedStep={accentSelectedStep}
                    neutralScaleHexes={neutralScaleHexes}
                    panelBorder={panelBorder}
                    panelFg={panelFg}
                    panelMuted={panelMuted}
                    panelDrawerBg={panelDrawerBg}
                    showcaseRampDivider={showcaseRampDivider}
                  showAdvanced={showAdvanced}
                  setShowAdvanced={setShowAdvanced}
                  alphaOnBg={alphaOnBg}
                    applyBrandColor={applyBrandColor}
                    setApplyBrandColor={setApplyBrandColor}
                  />
                </CmsCollapsibleCard>
                <CmsCollapsibleCard
                  title="Appearance"
                  expanded={designAppearanceOpen}
                  onToggle={() => setDesignAppearanceOpen(o => !o)}
                >
                  <DesignAppearanceCard
                    themeRadiusTier={themeRadiusTier}
                    setThemeRadiusTier={setThemeRadiusTier}
                    spacingScheme={spacingScheme}
                    setSpacingScheme={setSpacingScheme}
                    panelBackgroundMode={panelBackgroundMode}
                    setPanelBackgroundMode={setPanelBackgroundMode}
                  />
                </CmsCollapsibleCard>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {activeNav === 'pages' && (
                  <PagesTab
                    cardLayout={cardLayout}
                    setCardLayout={setCardLayout}
                    iconSize={iconSize}
                    setIconSize={setIconSize}
                    portalBannerStyle={portalBannerStyle}
                    setPortalBannerStyle={setPortalBannerStyle}
                    portalBannerImage={portalBannerImage}
                    setPortalBannerImage={setPortalBannerImage}
                    bannerPaddingX={bannerPaddingX}
                    setBannerPaddingX={setBannerPaddingX}
                    portalBannerHeadingColor={portalBannerHeadingColor}
                    setPortalBannerHeadingColor={setPortalBannerHeadingColor}
                  />
                )}

                {activeNav === 'site' && (
                  <SiteTab
                    playgroundConfig={playgroundConfig}
                    showDescription={showDescription}
                    setShowDescription={setShowDescription}
                    showDebug={showDebug}
                    setShowDebug={setShowDebug}
                  />
                )}
              </div>
            )}
          </div>
          <div
            role="status"
            aria-live="polite"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px 14px',
              borderTop: `1px solid ${CMS.border}`,
              fontSize: 12,
              fontWeight: 500,
              color: CMS.textMuted,
              background: CMS.pageBg,
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden
              style={{ fontSize: 16, color: '#22a06b' }}
            >
              check_circle
            </span>
            Changes saved
          </div>
        </div>
      </div>
    </div>
  );
};
