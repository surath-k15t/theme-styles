import type { RadioGroupProps } from '@radix-ui/react-radio-group';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { type ReactNode, type RefAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './k15t-radio-group.module.css';

export type K15tRadioGroupRootProps = {
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
} & Omit<RadioGroupProps, 'onValueChange'> &
  RefAttributes<HTMLDivElement>;

export function K15tRadioGroupRoot({ className, onChange, ...props }: K15tRadioGroupRootProps) {
  return (
    <RadixRadioGroup.Root
      className={cn('k15t-radio-group', styles.radioGroup, className)}
      onValueChange={onChange}
      {...props}
    />
  );
}
