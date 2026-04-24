# MVP Setup — 확정 결정 사항

> 채팅에서 확정된 결정만 여기에 기록한다.
> **다음 작업 / 서브에이전트에게는 이 파일만 전달하면 된다. 대화 히스토리 불필요.**

---

## 프로젝트 정체성
- **이름:** Claude 교육 가이드 자동 생성 시스템
- **위치:** `C:\Users\user AEA906\Documents\Claude Code Lecture Preparation`
- **설계 기반:** bob 8-Phase 파이프라인 (`C:\Users\user AEA906\.claude\commands\bob.md`)

## MVP 범위 (2026-04-22 확정)
- **포함:** Claude Code 스킬 3종 + 템플릿 MD 4종 + 샘플 산출물 1세트 + README
- **제외:** 웹앱, 자동 수집 자동화(n8n), Claude 외 도구 확장 — 전부 차기 Phase
- **1순위 타겟:** 외부 교육 요청 조직
- **2순위 타겟:** CCFM 사내 실무자

## 아키텍처 결정
- **스킬 구조:** guide-generator(오케스트레이터) → slide-designer(렌더링) + install-guide(특수 패턴)
- **slide-designer enforcement:** `block` (사양 이탈 시 작업 중단)
- **나머지 스킬 enforcement:** `suggest`
- **템플릿 변수:** `{{org_name}}`, `{{topic}}`, `{{date}}`, `{{presenter}}` — frontmatter로 받음
- **콘텐츠 소스:** 매번 **사용자 제공 레퍼런스**(URL/문서/요약) 기반 — 할루시네이션 금지

## 디자인 방침 (✅ 2026-04-22 확정 — Claude Design 핸드오프 수용)

### 확정 내용
| 항목 | 값 |
|------|-----|
| 디자인 캔버스 | 1280 × 720 |
| 인쇄 페이지 | 1920 × 1080 (`@page`, 1.5× 확대) |
| 비율 | 16:9 |
| 렌더링 | `<deck-stage>` 커스텀 엘리먼트 |
| 폰트 sans | Inter + 시스템 폴백 |
| 폰트 mono | JetBrains Mono + 시스템 폴백 |
| **현재 악센트** | **CCFM Pink `#ff008a`** (Tweaks 교체 가능) |
| 뉴트럴 | Airbnb 계열 light/dark 9단계 |
| 슬라이드 변종 | `.slide` / `.slide.tint` / `.slide.ink` |
| 컴포넌트 인벤토리 | 14종 고정 |

### 번들 위치
- 원본 (참조만): `docs/claude-design-bundle/ccfm-guide-remix/`
- 실사용: `.claude/skills/slide-designer/resources/template/` (deck.html, deck-print.html, deck-stage.js, assets/tokens.css, 로고/커버 이미지)
- 추출 토큰: `.claude/skills/slide-designer/resources/design-tokens.md`

### 악센트 컬러 이력 (⚠️ 사용자 확인 필요)
- **이전** (전역 CLAUDE.md): CCFM 브랜드 블루 `#1B4FD8`
- **현재** (Claude Design 인스턴스): CCFM Pink `#ff008a` — CCFM 로고(마젠타/핑크 별표)와 조화되도록 Claude Design 세션에서 선택됨
- **대응**: Tweaks 패널의 swatches 중 Focus Blue `#2f6feb` 선택 시 블루 복귀 가능. 인스턴스 HTML 상단 `--accent` inline style 수정으로도 가능

### 리셋→확정 이력
- **2026-04-22 (1차)**: 전역 CLAUDE.md 스킬1의 수치(#EFF3FF 등, 960×540)를 임시 채택 → Claude Design 핸드오프 선행을 위해 리셋
- **2026-04-22 (2차, 최종)**: Claude Design `ccfm-guide-remix` 번들 수신 → 번들을 실사용 기준으로 확정. 표지 문구(CCFM Guide Deck-print.html)를 Claude Code Workshop 용으로 수정:
  - "Automation Enablement Guide" → "Claude Code Workshop"
  - 서브타이틀 → "설치부터 간단한 활용 방법까지 — 따라하면 되는 Claude Code 입문"
  - "Version 1.0 · 2026.04" 캡션 삭제
  - "AX Team · 사내 실무자 & 외부 교육용" 캡션 삭제

## 콘텐츠 생성 방침 (2026-04-22 추가)
- 모든 가이드 콘텐츠는 **사용자 제공 레퍼런스 기반**으로 생성
- 레퍼런스가 없으면 guide-generator 는 콘텐츠 생성을 거부하고 먼저 요청
- 콘텐츠 브리프 템플릿: `docs/content-brief-template.md`
- 산출물 마지막 장에 레퍼런스 출처 목록 명시

## 산출물 규칙 (2026-04-23 업데이트)
- 저장 위치: `outputs/[조직명]_[주제]_YYYYMMDD/` — 주제당 1폴더
- HTML 파일: **버전별 분리** — `index_v1.html`, `index_v2.html` / `print_v1.html`, `print_v2.html`
- 최신 버전 = 숫자 최대. 수정 시 **덮어쓰지 않음**, 새 번호로 파일 추가
- PDF: `guide.pdf` (버전 공유), 브라우저 Ctrl+P
- PDF 설정: 용지 디자인 토큰 해상도, 여백 없음, 배경 그래픽 체크
- 변경 내역: 폴더 내 README.md "수정 이력" 섹션

## 기술 스택
- **Claude Code** (최신) + 순수 **HTML/CSS**
- **빌드 도구/npm 의존성 없음** (원칙)
- **Pretendard CDN** (jsdelivr) + 폴백 Noto Sans KR
- **Git** — `git init` 완료 (main 브랜치, 2026-04-22)

## 브리프 문서
| 문서 | 빈도 | 용도 |
|------|------|------|
| `docs/claude-design-brief.md` | 1회 (+ 재개편 시) | Claude Design으로 톤앤매너 확정 |
| `docs/content-brief-template.md` | 매 가이드 | 레퍼런스 기반 콘텐츠 입력 브리프 |

## 확정된 규칙
- 슬라이드 컨테이너 높이 임의 확장 금지
- 메인 컬러 #1B4FD8 이탈 금지
- 외부 CSS 프레임워크 / 아이콘 라이브러리 import 금지
- 모든 템플릿은 `templates/` 아래에 두고, 다른 곳에서 인라인 작성 금지
- 변경된 사양은 SPEC.md → CLAUDE.md → 관련 SKILL.md 순으로 일관 갱신
- Claude Design 토큰 확정 전에는 CSS 베이스·템플릿 MD 작성 착수 금지

## 변경된 결정
- **2026-04-22**: 전역 CLAUDE.md 스킬1의 구체 수치(960×540, #EFF3FF 등)를 그대로 따르기 → **Claude Design 핸드오프 후 재확정**으로 변경
- **2026-04-22**: "샘플 산출물 = Claude Code 입문 교육" 고정 → **샘플은 디자인 시안 검증용일 뿐, 실전 가이드는 레퍼런스 기반 동적 생성**으로 변경

## 완료 상태 (2026-04-22 기준)
- Phase 0 (Spec 승인) — ✅ 완료
- Phase 1 (CLAUDE.md) — ✅ 완료
- Phase 2 (스킬 3종) — ✅ 완료
- Phase 3 (skill-rules.json) — ✅ 완료
- Phase 4-B (4대 문서) — ✅ 완료
- 디자인 브리프 / 콘텐츠 브리프 문서 — ✅ 완료
- Phase 5 (디자인 핸드오프 등록 + 토큰화) — ✅ 완료
- Phase 5.5 (브라우저 렌더·PDF 검증) — ✅ 완료 (사용자 PDF 생성 확인)
- Phase 6 (템플릿 MD 4종) — ✅ 완료 (install / feature-intro / hands-on / troubleshooting)
- Phase 7 (샘플 산출물) — ✅ 완료 (`outputs/CCFM_ClaudeCodeWorkshop_20260422/` 7개 파일 + README)
- Phase 8 (README) — ✅ 완료 (프로젝트 루트 README.md)

**🎉 MVP 완료 (2026-04-22)**

## 사용자 확정 사항 (2026-04-22)
- **악센트**: ✅ CCFM Pink `#ff008a` 유지
- **한글 폰트**: ✅ Pretendard 추가 (jsdelivr CDN)
- **브라우저·PDF 렌더**: ✅ Desktop에 PDF 생성 확인, `outputs/CCFM_ClaudeCodeWorkshop_20260422/guide.pdf` 로 이동
- **콘텐츠 정확성**: ⏸ 슬라이드 2-10은 Claude Design 초기안 그대로. 실제 강의 전 SME 검토 권장 (workshop README에 명시)

## 다음 액션 후보 (MVP 이후)
- **Git 초기 커밋** — 저장소 설정하고 .gitignore 적용. 사용자 승인 필요
- **콘텐츠 정제** — Claude Code Workshop 슬라이드 2-10의 사실 오류 (측정치, 설치 경로 등) 공식 문서 레퍼런스로 보정
- **2차 Phase 스펙** — 웹앱(Next.js + Vercel) 카탈로그 배포 설계
- **3차 Phase 스펙** — 자동 수집 파이프라인 (n8n) 설계
