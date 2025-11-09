import { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

const baseClasses = `
    bg-white
    border border-Box-Line rounded-xl
    text-Hana-Black
    placeholder:text-Icon-Detail
    focus:ring-0 focus:outline-none
    font-[AppleSDGothicNeoM]
 `;

type Props = {
  placeholder?: string;
  width?: number;
  height?: number;
  className?: string;
  size?: number;
  ref?: Ref<HTMLInputElement | null>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export default function Input({ placeholder, className, ...props }: Props) {
  return (
    <input
      placeholder={placeholder}
      className={cn(baseClasses, className)}
      {...props}
    />
  );
}
