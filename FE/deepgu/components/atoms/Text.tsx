import { cn } from '@/lib/utils';
import { HTMLAttributes, PropsWithChildren } from 'react';

type Props = {
  className?: string;
  size?: number;
  weight?: keyof typeof fontMap;
} & HTMLAttributes<HTMLSpanElement>;

export const fontMap = {
  semibold: 'font-[AppleSDGothicNeoSB]',
  medium: 'font-[AppleSDGothicNeoM]',
  bold: 'font-[AppleSDGothicNeoB]',
  extrabold: 'font-[AppleSDGothicNeoEB]',
  heavy: 'font-[AppleSDGothicNeoH]',
} as const;

export default function Txt({
  children,
  className,
  weight = 'semibold',
  ...props
}: PropsWithChildren<Props>) {
  return (
    <span
      className={cn('text-Hana-Black', fontMap[weight], className)}
      {...props}
    >
      {children}
    </span>
  );
}
