'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Txt from '../atoms/Text';

type DatePickerProps = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  minYear?: number; // 기본 1930
  maxYear?: number; // 기본: 올해
  className?: string; // 트리거 박스 커스텀
  disablePast?: boolean; // 과거 날짜 선택 불가 옵션
  disableFuture?: boolean; //미래 날짜 선택 불가 옵션
  placeholder?: string;
  textClassName?: string; //글씨 크기, 두께
  placeholderClassName?: string;
};

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function DatePicker({
  value = null,
  onChange,
  minYear = 1930,
  maxYear = new Date().getFullYear(),
  className,
  disablePast,
  disableFuture,
  placeholder,
  textClassName,
  placeholderClassName,
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | null>(value);
  const [view, setView] = useState<Date>(value ?? new Date());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 외부에서 value 바뀌면 동기화
  useEffect(() => {
    setSelected(value ?? null);
    if (value) setView(value);
  }, [value]);

  // 바깥 클릭/ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // 달력 날짜 계산
  const Y = view.getFullYear();
  const M = view.getMonth();
  const first = new Date(Y, M, 1);
  const last = new Date(Y, M + 1, 0);
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(end.getDate() + (6 - last.getDay()));
  const dates: Date[] = [];
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 변경: 과거/미래 차단 로직을 prop 기반으로 분기
  const disabledDay = (d: Date) => {
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0); // (시분초 제거)
    if (disablePast && dd < today) return true;
    if (disableFuture && dd > today) return true;
    if (dd.getFullYear() < minYear || dd.getFullYear() > maxYear) return true;
    return false;
  };

  return (
    <div ref={wrapRef} className='w-full'>
      {/* 트리거(읽기전용 input 스타일) */}
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'border-Box-Line flex h-[50px] w-full items-center justify-between rounded-xl border bg-white pr-3 pl-5',
          className
        )}
      >
        <Txt
          weight='medium'
          className={cn(
            'text-[26px]',
            selected
              ? cn('text-Hana-Black', textClassName)
              : cn('text-Icon-Detail', textClassName, placeholderClassName)
          )}
        >
          {selected ? fmt(selected) : (placeholder ?? '날짜를 선택하세요')}
        </Txt>
        <svg
          className={cn(
            'text-Icon-Detail/70 ml-2 h-4 w-4 transition-transform',
            open && 'rotate-90'
          )}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
        >
          <path
            d='M19 9l-7 7-7-7'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {/* 드롭다운 달력 */}
      {open && (
        <div className='relative'>
          <div className='border-Box-Line absolute z-100 mt-2 w-full rounded-[10px] border bg-white p-3 shadow-[0_4px_10px_rgba(0,0,0,0.08)]'>
            <div className='mb-3 flex items-center justify-between'>
              <button
                type='button'
                onClick={() => setView(new Date(Y, M - 1, 1))}
                className='text-Logo-Mint px-2 py-1'
              >
                ◀
              </button>

              <div className='flex items-center gap-2'>
                <select
                  value={Y}
                  onChange={(e) =>
                    setView(new Date(Number(e.target.value), M, 1))
                  }
                  className='border-Box-Line rounded border px-2 py-1 text-sm'
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>

                <select
                  value={M}
                  onChange={(e) =>
                    setView(new Date(Y, Number(e.target.value), 1))
                  }
                  className='border-Box-Line rounded border px-2 py-1 text-sm'
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m + 1}월
                    </option>
                  ))}
                </select>
              </div>

              <button
                type='button'
                onClick={() => setView(new Date(Y, M + 1, 1))}
                className='text-Logo-Mint px-2 py-1'
              >
                ▶
              </button>
            </div>

            <div className='grid grid-cols-7 gap-1 text-center text-sm'>
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <div key={d} className='text-Icon-Detail py-1 font-medium'>
                  {d}
                </div>
              ))}

              {dates.map((d) => {
                const otherMonth = d.getMonth() !== M;
                const isToday = isSameDate(d, today);
                const isSelected = selected && isSameDate(d, selected);
                const disabled = disabledDay(d);

                return (
                  <button
                    type='button'
                    key={d.toISOString()}
                    disabled={disabled}
                    onClick={() => {
                      if (disabled) return;
                      setSelected(d);
                      onChange?.(d);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-[6px] py-2',
                      otherMonth ? 'text-Icon-Detail/50' : 'text-Hana-Black',
                      isToday && 'border-Logo-Mint border',
                      isSelected && 'bg-Logo-Mint text-white',
                      !isSelected && !disabled && 'hover:bg-Page-Background',
                      disabled && 'cursor-not-allowed opacity-40'
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
