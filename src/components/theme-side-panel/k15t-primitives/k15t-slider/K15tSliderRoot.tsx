import { forwardRef, type RefAttributes } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';
import styles from './k15t-slider.module.css';

export type K15tSliderRootProps = RadixSlider.SliderProps & RefAttributes<HTMLSpanElement>;

export const K15tSliderRoot = forwardRef<HTMLSpanElement, K15tSliderRootProps>(
    ({ className, ...props }, ref) => (
        <RadixSlider.Root
            ref={ref}
            className={classNames('k15t-slider', styles.sliderRoot, className)}
            {...props}
        />
    ),
);
K15tSliderRoot.displayName = 'K15tSliderRoot';
