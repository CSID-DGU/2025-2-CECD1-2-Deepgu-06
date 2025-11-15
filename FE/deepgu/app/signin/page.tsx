'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Txt from '@/components/atoms/Text';

export default function SignInPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  return (
    <main className='flex flex-col items-center'>
      {/* 로고 */}
      <div className='flex items-center gap-2'>
        <Image
          src='/icons/logo.svg'
          alt='로고'
          width={53}
          height={53}
          priority
        />
        <Txt weight='semibold' className='text-Hana-Black text-[32px]'>
          이상행동 감지 시스템
        </Txt>
      </div>

      {/* 폼 컨테이너 */}
      <div className='mt-11 w-[300px]'>
        <form className='flex flex-col'>
          {/* 이메일 */}
          <div>
            <label className='block'>
              <Txt weight='semibold' className='text-Hana-Black text-xl'>
                이메일
              </Txt>
            </label>
            <Input
              type='email'
              placeholder='이메일'
              autoComplete='email'
              required
              maxLength={50}
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail mt-2.5 mb-[25px] h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className='block'>
              <Txt weight='semibold' className='text-Hana-Black text-xl'>
                비밀번호
              </Txt>
            </label>
            <Input
              type='password'
              placeholder='비밀번호'
              autoComplete='current-password'
              required
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail mt-2.5 mb-[50px] h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 로그인 버튼 */}

          <Button
            className='h-[45px] w-full font-[AppleSDGothicNeoSB] text-xl'
            // onClick={formLogin}
            type='submit'
          >
            로그인
          </Button>

          {/* 회원가입으로 이동 */}
          <div className='flex items-center justify-center pt-[30px]'>
            <Txt
              weight='medium'
              className='text-Icon-Detail text-base leading-none'
            >
              가입한 계정이 없으신가요?
            </Txt>

            <Link href='/signup' className='ml-3.5 pb-1'>
              <Txt
                weight='medium'
                className='text-Icon-Detail align-middle text-base leading-none underline underline-offset-2'
              >
                회원가입
              </Txt>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
