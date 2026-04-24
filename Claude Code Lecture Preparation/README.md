# Claude 교육 가이드 자동 생성 시스템

> Claude Code 스킬 + 템플릿 MD로 교육 가이드(HTML 슬라이드 + PDF)를 **일관된 품질로 자동 생성**하는 시스템입니다.
> CCFM AX팀이 개발했고, 외부 교육 요청 조직·사내 실무자 양쪽에 맞게 설계됐습니다.

---

## 무엇을 해결하나

교육 강의안이나 설치 가이드를 매번 수작업으로 만드는 비효율을 없앱니다.

- 매번 PPT/Figma에서 슬라이드를 새로 디자인 × → **확정된 디자인 시스템 자동 적용**
- 콘텐츠를 말로 설명했다가 할루시네이션 × → **공식 문서 URL 등 레퍼런스 기반 생성**
- 사람마다 결과물 품질이 다름 × → **9단계 구조 + 14 컴포넌트 인벤토리로 일관성**

## 빠른 시작 (외부 조직용)

### 사전 준비
1. **Claude Code** 설치 — [공식 가이드](https://docs.claude.com/en/docs/claude-code)
2. 이 저장소를 로컬에 클론 (또는 압축 파일 다운로드)
3. 저장소 루트에서 Claude Code 실행:
   ```bash
   cd "Claude Code Lecture Preparation"
   claude
   ```

### 가이드 생성
Claude Code 대화창에 요청:
```
CCFM 조직 Claude Design 기능 소개 가이드 만들어줘.
레퍼런스: https://www.anthropic.com/news/claude-design
         https://docs.claude.com/...
발표일: 2026.05.10
대상: 비개발자 혼합
```

→ `guide-generator` 스킬이 자동 활성화되어:
1. 레퍼런스 URL을 읽고
2. 적절한 템플릿(install/feature-intro/hands-on/troubleshooting) 선택 후
3. 14 컴포넌트 인벤토리로 10장 HTML 생성
4. `outputs/CCFM_ClaudeDesign_20260510/` 에 산출물 저장

### PDF 변환
```
outputs/[폴더]/print_v<최고 번호>.html 더블클릭 → 자동 인쇄 대화상자
[대상] PDF로 저장 · [여백] 없음 · [배경 그래픽] ✅ 체크
```

### 파일 버전 규칙 (2026-04-23 적용)
- **한 폴더 = 한 주제**, HTML 파일은 버전별로 분리
- 최신: 숫자가 가장 큰 `index_v<N>.html` · `print_v<N>.html`
- 수정 시 덮어쓰지 않고 `_v2`, `_v3` 식으로 새 파일 생성 → 이전 버전 보존
- 에셋(`tokens.css`, 로고, JS) · README · PDF는 버전 공유
- 각 버전의 변경 내역은 해당 폴더 `README.md` 의 "수정 이력" 섹션

## 디자인 시스템

| 항목 | 값 |
|------|-----|
| 해상도 | 1280×720 (스크린) / 1920×1080 (PDF) |
| 비율 | 16:9 |
| 폰트 | Inter (Latin) + Pretendard (한글) + JetBrains Mono (코드) |
| 악센트 | CCFM Pink `#ff008a` (Tweaks 패널로 교체 가능) |
| 뉴트럴 | Airbnb DS 계열 light/dark |
| 컴포넌트 | 14종 고정 (Cover / TOC / 3-up / Before-After / Steps / Code / Pros-Cons / UseCase / Do-Dont / KPI / Divider / Quote / Image slot / Guide) |

원본은 Anthropic Claude Design 기능으로 제작, 번들 위치: `.claude/skills/slide-designer/resources/template/`

## 지원하는 가이드 유형

| 유형 | 언제 | 슬라이드 수 |
|------|------|-------------|
| `install-guide` | 설치·셋업·환경 구성 | 8장 |
| `feature-intro` | 도구/기능 소개 (가장 일반) | 10장 |
| `hands-on` | 실습 워크샵 | 10장 (단계 수 ±) |
| `troubleshooting` | 문제해결 가이드 | 8장 |

각 유형의 슬롯 매핑은 `templates/[유형].template.md` 참조.

## 디렉토리 구조

```
Claude Code Lecture Preparation/
├── README.md                       ← 이 문서
├── CLAUDE.md                       ← Claude Code 프로젝트 지침
├── SPEC.md                         ← 전체 설계서
├── .claude/
│   └── skills/
│       ├── skill-rules.json        ← 스킬 자동 트리거 규칙
│       ├── guide-generator/        ← 오케스트레이터
│       ├── slide-designer/         ← HTML/CSS 렌더링
│       │   └── resources/
│       │       ├── design-tokens.md
│       │       └── template/       ← 디자인 번들 (deck.html, tokens.css, ...)
│       └── install-guide/          ← 설치 가이드 특수 패턴
├── templates/                      ← 가이드 유형별 MD 템플릿 4종
├── docs/                           ← 브리프 문서
│   ├── claude-design-brief.md      ← 1회용: 디자인 톤 확정용
│   └── content-brief-template.md   ← 매 가이드용: 콘텐츠 입력 브리프
├── outputs/                        ← 생성된 가이드 저장소
│   └── [조직]_[주제]_YYYYMMDD/
│       ├── index_v1.html           ← 버전별 파일 (v2, v3 ... 누적)
│       ├── print_v1.html
│       ├── guide.pdf
│       ├── deck-stage.js
│       ├── assets/
│       └── README.md               ← 버전별 변경 내역 기록
├── dev/active/mvp-setup/           ← 외부 기억 장치 (4대 문서)
└── _learnings/                     ← bob 파이프라인 학습 기록
```

## 콘텐츠 레퍼런스 기반 원칙 (중요)

**새 가이드 생성 시 레퍼런스 없으면 `guide-generator` 가 작업을 거부합니다.**

할루시네이션을 막기 위한 원칙으로, 레퍼런스 형태는:
- 공식 문서 URL (`WebFetch` 로 원문 수집)
- YouTube 링크 + 요약/스크립트 첨부 (링크만으로는 부족)
- PDF/문서 파일 (경로 제공 또는 본문 붙여넣기)
- 요약본 텍스트

상세는 `docs/content-brief-template.md` 참조.

## 확장 계획

MVP 이후 Phase:
- **2차 · 웹앱 배포:** Next.js + Vercel로 가이드 카탈로그 정적 배포
- **3차 · 자동 수집:** 새 Claude 기능 URL/요약 입력 → 가이드 자동 생성 (n8n 파이프라인)
- **4차 · Claude 외 확장:** 개별 AI 도구·자동화 툴 가이드까지 확대

## 첫 번째 샘플

`outputs/CCFM_ClaudeCodeWorkshop_20260422/` 에 Claude Code Workshop 가이드 1세트가 있습니다. 10장 HTML + PDF + 메타 README 포함. 새 가이드 생성 시 구조 참고용으로 가장 유용합니다.

## 제작 · 문의

- 제작: CCFM AX팀
- 이메일: ai@ccfm.co.kr
- 설계 기반: [bob 8-Phase 파이프라인](https://이 저장소 외부 참조) — SDD + DDD + Context Engineering

## 라이선스

사내 운영 자산. 외부 공유 시 CCFM AX팀 확인 필요.
