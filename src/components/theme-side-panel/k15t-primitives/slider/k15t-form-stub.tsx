import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

/** Mixins copied from vpt3 `K15tFormInputMessage.tsx` — playground does not render messages. */
export interface K15tFormInputMessageMixins {
    errorText?: ReactNode;
    warningText?: ReactNode;
    successText?: ReactNode;
    hintText?: ReactNode;
    infoText?: ReactNode;
}

export type K15tFormInputMessageProps = K15tFormInputMessageMixins &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** Last branch of vpt3 `K15tFormInputMessage`: empty container when no message content. */
export const K15tFormInputMessage = ({ className, ...props }: K15tFormInputMessageProps) => (
    <div className={className} {...props} />
);

export const K15tForm = {
    InputMessage: K15tFormInputMessage,
};
