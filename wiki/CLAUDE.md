# wiki/ — Claude 전담 지식베이스

> 이 폴더의 모든 마크다운은 **Claude가 작성·유지·갱신**한다.
> 사용자(강동이)는 주로 읽고, 가끔 직접 편집한다 (그 경우 `updated` 필드 갱신).

---

## 2축 분류 (type × area)

```
wiki/
├── entities/         ← 사람·조직·제품·도구 (type)
├── concepts/         ← 개념·프레임워크·방법론 (type)
├── sources/          ← raw 의 각 원본별 요약 (type)
├── synthesis/        ← 가로지르는 종합 분석 (type)
└── conversations/    ← Claude와의 대화 기록 (type)

각 type 폴더 안에 5개 area 서브폴더:
├── AI/         — LLM, ML, 트랜스포머, 임베딩, AI 모델/연구
├── 자동화/     — n8n, 워크플로우, RPA, Slack봇, Apps Script
├── CCFM-내부/  — 사내 프로젝트·인물·정책·회의 (회의실예약, AX팀)
├── 메타-위키/  — 위키 자체 운영, 카파시 패턴, 클리퍼 템플릿
└── 도구/        — Obsidian, Claude Code, Firebase, GitHub, SaaS
```

> 모든 페이지 경로: `wiki/{type}/{area}/[페이지명].md`

루트 `CLAUDE.md` §3.4(자동 분류) 참고.

---

## 5가지 페이지 타입 상세

### entity (엔티티)
- 고유한 사람·조직·제품·도구·장소
- 파일명: `[엔티티명].md` (예: `n8n.md`, `Andrej-Karpathy.md`, `CCFM-AX팀.md`)
- 본문에는 정체 / 역할 / 관련 소스 / 관련 다른 엔티티

### concept (개념)
- 추상적 아이디어·프레임워크·방법론
- 파일명: `[개념명].md` (예: `LLM-Wiki패턴.md`, `RAG.md`, `Memex.md`)
- 본문에는 정의 / 핵심 메커니즘 / 등장 소스 / 관련 개념

### source (소스 요약)
- `raw/`의 한 원본 = 한 페이지
- 파일명: `YYYYMMDD_[제목].md` (예: `20260504_카파시-LLM-Wiki.md`)
- 본문에는 한줄 요약 / 핵심 takeaway / 주요 인용 / 원본 경로

### synthesis (종합 분석)
- 사용자 질문이나 자체 발견에서 비롯된 가로지르는 분석
- 파일명: `[주제].md` (예: `RAG-vs-위키패턴.md`, `n8n-도입-효과정리.md`)
- 본문에는 질문 / 분석 / 결론 / 참조 소스·엔티티·개념

### conversation (대화 기록)
- Claude와의 세션 중 보존 가치 있는 것만 적재
- 파일명: `YYYYMMDD_[주제].md` (예: `20260504_위키셋업.md`)
- 본문에는 세션 요약 / 결정 사항 / 후속 액션 / 참조 페이지

---

## Area 결정 우선순위

새 페이지를 만들 때 area는 다음 순서로 결정:

1. 본문의 **주된 주제** 키워드가 어느 area에 가장 가까운가
2. 등장한 위키링크들이 주로 어느 area인가
3. 페이지가 여러 area에 걸치면 **가장 본질적인 area 1개** 선택, 나머지는 `tags`로
4. 5개 시드에 안 맞으면 사용자에게 신규 area 제안 → 승인 후 추가

---

## Frontmatter 표준

모든 페이지 필수:

```yaml
---
title: 페이지 제목
type: entity | concept | source | synthesis | conversation
area: AI | 자동화 | CCFM-내부 | 메타-위키 | 도구
tags: [태그1, 태그2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [[20260504_카파시-LLM-Wiki]], [[다른-소스]]
---
```

추가 필드 (선택):
- `aliases`: [동의어, 별칭]
- `status`: draft | reviewed | stale
- `raw_path`: source 페이지 한정, 원본 파일 경로
- `participants`: conversation 한정, [강동이, Claude]

---

## 작성 원칙

1. **모든 주장에 위키링크 또는 출처** — `이 도구는 셀프호스트 가능 [[20260412_n8n-공식문서]]`
2. **위키링크는 파일명만** — `[[n8n]]` 으로 충분, Obsidian이 area 폴더에서 자동 검색
3. **모순은 덮지 말고 명시** — `> ⚠️ 모순: [[X]]는 A라 하지만 [[Y]]는 B라고 함`
4. **미확인은 명시** — `> ❓ TBD: 정확한 출시일 미확인`
5. **한국어로 작성**, 코드·고유명사는 원문 유지
6. **간결하게** — 페이지가 길어지면 sub 페이지로 분할하고 링크

---

## index.md 갱신 규칙

매 페이지 생성·삭제·이름변경 시 즉시 반영. **area 우선, 그 안에서 type별로** 묶음:

```markdown
## AI
**Entities**
- [[Andrej-Karpathy]] — LLM-Wiki 패턴 창시자
**Concepts**
- [[트랜스포머]] — 어텐션 기반 신경망 아키텍처
**Sources**
- [[20260504_카파시-LLM-Wiki]] (2026-05-04)
```

---

## log.md 갱신 규칙

`append-only`. prefix 고정:

```
## [YYYY-MM-DD] {ingest|query|lint|setup|materialize} | 짧은제목
- 변경 1 (area: 자동화)
- 변경 2 (area: 메타-위키)
```

---

## Lint 체크리스트

사용자가 "린트"라고 하면 다음을 점검:

- [ ] 페이지 간 모순 (서로 다른 주장)
- [ ] stale 페이지 (더 새 소스가 반박했는데 미반영)
- [ ] 고아 페이지 (inbound 링크 0)
- [ ] frontmatter `area` 누락 또는 정의되지 않은 area
- [ ] 잘못된 폴더에 있는 페이지 (frontmatter area ≠ 실제 폴더 경로)
- [ ] 본문에 자주 언급되는데 자체 페이지 없는 개념
- [ ] 누락 교차참조
- [ ] frontmatter 누락 / 형식 오류
- [ ] 깨진 위키링크 (`[[없는페이지]]`)

발견한 항목을 보고하고, 사용자 승인 후에만 실제 수정.

---

## 사용자가 직접 편집한 페이지 처리

`updated` 필드 미스매치 또는 형식이 평소와 다르면 **사용자가 직접 손댔다는 신호**다.
이 경우:
1. 즉시 사용자에게 알림
2. 덮어쓰기 전 차이를 보여주고 승인 받기
3. 사용자 편집을 보존하되 메타데이터만 갱신
