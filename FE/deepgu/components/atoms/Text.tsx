import { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

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

/**
 * Txt 컴포넌트
 * - weight: 글씨 두께 (semibold/medium/bold/extrabold/heavy)
 */
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
