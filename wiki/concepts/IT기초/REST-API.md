---
title: REST API
type: concept
area: IT기초
tags: [REST, API, HTTP]
aliases: [REST, Representational State Transfer, RESTful API]
created: 2026-05-04
updated: 2026-05-04
sources: [[20260504_AWS-API란]]
---

## 정의

REST API는 **HTTP 위에서 무상태(stateless) 방식으로 동작하는** [[API]] 아키텍처 스타일이다. 오늘날 웹에서 가장 널리 쓰이는 API 형식이다 [[20260504_AWS-API란]].

REST = **RE**presentational **S**tate **T**ransfer (표현 상태 전송).
이름이 어렵지만 핵심은 "리소스(데이터)를 표현 형태(JSON 등)로 주고받자"는 것.

## 핵심 메커니즘

### 1. HTTP 메서드를 사용

[[HTTP]]의 표준 동사를 그대로 의미 있는 동작에 매핑한다.

| 메서드 | 동작 | 예시 |
|---|---|---|
| **GET** | 조회 | `GET /users/123` — 123번 사용자 정보 가져오기 |
| **POST** | 생성 | `POST /users` — 새 사용자 등록 |
| **PUT** | 전체 수정 | `PUT /users/123` — 123번 정보 통째로 교체 |
| **PATCH** | 일부 수정 | `PATCH /users/123` — 이메일만 변경 |
| **DELETE** | 삭제 | `DELETE /users/123` |

### 2. 무상태 (Stateless)

**서버는 요청 사이에 클라이언트 상태를 저장하지 않는다** [[20260504_AWS-API란]]. 매 요청은 독립적이며, 필요한 인증 정보·파라미터를 매번 다 담아야 한다.

### 3. 리소스 중심 URL

URL이 "자원(noun)"을 표현하고, HTTP 메서드가 "동작(verb)"을 표현한다.

```
좋은 REST URL:
  GET    /articles          ← 글 목록
  GET    /articles/42       ← 42번 글
  POST   /articles          ← 새 글 작성
  DELETE /articles/42       ← 42번 글 삭제

나쁜 URL (REST답지 않음):
  GET /getArticles
  GET /deleteArticle?id=42
```

### 4. JSON으로 데이터 교환

요청·응답 본문은 보통 JSON 형식이다.

```json
// GET /users/123 응답 예시
{
  "id": 123,
  "name": "강동이",
  "team": "AX팀"
}
```

## 일상 비유

자판기를 떠올리면 된다.
- **자판기 = 서버**, 사용자 = 클라이언트
- 동전 넣고 (GET 버튼) → 음료 조회
- 새 번호 등록 버튼 (POST) → 음료 추가
- 자판기는 **누가 와도 똑같이 동작** — 이전 손님이 뭘 샀는지 기억하지 않음 (무상태)

## REST의 장점

- 단순하고 직관적: HTTP만 알면 누구나 호출 가능
- 무상태: 서버 확장이 쉽다 (요청을 어느 서버가 받아도 OK)
- 캐시 가능: GET 요청은 캐싱 가능 → 성능↑
- 표준 도구 풍부: 브라우저, curl, Postman 등으로 즉시 테스트 가능

## 한계

- **N+1 문제**: 관련 데이터를 가져오려면 여러 번 요청해야 할 때가 있음 (예: 글 + 작성자 정보 → 2번 호출)
- **고정된 응답 형식**: 클라이언트가 일부만 필요해도 서버가 정해놓은 전체를 받음
  → 이 두 한계를 [[GraphQL]]이 해결하려 함

## CCFM AX팀과의 연결

거의 모든 클라우드 SaaS와 자동화 도구는 REST API로 통신한다 — Slack, Google Calendar, Sheets, Firebase, [[OpenAI]], [[Claude]] 등 전부.
n8n에서 "HTTP Request" 노드를 쓸 때 호출하는 게 대부분 REST API다.

## 관련 개념

- 상위: [[API]]
- 기반: [[HTTP]]
- 비교: [[SOAP]] (구식), [[GraphQL]] (대안), [[WebSocket]] (실시간)
- 보안: [[API키-와-인증토큰]]
- 운영: [[API게이트웨이]], [[API엔드포인트]]
