'use client';

import React from 'react';
import Image from 'next/image';
import Txt from './atoms/Text';

type Props = {
  streamUrl?: string;
  videoFile?: File | null;
  title?: string;
  isLoading?: boolean;
};

export default function CCTVPanel({
  streamUrl,
  videoFile,
  title = 'CCTV',
  isLoading = false,
}: Props) {
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoUrl(null);
    }
  }, [videoFile]);

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
        ) : videoUrl ? (
          <video
            src={videoUrl}
            controls
            className='absolute inset-0 h-full w-full object-contain'
          >
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
        ) : streamUrl ? (
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
            영상을 선택해주세요.
          </Txt>
        )}
      </div>
    </section>
  );
}
