# Claude 교육 가이드 자동 생성 시스템 개발 Spec

> 작성자: AX팀 강동이
> 작성일: 2026-04-21
> 승인일: 2026-04-22
> 상태: **승인 완료 — Phase 1 진행 중**

---

## 1. 개요

### 목적
Claude Code 스킬 파일 + 템플릿 시스템으로 **Claude 교육 가이드(HTML 슬라이드 + PDF)를 일관된 품질로 자동 생성**한다. 매번 강의안을 수작업으로 만들지 않도록, 주제만 넘기면 사양을 지킨 산출물이 나오도록 한다.

### 범위
**포함 (MVP)**
- Claude Code 스킬 파일 3종 (가이드 생성 / 슬라이드 디자인 / 설치 가이드 전용)
- HTML 슬라이드 템플릿 (PPT 960×540 사양) + PDF 출력 가이드
- 가이드 유형별 구조화 템플릿 MD (설치 / 기능 소개 / 실습 / 문제해결)
- 외부 교육 요청 조직을 위한 변수 치환 구조 (조직명, 강의 날짜 등)
- 샘플 산출물 1세트 (Claude Code 입문 교육용)

**제외 (차기)**
- 웹앱 (Next.js 배포) — 2차 Phase
- 유튜브 영상/문서 링크 → 가이드 자동 생성 자동화 (n8n) — 3차 Phase
- 클로드 외 AI/자동화 툴 가이드 확장 — 4차 Phase

### 성공 기준
- [ ] "Claude Code 설치 가이드 만들어줘" → 스킬 자동 활성화 → HTML 10장+ 생성
- [ ] 생성된 HTML을 브라우저에서 Ctrl+P → PDF 변환 시 깨짐 없음
- [ ] 조직명만 바꿔서 동일 콘텐츠를 다른 조직용으로 재생성 가능
- [ ] 스킬 파일과 템플릿이 CCFM 사내 문서 규칙(#1B4FD8, Pretendard, 960×540)을 100% 준수
- [ ] 최소 1개 이상의 완성된 샘플 가이드가 `/outputs/`에 저장됨

---

## 2. 기술 스택 (정확한 버전 필수)

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| AI 협업 | Claude Code (CLI) | 최신 | 스킬/에이전트/훅 시스템 |
| 템플릿 엔진 | HTML + CSS (순수) | - | 외부 의존성 없음 |
| 폰트 | Pretendard / Noto Sans KR | CDN | 웹폰트 링크로 처리 |
| 출력 | 브라우저 PDF (Ctrl+P) | - | @page 규칙으로 960×540 강제 |
| 버전 관리 | Git | 2.x+ | (선택) 산출물 추적용 |
| 문서 형식 | Markdown | - | frontmatter로 메타데이터 |

**의존성 정책**
- 빌드 도구, 패키지 매니저, npm 의존성 **사용 안 함** (MVP는 순수 파일 기반)
- 외부 교육 조직이 Claude Code만 설치하면 바로 쓸 수 있어야 함

---

## 3. 아키텍처

### 디렉토리 구조
```
Claude Code Lecture Preparation/
├── CLAUDE.md                       ← 프로젝트 루트 지침 (Phase 1)
├── SPEC.md                         ← 이 문서
├── .claude/
│   ├── skills/
│   │   ├── skill-rules.json        ← 3중 트리거 규칙 (Phase 3)
│   │   ├── guide-generator/        ← 가이드 생성 메인 스킬
│   │   │   ├── SKILL.md
│   │   │   └── resources/
│   │   │       ├── slide-structure.md
│   │   │       ├── content-patterns.md
│   │   │       └── examples/
│   │   ├── slide-designer/         ← HTML/CSS 슬라이드 디자인 스킬
│   │   │   ├── SKILL.md
│   │   │   └── resources/
│   │   │       ├── css-template.md
│   │   │       ├── color-palette.md
│   │   │       └── layout-rules.md
│   │   └── install-guide/          ← 설치 가이드 전용 스킬
│   │       ├── SKILL.md
│   │       └── resources/
│   │           └── step-patterns.md
│   └── commands/
│       └── (추후 커스텀 커맨드)
├── templates/                      ← 가이드 유형별 템플릿 MD
│   ├── install-guide.template.md
│   ├── feature-intro.template.md
│   ├── hands-on.template.md
│   └── troubleshooting.template.md
├── dev/
│   └── active/
│       └── mvp-setup/              ← 외부 기억 장치 (Phase 4-B)
│           ├── mvp-setup-plan.md
│           ├── mvp-setup-context.md
│           ├── mvp-setup-tasks.md
│           └── mvp-setup-state.md
├── outputs/                        ← 생성된 가이드 저장소
│   └── [조직명]_[주제]_YYYYMMDD/
│       ├── index.html
│       └── guide.pdf
└── _learnings/
    └── bob-learnings.md
```

### 데이터 흐름
```
사용자 입력 ("X 조직 Claude Design 가이드 만들어줘")
 + 레퍼런스 (URL / 문서 / 요약본)
    ↓
skill-rules.json 트리거 매칭 → guide-generator 활성화
    ↓
① 레퍼런스 수집·파싱 (WebFetch / 파일 읽기)
② 가이드 유형 판별 → templates/ 선택
③ 핵심 개념 추출 → 6장 슬라이드 구조에 매핑
④ slide-designer 호출 → HTML/CSS 렌더링 (디자인 토큰은 고정)
    ↓
outputs/[조직명]_[주제]_YYYYMMDD/index.html 저장
    ↓
사용자 브라우저 Ctrl+P → PDF (안내 포함)
```

---

## 4. 핵심 패턴 & 컨벤션

### 슬라이드 사양 (✅ 2026-04-22 확정 — Claude Design 핸드오프 수용)

| 항목 | 값 |
|------|-----|
| 디자인 캔버스 | **1280 × 720** |
| 인쇄 페이지 | **1920 × 1080** (`@page`, 1.5× 확대) |
| 비율 | 16:9 |
| 렌더링 | `<deck-stage>` 커스텀 엘리먼트 |
| 폰트 sans | Inter + 시스템 폴백 (Pretendard/Noto 추가 검토 중) |
| 폰트 mono | JetBrains Mono + 시스템 폴백 |
| 현재 악센트 | **CCFM Pink `#ff008a`** (Tweaks 패널로 교체 가능) |
| 뉴트럴 시스템 | Airbnb 계열 light/dark 9단계 |
| 컴포넌트 인벤토리 | 14종 고정 (Cover / TOC / 3-up / BA / Steps / Code / Pros-Cons / UseCase / Do-Dont / KPI / Divider / Quote / Image slot / Guide) |
| 슬라이드 변종 | `.slide` / `.slide.tint` / `.slide.ink` |

- 상세 토큰: `.claude/skills/slide-designer/resources/design-tokens.md`
- 실사용 번들: `.claude/skills/slide-designer/resources/template/`
- 제외 규칙: 외부 CSS 프레임워크·아이콘 라이브러리·이미지 CDN 금지, 새 레이아웃 추가 금지, 컨테이너 높이 유동화 금지

### 악센트 이력 (⚠️ 확인 필요)
기존 전역 CLAUDE.md의 CCFM 브랜드 블루 `#1B4FD8` 와 달리, Claude Design 세션에서 **CCFM 로고(마젠타/핑크 별표)와 조화되는 CCFM Pink `#ff008a`** 를 채택. Tweaks 패널로 언제든 블루(Focus Blue `#2f6feb`)로 재전환 가능.

### 콘텐츠 생성은 레퍼런스 기반 (2026-04-22 확정)

개별 가이드의 **콘텐츠는 매번 사용자가 제공하는 레퍼런스**(URL·문서·요약)를 기반으로 생성한다. 디자인(톤앤매너)은 한 번 고정, 콘텐츠(내용)는 매 가이드마다 레퍼런스로 달라짐.

→ 상세는 `docs/content-brief-template.md` 참조.

### 파일 네이밍
- 템플릿: `[유형].template.md`
- 스킬: kebab-case 디렉토리명
- 산출물 폴더: `[조직명]_[주제]_YYYYMMDD`

### 가이드 구성 순서 (사용자 CLAUDE.md 스킬1)
1. 표지 → 2. 왜 만들었나 → 3. 무엇을 할 수 있나 → 4. 기능별 상세 → 5. 결과 화면 예시 → 6. 주의사항/팁

### 템플릿 변수 치환 규칙
```markdown
---
org_name: "{{조직명}}"
topic: "{{주제}}"
date: "{{YYYYMMDD}}"
presenter: "{{발표자}}"
---
```

### DDD 3파일 세트 적용
MVP는 단일 "가이드 생성" 도메인만 존재. 차기 Phase에서 도메인 확장 시 `domain/[도메인]/` 구조로 분리.

---

## 5. 단계별 구현 계획 (Small Chunks)

| Phase | 작업 | 산출물 | 검증 방법 |
|-------|------|--------|-----------|
| 0 | **Spec 작성** (현재) | SPEC.md | 사용자 승인 |
| 1 | CLAUDE.md 작성 | CLAUDE.md (실수 방지 섹션 포함) | Claude Code가 읽고 맥락 파악 가능 |
| 2 | 스킬 3종 골격 생성 | .claude/skills/*/SKILL.md | 디렉토리 구조 완성 |
| 3 | skill-rules.json | 3중 트리거 규칙 | 테스트 프롬프트로 스킬 자동 활성화 확인 |
| 4-B | 4대 문서 생성 | dev/active/mvp-setup/*.md | plan/context/tasks/state 초기화 |
| 5 | 슬라이드 CSS 템플릿 | slide-designer/resources/css-template.md | 기본 HTML 렌더링 시 960×540 유지 |
| 6 | 가이드 유형별 템플릿 MD 4종 | templates/*.template.md | 변수 치환 시 올바른 구조 생성 |
| 7 | 샘플 산출물 1세트 생성 | outputs/샘플_Claude입문_20260421/ | Ctrl+P PDF 변환 깨짐 없음 |
| 8 | README + 외부 사용 가이드 | README.md | 외부 조직이 따라 할 수 있는 수준 |

---

## 6. 검증 체크리스트

### 자동 검증 (가능한 경우)
- [ ] HTML 파일이 브라우저에서 에러 없이 렌더링
- [ ] 슬라이드 크기 960×540 유지 (devtools로 확인)
- [ ] @media print 규칙이 PDF 출력 시 적용됨

### 수동 검증
- [ ] 스킬 트리거 키워드 ("가이드 만들어줘", "강의안", "설치 안내서")로 스킬 자동 활성화
- [ ] 생성된 HTML이 사용자 CLAUDE.md 스킬1 사양 100% 준수 (색상, 폰트, 레이아웃)
- [ ] 조직명/주제만 바꿔 동일 주제 재생성 시 일관된 품질 유지
- [ ] `/outputs/` 폴더 규칙 준수

### 컨텍스트 엔지니어링 준수
- [ ] 4대 문서(plan/context/tasks/state) 최신 상태 유지
- [ ] 메인 대화 컨텍스트 40% 이하 유지
- [ ] 결정 사항은 `state.md`에 누적

---

## 7. 리스크 및 대응

| 리스크 | 대응 |
|--------|------|
| 외부 조직이 사내 맥락(CCFM 브랜드) 그대로 받으면 이상함 | (2026-04-22 결정) CCFM 톤앤매너로 통일 — 분기 없음. 조직명/발표자만 변수 치환 |
| 차기 Phase (웹앱/자동화) 스펙 과잉으로 MVP 지연 | MVP에서는 스킬 파일만. 웹앱 설계는 차기 Spec에서 |
| 스킬 간 중복/충돌 (guide-generator vs slide-designer) | skill-rules.json에서 역할 명확화. slide-designer는 guide-generator가 호출하는 서브 스킬로 포지셔닝 |
| Claude Code 업데이트로 스킬 규격 변경 | `_learnings/bob-learnings.md`에 변경점 누적 추적 |

---

## 8. 승인 요청 사항

다음 중 수정/확인이 필요한 부분을 알려주세요:

1. **프로젝트명** — "Claude 교육 가이드 자동 생성 시스템"으로 OK? 다른 이름?
2. **구현 Phase 순서** — 위 9단계 순서대로 진행 OK?
3. **샘플 산출물 주제** — "Claude Code 입문 교육" 1세트로 OK? 다른 주제?
4. **외부용 브랜딩 처리** — CCFM 블루를 외부용에서는 중립 색상(예: 다크 그레이)으로 대체하는 분기 필요?
5. **Git 저장소화** — `git init` 포함 여부?

승인 시 → Phase 1 (CLAUDE.md) 부터 순서대로 진행합니다.
