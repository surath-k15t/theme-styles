import { type RefAttributes } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import styles from './k15t-switch.module.css';

export type K15tSwitchRootProps = {
  enableAnimations?: boolean;
} & RadixSwitch.SwitchProps &
  RefAttributes<HTMLButtonElement>;

export function K15tSwitchRoot({
  className,
  enableAnimations = true,
  ...props
}: K15tSwitchRootProps) {
  return (
    <RadixSwitch.Root
      className={cn(
        'k15t-switch',
        styles.switch,
        !enableAnimations && styles.motionStatic,
        className,
      )}
      {...props}
    />
  );
}
