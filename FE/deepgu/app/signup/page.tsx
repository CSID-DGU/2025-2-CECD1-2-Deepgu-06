'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Txt from '@/components/atoms/Text';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className='flex flex-col items-center'>
      {/* 로고 */}
      <div className='flex items-center gap-2 pb-10'>
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
      <div className='w-[300px]'>
        <form className='flex flex-col gap-2' onSubmit={onSubmit}>
          {/* 이름 */}
          <div>
            <label className='block'>
              <Txt
                weight='semibold'
                className='text-Hana-Black block pb-2 text-xl'
              >
                이름
              </Txt>
            </label>
            <Input
              type='text'
              placeholder='이름을 입력해주세요'
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className='block'>
              <Txt
                weight='semibold'
                className='text-Hana-Black block pb-2 text-xl'
              >
                이메일
              </Txt>
            </label>
            <Input
              type='email'
              placeholder='이메일을 입력해주세요'
              autoComplete='email'
              required
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail tex-lg mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className='block'>
              <Txt
                weight='semibold'
                className='text-Hana-Black block pb-2 text-xl'
              >
                비밀번호
              </Txt>
            </label>
            <Input
              type='password'
              placeholder='비밀번호를 입력해주세요'
              autoComplete='new-password'
              required
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className='block'>
              <Input
                type='password'
                placeholder='비밀번호를 확인해주세요'
                autoComplete='new-password'
                required
                maxLength={50}
                value={secondPassword}
                onChange={(e) => setSecondPassword(e.target.value)}
                className='text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
              />
            </label>
          </div>

          {/* 전화번호 */}
          <div>
            <label className='block'>
              <Txt
                weight='semibold'
                className='text-Hana-Black block pb-2 text-xl'
              >
                전화번호
              </Txt>
            </label>
            <Input
              type='tel'
              placeholder='전화번호를 입력해주세요'
              required
              maxLength={13}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg'
            />
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type='submit'
            className='mt-[30px] h-[50px] w-full font-[AppleSDGothicNeoSB] text-xl'
          >
            {/* {signUp.isPending ? '가입 중…' : '회원가입'} */}
            회원가입
          </Button>

          {/* 로그인으로 이동 */}
          <div className='flex items-center justify-center pt-4'>
            <Txt weight='medium' className='text-Icon-Detail text-base'>
              계정이 이미 있으신가요?
            </Txt>
            <Link href='/signin' className='pb-1 pl-3.5'>
              <Txt
                weight='medium'
                className='text-Icon-Detail align-middle text-base underline underline-offset-2'
              >
                로그인
              </Txt>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
