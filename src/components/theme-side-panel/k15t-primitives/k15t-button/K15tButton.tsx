import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type MouseEventHandler,
} from 'react';
import { cn } from '@/lib/utils';
import spinnerStyles from '../k15t-spinner/k15t-spinner.module.css';
import ghostBrandStyles from './k15t-button-ghost-brand.module.css';
import styles from './k15t-button.module.css';

export type K15tButtonAppearance =
  | 'primary'
  | 'secondary'
  | 'secondary-strong'
  | 'danger'
  | 'danger-subtle'
  | 'tip'
  | 'tip-subtle'
  | 'link'
  | 'link-subtle'
  | 'link-source-subtle'
  | 'link-source'
  | 'warning';

export type K15tButtonSize = 'xs' | 's' | 'm' | 'l';

export type K15tButtonProps = {
  appearance?: K15tButtonAppearance;
  /** “Browse presets” outline — local variant on top of secondary sizing. */
  variant?: 'default' | 'ghost-brand';
  size?: K15tButtonSize;
  isCircle?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  shouldIncreaseIconSize?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  tabIndex?: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const loadingSpinner = (
  <svg aria-hidden className="k15t-button__spinner" viewBox="0 0 50 32" xmlns="http://www.w3.org/2000/svg">
    <circle className={spinnerStyles.animationCircle} cx="6" cy="6" r="6" />
    <circle className={spinnerStyles.animationCircle} cx="25" cy="6" r="6" />
    <circle className={spinnerStyles.animationCircle} cx="44" cy="6" r="6" />
  </svg>
);

export function K15tButton({
  appearance,
  variant = 'default',
  size,
  isCircle,
  isDisabled,
  isLoading,
  shouldIncreaseIconSize,
  type = 'button',
  tabIndex,
  children,
  className,
  ...props
}: K15tButtonProps) {
  const classes = cn(
    'k15t-button',
    styles.button,
    variant === 'ghost-brand' && ghostBrandStyles.ghostBrand,
    {
      [styles.buttonXs]: size === 'xs',
      [styles.buttonS]: size === 's',
      [styles.buttonM]: size === 'm',
      [styles.buttonL]: size === 'l',
      [styles.buttonPrimary]: appearance === 'primary',
      [styles.buttonSecondaryStrong]: appearance === 'secondary-strong',
      [styles.buttonDanger]: appearance === 'danger',
      [styles.buttonDangerSubtle]: appearance === 'danger-subtle',
      [styles.buttonTip]: appearance === 'tip',
      [styles.buttonTipSubtle]: appearance === 'tip-subtle',
      [styles.buttonLink]: appearance === 'link' || appearance === 'link-subtle',
      [styles.buttonLinkSubtle]: appearance === 'link-subtle',
      [styles.buttonLinkSource]: appearance === 'link-source' || appearance === 'link-source-subtle',
      [styles.buttonLinkSourceSubtle]: appearance === 'link-source-subtle',
      [styles.buttonWarning]: appearance === 'warning',
      [styles.buttonCircle]: isCircle,
      [styles.buttonLoading]: isLoading,
      [styles.buttonIncreaseIconSize]: shouldIncreaseIconSize,
    },
    className,
  );

  if (isLoading && appearance !== 'link' && appearance !== 'link-subtle') {
    return (
      <button type={type} disabled className={classes} tabIndex={tabIndex} {...props}>
        {children}
        {loadingSpinner}
      </button>
    );
  }

  if (isDisabled && appearance !== 'link' && appearance !== 'link-subtle') {
    return (
      <button type={type} disabled className={classes} tabIndex={tabIndex} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      tabIndex={tabIndex}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}
