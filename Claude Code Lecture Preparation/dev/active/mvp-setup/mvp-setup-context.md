# MVP Setup — 결정 이유 & 관련 자료 위치

> 작업 중 **수시로 갱신**. "왜 이렇게 결정했는지" 과정의 기록.
> 확정된 결론은 `mvp-setup-state.md`로 이동.

---

## 참고 자료 위치

| 자료 | 경로 / URL |
|------|-----------|
| 전역 CLAUDE.md (사용자 규칙) | `C:\Users\user AEA906\.claude\CLAUDE.md` |
| bob 파이프라인 지침 | `C:\Users\user AEA906\.claude\commands\bob.md` |
| 프로젝트 Spec | `./SPEC.md` |
| 프로젝트 CLAUDE.md | `./CLAUDE.md` |

## 결정 이유 로그

### 2026-04-22: MVP 범위를 "스킬 파일 시스템만"으로 제한
- **왜:** 웹앱/자동화까지 한 번에 가면 컨텍스트 롯 위험 + 스코프 크리프
- **대안 검토:** 웹앱까지(기각 — 스펙 과잉), 모든 기능(기각 — 리스크 과다)
- **영향:** `/outputs/`는 로컬 파일만. Git 저장소 링크로 공유

### 2026-04-22: 외부/사내 톤앤매너 통일
- **왜:** 사용자 지시. 브랜드 단일화가 운영 단순함 + 정체성 명확
- **대안 검토:** 외부용 중립 컬러 분기(기각)
- **영향:** CSS 분기 없음. 변수 치환은 조직명/발표자만

### 2026-04-22: Claude 디자인 시스템 레퍼런스 차용 (+ CCFM 컬러)
- **왜:** 사용자가 Claude 디자인 기능을 활용하고 싶다는 의도 + 본 프로젝트 톤과 일치
- **구체 차용 요소 (방향성):**
  - 넉넉한 패딩(Anthropic 문서/artifact 스타일)
  - 단정한 모노스페이스 코드 블록
  - 카드 경계선보다 미묘한 그림자 (shadow 기반 구획)
  - 정돈된 타이포 위계 (크기 차이 크게, 굵기 차이 명확하게)
- **영향:** 방향성은 유지하되, 구체 수치는 Claude Design 핸드오프로 확정

### 2026-04-22 (갱신): Claude Design 핸드오프 선행 + 콘텐츠 레퍼런스 기반
- **왜:**
  1. 말로 디자인을 정해서 코드에 박으면 한 번 잘못 꽂힌 값을 계속 끌고 감. 시각 시안 먼저 뽑고 확정하는 게 정확
  2. 가이드 콘텐츠는 매 주제마다 달라지는데, 샘플 하나 고정하면 그게 스펙처럼 굳어버림 → 콘텐츠는 레퍼런스 기반 동적 생성으로
- **변경사항:**
  - SPEC/CLAUDE/slide-designer의 구체 디자인 토큰을 TBD로 리셋 (고정 제약만 유지)
  - `docs/claude-design-brief.md` (1회용) + `docs/content-brief-template.md` (매 가이드용) 분리
  - guide-generator에 Step 0 "레퍼런스 수집" 추가 — 레퍼런스 없으면 콘텐츠 생성 거부
  - "Claude Code 입문" 샘플은 **디자인 시안 판단용**일 뿐, 실전 가이드는 레퍼런스 기반
- **대안 검토:** 기존 방향 유지(기각 — 디자인 박제 위험 + 샘플이 스펙화 위험)
- **영향:** Phase 5 이후는 Claude Design 산출물 수신까지 대기

### 2026-04-22 (확정): Claude Design 핸드오프 수용
- **번들:** `ccfm-guide-remix` (claude.ai 디자인 기능 export — HTML/CSS/JS + assets + chat transcripts)
- **선택 결과:**
  - 해상도: 1280×720 (CSS) / 1920×1080 (print) — 1.5× 확대
  - 악센트: **CCFM Pink `#ff008a`** (전역 CLAUDE.md의 `#1B4FD8` 블루와 다름. CCFM 로고가 마젠타/핑크 별표이기 때문)
  - 시스템: Airbnb 토큰 기반 (Rausch = 원 default)
  - 컴포넌트 14종 고정 인벤토리 (Cover/TOC/3-up/BA/Steps/Code/Pros-Cons/UseCase/Do-Dont/KPI/Divider/Quote/Image slot/Guide)
  - 폰트: Inter + JetBrains Mono (한글 Pretendard 추가 여부는 열린 질문)
- **구현:**
  - 번들을 `.claude/skills/slide-designer/resources/template/` 에 복사
  - `design-tokens.md` 에 모든 토큰 표로 추출
  - slide-designer SKILL.md 의 TBD → 확정 값 테이블로 교체
  - SPEC/CLAUDE/state.md 디자인 섹션 일관 갱신
- **표지 수정:** Claude Code Workshop 용 문구로 교체 (Automation Enablement Guide → Claude Code Workshop, 서브타이틀 교체, Version/Team 캡션 삭제)
- **남은 확인:** 악센트 컬러(Pink vs Blue)는 사용자 확인 필요. Pretendard 추가 여부도 결정 대기

### 2026-04-22: 스킬 3종 역할 분리
- **왜:** bob 스킬의 "도메인별 자동 참조" 원칙 + 재사용성
- **구조:**
  - guide-generator: 오케스트레이터 (사용자 입력 해석 → 템플릿 선택 → 서브 스킬 호출)
  - slide-designer: HTML/CSS 렌더링 전담 (모든 슬라이드 생성의 최종 단계)
  - install-guide: 설치 가이드 특화 패턴 (OS 분기, 커맨드 블록)
- **대안 검토:** 단일 스킬로 전부 통합(기각 — 100줄 초과 + 관심사 분리 깨짐)

### 2026-04-22: skill-rules.json enforcement 정책
- slide-designer만 `block` (사양 이탈 = 프로젝트 가치 훼손이므로 강제)
- 나머지는 `suggest` (유연성 + 스킬 간 협업 허용)

## 열린 질문 (의사결정 대기)

- [ ] 샘플 산출물은 6장 구성으로 한 번에 만들지, 챕터별로 나눌지? → 6장 기본 구성 따르는 것으로 가설 (레퍼런스에 따라 유연화 여지)
- [ ] 템플릿 MD에서 본문 콘텐츠를 어디까지 예시로 채울지? → 구조 뼈대만, 콘텐츠는 레퍼런스로 채움
- [ ] 아이콘 전략 → Claude Design 산출물 확인 후 결정 (이모지 or inline SVG)
- [ ] 해상도 → Claude Design 제안 수용
- [ ] 보조 컬러 4종 → Claude Design 제안 수용 (CCFM 블루와 조화되는 것 선택)

## 유혹 기록 (MVP 범위 밖 아이디어)

> 생각이 떠오르면 여기 적고 MVP에서는 손대지 않는다.

- [아이디어] 가이드 생성 완료 시 슬랙으로 자동 알림 — 차기 n8n 연동
- [아이디어] Claude 디자인 시스템 공식 레퍼런스 링크 수집해 resources에 별도 정리
- [아이디어] outputs/ 인덱스 페이지 자동 생성 (카탈로그 역할) — 웹앱 Phase에서
- [아이디어] 가이드 버전 관리(같은 주제 v1/v2) — Git 브랜치 전략 고민 필요
