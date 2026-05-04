# raw/ — 불변 원본 폴더

> 이 폴더의 파일은 **사용자(강동이)가 큐레이션해 떨어뜨리는 원본**이다. **Claude는 절대 수정하지 않는다.**

---

## 절대 규칙

1. ❌ **이 폴더 안의 파일을 수정하지 말 것** — 오타 수정, 포맷팅, 요약 추가, 어떤 것도 금지
2. ❌ **이 폴더 안에 새 파일을 자동 생성하지 말 것** (사용자가 명시적으로 "여기 저장해줘"라고 지시한 경우만 예외)
3. ✅ **읽기 전용**으로만 접근 — Read 도구로만 사용
4. ✅ **이 폴더의 내용을 위키에 통합**하는 것이 Claude의 역할 (→ `wiki/sources/`에 요약 페이지 생성)

---

## 하위 구조

```
raw/
├── articles/      ← 웹 기사, 블로그 포스트 (마크다운, html)
├── papers/        ← 논문, 백서 (PDF)
├── transcripts/   ← 회의록, 영상 스크립트
└── assets/        ← 이미지, 차트, 첨부파일
```

소스를 어디에 둘지 애매하면 사용자에게 묻고, 없으면 기본은 `raw/articles/`.

---

## Ingest 시 Claude의 작업 순서

사용자가 "이 파일 넣어줘"라고 하면:

1. 파일 읽기 (이 폴더에서)
2. 핵심 takeaway 3~5개를 사용자에게 보고하고 승인 받기
3. `wiki/sources/YYYYMMDD_[제목].md` 생성 (요약 + 핵심 인용 + 원본 경로 metadata)
4. 등장 엔티티/개념 페이지 생성·갱신 (`wiki/entities/`, `wiki/concepts/`)
5. `wiki/index.md`, `wiki/log.md` 갱신
6. **원본은 그대로 둠** — `raw/`의 어떤 파일도 건드리지 않음

---

## 소스 페이지 frontmatter 예시

`wiki/sources/`에 만들 때 항상 원본을 가리키게:

```yaml
---
title: 카파시 LLM-Wiki 패턴 gist
type: source
tags: [LLM, knowledge-base, RAG, 패턴]
created: 2026-05-04
updated: 2026-05-04
raw_path: raw/articles/karpathy-llm-wiki.md   # ← 원본 위치 명시
source_url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
---
```

---

## Clippings/ 폴더와의 관계

`Clippings/`는 Obsidian Web Clipper의 기본 저장 위치다. 이것도 raw 동급으로 취급하되, 사용자가 정리를 요청하면 `raw/articles/`로 옮겨도 된다 (옮길 때는 사용자에게 먼저 확인).
