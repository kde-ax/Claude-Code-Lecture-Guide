---
template_id: feature-intro
name: 기능 소개
description: 새 도구/기능의 존재 이유, 차별점, 이점을 설명하는 가장 일반적 가이드
default_slide_count: 10
base_template: .claude/skills/slide-designer/resources/template/deck.html
---

# Feature Intro — 슬롯 매핑

> guide-generator가 `guide_type: feature-intro` 또는 유형 판별 실패 시 기본값으로 사용.

## 필수 입력 (content brief)

```yaml
org_name: 조직명
topic: 기능/도구 이름
date: YYYYMMDD
presenter: (선택)
references: [공식 문서 URL, 블로그 포스트, 영상 요약] (필수)
audience_level: [비개발자 / 주니어 / 시니어 / 혼합]
key_features: [기능 3~5개] (있으면)
```

## 슬라이드 시퀀스 (10장 — Claude Code Workshop과 동일 구조)

### 01 · Cover
- **Component:** `.slide` + `.cover-mark` + `.cover-hero`
- **Slots:**
  - `cover-mark .sub`: `{{topic}} Overview` 또는 `{{org_name}} Workshop`
  - `.kicker`: `{{topic}} · Overview`
  - `h1.t-display`: `{{topic}}<br>{{한국어 부제}}`
  - `p.t-lede`: 한 줄로 "이 도구가 뭘 해결하는가"

### 02 · TOC
- **Component:** `.slide.tint` + `.toc-full`
- **Slots:** 8개 챕터 (본문 흐름 반영)
  기본 구성: ① What & Why ② 기존 방식과의 비교 ③ 핵심 이점 ④ 기본 사용법 ⑤ 심화/실전 ⑥ 장단점 ⑦ 활용 사례 ⑧ 출처·다음 단계

### 03 · What & Why (3-up)
- **Component:** `.slide` + `.three-col` + `.card`
- **Slots:** 도구의 핵심 특징 3가지
  - 각 카드: `.card-numeral` (01/02/03) + `h3` + `p`
  - 긴 설명은 최대 3줄

### 04 · Before / After
- **Component:** `.slide.tint` + `.ba`
- **Slots:**
  - Before 카드: 기존 방식의 불편 5개 (불릿)
  - After 카드 (ink 배경): 새 방식의 개선 5개
- **규칙:** 대응되는 항목끼리 같은 순서로 정렬 (좌측 1번 ↔ 우측 1번)

### 05 · Benefits (3-up + KPI)
- **Component:** `.slide` + `.three-col` + `.card.elevated` + `.kpi`
- **Slots:** 이점 3가지, 각 카드마다:
  - `.kpi .v`: 수치 (예: "3–5×", "0 →", "+1")
  - `.kpi .l`: 수치의 의미
  - `h3`: 이점 제목
  - `p`: 구체 설명
- **규칙:** KPI는 **레퍼런스 기반 수치**만. 임의 수치 금지 (근거 없으면 KPI 제거하고 `.card` 만 사용)

### 06 · 기본 사용법
- **Component:** `.slide.tint` + `.two-col` 또는 `.steps`
- **Slots:**
  - 좌측: `.code` 블록 (가장 기본적인 명령 / 사용 흐름)
  - 우측: `.card` 소형 3개 (자주 쓰는 기능/옵션)
- **대안:** 단계 중심이면 `.steps` 4-step 으로 대체

### 07 · 심화 활용 (선택)
- **Component:** `.slide` + `.two-col`
- **Slots:** 중급~고급 사용법 또는 조합 예시
- 불필요하면 스킵, 기본 시퀀스는 8장으로 축소

### 08 · Pros / Cons
- **Component:** `.slide.tint` + `.two-col` + `.pc.pros` / `.pc.cons`
- **Slots:** 각 5개씩 불릿
- **규칙:** Cons는 솔직하게 (레퍼런스 기반). 없는 Cons 만들지 말 것

### 09 · Use Cases & Cautions
- **Component:** `.slide` + 2-col grid
- **Left:** `.usecase` 카드 2~3개 — CCFM 또는 조직별 실무 사례
- **Right:** `.dd.do` / `.dd.dont` 4~5개 — 사용 시 주의사항

### 10 · References & Next Steps
- **Component:** `.slide.ink`
- **Slots:**
  - `h1.t-title`: "참고 자료 · 다음 단계"
  - 본문 좌/우 2열:
    - 좌: 레퍼런스 URL 목록 (content brief의 references)
    - 우: 다음 학습 단계 (다음 가이드 링크, 커뮤니티, 문의)

## 슬롯 텍스트 한도

- Title: 최대 2줄
- Lede: 최대 3줄
- `.card p`: 최대 3줄
- `.pc li`: 1줄 원칙
- Cover 서브타이틀: 최대 2줄

## 디자인 규칙

- 주제별 악센트 변경: 인스턴스 HTML 상단 `--accent` 에 지정
- 슬라이드 변종 패턴: 기본 → tint → 기본 → tint … 교차 (호흡)
- 마지막 10번은 `.slide.ink` 로 대조 효과

## 산출 경로
`outputs/{{org_name}}_{{topic}}_{{date}}/index.html`
