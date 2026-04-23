import {
  type ChangeEvent,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import styles from './k15t-color-picker.module.css';

export type K15tColorPickerProps = {
  value?: string;
  onChange?: (color?: string) => void;
  /** Fired on text-field blur after normalizing `#rgb` → `#rrggbb` (optional). */
  onValueCommit?: (color: string) => void;
  /** Match configurator rows: input grows instead of fixed 110px. */
  fullWidth?: boolean;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange'
>;

const transformValue = (raw: string): string => {
  const value = raw.trim();
  if (/^#[0-9a-f]{3}$/i.exec(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return value;
};

export const K15tColorPicker = forwardRef<HTMLInputElement, K15tColorPickerProps>(function K15tColorPicker(
  { id, value, onChange, onValueCommit, fullWidth, className, disabled, readOnly, onBlur, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? `k15t-color-picker-${autoId}`;
  const pickerId = `${fieldId}_picker`;

  const [fieldValue, setFieldValue] = useState<string>(value ?? '');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    setFieldValue(value ?? '');
  }, [value]);

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  const flushDebounced = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  }, []);

  const scheduleOnChange = useMemo(
    () => (newValue: string) => {
      setFieldValue(newValue);
      flushDebounced();
      debounceTimer.current = setTimeout(() => {
        onChange?.(newValue);
        inputRef.current?.focus();
      }, 50);
    },
    [flushDebounced, onChange],
  );

  const onTextInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    flushDebounced();
    const transformed = transformValue(event.target.value);
    setFieldValue(transformed);
    onChange?.(transformed);
    onValueCommit?.(transformed);
    onBlur?.(event);
  };

  const colorWellValue = useMemo(() => {
    const t = transformValue(fieldValue);
    if (/^#[0-9a-fA-F]{6}$/i.test(t)) return t;
    if (value && /^#[0-9a-fA-F]{6}$/i.test(value)) return value;
    return '#8590a2';
  }, [fieldValue, value]);

  return (
    <div className={cn('k15t-color-picker', styles.colorPicker, fullWidth && styles.widthFluid, className)}>
      <input
        ref={inputRef}
        id={fieldId}
        type="text"
        className={cn('k15t-text-field__input')}
        value={fieldValue}
        disabled={disabled}
        readOnly={readOnly}
        onBlur={onTextInputBlur}
        onChange={e => {
          scheduleOnChange(e.target.value);
        }}
        {...props}
      />

      <input
        id={pickerId}
        className={cn('k15t-color-picker__color-input', styles.pickerInput)}
        type="color"
        value={colorWellValue}
        disabled={disabled || readOnly}
        aria-label="Open color picker"
        onChange={e => {
          scheduleOnChange(e.target.value);
        }}
      />
    </div>
  );
});

K15tColorPicker.displayName = 'K15tColorPicker';
