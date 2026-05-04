---
title: "API란 무엇인가요? - 애플리케이션 프로그래밍 인터페이스 설명"
type: "source"
source_type: "paper"
source_url: "https://aws.amazon.com/ko/what-is/api/"
authors:
  - "[[Amazon Web Services]]"
venue:
doi:
arxiv_id: "https://aws.amazon.com/ko/what-is/api/"
abstract: "API의 정의, 비즈니스에서 API를 사용하는 방식과 이유, AWS에서 API를 사용하는 방법에 대해 알아보세요."
published:
reading_status: "to-read"
created: 2026-05-04
updated: 2026-05-04
tags:
  - "source/paper"
  - "inbox"
status: "raw"
---
# API란 무엇인가요? - 애플리케이션 프로그래밍 인터페이스 설명

> **저자**: Amazon Web Services
> **출처**: [amazon.com](https://aws.amazon.com/ko/what-is/api/)
> **발행**: 
> **DOI / arXiv**: 
> **클리핑**: 2026-05-04T17:55:51+09:00

## 한 줄 요약 (TL;DR)

_(Claude가 ingest 시 채움)_

## 연구 질문

_(논문이 풀려는 문제)_

## 방법론

_(접근법 / 데이터셋 / 실험 설계)_

## 핵심 결과

_(주요 finding 3~5개)_

## 한계 / 비판 지점

_(저자가 언급한 것 + 내 비판)_

## 인용할 만한 부분

_(원문 인용 + 페이지/섹션)_

## 관련 연구 / 후속 읽을거리

_(Claude가 references에서 추출 → wiki/sources/ 와 연결)_

---

## Abstract

API의 정의, 비즈니스에서 API를 사용하는 방식과 이유, AWS에서 API를 사용하는 방법에 대해 알아보세요.

## 본문

- [클라우드 컴퓨팅이란 무엇인가요?](https://aws.amazon.com/ko/what-is-cloud-computing/)
- [클라우드 컴퓨팅 개념 허브](https://aws.amazon.com/ko/what-is/)
- 애플리케이션 통합

## 애플리케이션 프로그래밍 인터페이스(API)란 무엇인가요?

[AWS 계정 생성](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?pg=what_is_header)

## API란 무엇인가요?

API는 정의 및 프로토콜 집합을 사용하여 두 소프트웨어 구성 요소가 서로 통신할 수 있게 하는 메커니즘입니다. 예를 들어, 기상청의 소프트웨어 시스템에는 일일 기상 데이터가 들어 있습니다. 휴대폰의 날씨 앱은 API를 통해 이 시스템과 ‘대화’하여 휴대폰에 매일 최신 날씨 정보를 표시합니다.

## API는 무엇을 의미하나요?

API는 Application Programming Interface(애플리케이션 프로그래밍 인터페이스)의 줄임말입니다. API의 맥락에서 애플리케이션이라는 단어는 고유한 기능을 가진 모든 소프트웨어를 나타냅니다. 인터페이스는 두 애플리케이션 간의 서비스 계약이라고 할 수 있습니다. 이 계약은 요청과 응답을 사용하여 두 애플리케이션이 서로 통신하는 방법을 정의합니다. API 문서에는 개발자가 이러한 요청과 응답을 구성하는 방법에 대한 정보가 들어 있습니다.

## API는 어떻게 작동하나요?

API 아키텍처는 일반적으로 클라이언트와 서버 측면에서 설명됩니다. 요청을 보내는 애플리케이션을 클라이언트라고 하고 응답을 보내는 애플리케이션을 서버라고 합니다. 따라서 날씨 예에서 기상청의 날씨 데이터베이스는 서버이고 모바일 앱은 클라이언트입니다.

API가 생성된 시기와 이유에 따라 API는 네 가지 방식으로 작동할 수 있습니다.

### SOAP API

이 API는 단순 객체 접근 프로토콜을 사용합니다. 클라이언트와 서버는 XML을 사용하여 메시지를 교환합니다. 과거에 더 많이 사용되었으며 유연성이 떨어지는 API입니다.

### RPC API

이 API를 원격 프로시저 호출이라고 합니다. 클라이언트가 서버에서 함수나 프로시저를 완료하면 서버가 출력을 클라이언트로 다시 전송합니다.

### Websocket API

[Websocket API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html) 는 JSON 객체를 사용하여 데이터를 전달하는 또 다른 최신 웹 API 개발입니다. WebSocket API는 클라이언트 앱과 서버 간의 양방향 통신을 지원합니다. 서버가 연결된 클라이언트에 콜백 메시지를 전송할 수 있어 REST API보다 효율적입니다.

### REST API

오늘날 웹에서 볼 수 있는 가장 많이 사용되고 유연한 API입니다. 클라이언트가 서버에 요청을 데이터로 전송합니다. 서버가 이 클라이언트 입력을 사용하여 내부 함수를 시작하고 출력 데이터를 다시 클라이언트에 반환합니다. 아래에서 REST API에 대해 더 자세히 살펴보겠습니다.

## REST API란 무엇인가요?

REST는 Representational State Transfer의 줄임말입니다. REST는 클라이언트가 서버 데이터에 액세스하는 데 사용할 수 있는 GET, PUT, DELETE 등의 함수 집합을 정의합니다. 클라이언트와 서버는 HTTP를 사용하여 데이터를 교환합니다.

[REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) 의 주된 특성은 무상태입니다. 무상태는 서버가 요청 간에 클라이언트 데이터를 저장하지 않음을 의미합니다. 서버에 대한 클라이언트 요청은 웹 사이트를 방문하기 위해 브라우저에 입력하는 URL과 유사합니다. 서버의 응답은 웹 페이지의 일반적인 그래픽 렌더링이 없는 일반 데이터입니다.

[Rest API에 대해 자세히 알아보기](https://aws.amazon.com/ko/what-is/restful-api/)

## 웹 API란 무엇인가요?

웹 API 또는 웹 서비스 API는 웹 서버와 웹 브라우저 간의 애플리케이션 처리 인터페이스입니다. 모든 웹 서비스는 API이지만 모든 API가 웹 서비스는 아닙니다. REST API는 위에서 설명한 표준 아키텍처 스타일을 사용하는 특수한 유형의 웹 API입니다.

역사적으로 API가 월드 와이드 웹 전에 만들어졌기 때문에 Java API, 서비스 API 등 API에 대한 다양한 용어가 존재합니다. 최신 웹 API는 REST API이며 용어는 서로 바꿔 사용할 수 있습니다.

## API 통합이란 무엇인가요?

API 통합은 클라이언트와 서버 간의 데이터를 자동으로 업데이트하는 소프트웨어 구성 요소입니다. API 통합의 몇 가지 예로 휴대폰 이미지 갤러리에서 클라우드로 데이터 자동 동기화 또는 다른 시간대 여행 시 노트북에서 시간 및 날짜 자동 동기화가 있습니다. 기업은 또한 API 통합을 사용하여 많은 시스템 함수를 효율적으로 자동화할 수 있습니다.

## REST API를 사용하면 어떤 이점이 있나요?

REST API는 다음과 같은 네 가지 주요 이점을 제공합니다.

### 1\. 통합

API는 새로운 애플리케이션을 기존 소프트웨어 시스템과 통합하는 데 사용됩니다. 그러면 각 기능을 처음부터 작성할 필요가 없기 때문에 개발 속도가 빨라집니다. API를 사용하여 기존 코드를 활용할 수 있습니다.

### 2\. 혁신

새로운 앱의 등장으로 전체 산업이 바뀔 수 있습니다. 기업은 신속하게 대응하고 혁신적인 서비스의 신속한 배포를 지원해야 합니다. 전체 코드를 다시 작성할 필요 없이 API 수준에서 변경하여 이를 수행할 수 있습니다.

### 3\. 확장

API는 기업이 다양한 플랫폼에서 고객의 요구 사항을 충족할 수 있는 고유한 기회를 제공합니다. 예를 들어 지도 API를 사용하면 웹 사이트, Android, iOS 등을 통해 지도 정보를 통합할 수 있습니다. 어느 기업이나 무료 또는 유료 API를 사용하여 내부 데이터베이스에 유사한 액세스 권한을 부여할 수 있습니다.

### 4\. 유지 관리의 용이성

API는 두 시스템 간의 게이트웨이 역할을 합니다. API가 영향을 받지 않도록 각 시스템은 내부적으로 변경해야 합니다. 이렇게 하면 한 시스템의 향후 코드 변경이 다른 시스템에 영향을 미치지 않습니다.

## API의 다른 유형은 무엇인가요?

API는 아키텍처와 사용 범위에 따라 분류됩니다. API 아키텍처의 주요 유형은 이미 살펴보았으므로 사용 범위를 살펴보겠습니다.

### 프라이빗 API

프라이빗 API는 기업 내부에 있으며 비즈니스 내에서 시스템과 데이터를 연결하는 데만 사용됩니다.

### 퍼블릭 API

퍼블릭 API는 일반에 공개되며 누구나 사용할 수 있습니다. 이러한 유형의 API와 관련된 권한 부여와 비용이 있을 수도 있고 없을 수도 있습니다.

### 파트너 API

이는 B2B 파트너십을 지원하기 위해 권한이 부여된 외부 개발자만 액세스할 수 있습니다.

### 복합 API

복합 API는 두 개 이상의 서로 다른 API를 결합하여 복잡한 시스템 요구 사항이나 동작을 처리합니다.

## API 엔드포인트는 무엇이며 왜 중요한가요?

API 엔드포인트는 API 통신 시스템의 최종 접점입니다. 여기에는 서버 URL, 서비스 및 시스템 간에 정보가 송수신되는 기타 특정 디지털 위치가 포함됩니다. API 엔드포인트는 두 가지 주요 이유로 기업에 중요합니다.

### 1\. 보안

API 엔드포인트는 시스템을 공격에 취약하게 만듭니다. API 모니터링은 오용을 방지하는 데 중요합니다.

### 2\. 성능

API 엔드포인트, 특히 트래픽이 많은 엔드포인트는 병목 현상을 일으키고 시스템 성능에 영향을 줄 수 있습니다.

## REST API를 보호하려면 어떻게 해야 하나요?

모든 API는 적절한 인증 및 모니터링을 통해 보호되어야 합니다. 다음은 REST API를 보호하는 두 가지 주요 방법입니다.

### 1\. 인증 토큰

인증 토큰은 사용자에게 API 호출을 수행할 수 있는 권한을 부여하는 데 사용됩니다. 인증 토큰은 사용자가 자신이 누구인지 확인하고 해당 특정 API 호출에 대한 액세스 권한이 있는지 확인합니다. 예를 들어, 이메일 서버에 로그인하면 이메일 클라이언트는 보안 액세스를 위해 인증 토큰을 사용합니다.

### 2\. API 키

API 키는 API를 호출하는 프로그램 또는 애플리케이션을 확인합니다. 즉, 애플리케이션을 식별하고 애플리케이션에 특정 API 호출을 수행하는 데 필요한 액세스 권한이 있는지 확인합니다. API 키는 토큰만큼 안전하지 않지만 사용량에 대한 데이터를 수집하기 위해 API 모니터링을 허용합니다. 다른 웹 사이트를 방문할 때 브라우저 URL에서 긴 문자열과 숫자를 본 적이 있을 것입니다. 이 문자열은 웹 사이트가 내부 API 호출을 수행하는 데 사용하는 API 키입니다.

## API는 어떻게 생성하나요?

다른 개발자가 사용하고 싶어하고 신뢰하는 API를 구축하려면 실사와 노력이 필요합니다. 고품질 API 설계에 필요한 5단계는 다음과 같습니다.

### 1\. API 계획

OpenAPI와 같은 API 사양은 API 설계를 위한 블루프린트를 제공합니다. 다양한 사용 사례를 미리 생각하고 API가 현재 API 개발 표준을 준수하는지 확인하는 것이 좋습니다.

### 2\. API 빌드

API 디자이너는 상용 코드를 사용하여 API 프로토타입을 생성합니다. 프로토타입이 테스트되면 개발자는 내부 사양에 맞게 이를 사용자 지정할 수 있습니다.

### 3\. API 테스트

API 테스트는 소프트웨어 테스트와 동일하며 버그 및 결함을 방지하기 위해 수행되어야 합니다. API 테스트 도구로 사이버 공격에 대비하여 API를 강화할 수 있습니다.

### 4\. API 문서화

API는 그 자체로 설명이 필요 없지만 API 문서는 사용 편의성은 높이는 가이드 역할을 합니다. 다양한 기능과 사용 사례를 제공하는 잘 문서화된 API는 서비스 지향 아키텍처에서 더 많이 사용되는 경향이 있습니다.

### 5\. API 마케팅

Amazon이 소매용 온라인 마켓플레이스인 것처럼 API 마켓플레이스는 개발자가 다른 API를 사고 팔기 위해 존재합니다. API를 나열하여 수익을 창출할 수 있습니다.

## API 테스트란 무엇인가요?

API 테스트 전략은 다른 소프트웨어 테스트 방법론과 유사합니다. 서버 응답 검증에 주로 초점을 둡니다. API 테스트에는 다음이 포함됩니다.

- 성능 테스트를 위해 API 엔드포인트에 요청을 여러 번 합니다.
- 비즈니스 로직 및 기능적 정확성을 확인하기 위한 단위 테스트 작성.
- 시스템 공격을 시뮬레이션하여 보안 테스트.

## API 문서는 어떻게 작성하나요?

포괄적인 API 문서 작성은 [API 관리 프로세스](https://aws.amazon.com/api-gateway/api-management/?pg=wianapi&cta=apimgtprcs) 의 일부입니다. API 문서는 도구를 사용하여 자동 생성하거나 수동으로 작성할 수 있습니다. 몇 가지 모범 사례는 다음과 같습니다.

- 간단하고 읽기 쉬운 영어로 설명을 작성합니다. 도구로 생성된 문서는 장황하며 편집이 필요할 수 있습니다.
- 코드 샘플을 사용하여 기능을 설명합니다.
- 문서를 정확하고 최신 상태로 유지합니다.
- 초심자를 위한 작문 스타일을 목표로 합니다.
- API가 사용자를 위해 해결할 수 있는 모든 문제를 다룹니다.

## API는 어떻게 사용하나요?

새 API를 구현하는 단계는 다음과 같습니다.

1. API 키를 받습니다. API 공급 업체의 확인을 받은 계정을 생성하면 됩니다.
2. HTTP API 클라이언트를 설정합니다. 이 도구를 사용하면 수신된 API 키를 사용하여 API 요청을 쉽게 구성할 수 있습니다.
3. API 클라이언트가 없는 경우 API 설명서를 참조하여 브라우저에서 요청을 직접 구성할 수 있습니다.
4. 새 API 구문에 익숙해지면 코드에서 이를 사용하기 시작할 수 있습니다.

## 새 API는 어디에서 찾을 수 있나요?

새로운 웹 API는 API 마켓플레이스 및 API 디렉터리에서 찾을 수 있습니다. API 마켓플레이스는 누구나 판매용 API를 나열할 수 있는 개방형 플랫폼입니다. API 디렉터리는 디렉터리 소유자가 규제하는 제어된 리포지토리입니다. 전문 API 디자이너는 새 API를 디렉터리에 추가하기 전에 평가하고 테스트할 수 있습니다.

인기 있는 몇몇 API 웹 사이트는 다음과 같습니다.

- RapidAPI – 10,000여 개의 퍼블릭 API와 현장에서 활동 중인 1백만 명의 개발자를 만날 수 있는 최대 규모의 글로벌 API 시장입니다. RapidAPI를 통해 사용자는 구매를 결정하기 전에 플랫폼에서 직접 API를 테스트할 수 있습니다.
- Public APIs – 이 플랫폼은 요구 사항에 맞는 API를 쉽게 탐색하고 찾을 수 있도록 원격 API를 40개의 틈새 범주로 그룹화합니다.
- APIForThat 및 APIList – 이 두 웹 사이트에는 사용 방법에 대한 심층 정보와 함께 500여 개의 웹 API 목록이 있습니다.

## API 게이트웨이란 무엇인가요?

API 게이트웨이는 광범위한 백엔드 서비스를 사용하는 기업 클라이언트를 위한 API 관리 도구입니다. API 게이트웨이는 일반적으로 모든 API 호출에 적용할 수 있는 사용자 인증, 통계 및 속도 관리와 같은 일반적인 태스크를 처리합니다.

[Amazon API Gateway](https://aws.amazon.com/ko/api-gateway/?pg=wianapi&cta=amzapigtwy) 는 어떤 규모에서든 개발자가 API를 손쉽게 생성, 게시, 유지 관리, 모니터링 및 보안 유지할 수 있도록 하는 완전관리형 서비스입니다. API Gateway는 트래픽 관리, CORS 지원, 권한 부여 및 액세스 제어, 제한, 모니터링 및 API 버전 관리 등 수천 개의 동시 API 호출을 수신 및 처리하는 데 관계된 모든 태스크를 처리합니다.

## GraphQL이란 무엇인가요?

GraphQL은 API용으로 특별히 개발된 쿼리 언어로서, 클라이언트에게 요청한 데이터만 제공하는 것을 우선으로 합니다. 또한 API를 빠르고 유연하며 개발자 친화적으로 만들도록 설계되었습니다. REST의 대안으로서 GraphQL은 프런트엔드 개발자에게 단일 GraphQL 엔드포인트로 여러 데이터베이스, 마이크로서비스 및, API를 쿼리할 수 있는 기능을 제공합니다. 조직은 애플리케이션을 더 빠르게 개발하는 데 도움이 되기 때문에 GraphQL을 사용하여 API를 빌드하기로 선택합니다. [여기에서 GraphQL에 대해 자세히 알아보세요](https://aws.amazon.com/graphql/).

AWS AppSync는 AWS DynamoDB, AWS Lambda 등의 데이터 소스에 안전하게 연결하는 힘든 작업을 처리하여 GraphQL API 개발을 용이하게 하는 완전관리형 서비스이며, Websocket을 통해 수백만 명의 클라이언트에 실시간 데이터 업데이트를 푸시할 수 있습니다. 모바일 및 웹 애플리케이션의 경우 AppSync는 디바이스가 오프라인 상태일 때 로컬 데이터 액세스 기능도 제공합니다. 배포된 후에는 AWS AppSync가 API 요청 볼륨에 따라 GraphQL API 실행 엔진을 자동으로 확장하고 축소합니다.

## Amazon API 서비스를 받으려면 어떻게 해야 하나요?

애플리케이션 프로그래밍 인터페이스는 현대 소프트웨어 개발의 중요한 부분입니다. 내부 사용자와 외부 사용자 모두를 위한 도구, 게이트웨이 및 마이크로서비스 아키텍처를 포함한 API 인프라에 투자할 가치가 있습니다.

[Amazon API Gateway](https://aws.amazon.com/ko/api-gateway/?pg=wianapi&cta=amzapugateway) 에는 여러 API를 동시에 효율적으로 관리할 수 있는 [모든 기능](https://aws.amazon.com/api-gateway/features/?pg=wianapi&cta=fullrangefeatures) 이 포함되어 있습니다. [AWS Portal에서 가입](https://aws.amazon.com/ko/api-gateway/pricing/?pg=wianapi&cta=awssignupportal) 하면 최대 100만 개의 API 호출을 무료로 만들 수 있습니다.

[AWS AppSync](https://aws.amazon.com/ko/appsync/?pg=wianapi&cta=awsappsync) 는 기본 제공되는 고가용성 서버리스 인프라를 통해 완전관리형 GraphQL API 설정, 관리 및 유지 관리를 제공합니다. 사용한 만큼만 비용을 지불하며 최소 요금이나 의무 서비스 사용량은 없습니다. 시작하려면 AWS AppSync 콘솔에 로그인하세요.

## AWS의 다음 단계

### [제품 관련 추가 리소스 확인](https://aws.amazon.com/ko/cloud9/?refid=faq_card)

IDE 서비스에 대해 자세히 알아보기

### [무료 계정 가입](https://aws.amazon.com/api-gateway/pricing/?pg=wianapi&cta=signup)

AWS 프리 티어에 즉시 액세스할 수 있습니다.

가입

### [콘솔에서 구축 시작](https://console.aws.amazon.com/apigateway/home?region=us-east-1#/welcome)

AWS Management Console에서 API 게이트웨이로 구축을 시작하세요.

로그인

## Browse all cloud computing concepts

Browse all cloud computing concepts content here:

0 - 0 (293) 표시[2022-08-08](https://aws.amazon.com/what-is/iaas/?trk=faq_card)

#### What is IaaS (Infrastructure as a Service)?

Infrastructure as a Service (IaaS) is a business model that delivers IT infrastructure like compute, storage, and network resources on a pay-as-you-go basis over the internet. You can use IaaS to request and configure the resources you require to run your applications and IT systems. You are responsible for deploying, maintaining, and supporting your applications, and the IaaS provider is responsible for maintaining the physical infrastructure. Infrastructure as a Service gives you flexibility and control over your IT resources in a cost-effective manner.

Learn more

[View original](https://aws.amazon.com/what-is/iaas/?trk=faq_card)[2022-05-25](https://aws.amazon.com/what-is/machine-translation/?trk=faq_card)

#### What is Machine Translation?

Machine translation is the process of using artificial intelligence to automatically translate text from one language to another without human involvement. Modern machine translation goes beyond simple word-to-word translation to communicate the full meaning of the original language text in the target language. It analyzes all text elements and recognizes how the words influence one another.

Learn more

[View original](https://aws.amazon.com/what-is/machine-translation/?trk=faq_card)[2022-08-12](https://aws.amazon.com/what-is/block-storage/?trk=faq_card)

#### What is Block Storage?

Block storage is technology that controls data storage and storage devices. It takes any data, like a file or database entry, and divides it into blocks of equal sizes. The block storage system then stores the data block on underlying physical storage in a manner that is optimized for fast access and retrieval. Developers prefer block storage for applications that require efficient, fast, and reliable data access. Think of block storage as a more direct pipeline to the data as opposed to file storage which has an extra layer consisting of a file system (NFS, SMB) to process before accessing the data.

Learn more

[View original](https://aws.amazon.com/what-is/block-storage/?trk=faq_card)[2021-09-29](https://aws.amazon.com/relational-database/?trk=faq_card)

#### What is a Relational Database?

A relational database is a collection of data items with pre-defined relationships between them. These items are organized as a set of tables with columns and rows. Tables are used to hold information about the objects to be represented in the database. Each column in a table holds a certain kind of data and a field stores the actual value of an attribute. The rows in the table represent a collection of related values of one object or entity. Each row in a table could be marked with a unique identifier called a primary key, and rows among multiple tables can be made related using foreign keys. This data can be accessed in many different ways without reorganizing the database tables themselves.

Learn more

[View original](https://aws.amazon.com/relational-database/?trk=faq_card)[2023-10-02](https://aws.amazon.com/what-is/advanced-analytics/?trk=faq_card)

#### What is Advanced Analytics?

Advanced analytics is the process of using complex machine learning (ML) and visualization techniques to derive data insights beyond traditional business intelligence. Modern organizations collect vast volumes of data and analyze it to discover hidden patterns and trends. They use the information to improve business process efficiency and customer satisfaction. With advanced analytics, you can take this one step further and use data for future and real-time decision-making. Advanced analytics techniques also derive meaning from unstructured data like social media comments or images. They can help your organization solve complex problems more efficiently. Advancements in cloud computing and data storage have made advanced analytics more affordable and accessible to all organizations.

Learn more

[View original](https://aws.amazon.com/what-is/advanced-analytics/?trk=faq_card)[2023-10-04](https://aws.amazon.com/what-is/gpu/?trk=faq_card)

#### What is a GPU?

A graphics processing unit (GPU) is an electronic circuit that can perform mathematical calculations at high speed. Computing tasks like graphics rendering, machine learning (ML), and video editing require the application of similar mathematical operations on a large dataset. A GPU’s design allows it to perform the same operation on multiple data values in parallel. This increases its processing efficiency for many compute-intensive tasks.

Learn more

[View original](https://aws.amazon.com/what-is/gpu/?trk=faq_card)[2024-08-01](https://aws.amazon.com/what-is/enterprise-ai/?trk=faq_card)

#### What Is Enterprise AI?

Enterprise artificial intelligence (AI) is the adoption of advanced AI technologies within large organizations. Taking AI systems from prototype to production introduces several challenges around scale, performance, data governance, ethics, and regulatory compliance. Enterprise AI includes policies, strategies, infrastructure, and technologies for widespread AI use within a large organization. Even though it requires significant investment and effort, enterprise AI is important for large organizations as AI systems become more mainstream.

Learn more

[View original](https://aws.amazon.com/what-is/enterprise-ai/?trk=faq_card)[2022-05-25](https://aws.amazon.com/what-is/web-hosting/?trk=faq_card)

#### What is Web Hosting?

Web hosting is a service that stores your website or web application and makes it easily accessible across different devices such as desktop, mobile, and tablets. Any web application or website is typically made of many files, such as images, videos, text, and code, that you need to store on special computers called servers. The web hosting service provider maintains, configures, and runs physical servers that you can rent for your files. Website and web application hosting services also provide additional support, such as security, website backup, and website performance, which free up your time so that you can focus on the core functions of your website.

Learn more

[View original](https://aws.amazon.com/what-is/web-hosting/?trk=faq_card)

## Did you find what you were looking for today?

Let us know so we can improve the quality of the content on our pages

---

## 하이라이트

