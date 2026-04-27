import type { RadioGroupItemProps } from '@radix-ui/react-radio-group';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { type ReactNode, type RefAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './k15t-radio-group.module.css';
import themeConfiguratorRadio from './k15t-theme-configurator-radio.module.css';

export type K15tRadioGroupItemProps = {
  label: ReactNode;
  /**
   * `themeConfigurator` — same classes as vpt3 `RadioItem` (`radio-group.module.css` on `K15tRadioGroup.Item`).
   * `primitive` — base `k15t-radio-group.module.css` only (wider gap / larger label token).
   */
  variant?: 'themeConfigurator' | 'primitive';
} & RadioGroupItemProps &
  RefAttributes<HTMLButtonElement>;

export function K15tRadioGroupItem({
  label,
  className,
  variant = 'themeConfigurator',
  ...props
}: K15tRadioGroupItemProps) {
  return (
    <RadixRadioGroup.Item
      className={cn(
        'k15t-radio-group__item',
        styles.item,
        variant === 'themeConfigurator' && themeConfiguratorRadio.thumbnailRadioItem,
        className,
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator forceMount className={cn('k15t-radio-group__dot', styles.dot)} />
      <div className={cn('k15t-radio-group__item-label', styles.label)}>{label}</div>
    </RadixRadioGroup.Item>
  );
}
