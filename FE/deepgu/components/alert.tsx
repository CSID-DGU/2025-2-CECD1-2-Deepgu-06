import Image from 'next/image';
import Txt from './atoms/Text';

export default function AlertPanel() {
  return (
    <div className='bg-Gray rounded-2xl p-4 text-white shadow-lg'>
      <Txt weight='semibold' className='text-xl text-white'>
        알람
      </Txt>
      <div className='grid grid-cols-2 gap-3 pt-3'>
        <div className='bg-Semi-Red flex flex-col items-center justify-center rounded-2xl px-3 py-4 text-[#2D3035] shadow-inner'>
          <Txt className='text-lg text-white'>쓰러짐</Txt>
          <Image
            src='/icons/collapse.svg'
            alt='쓰러짐'
            width={90}
            height={90}
          />
          <Txt className='text-lg text-white'>1회</Txt>
        </div>
        <div className='bg-Semi-Blue flex flex-col items-center justify-center rounded-2xl px-3 py-4 text-[#2D3035] shadow-inner'>
          <Txt className='text-lg text-white'>폭행</Txt>
          <Image src='/icons/violence.svg' alt='폭행' width={90} height={90} />
          <Txt className='text-lg text-white'>0회</Txt>
        </div>
      </div>
    </div>
  );
}
