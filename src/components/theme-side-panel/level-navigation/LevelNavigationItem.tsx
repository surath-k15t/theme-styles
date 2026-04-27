import { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './level-navigation.module.css';

export interface LevelNavigationItemProps {
  icon?: ReactNode;
  hasError?: boolean;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export const LevelNavigationItem = ({ icon, hasError, active, onClick, children }: LevelNavigationItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      styles['navigation-item'],
      {
        [styles['navigation-item-is-error']]: hasError,
        active,
      },
    )}
  >
    {icon ? <span className={styles['navigation-icon']} aria-hidden>{icon}</span> : null}
    <span className={styles['navigation-item-label']}>{children}</span>
  </button>
);
