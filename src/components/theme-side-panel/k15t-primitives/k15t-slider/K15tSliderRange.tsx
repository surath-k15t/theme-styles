import { type RefAttributes } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';
import styles from './k15t-slider.module.css';

export type K15tSliderRangeProps = RadixSlider.SliderRangeProps & RefAttributes<HTMLSpanElement>;

export const K15tSliderRange = ({ className, ...props }: K15tSliderRangeProps) => (
    <RadixSlider.SliderRange className={classNames('k15t-slider__range', styles.sliderRange, className)} {...props}/>
);
