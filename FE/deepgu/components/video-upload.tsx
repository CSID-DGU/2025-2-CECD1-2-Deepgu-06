'use client';

import { useState, useRef } from 'react';
import Txt from './atoms/Text';

type VideoUploadProps = {
  baseUrl: string;
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (result: {
    incident_id: number | null;
    video_url: string;
  }) => void;
};

export default function VideoUpload({
  baseUrl,
  onFileSelect,
  onUploadComplete,
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (
      !allowedTypes.includes(file.type) && 
      !allowedExtensions.includes(fileExtension)
    ) {
      setError('지원하지 않는 파일 형식입니다. (MP4, AVI, MOV, MKV, WEBM만 지원)');
      return;
    }

    // 파일 크기 검증 (예: 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('파일 크기는 100MB 이하여야 합니다.');
      return;
    }

    setError('');
    setSuccess(false);
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('영상을 먼저 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('video', selectedFile);

    const xhr = new XMLHttpRequest();

    // 업로드 진행률 추적
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setUploadProgress(percentComplete);
      }
    });

    // 응답 처리
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        setSuccess(true);
        if (onUploadComplete && result.success) {
          onUploadComplete({
            incident_id: result.incident_id,
            video_url: result.video_url || '',
          });
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          setError(errorData.detail || '영상 업로드에 실패했습니다.');
        } catch {
          setError('영상 업로드에 실패했습니다.');
        }
      }
      setIsUploading(false);
      setUploadProgress(0);
    });

    xhr.addEventListener('error', () => {
      setError('네트워크 오류가 발생했습니다.');
      setIsUploading(false);
      setUploadProgress(0);
    });

    xhr.open('POST', `${baseUrl}/api/upload/video`);
    xhr.send(formData);
  };

  return (
    <div className='bg-Semi-Gray rounded-2xl p-4 shadow-lg'>
      <Txt weight='bold' className='mb-3 text-lg text-white'>
        영상 업로드
      </Txt>

      <input
        ref={fileInputRef}
        type='file'
        accept='video/*'
        onChange={handleFileChange}
        className='hidden'
      />

      {!selectedFile && (
        <button
          onClick={handleFileSelect}
          className='inline-flex h-[45px] w-full items-center justify-center rounded-xl bg-Main-Blue'
        >
          <Txt weight='semibold' className='text-xl text-white'>
            영상 선택
          </Txt>
        </button>
      )}

      {selectedFile && !isUploading && !success && (
        <div className='space-y-2'>
          <Txt weight='medium' className='text-center text-sm text-white/80'>
            선택된 파일: {selectedFile.name}
          </Txt>
          <div className='flex gap-2'>
            <button
              onClick={handleFileSelect}
              className='flex-1 rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700'
            >
              다시 선택
            </button>
            <button
              onClick={handleUpload}
              className='flex-1 rounded-lg bg-Main-Blue px-4 py-2 text-sm text-white hover:bg-blue-700'
            >
              업로드
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className='space-y-2'>
          <div className='h-2 w-full overflow-hidden rounded-full bg-gray-700'>
            <div
              className='h-full bg-blue-500 transition-all duration-300'
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <Txt weight='medium' className='text-center text-sm text-white/70'>
            업로드 중... {Math.round(uploadProgress)}%
          </Txt>
        </div>
      )}

      {error && (
        <div className='mt-3 rounded-md bg-red-500/20 p-2'>
          <Txt weight='medium' className='text-sm text-red-200'>
            {error}
          </Txt>
        </div>
      )}

      {success && (
        <div className='mt-3 rounded-md bg-green-500/20 p-3'>
          <Txt weight='bold' className='text-sm text-green-200'>
            업로드 완료
          </Txt>
          <Txt weight='medium' className='mt-1 text-xs text-white/80'>
            영상이 성공적으로 업로드되었습니다.
          </Txt>
        </div>
      )}
    </div>
  );
}

