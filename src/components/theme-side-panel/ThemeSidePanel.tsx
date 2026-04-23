import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { presets } from '@/lib/presets';
import {
  alphaVariantMatchingSolid,
  generateDarkScale,
  generateScale,
  neutralSolidsForMode,
} from '@/lib/color-engine';
import {
  PLAYGROUND_HEX_KEY,
  PLAYGROUND_INPUT_KEY,
  PLAYGROUND_IS_DARK_KEY,
} from './constants';
import { getSessionBool, getSessionString } from './storage';
import { ConfigCategory } from './cms-ui';
import shellStyles from './cms-ui.module.css';
import { DesignAppearanceCard } from './brand/DesignAppearanceCard';
import { DesignColorCard } from './brand/DesignColorCard';
import { PagesTab } from './pages/PagesTab';
import { SiteTab } from './site/SiteTab';
import { LevelNavigation } from './level-navigation';
import levelNavStyles from './level-navigation/level-navigation.module.css';
import topLogoIcon from '@/assets/sidebar-icons/top-logo.png';
import sectionsNavIcon from '@/assets/sidebar-icons/sections.png';

type ActiveNav = 'site' | 'design' | 'pages';

const navItems: Array<{
  id: 'site' | 'brand' | 'fonts' | 'sections' | 'pages' | 'cookies' | 'integrations' | 'code';
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'site', label: 'Site', icon: <span className="material-symbols-outlined">web_asset</span> },
  { id: 'brand', label: 'Brand', icon: <span className="material-symbols-outlined">design_services</span> },
  { id: 'fonts', label: 'Fonts', icon: <span className="material-symbols-outlined">text_fields</span> },
  {
    id: 'sections',
    label: 'Sections',
    icon: <img src={sectionsNavIcon} alt="" className={levelNavStyles['navigation-icon-image']} />,
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: <span className="material-symbols-outlined">table_chart</span>,
  },
  { id: 'cookies', label: 'Cookies', icon: <span className="material-symbols-outlined">cookie</span> },
  { id: 'integrations', label: 'Integrations', icon: <span className="material-symbols-outlined">deployed_code</span> },
  { id: 'code', label: 'Code', icon: <span className="material-symbols-outlined">code</span> },
];

export const ThemeSidePanel: React.FC = () => {
  const [activeNav, setActiveNav] = useState<ActiveNav>('design');

  const handleNavItemClick = (id: typeof navItems[number]['id']) => {
    if (id === 'site') setActiveNav('site');
    else if (id === 'brand') setActiveNav('design');
    else if (id === 'pages') setActiveNav('pages');
    else setActiveNav('design');
  };

  const playgroundConfig = presets.playground;
  const {
    playgroundHex,
    setPlaygroundHex,
    playgroundIsDark,
    setPlaygroundIsDark,
    colorModeSetting,
    setColorModeSetting,
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
    colorCoverage,
    setColorCoverage,
    panelBackgroundMode,
    setPanelBackgroundMode,
    advancedColorPanelEnabled,
    showDescription,
    setShowDescription,
    showDebug,
    setShowDebug,
  } = useTheme();

  const [inputValue, setInputValue] = useState(() =>
    getSessionString(PLAYGROUND_INPUT_KEY, playgroundHex),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  useEffect(() => {
    if (!advancedColorPanelEnabled) setShowAdvanced(false);
  }, [advancedColorPanelEnabled]);

  const hex = playgroundHex;
  const isDark = playgroundIsDark;
  const currentSnapshot = useMemo(
    () => ({
      playgroundHex,
      playgroundIsDark,
      colorModeSetting,
      themeRadiusTier,
      spacingScheme,
      cardLayout,
      iconSize,
      portalBannerStyle,
      portalBannerImage,
      bannerPaddingX,
      colorCoverage,
      panelBackgroundMode,
      showDescription,
      showDebug,
    }),
    [
      playgroundHex,
      playgroundIsDark,
      colorModeSetting,
      themeRadiusTier,
      spacingScheme,
      cardLayout,
      iconSize,
      portalBannerStyle,
      portalBannerImage,
      bannerPaddingX,
      colorCoverage,
      panelBackgroundMode,
      showDescription,
      showDebug,
    ],
  );
  const [savedSnapshot, setSavedSnapshot] = useState(currentSnapshot);

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
      return { diagnostics: steps, brandStep: 9 };
    }
    const { diagnostics: rows } = generateScale(hex);
    return { diagnostics: rows, brandStep: 9 };
  }, [hex, isDark]);

  const alphaOnBg = useMemo(() => {
    if (diagnostics.length < 1) return [];
    const step1 = diagnostics[0].hex;
    return [3, 9, 11]
      .filter(step => step <= diagnostics.length)
      .map(step => {
        const solid = diagnostics[step - 1].hex;
        return {
          step,
          a50: alphaVariantMatchingSolid(solid, step1, 0.5),
          a15: alphaVariantMatchingSolid(solid, step1, 0.15),
        };
      });
  }, [diagnostics]);

  const neutralScaleHexes = neutralSolidsForMode(isDark);
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(currentSnapshot) !== JSON.stringify(savedSnapshot),
    [currentSnapshot, savedSnapshot],
  );

  const applySnapshot = (snapshot: typeof currentSnapshot) => {
    setPlaygroundHex(snapshot.playgroundHex);
    setInputValue(snapshot.playgroundHex);
    setPlaygroundIsDark(snapshot.playgroundIsDark);
    setColorModeSetting(snapshot.colorModeSetting);
    setThemeRadiusTier(snapshot.themeRadiusTier);
    setSpacingScheme(snapshot.spacingScheme);
    setCardLayout(snapshot.cardLayout);
    setIconSize(snapshot.iconSize);
    setPortalBannerStyle(snapshot.portalBannerStyle);
    setPortalBannerImage(snapshot.portalBannerImage);
    setBannerPaddingX(snapshot.bannerPaddingX);
    setColorCoverage(snapshot.colorCoverage);
    setPanelBackgroundMode(snapshot.panelBackgroundMode);
    setShowDescription(snapshot.showDescription);
    setShowDebug(snapshot.showDebug);
  };

  const panelBorder = '#e4e4e7';
  const panelFg = '#18181b';
  const panelMuted = '#71717a';
  const panelDrawerBg = 'rgba(250, 250, 250, 0.98)';

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

  const secondLevelContent = (
    <>
      <h1 className={shellStyles.levelHeadline}>
        {activeNav === 'site' ? 'Site' : activeNav === 'design' ? 'Brand' : 'Pages'}
      </h1>

      {activeNav === 'design' && (
        <>
          <ConfigCategory title="Color">
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
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              alphaOnBg={alphaOnBg}
              colorCoverage={colorCoverage}
              setColorCoverage={setColorCoverage}
            />
          </ConfigCategory>
          <ConfigCategory title="Appearance">
            <DesignAppearanceCard
              themeRadiusTier={themeRadiusTier}
              setThemeRadiusTier={setThemeRadiusTier}
              spacingScheme={spacingScheme}
              setSpacingScheme={setSpacingScheme}
              panelBackgroundMode={panelBackgroundMode}
              setPanelBackgroundMode={setPanelBackgroundMode}
            />
          </ConfigCategory>
        </>
      )}

      {activeNav === 'pages' && (
        <PagesTab
          cardLayout={cardLayout}
          setCardLayout={setCardLayout}
          iconSize={iconSize}
          setIconSize={setIconSize}
          setPortalBannerStyle={setPortalBannerStyle}
          portalBannerImage={portalBannerImage}
          setPortalBannerImage={setPortalBannerImage}
          bannerPaddingX={bannerPaddingX}
          setBannerPaddingX={setBannerPaddingX}
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
    </>
  );

  return (
    <LevelNavigation.Root
      activeSecondLevel={secondLevelContent}
      canSave={hasUnsavedChanges}
      onClose={() => {}}
      onSave={() => setSavedSnapshot(currentSnapshot)}
      onDiscard={() => applySnapshot(savedSnapshot)}
    >
      <img
        src={topLogoIcon}
        alt=""
        aria-hidden
        style={{ width: 32, height: 32, display: 'block', margin: '16px auto 8px' }}
      />
      <LevelNavigation.Items>
        {navItems.map(item => {
          const active =
            (item.id === 'site' && activeNav === 'site') ||
            (item.id === 'brand' && activeNav === 'design') ||
            (item.id === 'pages' && activeNav === 'pages');
          return (
            <LevelNavigation.Item
              key={item.id}
              icon={item.icon}
              active={active}
              onClick={() => handleNavItemClick(item.id)}
            >
              {item.label}
            </LevelNavigation.Item>
          );
        })}
      </LevelNavigation.Items>
    </LevelNavigation.Root>
  );
};
