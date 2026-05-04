---
title: "LLM이란 무엇인가요? - 대규모 언어 모델 설명"
type: "source"
source_type: "paper"
source_url: "https://aws.amazon.com/ko/what-is/large-language-model/"
authors:
  - "[[Amazon Web Services]]"
venue:
doi:
arxiv_id: "https://aws.amazon.com/ko/what-is/large-language-model/"
abstract: "대규모 언어 모델이 무엇인지, 왜 LLM을 사용해야 하는지 알아보세요. 엔터프라이즈 AI의 이점과 이를 사용하여 텍스트, 대화, 이미지, 비디오 및 오디오를 비롯한 새로운 콘텐츠와 아이디어를 만들 수 있는 방법을 알아보세요."
published:
reading_status: "to-read"
created: 2026-05-04
updated: 2026-05-04
tags:
  - "source/paper"
  - "inbox"
status: "raw"
---
# LLM이란 무엇인가요? - 대규모 언어 모델 설명

> **저자**: Amazon Web Services
> **출처**: [amazon.com](https://aws.amazon.com/ko/what-is/large-language-model/)
> **발행**: 
> **DOI / arXiv**: 
> **클리핑**: 2026-05-04T14:55:04+09:00

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

대규모 언어 모델이 무엇인지, 왜 LLM을 사용해야 하는지 알아보세요. 엔터프라이즈 AI의 이점과 이를 사용하여 텍스트, 대화, 이미지, 비디오 및 오디오를 비롯한 새로운 콘텐츠와 아이디어를 만들 수 있는 방법을 알아보세요.

## 본문

- [클라우드 컴퓨팅이란 무엇인가요?](https://aws.amazon.com/what-is-cloud-computing/)
- [클라우드 컴퓨팅 개념 허브](https://aws.amazon.com/what-is/)
- 생성형 AI

## 대규모 언어 모델(LLM)이란 무엇인가요?

[AWS 계정 생성](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?pg=what_is_header)

## 대규모 언어 모델이란 무엇인가요?

대규모 언어 모델(LLM)은 방대한 양의 데이터로 사전 학습된 초대형 [딥 러닝](https://aws.amazon.com/what-is/deep-learning/) 모델입니다. 기본 트랜스포머는 셀프 어텐션(self-attention) 기능을 갖춘 인코더와 디코더로 구성된 [신경망](https://aws.amazon.com/what-is/neural-network/) 세트입니다. 인코더와 디코더는 일련의 텍스트에서 의미를 추출하고 텍스트 내의 단어와 구문 간의 관계를 이해합니다.

트랜스포머 LLM은 비지도 학습이 가능하지만 더 정확한 설명은 트랜스포머가 자체 학습을 수행한다는 것입니다. 이 과정을 통해 트랜스포머는 기본 문법, 언어 및 지식을 이해하는 법을 배웁니다.

입력을 순차적으로 처리하는 이전의 순환 신경망(RNN)과 달리 트랜스포머 전체 시퀀스를 병렬로 처리합니다. 이를 통해 데이터 사이언티스트는 GPU를 사용하여 트랜스포머 기반 LLM을 학습할 수 있어 훈련 시간을 크게 줄일 수 있습니다.

트랜스포머 신경망 아키텍처를 사용하면 종종 수천억 개의 파라미터가 포함된 매우 큰 모델을 사용할 수 있습니다. 이러한 대규모 모델은 주로 인터넷뿐만 아니라 500억 개 이상의 웹 페이지로 구성된 [Common Crawl과](https://registry.opendata.aws/commoncrawl/) 약 5,700만 페이지로 구성된 Wikipedia와 같은 출처에서도 엄청난 양의 데이터를 수집할 수 있습니다.

[신경망에 대해 자세히 읽어보기 »](https://aws.amazon.com/what-is/neural-network/)

[딥 러닝에 대해 자세히 읽어보기 »](https://aws.amazon.com/what-is/deep-learning/)

## 대규모 언어 모델이 중요한 이유는 무엇인가요?

대형 언어 모델은 매우 유연합니다. 한 모델은 질문에 답하고, 문서를 요약하고, 언어를 번역하고, 문장을 완성하는 등 완전히 다른 작업을 수행할 수 있습니다. LLM은 콘텐츠 제작과 사람들이 검색 엔진 및 가상 어시스턴트를 사용하는 방식을 방해할 가능성이 있습니다.

LLM은 완벽하지는 않지만 비교적 적은 수의 프롬프트 또는 입력을 기반으로 예측하는 놀라운 능력을 보여주고 있습니다. LLM은 [제너레이티브 AI](https://aws.amazon.com/ai/generative-ai/) (인공 지능) 에 사용하여 인간 언어의 입력 프롬프트를 기반으로 콘텐츠를 생성할 수 있습니다.

LLM은 아주 아주 큽니다. 수십억 개의 파라미터를 고려할 수 있으며 다양한 용도로 사용할 수 있습니다. 다음은 몇 가지 예시입니다.

- 오픈 AI의 GPT-3 모델에는 1,750억 개의 파라미터가 있습니다. 그의 사촌인 ChatGPT는 데이터에서 패턴을 식별하고 자연스럽고 읽기 쉬운 결과를 생성할 수 있습니다. Claude 2의 크기는 알 수 없지만 각 프롬프트에 최대 10만 개의 토큰을 입력할 수 있습니다. 즉, 수백 페이지에 달하는 기술 문서 또는 책 전체를 처리할 수 있습니다.
- AI21 Labs의 Jurassic-1 모델에는 1,780억 개의 파라미터와 25만 단어 파트로 구성된 토큰 어휘 그리고 유사한 대화형 기능이 있습니다.
- Cohere의 Command 모델은 기능이 비슷하며 100개 이상의 다른 언어에서 작동할 수 있습니다.
- LightOn의 패러다임은 GPT-3 기능을 능가하는 기능을 갖춘 기본 모델을 제공합니다. 이러한 모든 LLM에는 개발자가 고유한 생성형 AI 애플리케이션을 만들 수 있는 API가 함께 제공됩니다.

[제너레이티브 AI에 대해 자세히 알아보기](https://aws.amazon.com/what-is/generative-ai/) [”](https://aws.amazon.com/what-is/generative-ai/)

[파운데이션 모델에 대해 자세히 읽어보기 »](https://aws.amazon.com/what-is/foundation-models/)

## 대규모 언어 모델은 어떻게 작동할까요?

LLM 작동 방식의 핵심 요소는 단어를 나타내는 방식입니다. 이전 형태의 [기계 학습](https://aws.amazon.com/what-is/machine-learning/) 은 숫자 표를 사용하여 각 단어를 표현했습니다. 그러나 이러한 형태의 표현으로는 비슷한 의미를 가진 단어와 같은 단어 간의 관계를 인식할 수 없었습니다. 일반적으로 워드 임베딩이라고 하는 다차원 벡터를 사용하여 벡터 공간에서 문맥상 의미가 비슷하거나 다른 관계가 있는 단어가 서로 가깝도록 단어를 표현함으로써 이러한 한계를 극복했습니다.

트랜스포머는 워드 임베딩을 사용하여 인코더를 통해 텍스트를 숫자 표현으로 사전 처리하고 비슷한 의미를 가진 단어 및 구문의 문맥은 물론 품사와 같은 단어 간의 기타 관계를 이해할 수 있습니다. 그러면 LLM은 디코더를 통해 이러한 언어 지식을 적용하여 고유한 출력을 생성할 수 있습니다.

## 대규모 언어 모델의 응용 분야는 무엇인가요?

LLM에는 많은 실용적인 응용 분야가 있습니다.

### 카피라이팅

GPT-3 및 ChatGPT 외에도 Claude, Llama 2, Cohere Command, 및 Jurassiccan이 원본 카피를 씁니다. AI21 Wordspice는 스타일과 음성을 향상시키기 위해 원본 문장의 변경을 제안합니다.

### 지식 기반 답변

지식 집약적 자연어 처리(KI-NLP)라고도 하는 이 기법은 디지털 아카이브의 정보 도움말을 통해 특정 질문에 답할 수 있는 LLM을 말합니다. 일반적인 지식 질문에 답할 수 있는 AI21 Studio 플레이그라운드의 능력을 예로 들 수 있습니다.

### 텍스트 분류

LLM은 클러스터링을 사용하여 비슷한 의미나 감정을 가진 텍스트를 분류할 수 있습니다. 이러한 용도에는 고객 감정 측정, 텍스트 간의 관계 결정 및 문서 검색이 포함됩니다.

### 코드 생성

LLM은 자연어 프롬프트에서 코드를 생성하는 데 능숙합니다. 예로는 GitHub Copilot에서 사용되는 [Amazon CodeWhisperer와](https://aws.amazon.com/codewhisperer/) Open AI의 코덱스가 있습니다. 이 코덱스는 파이썬, 자바스크립트, 루비 및 기타 여러 프로그래밍 언어로 코딩할 수 있습니다. 다른 코딩 응용 분야로는 SQL 쿼리 생성, 셸 명령 작성, 웹 사이트 디자인 등이 있습니다. [AI 코드 생성에 대해 자세히 알아보십시오](https://aws.amazon.com/what-is/ai-coding/).

### 텍스트 생성

코드 생성과 마찬가지로 텍스트 생성은 불완전한 문장을 완성하거나 제품 설명서를 작성하거나 Alexa Create와 같이 짧은 동화를 작성할 수 있습니다.

## 대규모 언어 모델이란 무엇인가요?

트랜스포머 기반 신경망은 매우 큽니다. 이러한 네트워크에는 여러 노드와 계층이 있습니다. 계층의 각 노드는 다음 계층의 모든 노드에 연결되며 각 노드에는 가중치와 편향이 있습니다. 임베딩과 함께 가중치 및 편향을 모델 파라미터라고 합니다. 대형 트랜스포머 기반 신경망에는 수십억 개의 파라미터가 있을 수 있습니다. 모델의 크기는 일반적으로 모델 크기, 파라미터 수, 훈련 데이터 크기 간의 경험적 관계에 의해 결정됩니다.

훈련은 대량의 고품질 데이터를 사용하여 수행됩니다. 훈련 중에 모델은 이전 입력 토큰 시퀀스에서 다음 토큰을 올바르게 예측할 때까지 파라미터 값을 반복적으로 조정합니다. 이는 훈련 예제에서 다음 토큰이 나올 가능성을 극대화하기 위해 파라미터를 조정하도록 모델을 학습시키는 자체 학습 기술을 통해 수행합니다.

일단 훈련되면 LLM은 비교적 작은 지도 데이터 세트를 사용하여 여러 작업을 수행하도록 쉽게 조정할 수 있으며, 이를 미세 조정이라고 합니다.

세 가지 일반적인 학습 모델이 있습니다.

- 제로샷 학습: 기본 LLM은 응답 정확도는 다르지만 대개 프롬프트를 통해 명시적인 훈련 없이 광범위한 요청에 응답할 수 있습니다.
- 퓨샷 학습: 몇 가지 관련 훈련 예제를 제공하면 해당 영역에서 기본 모델 성능이 크게 향상됩니다.
- 미세 조정: 이는 데이터 사이언티스트과 특정 애플리케이션과 관련된 추가 데이터로 파라미터를 조정하도록 기본 모델을 훈련한다는 점에서 퓨샷 학습의 연장입니다.

## LLM의 미래란 무엇인가요?

질문에 답하고 미래의 흥미로운 가능성에 대한 텍스트 포인트를 생성할 수 있는 ChatGPT, Claude 2, Llama 2와 같은 대규모 언어 모델이 도입되었습니다. 느리지만 확실하게 LLM은 인간의 성능에 점점 가까워지고 있습니다. 이러한 LLM의 즉각적인 성공은 인간의 두뇌를 모방하고 일부 상황에서는 이를 능가하는 로봇 유형 LLM에 대한 큰 관심을 반증하고 있습니다. LLM의 미래에 대한 몇 가지 생각은 다음과 같습니다.

### 향상된 기능

인상적이긴 하지만 현재의 기술 수준은 완벽하지 않으며 LLM이 실수를 하지 않는 것은 아닙니다. 그러나 개발자가 편견을 줄이고 오답을 없애는 동시에 성능을 개선하는 방법을 배우면서 새 릴리스에서는 정확도가 향상되고 기능이 향상될 것입니다.

### 시청각 교육

개발자는 텍스트를 사용하여 대부분의 LLM을 훈련시키지만 일부는 비디오 및 오디오 입력을 사용하여 모델을 훈련하기 시작했습니다. 이러한 형태의 훈련은 모델 개발을 가속화하고 자율주행차에 LLM을 사용하는 새로운 가능성을 열어줄 것입니다.

### 업무 환경 혁신

LLM은 직장을 변화시키는 파괴적 요인입니다. LLM은 로봇이 반복적인 제조 작업을 수행하는 것과 같은 방식으로 단조롭고 반복적인 작업을 줄일 수 있을 것입니다. 반복적인 사무 작업, 고객 서비스 [챗봇](https://aws.amazon.com/what-is/chatbot/), 간단한 자동 카피라이팅 등이 가능합니다.

### 대화형 AI

LLM은 의심할 여지 없이 Alexa, Google Assistant, Siri와 같은 자동화된 가상 어시스턴트의 성능을 향상시킬 것입니다. 사용자 의도를 더 잘 해석하고 정교한 명령에 응답할 수 있습니다.

[대화형 AI에 대해 자세히 알아보기](https://aws.amazon.com/what-is/conversational-ai/)

## AWS는 LLM을 어떻게 지원하나요?

AWS는 대규모 언어 모델 개발자에게 여러 가지 가능성을 제공합니다. [Amazon Bedrock은 LLM을](https://aws.amazon.com/bedrock/) 사용하여 [제너레이티브 AI](https://aws.amazon.com/ai/generative-ai/) 애플리케이션을 구축하고 확장할 수 있는 가장 쉬운 방법입니다. Amazon Bedrock은 API를 통해 Amazon 및 주요 AI 스타트업의 LLM을 사용할 수 있게 하는 완전관리형 서비스입니다. 다양한 LLM 중에서 선택하여 사용 사례에 가장 적합한 모델을 찾을 수 있습니다.

Amazon SageMaker JumpStart는 클릭 몇 번으로 배포할 수 있는 기초 모델, 내장 알고리즘 및 사전 구축된 ML 솔루션을 갖춘 기계 학습 허브입니다. SageMaker JumpStart를 사용하면 기초 모델을 비롯한 사전 학습된 모델에 액세스하여 문서 요약 및 이미지 생성과 같은 작업을 수행할 수 있습니다. 사전 훈련된 모델은 데이터를 사용하여 사용 사례에 맞게 완전히 맞춤화할 수 있으며 사용자 인터페이스 또는 SDK를 사용하여 이를 프로덕션 환경에 쉽게 배포할 수 있습니다.

지금 [무료 계정을 만들어 AWS에서 LLM 및 AI를](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) 시작하십시오.

## AWS에서의 다음 단계

### [제품 관련 추가 리소스 확인](https://aws.amazon.com/ai/generative-ai/services/)

AWS 생성형 AI 서비스로 더 빠르게 혁신

### [무료 계정 가입](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html)

AWS 프리 티어에 즉시 액세스할 수 있습니다.

가입

### [콘솔에서 구축 시작](https://console.aws.amazon.com/)

AWS Management Console에서 구축을 시작하세요.

로그인

## Browse all cloud computing concepts

Browse all cloud computing concepts content here:

1 - 8 (293) 표시[2022-08-08](https://aws.amazon.com/what-is/iaas/?trk=faq_card)

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

