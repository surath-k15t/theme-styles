import { type RefAttributes } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import classNames from 'classnames';
import styles from './k15t-slider.module.css';

export type K15tSliderTrackProps = RadixSlider.SliderTrackProps & RefAttributes<HTMLSpanElement>;

export const K15tSliderTrack = ({ className, ...props }: K15tSliderTrackProps) => (
    <RadixSlider.SliderTrack className={classNames('k15-slider__track', styles.sliderTrack, className)} {...props}/>
);
