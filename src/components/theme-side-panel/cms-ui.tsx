import React from 'react';
import { K15tSwitchRoot } from '@/components/theme-side-panel/k15t-primitives';
import { CMS } from './constants';
import styles from './cms-ui.module.css';

/** vpt3 `config-category/ConfigCategory.tsx` shape (without form-reset behavior). */
export function ConfigCategory({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.configCategory}>
      <div className={styles.configCategoryHeader}>
        <div className={styles.configCategoryTitle}>{title}</div>
      </div>
      <div className={styles.configCategoryContent}>{children}</div>
    </section>
  );
}

export function CmsNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
    >
      <span className={styles.navItemIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.navItemLabel}>{label}</span>
    </button>
  );
}

/**
 * vpt3 `config-field`: label (`k15t-form__label` override) + optional `InfoText` hint.
 * Spacing matches `config-field.module.css` / `info-text.module.css`.
 */
export function CmsFieldLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <>
      <div className={styles.configFieldLabel}>{title}</div>
      {hint ? <div className={styles.infoText}>{hint}</div> : null}
    </>
  );
}

export const cmsInputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 32,
  height: 32,
  margin: 0,
  padding: '0 10px',
  borderRadius: 6,
  border: `1px solid ${CMS.inputBg}`,
  background: CMS.inputBg,
  color: 'var(--foreground-resting)',
  font: 'var(--font-body-default-s)',
  lineHeight: 1,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
};

export function cmsChipStyle(selected: boolean): React.CSSProperties {
  return {
    flex: 1,
    minWidth: 0,
    padding: '8px 10px',
    borderRadius: 4,
    border: `1px solid ${selected ? CMS.primary : CMS.border}`,
    background: selected ? 'rgba(12, 102, 228, 0.08)' : CMS.inputBg,
    color: selected ? 'var(--foreground-resting)' : 'var(--foreground-restrained)',
    font: 'var(--font-body-strong-xs)',
    lineHeight: 1,
    cursor: 'pointer',
    boxShadow: selected ? 'inset 0 0 0 1px rgba(12, 102, 228, 0.25)' : 'none',
    transition: 'all 0.2s ease',
  };
}

export function cmsRadioDotStyle(selected: boolean): React.CSSProperties {
  return {
    width: 14,
    height: 14,
    minWidth: 14,
    minHeight: 14,
    borderRadius: '999px',
    border: selected ? '4px solid #0C66E4' : '2px solid #8590A2',
    background: '#fff',
    transition: 'all 0.2s ease',
  };
}

/** vpt3 `config-field` checkbox type: `.control-one-line` row with label + optional info text + switch. */
export function CmsToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={styles.controlOneLine}>
      <div className={styles.labelContainer}>
        <div className={styles.configFieldLabel}>{label}</div>
        {description ? <div className={styles.infoText}>{description}</div> : null}
      </div>
      <CmsSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

export function CmsSwitch({
  checked,
  onChange,
  title,
  style,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title?: string;
  style?: React.CSSProperties;
}) {
  return (
    <K15tSwitchRoot
      title={title}
      checked={checked}
      onCheckedChange={onChange}
      style={{ flexShrink: 0, alignSelf: 'center', ...style }}
    />
  );
}

/** vpt3 form control height `2rem` + neutral field surface (`config-field` / select trigger). */
export const cmsSelectStyle: React.CSSProperties = {
  width: '100%',
  margin: 0,
  minHeight: '2rem',
  height: '2rem',
  padding: '0 2.25rem 0 0.75rem',
  borderRadius: 'var(--border-radius-s)',
  border: 'var(--border-width-s) solid var(--background-neutral-resting)',
  backgroundColor: 'var(--background-neutral-resting)',
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%235E6C84%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.625rem center',
  backgroundSize: 16,
  color: 'var(--foreground-resting)',
  font: 'var(--font-body-default-s)',
  lineHeight: 1,
  cursor: 'pointer',
  outline: 'none',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
};
