'use client';

import Image from 'next/image';
import Txt from './atoms/Text';

type Props = {
  streamUrl?: string;
  title?: string;
  isLoading?: boolean;
};

export default function CCTVPanel({
  streamUrl,
  title = 'CCTV',
  isLoading = false,
}: Props) {
  return (
    <section className='bg-Semi-Gray flex flex-1 flex-col overflow-hidden rounded-2xl shadow-lg'>
      <div className='flex items-center gap-2 px-5 py-3 text-white'>
        <Image src='/icons/cctv.svg' alt='cctv' width={22} height={22} />
        <Txt weight='bold' className='text-xl text-white'>
          {title}
        </Txt>
      </div>
      <div className='bg-Hana-Black relative flex flex-1 items-center justify-center'>
        {isLoading ? (
          <Txt weight='medium' className='text-sm text-white/70'>
            영상을 불러오는 중...
          </Txt>
        ) : streamUrl ? (
          // iframe으로 스트림 표시 (인증 문제 우회 가능)
          <iframe
            src={streamUrl}
            className='absolute inset-0 h-full w-full border-0'
            allow='camera; microphone'
            title='CCTV Stream'
            onLoad={() => {
              console.log('✅ Stream iframe loaded:', streamUrl);
            }}
          />
        ) : (
          <Txt weight='medium' className='text-sm text-white/70'>
            영상 URL이 없습니다.
          </Txt>
        )}
      </div>
    </section>
  );
}
