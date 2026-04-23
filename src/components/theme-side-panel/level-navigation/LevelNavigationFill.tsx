import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './level-navigation.module.css';

export interface LevelNavigationFillProps {
  className?: string;
  children?: ReactNode;
}

export const LevelNavigationFill = ({ className, children }: LevelNavigationFillProps) => (
  <div className={classNames(styles.fill, className)}>
    {children}
  </div>
);
