import { type ReactNode } from 'react';
import styles from './level-navigation.module.css';

export interface LevelNavigationItemsProps {
  children: ReactNode;
}

export const LevelNavigationItems = ({ children }: LevelNavigationItemsProps) => (
  <nav className={styles['navigation-items']}>
    {children}
  </nav>
);
