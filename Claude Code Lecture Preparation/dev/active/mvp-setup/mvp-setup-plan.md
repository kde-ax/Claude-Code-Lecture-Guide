# MVP Setup — 전략 & 아키텍처

> 작업 범위: Phase 1~8 — 스킬 파일 시스템 MVP 완성까지
> 이 문서는 **작업 시작 시 1회 작성**되고, 큰 방향 전환이 있을 때만 개정한다.

---

## 작업 목표
SPEC.md에서 정의한 MVP를 완성한다. 핵심 산출물:
1. 스킬 3종 (guide-generator / slide-designer / install-guide) — **완료**
2. skill-rules.json 3중 트리거 규칙 — **완료**
3. 슬라이드 CSS 공통 베이스 (slide-designer/resources/css-template.md)
4. 가이드 유형별 템플릿 MD 4종 (templates/)
5. 샘플 산출물 1세트 (outputs/CCFM_Claude입문_20260422/)
6. README.md — 외부 사용자용 진입점

## 전략

### 핵심 원칙
- **재사용 > 재작성**: slide-designer CSS 베이스는 한 곳(resources/css-template.md)에만 쓰고 모든 템플릿이 참조
- **변수 중심 설계**: 조직명/주제/발표자는 frontmatter 변수, 본문 콘텐츠만 유형별로 다름
- **샘플이 스펙**: outputs/의 샘플 1세트가 살아있는 레퍼런스 (말보다 강력)
- **MVP 스코프 유지**: 웹앱/자동화는 이 작업에서 제외. 유혹 오면 context.md에 기록하고 넘김

### 컨텍스트 엔지니어링 전략
- 이 MVP는 한 세션 내 완결 가능한 규모
- 단 Phase 5~7 (CSS 템플릿 + 템플릿 MD + 샘플 산출물)은 실작업 분량이 크므로, 필요 시 Explore 서브에이전트로 분리
- 확정 결정은 즉시 `mvp-setup-state.md`로 이동

## 아키텍처 요지

```
사용자 프롬프트 ("CCFM Claude 입문 가이드 만들어줘")
    ↓  [skill-rules.json 트리거 매칭]
guide-generator 활성화
    ↓  [유형 판별: feature-intro]
templates/feature-intro.template.md 선택
    ↓  [frontmatter 변수 치환]
{{org_name}} → "CCFM", {{date}} → "20260422" 등
    ↓  [slide-designer 호출]
CSS 베이스 + 콘텐츠 조립 → HTML 생성
    ↓  [설치 유형이면 install-guide 패턴 추가 참조]
    ↓
outputs/CCFM_Claude입문_20260422/index.html 저장
    ↓
사용자에게 파일 경로 + PDF 변환 방법 안내
```

## 품질 게이트 (Phase 완료 조건)

| Phase | 완료 조건 |
|-------|-----------|
| Phase 5 (CSS 템플릿) | 빈 HTML에 CSS만 적용해도 960×540 프레임이 렌더링 |
| Phase 6 (템플릿 MD 4종) | 각 템플릿을 하드코딩 값으로 치환 시 온전한 HTML 산출 |
| Phase 7 (샘플) | 브라우저에서 열어 Ctrl+P로 PDF 저장 시 깨짐 없음 |
| Phase 8 (README) | Claude Code 처음 쓰는 외부 조직이 따라 할 수 있는 수준 |

## 리스크

| 리스크 | 대응 |
|--------|------|
| 템플릿 간 CSS 중복 → 수정 분산 | css-template.md 단일 소스, 템플릿은 link만 |
| Pretendard CDN 장애 시 Noto Sans KR로 폴백 | font-family에 두 번째 값으로 Noto 명시 (이미 적용) |
| PDF 변환 시 배경색 누락 | `print-color-adjust: exact` 필수 (이미 적용) |
| 외부 조직이 organization 변수 빼먹고 쓸까 | 빈 값일 때 "CCFM" 또는 "YOUR_ORG" 기본값 설정 |
