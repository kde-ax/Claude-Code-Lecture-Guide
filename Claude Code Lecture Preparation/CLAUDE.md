# Claude 교육 가이드 자동 생성 시스템 — 프로젝트 지침

> 이 문서는 이 프로젝트 루트에서 Claude Code가 읽는 **프로젝트 전용** 지침이다.
> 사용자 전역 지침(`C:\Users\user AEA906\.claude\CLAUDE.md`)의 스킬1(PPT 사양) 규칙과 **충돌 없이 확장**한다.

---

## 프로젝트 정체성

**무엇:** Claude Code 스킬 + 템플릿 MD로 교육 가이드(HTML 슬라이드 + PDF)를 자동 생성하는 시스템
**누구를 위해:** 외부 교육 요청 조직(1순위) + CCFM 사내 실무자
**왜:** 매번 강의안을 손으로 만드는 비효율 + 결과물 품질 편차 제거
**어디까지 (MVP):** 스킬 파일 시스템만. 웹앱/자동화 파이프라인은 차기 Phase

전체 설계는 `SPEC.md` 참조.

---

## 프로젝트 구조

```
Claude Code Lecture Preparation/
├── CLAUDE.md                       ← 이 문서
├── SPEC.md                         ← 전체 설계서 (승인 완료)
├── README.md                       ← 외부 사용자용 (추후)
├── .claude/
│   ├── skills/
│   │   ├── skill-rules.json        ← 3중 트리거 규칙
│   │   ├── guide-generator/        ← 가이드 생성 메인 스킬 (오케스트레이터)
│   │   ├── slide-designer/         ← HTML/CSS 슬라이드 디자인 서브 스킬
│   │   └── install-guide/          ← 설치 가이드 전용 패턴
│   └── commands/
├── templates/                      ← 가이드 유형별 템플릿 MD
│   ├── install-guide.template.md
│   ├── feature-intro.template.md
│   ├── hands-on.template.md
│   └── troubleshooting.template.md
├── dev/active/mvp-setup/           ← 외부 기억 장치 (4대 문서)
├── outputs/                        ← 생성된 가이드 저장소
│   └── [조직명]_[주제]_YYYYMMDD/
└── _learnings/
    └── bob-learnings.md
```

---

## 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| AI 협업 | Claude Code | 최신 | 스킬/에이전트/훅 |
| 템플릿 | 순수 HTML + CSS | - | 빌드 도구 없음 |
| 폰트 | Pretendard, Noto Sans KR | CDN | 웹폰트 |
| PDF | 브라우저 Ctrl+P | - | `@page 960px 540px` |
| 버전관리 | Git | 2.x+ | |

**빌드/패키지 매니저 없음.** 외부 조직이 Claude Code만 설치하면 즉시 사용 가능해야 한다.

---

## 빌드 & 실행 명령어

```bash
# 가이드 생성 (Claude Code 대화 내에서 트리거)
# → "Claude Code 설치 가이드 만들어줘" 같은 자연어 입력
# → guide-generator 스킬 자동 활성화 → outputs/에 HTML 생성

# 생성된 HTML 미리보기 (Windows)
start outputs/[폴더명]/index.html

# PDF 변환
# 1) 브라우저에서 HTML 열기
# 2) Ctrl+P
# 3) "대상: PDF로 저장"
# 4) 용지 크기: 사용자 정의 960×540px
# 5) 여백: 없음
# 6) 배경 그래픽: 체크
```

---

## 아키텍처 패턴

### 스킬 역할 분리
- **guide-generator** (오케스트레이터): 사용자 입력 → 가이드 유형 판별 → 템플릿 선택 → slide-designer 호출
- **slide-designer** (서브): HTML/CSS 렌더링 전담. 960×540 사양과 컬러 팔레트를 강제
- **install-guide** (전문): 설치 단계 가이드의 특수 패턴(커맨드 블록, OS 분기)

### 디자인 언어 (✅ 2026-04-22 확정)

- **디자인 시스템**: Claude Design 핸드오프(`ccfm-guide-remix`) 번들을 `.claude/skills/slide-designer/resources/template/` 에 등록
- **캔버스**: 1280×720 (CSS) / 인쇄 1920×1080 (`@page`)
- **폰트**: Inter (sans) + JetBrains Mono (mono) — 한글 비중 높으면 Pretendard 추가 검토
- **악센트**: CCFM Pink `#ff008a` (현재 인스턴스), Tweaks 패널로 교체 가능
- **뉴트럴**: Airbnb 계열 토큰 (canvas/surface/hairline/ink/ash/mute)
- **렌더링**: `<deck-stage>` 커스텀 엘리먼트 (`deck-stage.js` 의존)
- **컴포넌트 인벤토리**: 14종 고정 (새 레이아웃 추가 금지)
- **토큰 단일 출처**: `slide-designer/resources/design-tokens.md` + `template/assets/tokens.css`

> 상세 토큰·컴포넌트 목록은 `slide-designer/SKILL.md` 및 `slide-designer/resources/design-tokens.md` 참조

### 변수 치환 규칙
모든 템플릿은 frontmatter로 메타데이터를 받는다:
```markdown
---
org_name: "{{조직명}}"
topic: "{{주제}}"
date: "{{YYYYMMDD}}"
presenter: "{{발표자}}"
---
```

### 산출물 저장 규칙
- 폴더: `outputs/[조직명]_[주제]_YYYYMMDD/` — 주제당 1개, 수정해도 폴더는 그대로
- **HTML 파일: 버전별로 분리** — `index_v1.html`, `index_v2.html` ... / `print_v1.html`, `print_v2.html` ...
- 숫자가 가장 큰 파일이 최신. 수정 시 **이전 버전 덮어쓰지 말 것** (새 번호로 저장)
- `alias` 파일(`index.html`) 생성하지 않음 — 사용자는 최신 번호 파일을 직접 연다
- PDF는 같은 폴더에 `guide.pdf` (공유)
- 에셋(`tokens.css`, `deck-stage.js`, 로고) · README.md 는 버전 공유 — 1세트만 유지
- 각 버전의 변경 내역은 폴더 내 `README.md` 의 "수정 이력" 섹션에 기록

---

## 작업 프로세스

이 프로젝트는 **bob 8-Phase 파이프라인**(`C:\Users\user AEA906\.claude\commands\bob.md`)을 따른다.

1. 새 기능/변경은 SPEC.md 업데이트부터
2. 결정 사항은 `dev/active/[task]/[task]-state.md`에 누적
3. 메인 컨텍스트 30~40% 유지 — 커지면 서브에이전트 분리
4. 실수 발견 시 하단 "에이전트 실수 방지 규칙" 섹션에 누적

---

## 중요 주의사항

### 절대 하지 말 것
- `tokens.css` 를 직접 수정 (주제별 악센트는 인스턴스 HTML의 inline `--accent` 로)
- 새 레이아웃 유형 추가 (컴포넌트 인벤토리 14종 내에서 조합)
- 슬라이드 컨테이너 높이 임의 확장 (내용이 많으면 글자/패딩 축소 또는 슬라이드 분할)
- 외부 CSS 프레임워크 / 아이콘 라이브러리 / 이미지 CDN import
- 빌드 도구·npm 의존성 도입 (순수 HTML/CSS 원칙)
- templates 밖에서 인라인으로 슬라이드 구조 작성
- 레퍼런스(URL/문서/요약) 없이 콘텐츠 임의 생성 (할루시네이션 위험)
- 슬롯 텍스트 길이 한도 초과 (Title 2줄, Lede 3줄 등)

### 반드시 할 것
- 생성물은 `outputs/` 아래, `[조직명]_[주제]_YYYYMMDD` 폴더명 규칙 준수
- 변수 치환 가능한 부분은 frontmatter 변수로 추출
- 사용자 전역 CLAUDE.md 스킬1(PPT 사양) 규칙과 충돌 없이 확장
- 가이드 생성 시 **레퍼런스 입력을 먼저 요구** (URL/문서/요약) — `docs/content-brief-template.md` 준수
- 새 결정은 `state.md`에 즉시 기록

---

## 에이전트 실수 방지 규칙

> 에이전트 실수 발견 시 여기에 규칙을 추가하세요.
> 형식: `[날짜]: [실수 설명] → [방지 규칙]`

<!-- 현재 기록된 실수 없음 -->

---

## 배포

MVP는 별도 배포 없음. 사용자 로컬 + Git 저장소로 관리.

외부 조직 공유 시:
1. `outputs/[폴더]/` 자체를 전달 (HTML+PDF)
2. 또는 Git 저장소 링크 공유 (`.claude/`, `templates/` 포함)

차기 Phase에서 Next.js + Vercel 정적 배포로 확장 예정.
