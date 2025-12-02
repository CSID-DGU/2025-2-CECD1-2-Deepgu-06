'use client';

import Image from 'next/image';
import { useState } from 'react';
import AlertPanel from '@/components/alert';
import Txt from '@/components/atoms/Text';
import CCTVPanel from '@/components/cctv';
import LogPanel from '@/components/log';
import VideoUpload from '@/components/video-upload';

export default function CCTVPage() {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  ).replace(/\/$/, '');

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
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
      <div className='flex gap-6'>
        <CCTVPanel title='CCTV' videoFile={selectedVideoFile} />
        <aside className='flex w-72 flex-col gap-4'>
          <VideoUpload
            baseUrl={baseUrl}
            onFileSelect={(file) => {
              setSelectedVideoFile(file);
            }}
            onUploadComplete={(result) => {
              console.log('Video uploaded:', result);
            }}
          />
          <AlertPanel />
          <LogPanel />
        </aside>
      </div>
    </div>
  );
}
