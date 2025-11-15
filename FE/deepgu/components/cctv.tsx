import Image from 'next/image';
import Txt from './atoms/Text';

export default function CCTVPanel() {
  return (
    <section className='bg-Semi-Gray flex flex-1 flex-col overflow-hidden rounded-2xl shadow-lg'>
      <div className='flex items-center gap-2 px-5 py-3 text-white'>
        <Image src='/icons/cctv.svg' alt='cctv' width={22} height={22} />
        <Txt className='bold text-xl text-white'>CCTV</Txt>
      </div>
      <div className='bg-Hana-Black flex-1' />
    </section>
  );
}
