'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Txt from '@/components/atoms/Text';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <Image
        src='/icons/logo.svg'
        alt='로고'
        width={150}
        height={150}
        priority
      />
      <Txt
        weight='semibold'
        className='text-modal-font text-Hana-Black mt-12 mb-8 text-[40px]'
      >
        VLM 기반 이상행동 분석 플랫폼
      </Txt>
    </div>
  );
}
