// 'use client';

// import Image from 'next/image';
// import { useState, useEffect, useRef } from 'react';
// import AlertPanel from '@/components/alert';
// import Txt from '@/components/atoms/Text';
// import CCTVPanel from '@/components/cctv';
// import LogPanel from '@/components/log';
// import VideoUpload from '@/components/video-upload';

// export default function CCTVPage() {
//   const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
//   const [collapseCount, setCollapseCount] = useState(0);
//   const [violenceCount, setViolenceCount] = useState(0);
//   const [logs, setLogs] = useState<
//     Array<{ id: number; message: string; timestamp: Date }>
//   >([]);
//   const timersRef = useRef<NodeJS.Timeout[]>([]);

//   // 영상 파일 선택 시 타이머 시작
//   const handleFileSelect = (file: File) => {
//     setSelectedVideoFile(file);
//     console.log('✅ 영상 파일 선택됨:', file.name);

//     // 기존 타이머 정리
//     timersRef.current.forEach((timer) => clearTimeout(timer));
//     timersRef.current = [];

//     // 11초 후 폭행 감지
//     const violenceTimer = setTimeout(() => {
//       setViolenceCount((prev) => {
//         const newCount = prev + 1;
//         return newCount;
//       });
//     }, 17000);
//     timersRef.current.push(violenceTimer);

//     // 16초 후 쓰러짐 감지 및 로그 추가
//     const collapseTimer = setTimeout(() => {
//       // setCollapseCount((prev) => {
//       //   const newCount = prev + 1;
//       //   console.log('💥 쓰러짐 감지! 카운트:', newCount);
//       //   return newCount;
//       // });
//       const newLog = {
//         id: Date.now(),
//         message: ' 폭행 이상행동 감지',
//         timestamp: new Date(),
//       };
//       setLogs((prev) => {
//         const newLogs = [newLog, ...prev];
//         return newLogs;
//       });
//     }, 17000);
//     timersRef.current.push(collapseTimer);
//   };

//   // 컴포넌트 언마운트 시 타이머 정리
//   useEffect(() => {
//     return () => {
//       timersRef.current.forEach((timer) => clearTimeout(timer));
//     };
//   }, []);

//   return (
//     <div className='mx-auto flex h-screen w-full max-w-7xl flex-col gap-6 p-6'>
//       {/* 로고 */}
//       <div className='flex items-center gap-3'>
//         <Image
//           src='/icons/logo.svg'
//           alt='로고'
//           width={56}
//           height={56}
//           priority
//         />
//         <Txt weight='semibold' className='text-Hana-Black text-[32px]'>
//           이상행동 감지 시스템
//         </Txt>
//       </div>

//       {/* 메인 레이아웃 */}
//       <div className='flex min-h-0 flex-1 gap-6'>
//         <CCTVPanel title='CCTV' videoFile={selectedVideoFile} />
//         <aside className='flex min-h-0 w-64 flex-col gap-4'>
//           {!selectedVideoFile && (
//             <VideoUpload onFileSelect={handleFileSelect} />
//           )}
//           {/* <AlertPanel
//             // collapseCount={collapseCount}
//             violenceCount={violenceCount}
//           /> */}
//           <LogPanel />
//         </aside>
//       </div>
//     </div>
//   );
// }
