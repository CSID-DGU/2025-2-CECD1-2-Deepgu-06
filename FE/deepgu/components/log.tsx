import Txt from './atoms/Text';

export default function LogPanel() {
  return (
    <div className='bg-Gray rounded-2xl p-4 text-white shadow-lg'>
      <Txt weight='semibold' className='text-xl text-white'>
        최근 통계
      </Txt>
      <div className='bg-Alert-Red mt-3 h-10 w-full rounded-xl pt-3 shadow-inner' />
    </div>
  );
}
