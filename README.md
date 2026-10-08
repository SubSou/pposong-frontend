#  뽀송 (Pposong)

### 일상을 기록하고 서로의 이야기를 공유하는 SNS 웹 서비스

뽀송(Pposong)은 사용자들이 일상과 사진을 공유하고, 좋아요와 댓글을 통해 소통할 수 있는 SNS 웹 서비스입니다.

React와 TypeScript를 기반으로 사용자 인터페이스를 구현했으며, Spring Boot 백엔드와 REST API 및 WebSocket을 통해 연동했습니다.

개인 포트폴리오 프로젝트로 기획부터 UI 설계, 프론트엔드 구현 및 배포까지 진행했습니다.

## 🔗 배포 및 저장소

- **서비스 URL:** https://pposong-frontend.vercel.app/
- **Backend:** https://github.com/SubSou/pposong-backend

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| Language | TypeScript |
| Framework / Library | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Routing | React Router DOM |
| Icons | Bootstrap Icons |
| API Communication | Fetch API |
| Real-time Communication | WebSocket |
| Deployment | Vercel |
| Version Control | Git, GitHub |

## ✨ 주요 기능

### 1. 회원가입 및 로그인

- 이메일 기반 회원가입 및 로그인
- 입력값 유효성 검사
- 비밀번호 확인 및 오류 메시지 표시
- JWT 기반 로그인 인증
- 관리자 승인 후 서비스 이용
- 인증되지 않은 사용자의 페이지 접근 제한

### 2. 게시글 관리

- 게시글 작성, 조회, 수정 및 삭제
- 게시글 작성 모달
- 이미지 첨부 및 미리보기
- 이미지 최대 10장 첨부
- 게시글 상세 페이지
- 게시글 목록 표시

### 3. 좋아요 및 댓글

- 게시글 좋아요 및 취소
- 게시글별 좋아요 상태 표시
- 댓글 작성, 조회, 수정 및 삭제
- 사용자와 게시글 간 상호작용 기능

### 4. 사용자 프로필

- 사용자 프로필 조회
- 프로필 정보 수정
- 프로필 이미지 관리
- 내가 작성한 게시글 확인
- 좋아요한 게시글 확인

### 5. 실시간 접속자

- WebSocket 기반 실시간 접속자 표시
- 현재 접속 중인 사용자 목록 확인
- 접속자 수 실시간 표시
- 프로필 이미지 및 온라인 상태 표시

### 6. 반응형 UI

- PC 및 모바일 환경에 대응하는 반응형 레이아웃
- 모바일 사이드 메뉴
- 현재 페이지에 따른 메뉴 활성화 표시
- 게시글 작성 모달 및 이미지 미리보기
- 일관된 디자인 시스템 적용

## 🎨 디자인

사용자가 편안하게 이용할 수 있도록 밝은 라벤더 계열의 색상을 사용했습니다.

| 용도 | 색상 |
|---|---|
| Primary | `#8B7CF6` |
| Background | `#F5F4FF` |
| White | `#FFFFFF` |

## 📁 프로젝트 구조

```text
src/
├── api/                 # 백엔드 API 요청
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   └── websocket/       # 실시간 통신 컴포넌트
├── pages/
│   ├── auth/            # 로그인 및 회원가입
│   ├── home/            # 홈 화면
│   ├── post/            # 게시글 상세
│   └── profile/         # 프로필 및 정보 수정
├── stores/              # Zustand 상태 관리
└── main.tsx             # 애플리케이션 진입점
```

※ 프로젝트 구조는 주요 디렉터리를 중심으로 요약했습니다.

## 🔐 인증 및 API 연동

- JWT Access Token을 이용한 인증
- `sessionStorage`를 이용한 토큰 관리
- Protected Route를 통한 접근 제어
- REST API를 통한 백엔드 데이터 연동
- WebSocket을 통한 실시간 접속자 정보 수신
- 개발 및 배포 환경에 따른 API 주소 분리

## 🚀 실행 방법

### 1. 저장소 복제

```bash
git clone https://github.com/SubSou/pposong-frontend.git
cd pposong-frontend
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 최상위 폴더에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. 개발 서버 실행

```bash
npm run dev
```

프론트엔드 개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 📌 프로젝트를 통해 경험한 내용

- React와 TypeScript를 활용한 컴포넌트 기반 UI 개발
- Tailwind CSS를 활용한 반응형 웹 구현
- 공통 컴포넌트 분리를 통한 코드 재사용성 개선
- REST API 연동 및 비동기 데이터 처리
- JWT 기반 인증 흐름과 접근 제어 구현
- WebSocket을 활용한 실시간 기능 개발
- Vercel을 활용한 프론트엔드 배포
- CORS, API 연결, 라우팅 및 배포 환경 문제 해결

## 📄 프로젝트 안내

본 프로젝트는 개인 학습 및 개발 포트폴리오 목적으로 제작되었습니다.

사용자는 개인정보나 민감한 정보를 게시하지 않도록 주의해 주세요.
