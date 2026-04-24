---
template_id: install-guide
name: 설치 가이드
description: 도구 설치 / 환경 구성 / 첫 실행까지를 단계별로 설명하는 가이드
default_slide_count: 8
base_template: .claude/skills/slide-designer/resources/template/deck.html
---

# Install Guide — 슬롯 매핑

> guide-generator가 `guide_type: install` 로 판별했을 때 이 템플릿을 따른다.
> 슬라이드는 `base_template` 의 `<section>` 을 복제 후 내용만 교체.

## 필수 입력 (content brief)

```yaml
org_name: 조직명
topic: 도구명 (예: "Claude Code")
date: YYYYMMDD
presenter: (선택)
references: [URL/문서/요약본] (필수)
target_os: [windows, macos, linux] (최소 1개)
prerequisites: [계정, 하드웨어, 사전 설치 도구]
```

## 슬라이드 시퀀스 (8장 기본)

### 01 · Cover
- **Component:** `.slide` + `.cover-mark` + `.cover-hero`
- **Slots:**
  - `cover-mark .name`: `CCFM · AX Team` (고정)
  - `cover-mark .sub`: `{{topic}} Installation` (예: "Claude Code Installation")
  - `.kicker`: `{{topic}} · Getting Started`
  - `h1.t-display`: `{{topic}}<br>설치 가이드`
  - `p.t-lede`: `{{one_liner}}` (설치 성공 시 얻는 것, 1-2문장)
  - 우측 `.cover-graphic`: 터미널 목업 유지 또는 설치 성공 화면으로 교체

### 02 · TOC
- **Component:** `.slide.tint` + `.toc-full`
- **Slots:** 8개 챕터 (2열 x 4행)
  1. 사전 요구사항
  2. (OS 1) 설치
  3. (OS 2) 설치 (필요 시)
  4. 첫 실행 & 로그인
  5. 동작 확인
  6. 자주 쓰는 명령
  7. 문제 해결
  8. 다음 단계

### 03 · Prerequisites
- **Component:** `.slide` + `.three-col` + `.card`
- **Purpose:** OS / 사전 설치 도구 / 계정 3 카드
- **Slots:**
  - Card 1: OS 요구사항 (WSL2, macOS 13+, Ubuntu 20.04+ 등)
  - Card 2: 필수 도구 (Node.js LTS, Git 등 — 버전 명시)
  - Card 3: 계정 (Anthropic 계정, 결제 수단 등)

### 04 · Install Steps (핵심)
- **Component:** `.slide.tint` + `.steps` (`.step` × 4)
- **Slots:** 4단계 (Step 01 ~ Step 04), 각 단계마다:
  - `.step-num`: "Step 0N"
  - `h4`: 단계 제목 (짧게)
  - `p`: 설명 1문장
  - `code`: 실제 커맨드 (복사 가능)
- **규칙:**
  - 다중 OS 지원 시 이 슬라이드를 OS별로 복제 (최대 3장)
  - 각 단계 커맨드는 **공식 문서 기반** — 임의 생성 금지

### 05 · First Run & Verification
- **Component:** `.slide` + `.two-col`
- **Left:** `.code` 블록 — 첫 실행 커맨드 + 예상 출력
- **Right:** 자주 쓰는 명령어 3~5개 (`.card` 소형)
- **Slots:**
  - 좌측: `claude` 같은 진입 커맨드 → 환영 메시지 → 간단한 첫 작업
  - 우측: 각 카드에 커맨드명(mono) + 1줄 설명

### 06 · Troubleshooting
- **Component:** `.slide.tint` + 좌측 `.three-col` (증상 요약) 또는 `.dd.dont` 목록
- **Slots:** 자주 발생 문제 3~5개
  - 증상 (`h4` 또는 `.tag`)
  - 원인 한 줄
  - 해결 커맨드 또는 체크리스트
- **규칙:** 실제 공식 문서 / 커뮤니티에서 확인된 이슈만 포함

### 07 · Next Steps
- **Component:** `.slide` + `.three-col` + `.usecase`
- **Slots:** 설치 완료 후 해볼 수 있는 것 3가지
  - 튜토리얼 / 샘플 프로젝트 / 다음 교육 가이드 링크

### 08 · References & Credits
- **Component:** `.slide.ink`
- **Slots:**
  - `h1.t-title`: "참고 자료"
  - 본문: 레퍼런스 URL 목록 (공식 문서, 블로그 등)
  - 하단: 제작/문의 (CCFM AX팀, 이메일)

## 슬롯 텍스트 한도

- Cover `t-display` 제목: 최대 2줄 (≈30자)
- Cover `t-lede` 서브: 최대 3줄 (≈80자)
- `.step` 설명문 p: 최대 2줄 (≈60자)
- `.step code`: 1줄 원칙 (넘치면 줄바꿈 `<br>` 또는 간략화)
- Troubleshooting 각 항목: 1문장 원칙

## 디자인 규칙

- 악센트 컬러: 인스턴스 HTML 상단 `--accent` 에 지정 (기본은 CCFM Pink `#ff008a`)
- 슬라이드 변종: 기본 `.slide`, 섹션 구분 시 `.slide.tint`, 마지막 크레딧은 `.slide.ink`
- 설치 커맨드는 반드시 `<code>` 또는 `.code` 블록으로 (인라인 mono)

## 산출 경로
`outputs/{{org_name}}_{{topic}}_{{date}}/index.html` (+ print.html, guide.pdf, assets/, README.md)
