---
template_id: troubleshooting
name: 문제해결 가이드
description: 특정 도구/기능에서 자주 발생하는 문제와 해결법을 증상별로 정리
default_slide_count: 8
base_template: .claude/skills/slide-designer/resources/template/deck.html
---

# Troubleshooting — 슬롯 매핑

> guide-generator가 `guide_type: troubleshooting` 로 판별 시 사용.
> "트러블슈팅", "문제해결", "에러 대응", "자주 발생하는 오류" 키워드로 트리거.

## 필수 입력 (content brief)

```yaml
org_name: 조직명
topic: 대상 도구/기능 (예: "Claude Code 실행 오류")
date: YYYYMMDD
presenter: (선택)
references: [공식 이슈 트래커, 공식 문서, Stack Overflow, 커뮤니티 포스트] (필수)
known_issues: [이슈 목록] (각 이슈는 증상·원인·해결·출처)
severity_levels: [critical, blocking, minor] (선택)
```

## 슬라이드 시퀀스 (8장 기본)

### 01 · Cover
- **Slots:**
  - `cover-mark .sub`: `{{topic}} Troubleshooting`
  - `.kicker`: `Troubleshooting Guide`
  - `h1.t-display`: `{{topic}}<br>문제 해결`
  - `p.t-lede`: "가장 자주 마주치는 N가지 이슈와 해결책"

### 02 · TOC (증상 목록)
- **Component:** `.slide.tint` + `.toc-full`
- **Slots:** 다룰 증상 N개 (최대 8개). 각 toc-row:
  - `.n`: 이슈 번호
  - `.t`: 증상 한 줄 요약
  - `.meta`: 심각도 배지 (🔴 Critical / 🟡 Blocking / ⚪ Minor)

### 03 · 증상 분류 (3-up)
- **Component:** `.slide` + `.three-col` + `.card`
- **Slots:** 이슈를 3개 카테고리로 묶기
  - 예: 설치/환경 / 실행 시 에러 / 결과 품질 문제
  - 각 카드에 카테고리별 이슈 수 + 대표 증상

### 04-06 · 증상별 상세 (3장)
- **Component:** `.slide.tint` (짝수) 또는 `.slide` (홀수)
- **Layout:** `.two-col`
- **Left:** 증상 재현 `.code` 블록 (실제 에러 메시지 포함)
- **Right:**
  - `.dd.dont` 카드 — "원인" (왜 발생하는가)
  - `.dd.do` 카드 — "해결" (실제 커맨드/설정 변경)
- **Slots:** `.slide-head`:
  - `.kicker`: `Issue 0N · [심각도]`
  - `h1.t-title`: 증상 제목
  - `p.t-lede`: 언제 주로 발생하는지 한 줄

### 07 · 예방 수칙
- **Component:** `.slide` + `.three-col` + `.usecase`
- **Slots:** 이슈 미연 방지 수칙 3~5개
  - 각 카드: `.tag` (카테고리) + `h4` (수칙) + `p` (이유)
  - 예: "작업 전 Git 커밋", "샘플 데이터로 먼저 테스트", "공식 문서 버전 확인"

### 08 · 더 도움이 필요할 때
- **Component:** `.slide.ink`
- **Slots:**
  - `h1.t-title`: "Still stuck?"
  - 좌측: 공식 채널 (공식 문서, GitHub Issues, Discord 등)
  - 우측: 사내 채널 (Slack `#ax-help`, 이메일, 위키)
  - 하단 crediting line: 레퍼런스 URL + 업데이트 일자

## 슬롯 텍스트 한도

- 증상 제목 (`h1.t-title`): 최대 2줄
- 증상 재현 `.code`: 최대 10줄
- 원인·해결 각각: 3 불릿 이하
- 예방 수칙 p: 1문장

## 디자인 규칙

- **증상 슬라이드 3장(04-06)은 동일 레이아웃** — 탐색 쉽게
- 에러 메시지는 실제 출력 그대로 (색상 없이 모노스페이스)
- 해결 커맨드는 반드시 `.code` 블록으로
- 심각도 이모지는 `.meta` / `.tag` 위치에서만 사용 (본문 X)

## 이슈당 데이터 구조 (content brief의 `known_issues` 각 요소)

```yaml
- id: ISSUE-01
  severity: critical
  symptom: 증상 (한 줄)
  error_output: |
    실제 터미널 출력 또는 에러 메시지
  root_cause: 원인 (1-2문장)
  fix:
    - step: 해결 단계 1
      command: 실제 커맨드
    - step: 해결 단계 2
      command: 실제 커맨드
  source: URL (공식 이슈 / 문서)
```

## 산출 경로
`outputs/{{org_name}}_{{topic}}_{{date}}/index.html`
