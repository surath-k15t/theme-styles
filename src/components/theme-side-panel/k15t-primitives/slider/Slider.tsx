import { K15tSlider } from '../k15t-slider';
import { type Ref, useLayoutEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { K15tForm, type K15tFormInputMessageMixins } from './k15t-form-stub';
import { getRandomString } from './getRandomString';
import styles from './slider.module.css';

/**
 * Same implementation as vpt3 `common/components/slider/Slider.tsx` (K15tSlider + FlexStack + value column).
 * The playground panel uses nested flex and `overflow-x: hidden` (see `cms-ui.module.css`); Radix needs
 * `min-width: 0` on the slider flex chain — set in `slider.module.css` (`.control`) and `k15t-slider.module.css` (track).
 */
export interface SliderProps extends K15tFormInputMessageMixins {
    id?: string;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange?: (value: number | null) => void;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    ref?: Ref<HTMLSpanElement>;
}

export const Slider = ({
    id,
    label,
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    className,
    onFocus,
    onBlur,
    ref,
    ...messages
}: SliderProps) => {
    const validationMessageId = useMemo(() => getRandomString(), []);
    const thumbRef = useRef<HTMLSpanElement>(null);

    // vpt3: compensate radix thumb `left` calc so narrow thumb aligns with range end.
    useLayoutEffect(() => {
        if (thumbRef.current?.parentElement) {
            const perc = (/calc\((?<perc>\d{1,3}%)/i.exec(thumbRef.current.parentElement.style.left))?.groups?.perc;
            if (perc) {
                thumbRef.current.parentElement.style.left = perc;
            }
        }
    }, [value]);

    return (
        <>
            <div className={classnames(styles.slider, className)}>
                <K15tSlider.Root
                    id={id}
                    aria-label={label}
                    ref={ref}
                    className={styles.control}
                    min={min}
                    max={max}
                    step={step}
                    value={[value]}
                    orientation="horizontal"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onValueChange={(values: number[]) => {
                        onChange?.(values[0] ?? null);
                    }}
                >
                    <K15tSlider.Track>
                        <K15tSlider.Range />
                    </K15tSlider.Track>
                    <K15tSlider.Thumb ref={thumbRef} />
                </K15tSlider.Root>

                <span className={styles.valueDisplay}>{value}</span>
            </div>

            <K15tForm.InputMessage {...messages} id={validationMessageId} />
        </>
    );
};
