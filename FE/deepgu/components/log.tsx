import { useEffect, useState } from 'react';
import { cleanReason } from '@/lib/cleanReason';
import Txt from './atoms/Text';

type IncidentApi = {
  incident_id: number;
  cctv_id: number;
  type?: string;
  start_time?: string;
  end_time?: string | null;
  status?: string | null;
  explanation?: string | null;
};

type Log = {
  id: number;
  message: string;
  timestamp: Date;
  reason?: string | null;
};

export default function LogPanel() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/incidents/?cctv_id=1&status=CLOSED`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,
          }
        );

        if (!res.ok) {
          throw new Error('이상행동 이력을 불러오지 못했습니다.');
        }

        const incidents = (await res.json()) as IncidentApi[];
        const closed = (incidents || []).filter(
          (it) => it.status === 'CLOSED' || it.end_time
        );

        const mapped = closed.map((it) => ({
          id: it.incident_id ?? Date.now(),
          // message: ` ${it.type || '이상행동'} 감지`,
          message: ' 이상행동 감지',
          timestamp: new Date(it.end_time || it.start_time || Date.now()),
          reason: it.explanation,
        }));

        setLogs(mapped);
        setError('');
      } catch (err) {
        console.error(err);
        setError('이상행동 이력을 불러오지 못했습니다.');
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className='bg-Gray flex min-h-0 flex-1 flex-col rounded-2xl p-4 text-white shadow-lg'>
      <Txt weight='semibold' className='text-xl text-white'>
        최근 통계
      </Txt>
      <div className='bg-Semi-Gray mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-xl p-3 shadow-inner'>
        {error && (
          <Txt className='text-center text-sm text-red-200'>{error}</Txt>
        )}
        {!error && logs.length === 0 && (
          <Txt className='text-center text-sm text-white/60'>
            로그가 없습니다
          </Txt>
        )}
        {!error &&
          logs.map((log) => (
            <div
              key={log.id}
              className='rounded-lg bg-red-500/30 p-2 text-sm text-white backdrop-blur-sm transition-all duration-300'
            >
              <Txt className='text-xs text-white/80'>
                {log.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </Txt>
              <Txt className='mt-1 text-sm text-white'>{log.message}</Txt>

              <Txt className='mt-1 text-sm text-white'>
                {cleanReason(log.reason ?? undefined)}
              </Txt>
            </div>
          ))}
      </div>
    </div>
  );
}
