# CCFM Claude Code Workshop

> **주제:** Claude Code 시작 가이드 (설치부터 간단한 활용 방법까지)
> **생성일:** 2026-04-22
> **제작:** CCFM AX팀
> **대상:** CCFM 사내 실무자 + 외부 교육 요청 조직

---

## 파일

> **최신 버전: `index_v1.html` · `print_v1.html`**
> 숫자가 가장 큰 파일이 항상 최신. 수정 시마다 새 버전 파일 생성 (2026-04-23 부터 적용).

| 파일 | 용도 |
|------|------|
| `index_v1.html` | **최신** · 스크린 버전 — 브라우저에서 슬라이드쇼처럼 보기 |
| `print_v1.html` | **최신** · 인쇄 버전 — 열면 자동으로 `Ctrl+P` 대화상자 표시 |
| `guide.pdf` | 최종 PDF (1920×1080, 10페이지) |
| `deck-stage.js` | `<deck-stage>` 커스텀 엘리먼트 스크립트 (버전 공유) |
| `assets/tokens.css` | 디자인 토큰 CSS (버전 공유) |
| `assets/ccfm-logo.png` | CCFM 로고 (버전 공유) |
| `assets/cover-claude-code.png` | 커버 이미지 예비 |

## 빠른 사용법

### 스크린으로 보기
```
index_v1.html(가장 최신)을 더블클릭 → 기본 브라우저로 열림
스크롤로 10장 슬라이드 탐색
```

### PDF 재생성
```
print_v1.html 더블클릭 → 자동으로 인쇄 대화상자 뜸
[대상] PDF로 저장
[용지] 1920×1080 (사용자 지정) 또는 브라우저 자동
[여백] 없음
[배경 그래픽] ✅ 반드시 체크
```

### 타 조직·다른 주제로 재사용
원본 템플릿은 `.claude/skills/slide-designer/resources/template/` 에 있음.
새 가이드 생성 시 Claude Code에게 요청:
> "Claude Design 기능 가이드 만들어줘. 레퍼런스: [URL]"

→ `guide-generator` 스킬이 콘텐츠 브리프를 받아 자동으로 새 `outputs/[조직]_[주제]_YYYYMMDD/` 폴더 생성.

## 슬라이드 구성 (10장)

| # | 유형 | 내용 |
|---|------|------|
| 01 | Cover | 표지 — Claude Code 시작 가이드 |
| 02 | TOC | 목차 · 8개 챕터 |
| 03 | What & Why (3-up 카드) | Claude Code란? |
| 04 | Before / After | 복붙 방식 vs 터미널 네이티브 |
| 05 | Benefits (3-up + KPI) | 쓰면서 체감하는 세 가지 변화 |
| 06 | Install (4-step) | Windows WSL2 설치 |
| 07 | First Run | `claude` 실행 + 자주 쓰는 명령어 |
| 08 | Pros / Cons | 장단점 솔직하게 |
| 09 | Use Cases + Do/Don't | CCFM 실무 활용 & 주의사항 |
| 10 | Template Guide (ink 변종) | 템플릿 사용 가이드 (내부용) |

## 디자인 사양

- **해상도:** 1280×720 (스크린) / 1920×1080 (PDF)
- **비율:** 16:9
- **폰트:** Inter (Latin) + Pretendard (한글) + JetBrains Mono (코드)
- **악센트:** CCFM Pink `#ff008a`
- **뉴트럴:** Airbnb DS 계열 (surface / ink / ash / mute)

## 출처 & 콘텐츠 검토 안내

본 워크샵의 초기 콘텐츠(슬라이드 2~10)는 Claude Design 세션의 `ccfm-guide-remix` 번들에서 생성되었습니다. 교육 담당자가 **실제 강의 전 다음 항목을 검토**하시길 권장합니다:

- **Slide 5**: "3–5× 빠른 작업 속도 (AX팀 내부 측정 기준)" — 실측값으로 보정 필요
- **Slide 6**: Windows 설치 경로가 WSL2만 제시됨 — 네이티브 Windows 설치도 공식 지원
- **Slide 6 Step 03**: `sudo apt install nodejs npm` — 공식 권장은 NodeSource LTS 스크립트
- **Slide 9**: CCFM 실무 사례는 일반화된 예시 — 실제 팀별 활용 사례로 교체 권장

## 수정 이력

- **2026-04-22 · v1.0** · 초판 생성. Claude Design `ccfm-guide-remix` 번들 기반. 표지 문구를 Claude Code Workshop 용으로 조정.
