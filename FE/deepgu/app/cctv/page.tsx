'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AlertPanel from '@/components/alert';
import Txt from '@/components/atoms/Text';
import CCTVPanel from '@/components/cctv';
import LogPanel from '@/components/log';

type Cctv = {
  cctv_id: number;
  name: string;
  location: string;
  streaming_url: string;
  status: string;
};

export default function CCTVPage() {
  const [cameras, setCameras] = useState<Cctv[]>([]);
  const [selectedCctvId, setSelectedCctvId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  ).replace(/\/$/, '');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchCameras = async () => {
      // 토큰이 없으면 기본 스트림만 사용
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/cameras`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('access_token');
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('CCTV 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setCameras(data);

        // 기본으로 첫 번째 CCTV 선택
        if (data.length > 0) {
          setSelectedCctvId(data[0].cctv_id);
        }
      } catch {
        setError('CCTV 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCameras();
  }, [baseUrl]);

  const selectedCctv = cameras.find((c) => c.cctv_id === selectedCctvId);

  // 테스트용: 직접 스트림 URL 사용
  const streamUrl =
    selectedCctv?.streaming_url || 'https://www.maeumnaru.shop/iphone/stream/';

  // 디버깅: 스트림 URL 확인
  useEffect(() => {
    console.log('Stream URL:', streamUrl);
    console.log('Selected CCTV:', selectedCctv);
    console.log('Cameras:', cameras);
  }, [streamUrl, selectedCctv, cameras]);

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

      {/* CCTV 선택 드롭다운 */}
      {cameras.length > 0 && (
        <div className='flex items-center gap-3'>
          <Txt weight='semibold' className='text-Hana-Black text-lg'>
            카메라 선택:
          </Txt>
          <select
            value={selectedCctvId || ''}
            onChange={(e) => setSelectedCctvId(Number(e.target.value))}
            className='text-Hana-Black rounded-lg border border-gray-300 px-4 py-2'
          >
            {cameras.map((camera) => (
              <option key={camera.cctv_id} value={camera.cctv_id}>
                {camera.name} ({camera.location})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className='rounded-md bg-red-50 p-3'>
          <Txt weight='medium' className='text-sm text-red-600'>
            {error}
          </Txt>
        </div>
      )}

      {/* 메인 레이아웃 */}
      <div className='flex gap-6'>
        <CCTVPanel
          streamUrl={streamUrl}
          title={selectedCctv?.name || 'CCTV'}
          isLoading={isLoading}
        />
        <aside className='flex w-72 flex-col gap-4'>
          <AlertPanel />
          <LogPanel />
        </aside>
      </div>
    </div>
  );
}
