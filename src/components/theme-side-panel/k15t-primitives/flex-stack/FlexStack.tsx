import classNames from 'classnames';
import { type CSSProperties, type DetailedHTMLProps, type HTMLAttributes, type ReactNode } from 'react';
import styles from './flex-stack.module.css';

export interface FlexStackProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: ReactNode;
    flex?: string;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    alignItems?: 'stretch' | 'center' | 'start' | 'end';
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
    flexGrow?: number;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string;
    isFullWidth?: boolean;
    isFullHeight?: boolean;
    className?: string;
    style?: CSSProperties;
}

export const FlexStack = ({
    children,
    flex,
    flexDirection = 'row',
    alignItems,
    justifyContent,
    flexGrow,
    flexWrap,
    gap,
    isFullWidth = false,
    isFullHeight = false,
    className,
    style,
    ...rest
}: FlexStackProps) => (
    <div
        className={classNames(styles.flexStack, className)}
        style={{
            flex: flex ?? undefined,
            alignItems: alignItems ?? (flexDirection === 'row' ? 'center' : 'start'),
            justifyContent: justifyContent ?? (flexDirection === 'row' ? 'start' : 'center'),
            gap,
            flexDirection,
            width: isFullWidth ? '100%' : '',
            height: isFullHeight ? '100%' : '',
            flexGrow,
            flexWrap,
            ...style
        }}
        {...rest}
    >
        {children}
    </div>
);
