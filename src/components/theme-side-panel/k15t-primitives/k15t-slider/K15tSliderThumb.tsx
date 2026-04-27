import { forwardRef, type RefAttributes } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';
import styles from './k15t-slider.module.css';

export type K15tSliderThumbProps = RadixSlider.SliderThumbProps & RefAttributes<HTMLSpanElement>;

export const K15tSliderThumb = forwardRef<HTMLSpanElement, K15tSliderThumbProps>(
    ({ className, ...props }, ref) => (
        <RadixSlider.SliderThumb
            ref={ref}
            className={classNames('k15t-slider__thumb', styles.sliderThumb, className)}
            {...props}
        />
    ),
);
K15tSliderThumb.displayName = 'K15tSliderThumb';
