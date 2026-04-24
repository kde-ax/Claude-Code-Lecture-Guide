# MVP Setup — 진행 체크리스트

> 실시간 업데이트. 각 항목 완료 시 `[x]`로 표시하고 날짜 기록.

---

## Phase 0 — SDD Spec 작성
- [x] SPEC.md 초안 작성 (2026-04-21)
- [x] 사용자 리뷰 & 승인 (2026-04-22)
- [x] Spec 확정 사항 반영 (2026-04-22)

## Phase 1 — CLAUDE.md
- [x] 프로젝트 루트 CLAUDE.md 작성 (2026-04-22)
- [x] 에이전트 실수 방지 규칙 섹션 포함 (2026-04-22)

## Phase 2 — 스킬 3종 골격
- [x] guide-generator/SKILL.md (2026-04-22)
- [x] slide-designer/SKILL.md (2026-04-22)
- [x] install-guide/SKILL.md (2026-04-22)
- [x] 각 스킬 resources/ 디렉토리 생성 (2026-04-22)

## Phase 3 — skill-rules.json
- [x] 3중 트리거(키워드/의도/경로) 정의 (2026-04-22)
- [x] enforcement 정책 (slide-designer=block) (2026-04-22)

## Phase 4-B — 4대 문서 (외부 기억 장치)
- [x] mvp-setup-plan.md (2026-04-22)
- [x] mvp-setup-context.md (2026-04-22)
- [x] mvp-setup-tasks.md (이 파일) (2026-04-22)
- [x] mvp-setup-state.md (2026-04-22)

## Phase 4.5 — Claude Design 핸드오프 (2026-04-22 완료)
- [x] `docs/claude-design-brief.md` 작성 (2026-04-22)
- [x] `docs/content-brief-template.md` 작성 (2026-04-22)
- [x] SPEC/CLAUDE/slide-designer의 디자인 섹션 TBD로 리셋 (2026-04-22)
- [x] guide-generator에 레퍼런스 입력 단계 추가 (2026-04-22)
- [x] 사용자: Claude Design에서 시안 생성 (`ccfm-guide-remix` 번들) (2026-04-22)
- [x] 사용자: 번들 핸드오프 → `docs/claude-design-bundle/` 저장 (2026-04-22)
- [x] Code: 번들을 `slide-designer/resources/template/`에 등록 (2026-04-22)
- [x] Code: 토큰 추출 → `slide-designer/resources/design-tokens.md` 작성 (2026-04-22)
- [x] Code: 확정 내용을 SPEC/CLAUDE/slide-designer SKILL.md/state.md 에 반영 (2026-04-22)
- [x] Code: 표지 문구 수정 (Claude Code Workshop 용) (2026-04-22)

## Phase 5 — 슬라이드 CSS 공통 베이스 (✅ 2026-04-22 완료)
- [x] 토큰 기반 CSS (`template/assets/tokens.css`) — 번들 수신
- [x] 컴포넌트 인벤토리 14종 — 번들 포함
- [x] layout-rules → design-tokens.md 내 "컴포넌트 인벤토리" 섹션으로 대체
- [x] Pretendard 한글 폰트 스택 추가 (2026-04-22 추가 세션)

## Phase 5.5 — 브라우저 렌더 + PDF 검증 (✅ 2026-04-22 완료)
- [x] deck.html 브라우저 열기 + 시각 확인
- [x] deck-print.html Ctrl+P → PDF 저장 테스트
- [x] 핑크 악센트 + 한글 Pretendard + 배경 그래픽 PDF 반영 확인

## Phase 6 — 가이드 유형별 템플릿 MD 4종 (✅ 2026-04-22 완료)
- [x] templates/install-guide.template.md — 8장, OS 분기·스텝 4개
- [x] templates/feature-intro.template.md — 10장, 기본 feature intro
- [x] templates/hands-on.template.md — 10장, 실습 워크샵용
- [x] templates/troubleshooting.template.md — 8장, 이슈별 구조
- [x] 각 템플릿 frontmatter + 슬롯 매핑 + 길이 한도 포함

## Phase 7 — 샘플 산출물 1세트 (✅ 2026-04-22 완료)
- [x] 주제: "Claude Code Workshop" (표지 문구 수정)
- [x] outputs/CCFM_ClaudeCodeWorkshop_20260422/index.html (+ print.html)
- [x] 브라우저 렌더링 검증 통과
- [x] Ctrl+P PDF 변환 검증 통과
- [x] guide.pdf (980KB, 10페이지) 저장 완료
- [x] 워크샵 README.md 작성

## Phase 8 — README 작성 (✅ 2026-04-22 완료)
- [x] 프로젝트 루트 README.md
- [x] 빠른 시작 + 디자인 시스템 + 가이드 유형 + 디렉토리 구조 + 레퍼런스 원칙 포함

## 최종 검증
- [x] SPEC.md 검증 체크리스트 — 핵심 항목 통과 (슬라이드 960→1280×720, CCFM 톤 유지 등)
- [ ] Git 첫 커밋 (.gitignore 포함) — **사용자 승인 대기**
- [x] _learnings/bob-learnings.md 초기화 — 초기 관찰 기록됨
