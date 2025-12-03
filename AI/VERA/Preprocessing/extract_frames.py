import argparse
import os
from pathlib import Path

import cv2


def extract_frames(video_path, frames_dir):
    video_name = Path(video_path).stem

    video_frames_dir = os.path.join(frames_dir, video_name)
    os.makedirs(video_frames_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_path = os.path.join(video_frames_dir, f"{frame_count:06d}.jpg")

        cv2.imwrite(frame_path, frame)

        frame_count += 1

    cap.release()
    print(f"Extracted {frame_count} frames from {video_path} to {video_frames_dir}")
    return video_name, frame_count

"""
def main(videos_dir, frames_dir, annotations_file):
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs(os.path.dirname(annotations_file), exist_ok=True)

    with open(annotations_file, "w") as f:

        for video_file in os.listdir(videos_dir):
            if video_file.endswith(".avi") or video_file.endswith(".mp4"):
                video_path = os.path.join(videos_dir, video_file)
                video_name, num_frames = extract_frames(video_path, frames_dir)
                f.write(f"{video_name} 0 {num_frames - 1} 0\n")
"""

def main(videos_dir, frames_dir, annotations_file):
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs(os.path.dirname(annotations_file), exist_ok=True)

    with open(annotations_file, "w") as f:
        # os.walk를 사용하여 videos_dir의 모든 하위 디렉토리를 재귀적으로 탐색합니다.
        for root, dirs, files in os.walk(videos_dir): 
            for video_file in files:
                # 파일 확장자 확인
                if video_file.endswith(".avi") or video_file.endswith(".mp4"):
                    # root는 현재 파일이 발견된 디렉토리 경로입니다 (예: /videos/Arrest)
                    video_path = os.path.join(root, video_file) 
                    
                    # 파일명만 사용하여 프레임 디렉토리를 생성하고 프레임을 추출합니다.
                    video_name, num_frames = extract_frames(video_path, frames_dir)
                    
                    # 어노테이션 파일에 기록
                    f.write(f"{video_name} 0 {num_frames - 1} 0\n")

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--videos_dir",
        type=str,
        required=True,
        help="Directory path to the videos.",
    )
    parser.add_argument(
        "--frames_dir",
        type=str,
        required=True,
        help="Directory path to the frames.",
    )
    parser.add_argument(
        "--annotations_file",
        type=str,
        required=True,
        help="Path to the annotations file.",
    )
    args = parser.parse_args()
    return args


if __name__ == "__main__":
    args = parse_args()
    main(args.videos_dir, args.frames_dir, args.annotations_file)
