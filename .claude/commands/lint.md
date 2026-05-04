---
description: wiki/ 전체 건강 체크 — 깨진 링크·고아·낡음·모순 (CLAUDE.md §3.3)
argument-hint: [스코프 — entities | concepts | sources | synthesis | conversations | all (기본)]
---

# /lint — 위키 점검

CLAUDE.md `§3.3 Lint` 워크플로우를 그대로 수행한다. **보고가 먼저, 수정은 사용자 승인 항목만.**

## 입력

- 스코프: `$ARGUMENTS` (없으면 `all`)
  - `all` → `wiki/` 전체
  - `entities` / `concepts` / `sources` / `synthesis` / `conversations` → 해당 type 폴더만
  - `area:AI` 처럼 area 한정도 허용

## 절차

### 1. 수집

- Glob으로 대상 마크다운 전체 목록 확보.
- 각 파일을 Read해서 frontmatter (`type`, `area`, `tags`, `created`, `updated`, `sources`)와 본문의 위키링크 `[[...]]`, 모순 블록 `⚠️ 모순:`, TBD 블록 `❓ TBD:`를 추출.

### 2. 항목별 점검

다음을 **이 순서로 보고만** 한다 (수정은 아직 X):

#### 🔗 깨진 위키링크
- 본문에 `[[X]]`가 있는데 `wiki/**/X.md`가 없는 경우.
- 단, 의도적인 stub 페이지는 제외 — frontmatter `type` 있고 본문 한 줄짜리는 OK.

#### 🪦 고아 페이지 (inbound 0)
- 어떤 페이지로부터도 `[[Y]]` 링크를 받지 못한 페이지.
- `wiki/index.md`와 `wiki/log.md`는 카운트에서 제외 (인덱스라 외부 inbound 무관).
- `wiki/sources/`는 inbound 적어도 정상일 수 있음 — 같은 area의 entity/concept이 1개라도 참조하는지만 확인.

#### 📚 자체 페이지 없는 빈출 명사
- 본문에 3회 이상 등장하는데 자체 페이지가 없는 고유명사·개념. 후보 5개까지만.

#### ⏰ Stale claim
- 같은 주제에 대해 더 새로운 source(`wiki/sources/{area}/YYYYMMDD_*`)가 있는데도 entity/concept 페이지가 옛 source만 인용 중인 경우.

#### ⚠️ 모순
- 본문 `⚠️ 모순:` 블록 전수 수집.
- 더불어 frontmatter나 본문에서 **상반된 단정**을 한 페이지 쌍 자동 후보 (예: "X는 오픈소스" vs "X는 상용") — 정확도 낮으니 후보로만.

#### ❓ TBD
- `❓ TBD:` 블록 전수 수집. 가장 오래된 것부터.

#### 🏷️ frontmatter 위반
- `type`이 5종(entity/concept/source/synthesis/conversation)이 아닌 페이지
- `area`가 시드 5종 + 승인된 area 외인 페이지
- `updated`가 파일 mtime 보다 7일 이상 뒤처진 페이지 (수동 편집 후 업데이트 누락 의심)
- `sources`가 비어 있는 entity/concept 페이지 (Provenance 누락)

#### 📁 경로 위반
- `wiki/{type}/{area}/` 외에 떠 있는 파일
- 파일명이 §4.3 규칙 위반 (sources/conversations는 `YYYYMMDD_` 접두 필수)

#### 🌐 데이터 갭
- TBD가 많거나 외부 사실 확인이 필요한 항목 중 WebSearch로 메울 만한 것 — 후보로만 제시.

### 3. 보고서 출력

마크다운으로 카테고리별 카운트 + 상세 항목. 예:

```
## 위키 린트 결과 — 2026-05-04 (스코프: all)

🔗 깨진 위키링크: 2건
- [[Karpathy-2026]] in wiki/concepts/메타-위키/LLM-Wiki패턴.md (L42)
- ...

🪦 고아 페이지: 1건
- wiki/entities/도구/Foo.md (inbound 0)

⚠️ 모순: 1건
- [[n8n]] vs [[20260412_n8n공식문서]]: 라이선스 모델 다름

...

총 N건. 어느 항목을 고칠까요?
```

### 4. 사용자 승인 → 수정

- 사용자가 "1, 3, 5번 고쳐" 또는 "전부 고쳐"라고 명시 승인한 항목만 수정.
- 수정 후 `wiki/log.md`에 append:
  ```
  ## [YYYY-MM-DD] lint | 스코프
  - 깨진 링크 2건 수정: [[A]], [[B]]
  - 고아 페이지 1건 보관: wiki/_attic/Foo.md
  - 모순 1건 해소: [[n8n]] frontmatter sources 갱신
  ```
- 자동 수정 안 되는 것 (모순 해소, TBD 채우기 등)은 항목별로 "이건 사용자 판단 필요"라고 남기고 패스.

### 5. 결론 한 줄

- 수정 N건 / 보류 M건 / 사용자 판단 필요 K건.
- 다음 권장 액션 (예: "TBD 5건은 `/ingest`로 새 소스 받아 채우는 게 빠름").

## 가드레일

- **수정은 사용자가 승인한 항목만**. lint는 기본적으로 보고 도구다.
- 고아 페이지를 임의로 삭제하지 않는다. 보존 가치 의심되면 `wiki/_attic/`로 옮기자고 제안만 (사용자 OK 후 이동).
- 모순은 **둘 다 보존**. 한쪽을 지우지 말고 `⚠️ 모순:` 블록과 출처 링크로 명시.
- `raw/`는 lint 대상 아님 (불변 원본).
- `wiki/log.md` 자체는 append-only — 과거 항목을 절대 수정하지 않는다.
- linting 자체로 큰 frontmatter `updated` 갱신을 일괄로 하지 않는다 (변경 없는 파일은 그대로).
