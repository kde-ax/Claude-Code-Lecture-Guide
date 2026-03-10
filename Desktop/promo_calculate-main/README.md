# CCFM 프로모션 시뮬레이터 (CCFM Promotion Simulator)

CCFM 전사 직무별 프로모션(승진) 기준을 시뮬레이션하고 결과를 확인할 수 있는 대시보드 시스템입니다.

## 🚀 주요 기능

### 1. 직무별 맞춤형 계산기 (Calculator)
- **퍼포먼스 마케터, 디자이너, 영상 디자이너, 풀스택 마케터** 등 각 직군에 최적화된 시뮬레이터 제공
- **L1 ~ L5** 단계별 상세 기준 및 점수 계산 로직 적용
- Iframe 방식을 통한 파일 격리로 안정적인 계산 엔진 구동

### 2. 정밀한 권한 제어 (RBAC)
- **직군 자동 매칭**: 유저의 직군(Job Family)에 맞는 계산기 섹션 자동 활성화
- **단계(Level) 제한**: 일반 사용자는 본인의 레벨에 해당하는 시뮬레이터만 접근 가능
- **계층적 메뉴 노출**:
  - `부팀장`: 본인 관리 메뉴만 노출
  - `팀장`: 부팀장 + 팀장 메뉴 노출
  - `본부장`: 부팀장 + 팀장 + 본부장 + 전체 계산기 접근
  - `경영진`: 모든 관리 메뉴 및 전체 계산기 접근

### 3. 보안 및 인프라 (Security & Infrastructure)
- **Firebase Authentication**: Google Social Login을 통한 보안 인증
- **Firebase Realtime Database**: 실시간 권한 및 유저 데이터 동기화
- **SEO 방지**: 외부 검색 엔진 수집 차단 (`robots.txt`, `noindex` 적용)
- **Firebase Hosting**: 빠르고 안정적인 CDN 배포

## 🛠 기술 스택
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS
- **Backend**: Firebase Auth, Realtime Database, Cloud Functions
- **Font**: Pretendard (Pretendard JP & KR)
- **Icons**: Lucide Icons (SVG)

## 📂 프로젝트 구조
```text
.
├── public/                 # Firebase Hosting 배포 파일
├── functions/              # Firebase Cloud Functions (인사 DB 연동)
├── index.html              # 대시보드 메인 페이지 (Shell)
├── robots.txt              # 검색 엔진 접근 차단 설정
├── * _Calc.html            # 직군/레벨별 독립 계산기 파일
└── ccfmlog.webp            # 로고 이미지
```

## 💻 로컬 실행 방법
1. 저장소를 클론합니다.
2. Firebase CLI가 설치되어 있어야 합니다 (`npm install -g firebase-tools`).
3. 로컬 서버를 실행합니다:
   ```bash
   python3 -m http.server 8080
   ```
4. 또는 Firebase hosting 에뮬레이터를 사용합니다:
   ```bash
   firebase emulators:start
   ```

## 📄 배포 방법
수정 사항 반영 후 아래 명령어를 통해 배포합니다:
```bash
cp *.html public/
cp *.webp public/
firebase deploy --only hosting
```
