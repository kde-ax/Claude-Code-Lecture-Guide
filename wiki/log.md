# 활동 로그

> append-only. prefix 형식: `## [YYYY-MM-DD] {ingest|query|lint|setup|output} | 짧은제목`
> 최근 N건 보기: `grep "^## \[" wiki/log.md | tail -10`

---

## [2026-05-04] setup | LLM-Wiki 초기 셋업
- 카파시 LLM-Wiki 패턴을 CCFM AX팀 환경에 맞춰 적용
- 폴더 구조 생성: `raw/`, `wiki/`, `아웃풋/`
- 스키마 작성: 루트 `CLAUDE.md` + 각 하위 폴더별 `CLAUDE.md`
- `wiki/index.md`, `wiki/log.md` 초기화
- 기존 `Clippings/` 폴더는 raw 동급으로 취급 (Obsidian Web Clipper 호환)
