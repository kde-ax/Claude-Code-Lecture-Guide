# CCFM Claude Code 터미널 환경 구축 가이드

> **주제:** Claude Code 터미널 환경 구축 + 기본 조작 (Windows Native)
> **대상:** 비개발자
> **발표일:** 2026-04-27
> **생성일:** 2026-04-22 → **최신: v13 (2026-04-24)**
> **제작:** CCFM AX팀

---

## 파일

> **최신 버전: `index_v13.html` · `print_v13.html`**
> 숫자가 가장 큰 파일이 항상 최신. 이전 버전 보존.

| 파일 | 용도 |
|------|------|
| `index_v13.html` | **최신 · 15장** · v12 우측 열 세로 오버플로 수정: 이미지 소스를 **목표 표시 크기에 맞춰 더 타이트하게 크롭** (usage-02 253×220→**253×170**, usage-03 1416×550→**1416×437**). CSS는 v12와 동일한 `max-width: 100%; height: auto;`만 유지 — 소스 치수를 조정하는 방식이 슬라이드 고정 캔버스에서 가장 안전 |
| `print_v13.html` | **최신** · 인쇄 버전 |
| `index_v12.html` / `print_v12.html` | 15장 · 기본 사용법 이미지 자연 크기 렌더링 시도(오버플로 발생) |
| `index_v11.html` / `print_v11.html` | 15장 · 마무리 contact 블록 통째 하단 이동, 타이트 간격 |
| `index_v10.html` / `print_v10.html` | 15장 · 감사합니다 16px 축소, gap 확장으로 감사합니다만 풋 위로 (contact 행은 제자리) |
| `index_v9.html` / `print_v9.html` | 15장 · contact 영역 글자 크기 상향, 문구 재정렬 |
| `index_v8.html` / `print_v8.html` | 15장 · 마무리: 좌상단 cover-mark, 목록 단순화, compact 이메일 배치 |
| `index_v7.html` / `print_v7.html` | 15장 · 기본 사용법 HTML 모의 터미널 재설계, 단축키 Ctrl+L/Ctrl+J/Alt 방향키 정리, 마무리 라이트 배경 |
| `index_v6.html` / `print_v6.html` | 15장 · VS Code 연동 이미지 추가, First Run 코드박스 축소, 기본 사용법 3카드+실제 스크린샷, CLI/In-Session 2분할 |
| `index_v5.html` / `print_v5.html` | 15장 · Node.js/VSCode 별도 분리, 마무리 슬라이드 추가, 기본 사용법·슬래시 시각화 강화 |
| `index_v4.html` / `print_v4.html` | 13장 · 제목/소제목 축소, 슬라이드 4 카드화, Pro 복원, Git 이미지 병치 |
| `index_v3.html` / `print_v3.html` | PDF 레퍼런스 반영 (Pro 제한·OAuth 자동 브라우저) |
| `index_v2.html` / `print_v2.html` | 사용자 상세 수정 (13장, 순서 swap, 이미지 삽입) |
| `index_v1.html` / `print_v1.html` | 초기 14장 버전 (보존) |
| `guide.pdf` | 최종 PDF (PDF 변환 후 생성) |
| `deck-stage.js` | `<deck-stage>` 커스텀 엘리먼트 (버전 공유) |
| `assets/tokens.css` | 디자인 토큰 CSS (Pretendard 한글 지원, 버전 공유) |
| `assets/ccfm-logo.png` | CCFM 로고 (버전 공유) |
| `assets/screenshots/` | Git / Node.js / VS Code / 사용법 스크린샷 9종 |

## 슬라이드 구성 (14장)

| # | 유형 | 내용 |
|---|------|------|
| 01 | Cover | 표지 — Claude Code 터미널 환경 구축 |
| 02 | TOC | 목차 · 12개 챕터 (2열 6+6) |
| 03 | 3-up | 이 가이드의 목표 (다루는 것 / 다루지 않는 것 / 소요 시간) |
| 04 | 3-up | Claude Code란? (터미널 네이티브 / 파일 직접 / 에이전틱 루프) |
| 05 | 3-up | 준비물 (OS / 계정 / PowerShell) |
| 06 | 3-up | **설치 체크리스트** · 필수 2 / 권장 2 / 선택 2 |
| 07 | Two-col + Steps | **Step 1** · Git for Windows (gitforwindows.org · 필수) |
| 08 | Two-col + Cards | **Step 2** · Node.js 22 LTS + VS Code (권장) |
| 09 | Two-col + Code | **Step 3** · Claude Code (PowerShell · npm 방식 경고) |
| 10 | Two-col + Code | **첫 실행 & 로그인** · claude → /login → URL → 인증 코드 → doctor |
| 11 | 3-up elevated | 기본 사용법 (자연어 / @ 파일 참조 / Plan Mode) |
| 12 | TOC-grid | 슬래시 명령어 치트시트 (10개) |
| 13 | 3-up kbd | 단축키 치트시트 (기본 / 효율 / 도움말) |
| 14 | Ink (guide-grid) | 문제 해결 4건 + 다음 가이드 안내 + 출처 |

## 빠른 사용법

### 스크린으로 보기
```
index_v13.html (가장 최신 버전) 더블클릭 → 기본 브라우저로 열림
```

### PDF 생성
```
print_v13.html 더블클릭 → 자동 인쇄 대화상자
[대상] PDF로 저장
[용지] 1920×1080 (사용자 지정) 또는 브라우저 자동
[여백] 없음
[배경 그래픽] ✅ 반드시 체크
```

## 레퍼런스 (이 가이드의 출처)

1. https://code.claude.com/docs/ko/quickstart — 공식 빠른 시작
2. https://code.claude.com/docs/ko/setup — 공식 고급 설정
3. https://www.inflearn.com/pages/how-to-use-claudecode — 슬래시·단축키
4. https://brunch.co.kr/@publichr/179 — 비개발자/마케터 관점 입문기
5. https://wikidocs.net/329826 — 한국어 위키독스 가이드
6. https://gitforwindows.org — Git for Windows 다운로드
7. https://nodejs.org — Node.js 22 LTS
8. https://code.visualstudio.com — VS Code
9. **사용자 참고 자료 (2026-04-23 추가)** — npm 지원 중단·네이티브 권장·5개 도구 체크리스트 출처

## 콘텐츠 설계 원칙

✅ **다루는 것:**
- Windows **네이티브** 설치 (WSL 아님)
- 필수/권장/선택 도구 5종 + Claude Code 본체
- 순서: Git (먼저) → Node.js + VS Code (권장) → Claude Code (PowerShell) → 로그인
- 기본 사용법 · 슬래시 명령어 · 단축키
- 자주 발생 문제 4건

❌ **다루지 않는 것:**
- 고급 워크플로우 · 프롬프트 테크닉 심화
- MCP 연동 상세 (언급만)
- 팀 협업 · 관리자 설정
- 모델 비교 심화 · 비용 최적화
- CLAUDE.md 작성 규칙 상세

## 디자인 사양

- **해상도:** 1280×720 (스크린) / 1920×1080 (PDF)
- **비율:** 16:9
- **폰트:** Inter (Latin) + Pretendard (한글) + JetBrains Mono (코드)
- **악센트:** CCFM Pink `#ff008a`
- **뉴트럴:** Airbnb DS 계열

## 강의 전 검토 권장 포인트

1. **Slide 05 · 계정 조건** — CCFM이 Team/Enterprise 단체 라이선스인지 확인 후 안내 문구 조정
2. **Slide 07 · Git** — CCFM 내부 프록시/방화벽 환경에서 `gitforwindows.org` 접근 가능한지 사전 확인
3. **Slide 08 · Node.js 22 LTS** — 버전 번호는 수시 변경 가능, 강의일 기준 Nodejs.org 확인
4. **Slide 09 · PowerShell 실행 정책** — 제한이 걸린 환경이면 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` 안내 필요
5. **Slide 10 · 로그인 URL 플로우** — 최신 Claude Code 버전에 따라 브라우저 자동 열림으로 바뀔 수 있음. 강의 당일 확인
6. **Slide 12 · 슬래시 명령** — `claude --version` 확인 후 변경된 명령어 있는지 점검

## 수정 이력

| 버전 | 날짜 | 장 수 | 주요 변경 |
|------|------|-------|----------|
| **v13** (최신) | 2026-04-24 | **15장** | v12 우측 열 **세로 오버플로 수정** — `max-width: 100%`는 폭만 제한하고 높이는 제한 못함. 고정 캔버스 슬라이드에서 안 깨지려면 **이미지 소스를 목표 표시 크기에 맞춰 프리사이즈**하는 게 정답. 크롭 재조정: 폴더 **253×220 → 253×170**, xlsx **1416×550 → 1416×437** (표시 높이 ~170px 상한 맞춤). CSS는 v12 그대로(`max-width: 100%; height: auto;`) |
| v12 | 2026-04-24 | 15장 | 기본 사용법 이미지 **소스 크롭 + 자연 크기 렌더링**: 폴더 이미지(usage-02) **253×535 → 253×220**(상단 CCFM AX팀 영역만), xlsx 이미지(usage-03) **1416×915 → 1416×550**(리본+컬럼 헤더+몇 행). CSS 룰 단순화: `width: 100%; max-height: 190px; object-fit: contain;` → **`max-width: 100%; height: auto;`** 만 (강제 사이즈·object-fit 제거, `overflow: hidden`/`min-height` 제거, 컨테이너 padding 10px로 여백 확보). 원본 해상도 유지로 확대 blur 없이 선명, **레이아웃 오버플로 발생** → v13에서 소스 리사이즈로 해결. 원본은 `usage-0N-prev.png`로 백업 |
| v11 | 2026-04-23 | 15장 | 마무리 슬라이드 contact 블록 통째 하단 이동 — gap **24→8px** 원복(타이트), 컨테이너 padding-bottom **54→30px** → "관련 문의…"와 "감사합니다"가 **기존 타이트 간격 유지**하며 같이 풋 바로 위로 |
| v10 | 2026-04-23 | 15장 | 마무리 슬라이드 감사합니다 **18px→16px** 축소, contact 행과 감사합니다 사이 간격 **8px→24px** 확장 — 감사합니다 블록을 **풋 바로 위로** 내림 |
| v9 | 2026-04-23 | 15장 | 마무리 슬라이드 contact 영역 조정 — 글자 크기 상향(11.5px→**15px** 본문, 12.5px→**18px** 감사합니다) 전체 조화, 문구 수정: "관련 문의는 이메일로 · kde@ccfm.co.kr · AX팀 강동이" → "**관련 문의는 CCFM AX팀 강동이 kde@ccfm.co.kr 여기로**" |
| v8 | 2026-04-23 | 15장 | 마무리 슬라이드만 수정 — 로고를 좌상단 **cover-mark 브랜딩**("CCFM · AX Team / Claude Code Setup Guide")으로 배치(표지와 수미상관) · "오늘 한 것 정리" 목록 단순화: `claude doctor 점검` 제거(렌더링 깨짐 방지), 4번째 항목 "기본 대화(@ 파일 참조, Plan Mode) · 슬래시 명령 · 단축키 숙지" → "**기본 사용법 · 슬래시 명령 · 단축키 숙지**" · 이메일 & 감사합니다 블록을 **compact 한 줄 + 작은 감사**로 축소해 **풋 바로 위**에 깔기, 이메일 옆에 **AX팀 강동이** 명기 |
| v7 | 2026-04-23 | 15장 | 기본 사용법 **단일 스토리 재설계**: HTML로 모의 터미널(크리스프) + 'CCFM AX팀 폴더/xlsx 생성' 명령 → 폴더 생성 → xlsx 자동 생성 3단계 · 단축키 정리: **Ctrl+L** "화면 지우기"→"**쌓인 텍스트 지우기**", `\\+Enter` 제거 → **Ctrl+J(줄 바꿈)** 기본·입력으로 이동, **Alt + ← →(단어 이동)** 추가 · 마무리 슬라이드 리디자인: 배경 ink(검정) → **white**, 로고를 **제목 옆 inline**, 본문을 중앙 정렬 (오늘 한 것 정리 박스 → 메일 안내 → 감사합니다), `claude doctor` 코드 렌더링 깨짐 해결 |
| v6 | 2026-04-23 | 15장 | VS Code 슬라이드에 **Claude 터미널 연동 이미지(#22)** 추가, 이미지 크기 최적화 · 첫 실행 코드박스 **높이 축소**(font 15.5→13px, 줄 수 trim) — 풋 겹침 방지 · 기본 사용법 재구성: "카톡치듯" → "**카톡하듯**", lede "내 바탕화면 파일 정리해줘", 3카드(작업폴더/@참조/맥락구체) + **실제 사용 스크린샷 3장** · 슬래시 슬라이드 kicker "In-Session Commands", 제목 "**자주 쓰는 명령어 모아보기**", lede "외울 필요 없어요", CLI(claude…) / Slash(/…) **2카드 분할** · 단축키 통합(15개·3범주, Esc/Esc Esc/\\+Enter/# 추가) · 마무리 슬라이드 정리: "**CLI 환경 설정 → Claude Code 로그인**", "**오늘 한 것 정리**", **kde@ccfm.co.kr** 메일 링크, "막힐 때" 줄 + "다음 가이드" 블록 삭제, **CCFM 로고 삽입**, 흰색 불투명도 상향(가독성) |
| v5 | 2026-04-23 | 15장 | Node.js·VS Code 별도 슬라이드로 분리 · Node.js v24.15.0 LTS 반영 + 스크린샷 2장 · VS Code 독립 슬라이드 + 스크린샷 · 첫 실행 슬라이드 trim (`자격 증명` 띄어쓰기, `claude doctor`는 PowerShell 주의) · 기본 사용법에 PDF 예시 인용 (카톡치듯이, "PDF 10개 합쳐줘") · 슬래시 범주별 3그룹 시각화 · 단축키 카드에 아이콘 추가 · **마무리 슬라이드 신설**(요약 + CCFM AX팀 signature) |
| v4 | 2026-04-23 | 13장 | 전역: `--fs-title` 44→38, `--fs-lede` 24→19 · Slide 4 카드화 · Pro 복원 · "비필수" · Git 이미지 병치 |
| v3 | 2026-04-23 | 13장 | PDF 레퍼런스 반영: Pro 제한, OAuth 자동 브라우저 |
| v2 | 2026-04-23 | 13장 | 표지·TOC·목표·준비물 재작성, 설치 체크리스트에서 Windows Terminal 제거, Git/Claude Code 슬라이드 간결화 + Git 설치 스크린샷 2종 삽입, Claude Code/Node.js+VSCode 순서 swap, 문제해결&다음단계 챕터 제거 |
| v1 | 2026-04-23 | 14장 | 초기 버전 (설치 + 사용법 + 문제해결 전부 포함) |

### v1 내부 누적 편집 히스토리 (단일 파일 덮어쓰기 구간)

- R1 (2026-04-22) · 초판 13장, 5개 레퍼런스 기반
- R2 (2026-04-22) · Git/Claude Code 설치 순서 스왑, WinGet·CMD 제거
- R3 (2026-04-23) · 범위 재정의 시도 (사용법 3장 임시 제거)
- R4 (2026-04-23) · 단축키까지 포함, Node.js·VS Code 권장, 설치 체크리스트 추가, 문제해결 추가 → 14장 최종 (v1)

> 2026-04-23 부터 **버전별 파일 분리** 규칙 적용. 다음 수정은 `index_v14.html` / `print_v14.html`로 생성.
