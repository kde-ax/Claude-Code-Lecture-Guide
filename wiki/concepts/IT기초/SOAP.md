---
title: SOAP (Simple Object Access Protocol)
type: concept
area: IT기초
tags: [SOAP, API, XML]
aliases: [Simple Object Access Protocol]
created: 2026-05-04
updated: 2026-05-04
sources: [[20260504_AWS-API란]]
---

## 정의

SOAP은 **XML 기반의 메시지 형식을 사용하는** [[API]] 통신 프로토콜이다. 1990년대 후반에 표준화되었고, 한때 기업용 시스템 간 통신의 표준이었다 [[20260504_AWS-API란]].

이름의 풀이: **S**imple **O**bject **A**ccess **P**rotocol — 간단한 객체 접근 프로토콜.
다만 실제로는 그렇게 단순하지 않다는 평이 많다.

## 핵심 메커니즘

요청과 응답 모두 정해진 구조의 XML 문서다.

```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <!-- 메타데이터 (인증, 라우팅 등) -->
  </soap:Header>
  <soap:Body>
    <m:GetUser xmlns:m="http://example.com/users">
      <m:UserId>123</m:UserId>
    </m:GetUser>
  </soap:Body>
</soap:Envelope>
```

엄격한 스키마(WSDL)로 모든 입력·출력 형식이 사전에 정의되며, 그 스키마에 맞지 않으면 요청이 거부된다.

## 일상 비유

서류 양식이 빡빡한 정부 민원 창구.
- 모든 신청서가 **정해진 칸**에, **정해진 글씨체**로 작성되어야 함
- 누락이나 오타가 있으면 **반려**
- 대신 양식이 통과되면 처리 결과가 매우 명확하고 신뢰할 수 있음

## 장점

- **엄격한 표준**: 형식이 명확해 대규모 기업 시스템에 안정적
- **보안 표준 풍부**: WS-Security 등 엔터프라이즈 보안 스펙 보유
- **트랜잭션 지원**: 분산 트랜잭션 표준이 잘 정의됨
- **언어 독립**: XML 기반이라 어떤 언어에서도 파싱 가능

## 단점

- **무겁다**: XML이라 같은 데이터를 [[REST-API]]의 JSON보다 훨씬 큰 용량으로 전송
- **복잡하다**: 직접 SOAP 메시지 작성·디버깅이 까다로움
- **유연성 낮음**: 스키마 변경이 어렵고, 클라이언트도 함께 업데이트 필요
- **모바일·웹 친화도 낮음**: 브라우저에서 다루기 어렵다

## 지금은?

대부분의 신규 시스템은 [[REST-API]]나 [[GraphQL]]을 채택한다. SOAP은 다음 영역에서 여전히 살아있다:
- 은행, 보험, 의료 등 **레거시 엔터프라이즈 시스템**
- 정부·공공기관 데이터 연동
- 전자결제 (일부 구식 PG사)

## 관련 개념

- 상위: [[API]]
- 비교: [[REST-API]] (현대 표준), [[RPC]] (호출 방식 유사), [[GraphQL]]
