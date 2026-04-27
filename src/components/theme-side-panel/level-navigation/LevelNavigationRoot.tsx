import { type ReactNode, useRef } from 'react';
import helpButtonIcon from '@/assets/sidebar-icons/help.png';
import { K15tButton } from '@/components/theme-side-panel/k15t-primitives';
import { LevelNavigationFill } from './LevelNavigationFill';
import styles from './level-navigation.module.css';

export interface LevelNavigationRootProps {
  children: ReactNode | ReactNode[];
  activeSecondLevel?: ReactNode;
  isLoadingActions?: boolean;
  isLoadingSecondLevel?: boolean;
  canSave: boolean;
  isSaveDisabled?: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

export const LevelNavigationRoot = ({
  children,
  activeSecondLevel,
  isLoadingActions = false,
  isLoadingSecondLevel = false,
  canSave,
  isSaveDisabled = false,
  onClose,
  onSave,
  onDiscard,
}: LevelNavigationRootProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles['level-navigation']}>
      <div className={styles['first-level']}>
        <div>{children}</div>
        <LevelNavigationFill>
          <button
            type="button"
            title="Help"
            aria-label="Help"
            style={{
              marginBottom: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 0,
            }}
          >
            <img src={helpButtonIcon} alt="" style={{ width: 40, height: 40, display: 'block' }} />
          </button>
        </LevelNavigationFill>
      </div>

      <div className={styles['second-level']}>
        <div className={styles['second-level-content']} ref={scrollContainerRef}>
          {isLoadingSecondLevel ? null : activeSecondLevel}
        </div>

        <div className={styles['second-level-actions']}>
          {!canSave ? (
            <K15tButton type="button" appearance="secondary" size="s" onClick={onClose}>
              Close
            </K15tButton>
          ) : (
            <>
              <button
                type="button"
                onClick={onDiscard}
                disabled={isLoadingActions}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--foreground-restrained)',
                  font: 'var(--font-body-strong-s)',
                  cursor: 'pointer',
                  padding: '0.5rem 0.25rem',
                }}
              >
                Discard
              </button>
              <K15tButton
                type="button"
                appearance="primary"
                size="s"
                isDisabled={isSaveDisabled}
                isLoading={isLoadingActions}
                onClick={onSave}
              >
                Save changes
              </K15tButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
