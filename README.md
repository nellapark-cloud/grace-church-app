# 교회 재적부

React + TypeScript + Vite + Tailwind CSS로 만든 반응형 교회 재적부(교인 명부) 웹앱입니다.
Firebase(Firestore + Authentication)를 사용해 데이터를 클라우드에 저장하므로 여러 기기에서
같은 데이터를 공유해서 볼 수 있습니다.

## 주요 기능

- 이메일/비밀번호 로그인 (관리자만 접근)
- 교인 등록 / 수정 / 삭제
- 이름·연락처·주소 검색, 재적 상태·소속(구역)별 필터
- 기본정보 / 신앙정보(세례일·직분·소속·등록일) / 가족관계 관리
- 같은 가족(세대)으로 등록된 교인 간 연결 보기
- 모바일에서는 카드형, 데스크톱에서는 표(테이블) 형태로 자동 전환되는 반응형 레이아웃

## 시작하기

### 1. Firebase 프로젝트 준비

1. [Firebase 콘솔](https://console.firebase.google.com/)에서 새 프로젝트를 만듭니다.
2. **Authentication → 로그인 방법**에서 "이메일/비밀번호"를 사용 설정합니다.
3. **Authentication → 사용자**에서 재적부를 관리할 관리자 계정(이메일/비밀번호)을 추가합니다.
4. **Firestore Database**를 생성합니다(프로덕션 모드 권장).
5. Firestore 보안 규칙은 이 저장소의 `firestore.rules` 내용을 그대로 붙여넣습니다.
   (로그인한 사용자만 `members` 컬렉션을 읽고 쓸 수 있도록 제한합니다.)
6. **프로젝트 설정 → 일반 → 내 앱**에서 웹 앱을 추가하고 SDK 설정값(config)을 확인합니다.

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env` 파일을 만들고, Firebase 웹 앱 설정값을 채워 넣습니다.

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속한 뒤, Firebase Authentication에 등록한
관리자 계정으로 로그인합니다.

### 4. 배포

```bash
npm run build
```

`dist` 폴더가 생성되며, Firebase Hosting, Vercel, Netlify 등 정적 호스팅 서비스에
그대로 배포할 수 있습니다.

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Firebase (Authentication, Firestore)
