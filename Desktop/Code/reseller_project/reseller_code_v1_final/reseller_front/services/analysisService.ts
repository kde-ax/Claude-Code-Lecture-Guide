
import { RiskLevel, AnalysisResult } from '../types';

const mockReasons = [
  '동일 주소로 여러 개의 다른 이름으로 주문이 접수되었습니다.',
  '단일 품목에 대한 비정상적으로 많은 수량의 주문입니다.',
  '주문 주소가 알려진 배송 대행지와 일치합니다.',
  '신규 계정에서 연속적으로 빠른 주문이 발생했습니다.',
  '일회용 이메일 주소가 사용되었습니다.',
  '청구 주소와 배송 주소가 서로 다른 국가입니다.',
];

const mockNames = ['김철수', '이영희', '박지성', '최수진', '정다빈', '윤민준', '송혜교', '강동원'];
const mockAddresses = ['서울시 강남구 테헤란로 123', '부산시 해운대구 마린시티로 456', '경기도 성남시 분당구 판교역로 789', '인천시 연수구 송도국제대로 101'];

const generateMockResult = (id: number): AnalysisResult => {
  const riskLevels = [RiskLevel.High, RiskLevel.Medium, RiskLevel.Low, RiskLevel.Low, RiskLevel.Medium];
  const riskLevel = riskLevels[id % riskLevels.length];
  
  return {
    id: `ORD-${1000 + id}`,
    customerName: mockNames[id % mockNames.length],
    customerContact: `010-1234-56${id.toString().padStart(2, '0')}`,
    orderAddress: mockAddresses[id % mockAddresses.length],
    orderId: `ORD-${1000 + id}`,
    orderDate: new Date(Date.now() - id * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    riskLevel,
    reason: riskLevel !== RiskLevel.Low ? mockReasons[id % mockReasons.length] : '의심스러운 활동이 감지되지 않았습니다.',
  };
};

export const simulateAnalysis = (monthlyFile: File, dailyFile: File): Promise<AnalysisResult[]> => {
  console.log('Simulating analysis for:', monthlyFile.name, dailyFile.name);

  return new Promise((resolve, reject) => {
    // Simulate network delay and processing time
    setTimeout(() => {
      // Simulate a potential error
      if (Math.random() < 0.1) { // 10% chance of failure
        reject(new Error('입력 파일을 분석하는 데 실패했습니다. 파일 형식을 확인하고 다시 시도해 주세요.'));
        return;
      }

      const results: AnalysisResult[] = [];
      const numResults = Math.floor(Math.random() * 50) + 50; // 50 to 100 results

      for (let i = 0; i < numResults; i++) {
        results.push(generateMockResult(i));
      }
      
      resolve(results.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    }, 4000); // 4-second delay
  });
};
