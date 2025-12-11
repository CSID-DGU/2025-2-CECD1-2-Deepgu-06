'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AlertPanel from '@/components/alert';
import Txt from '@/components/atoms/Text';
import CCTVPanel from '@/components/cctv';
import LogPanel from '@/components/log';

export default function CCTVPage() {
  const [isLoading] = useState(false);
  const [logs] = useState<
    Array<{ id: number; message: string; timestamp: Date }>
  >([]);

  useEffect(() => {
    // 백엔드 호출 없이 스트림만 표시
  }, []);

  // 항상 고정된 스트림 URL 사용
  const streamUrl = 'https://www.maeumnaru.shop/iphone/stream/';

  // 디버깅: 스트림 URL 확인
  useEffect(() => {
    console.log('Stream URL:', streamUrl);
  }, [streamUrl]);

  return (
    <div className='mx-auto flex h-screen w-full max-w-7xl flex-col gap-6 p-6'>
      {/* 로고 */}
      <div className='flex items-center gap-3'>
        <Image
          src='/icons/logo.svg'
          alt='로고'
          width={56}
          height={56}
          priority
        />
        <Txt weight='semibold' className='text-Hana-Black text-[32px]'>
          이상행동 감지 시스템
        </Txt>
      </div>
      {/* 메인 레이아웃 */}
      <div className='flex min-h-0 flex-1 gap-6'>
        {/* <CCTVPanel /> */}
        <CCTVPanel streamUrl={streamUrl} title='CCTV' isLoading={isLoading} />
        <aside className='flex min-h-0 w-64 flex-col gap-4'>
          <AlertPanel />
          <LogPanel />
        </aside>
      </div>
    </div>
  );
}
