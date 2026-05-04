---
title: RPC (Remote Procedure Call)
type: concept
area: IT기초
tags: [RPC, API, gRPC]
aliases: [Remote Procedure Call, 원격 프로시저 호출]
created: 2026-05-04
updated: 2026-05-04
sources: [[20260504_AWS-API란]]
---

## 정의

RPC(원격 프로시저 호출)는 **다른 컴퓨터에 있는 함수를, 마치 내 컴퓨터의 함수처럼 호출**하는 [[API]] 패러다임이다 [[20260504_AWS-API란]].

클라이언트가 함수를 부르면, 내부적으로는 네트워크 너머의 서버가 실행되고 그 결과가 반환된다.

## 핵심 메커니즘

```python
# 일반 함수 호출
result = add(3, 5)

# RPC 호출 (사용 모습은 거의 동일)
result = remote_server.add(3, 5)
```

내부적으로는:
1. 함수명·인자를 **직렬화**(serialize)해서 네트워크로 전송
2. 서버에서 함수 실행
3. 결과를 직렬화해 다시 클라이언트로 반환
4. 클라이언트가 받은 데이터를 결과 객체로 복원

개발자 입장에서는 **로컬 함수 호출처럼 자연스럽게** 다른 서버 기능을 쓸 수 있다.

## 일상 비유

옆 부서에 전화로 일을 부탁하는 것과 같다.
- 직접 가지 않고 전화로 "이 자료 처리해줘"
- 옆 부서가 일하고 결과를 다시 전화로 알려줌
- 호출자 입장에서는 그냥 "내 일이 처리됐다"

[[REST-API]]는 "이 URL로 요청 보내" 식인 데 반해, RPC는 "이 함수 실행해줘" 식이다 — 더 함수 호출 같은 느낌.

## 대표 종류

### gRPC
- Google이 만든 현대 RPC 프레임워크
- HTTP/2 + Protocol Buffers (이진 직렬화)
- 매우 빠르고 효율적 → 마이크로서비스 간 통신 표준
- 양방향 스트리밍 지원

### JSON-RPC
- JSON으로 함수명·인자 전송
- 간단하고 가벼움
- 일부 블록체인·암호화폐 노드에서 사용

### XML-RPC
- 1990년대의 원조 RPC 표준
- 이후 [[SOAP]]으로 발전

## RPC vs [[REST-API]]

| 항목 | RPC | REST |
|---|---|---|
| 사고 방식 | "함수 호출" | "리소스 조회/수정" |
| URL 구조 | `/createUser` | `POST /users` |
| 형식 | 종류마다 다름 (gRPC=protobuf, JSON-RPC=JSON) | 보통 JSON |
| 속도 | gRPC 매우 빠름 | 느린 편 |
| 표준 도구 | gRPC 도구 필요 | 브라우저로도 호출 |

요즘은 외부 노출 API는 [[REST-API]]/[[GraphQL]], 내부 마이크로서비스 간은 gRPC를 쓰는 패턴이 흔하다.

## 관련 개념

- 상위: [[API]]
- 비교: [[REST-API]], [[SOAP]] (XML-RPC 기반), [[GraphQL]]
- 변형: gRPC, JSON-RPC
