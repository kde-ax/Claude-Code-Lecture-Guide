
import React from 'react';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

interface PlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const PlanCard: React.FC<PlanProps> = ({ name, price, description, features, isPopular = false }) => {
  return (
    <div className={`relative flex flex-col p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl ${isPopular ? 'border-2 border-indigo-500' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-8 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-b-lg">
          가장 인기있는 플랜
        </div>
      )}
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{price.startsWith('₩') ? '/월' : ''}</span>
      </div>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon />
            <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <button className={`w-full py-3 px-6 text-center rounded-lg font-semibold transition ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-indigo-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
          플랜 선택하기
        </button>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const plans = [
    {
      name: '베이직',
      price: '₩29,000',
      description: '소규모 비즈니스와 스타트업을 위한 플랜입니다.',
      features: ['월 최대 1,000건 주문 분석', '기본 위험도 분석', 'CSV 데이터 내보내기', '이메일 지원'],
    },
    {
      name: '프로',
      price: '₩99,000',
      description: '거래량이 많은 성장 중인 비즈니스를 위한 플랜입니다.',
      features: ['월 최대 10,000건 주문 분석', '고급 AI 분석', 'PDF & CSV 내보내기', '우선 이메일 지원', 'API 접근 (예정)'],
      isPopular: true,
    },
    {
      name: '엔터프라이즈',
      price: '별도 문의',
      description: '대규모 운영 및 맞춤형 솔루션이 필요한 기업을 위한 플랜입니다.',
      features: ['주문 건수 무제한', '맞춤형 AI 모델', '전담 계정 관리자', '24/7 전화 지원', '온프레미스 배포 가능'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">요금제 안내</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">귀사의 비즈니스에 가장 적합한 플랜을 선택하세요.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
