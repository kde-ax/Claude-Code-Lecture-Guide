# Obsidian Web Clipper 커스텀 템플릿 (LLM-Wiki 용)

5종 템플릿 — 모두 `raw/inbox/`에 저장되며, ingest 단계에서 `wiki/sources/`로 정리·이동됨.

| 파일 | 트리거 도메인 | 노트명 prefix |
|------|---------------|---------------|
| `01_일반아티클.json` | (트리거 없음, 수동 선택) | `YYYYMMDD_제목` |
| `02_유튜브.json` | youtube.com / youtu.be | `YYYYMMDD_YT_제목` |
| `03_팟캐스트.json` | Spotify / Apple Podcasts / Overcast / Pocket Casts 외 | `YYYYMMDD_PC_제목` |
| `04_책.json` | Amazon / Goodreads / 알라딘 / 교보 / Yes24 / 리디 | `YYYYMMDD_BOOK_제목` |
| `05_리서치논문.json` | arXiv / bioRxiv / OpenReview / ACL / NeurIPS / DOI 외 | `YYYYMMDD_PAPER_제목` |

## 임포트 방법

1. Obsidian Web Clipper 확장 → **Settings → Templates**
2. 우측 상단 **Import** → 위 JSON 파일 선택
3. 모든 템플릿이 자동으로 `raw/inbox/`에 저장되도록 path 설정됨

## 공통 frontmatter 필드

- `type: source` — 위키 페이지 타입
- `source_type: article|youtube|podcast|book|paper`
- `status: raw` — ingest 전 상태 (Claude가 처리 후 `processed` 또는 `wiki/sources/`로 이동하며 제거)
- `tags: source/{타입}, inbox`

## ingest 흐름

```
raw/inbox/20260504_PAPER_xxx.md   (Web Clipper 자동)
    ↓ "이거 넣어줘"
wiki/sources/20260504_xxx.md       (Claude 작성)
+ wiki/entities/, wiki/concepts/    (관련 페이지 갱신)
+ wiki/index.md, wiki/log.md        (인덱스/로그 갱신)
```
