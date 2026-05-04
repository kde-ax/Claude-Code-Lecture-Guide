---
template_id: hands-on
name: 실습 가이드
description: 참석자가 단계별로 따라하며 결과물을 만드는 워크샵용 가이드
default_slide_count: 10
base_template: .claude/skills/slide-designer/resources/template/deck.html
---

# Hands-on — 슬롯 매핑

> guide-generator가 `guide_type: hands-on` 로 판별 시 사용.
> "따라하면 되는", "실습", "워크샵", "핸즈온" 키워드로 트리거.

## 필수 입력 (content brief)

```yaml
org_name: 조직명
topic: 실습 주제 (예: "Claude Code로 CSV 정제 자동화")
date: YYYYMMDD
presenter: (선택)
references: [참고 자료 URL] (필수)
duration_min: 세션 길이 (분) — 슬라이드당 시간 배분에 사용
prerequisites: [사전 설치, 사전 지식]
outcome: 실습 후 손에 쥐는 결과물 (1문장)
steps_planned: [단계 목록] (3~5개 권장)
```

## 슬라이드 시퀀스 (10장 기본 · 단계 수에 따라 ±2)

### 01 · Cover
- **Slots:**
  - `cover-mark .sub`: `{{topic}} Hands-on`
  - `.kicker`: `Hands-on · {{duration_min}}분`
  - `h1.t-display`: `{{topic}}`
  - `p.t-lede`: "이 세션이 끝나면 {{outcome}} 를 갖고 돌아갑니다"

### 02 · 오늘의 결과물 (Outcome Preview)
- **Component:** `.slide` + 중앙 `.img-slot` 또는 `.code`
- **Purpose:** 실습 완료 후 모습을 먼저 보여주기 (동기 부여)
- **Slots:**
  - `.kicker`: "Outcome"
  - `h1.t-title`: "오늘 만드는 것"
  - 본문: 결과물 스크린샷 슬롯 또는 최종 코드 스니펫

### 03 · Prerequisites Check
- **Component:** `.slide.tint` + `.three-col` + `.card`
- **Slots:** 시작 전 확인 3 카드
  - Card 1: 설치 확인 (`.code` 로 버전 체크 커맨드)
  - Card 2: 사전 파일/샘플 데이터 위치
  - Card 3: 환경변수 / 계정 / 권한

### 04 · Step 1
- **Component:** `.slide` + `.two-col`
- **Left:** `.code` 블록 (실제 입력할 커맨드/코드)
- **Right:** `h3` + `p` + `.dd.do` (핵심 포인트 1~2개)
- **Slot:** `.slide-head .kicker`: "Step 01" + 단계명

### 05 · Step 2
- 04와 동일 구조, 다른 내용

### 06 · Step 3
- 04와 동일 구조

### 07 · (선택) Step 4 / Step 5
- 단계가 많으면 추가, 적으면 스킵

### 08 · 흔한 오류 & 대응
- **Component:** `.slide.tint` + `.dd.dont` 리스트 또는 `.three-col` + `.usecase`
- **Slots:** 실습 중 막히기 쉬운 지점 3~4개
  - 증상 + 체크포인트 + 해결 커맨드

### 09 · 확장 아이디어
- **Component:** `.slide` + `.three-col` + `.usecase`
- **Purpose:** "오늘 만든 것을 이렇게도 쓸 수 있어요"
- **Slots:** 응용 사례 3가지

### 10 · References & Repo
- **Component:** `.slide.ink`
- **Slots:**
  - 참고 자료 URL
  - 실습 저장소 (GitHub / Notion / 로컬 경로)
  - 문의 채널

## 슬롯 텍스트 한도

- Step `.code` 블록: 최대 15줄 (스크롤 없이 한눈)
- Step 우측 설명: 최대 3 불릿
- 커맨드 한 줄: 최대 80자 (초과 시 `\` 줄바꿈)

## 디자인 규칙

- **Step 슬라이드(04-07)는 동일 레이아웃 유지** — 반복 리듬이 중요
- 코드 블록은 실제 실행 가능해야 함 — 플레이스홀더는 `{{...}}` 로 명시
- Step 번호는 `.kicker` 에 "Step 0N" 형태 유지

## 타이밍 가이드 (참고)

- 짧은 세션(30분): 3 step + 전후 슬라이드 = 8장
- 표준(60분): 4 step = 10장
- 긴 세션(90분+): 5 step + 확장 = 12장

## 산출 경로
`outputs/{{org_name}}_{{topic}}_{{date}}/index.html`
