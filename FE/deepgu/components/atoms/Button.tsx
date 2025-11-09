import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import Txt, { fontMap } from '@/components/atoms/Text';

const BgColor = {
  blue: 'bg-Main-Blue',
  gray: 'bg-Background',
  white: 'bg-white',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof BgColor;
  textWeight?: keyof typeof fontMap;
  textClassName?: string;
}

/**
 * Button 컴포넌트
 * - color: 토큰 기반 배경색 (blue/gray/white)
 * - 버튼 크기: 호출부에서 className으로 자유롭게 조정
 * - textWeight: 글씨 Bold
 * - textClassName: 글씨 색상/크기
 */
export default function Button({
  color = 'blue',
  disabled,
  type = 'button',
  children,
  textWeight = 'semibold',
  textClassName,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex h-[45px] w-[355px] items-center justify-center rounded-xl',
        BgColor[color],
        className
      )}
      {...props}
    >
      <Txt
        weight={textWeight}
        className={cn('text-xl text-white', textClassName)}
      >
        {children}
      </Txt>
    </button>
  );
}
