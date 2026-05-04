
import React from 'react';
import Card from '../components/ui/Card';

const SupportPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">고객 지원</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h3 className="text-lg font-semibold mb-4">문의하기</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
            궁금한 점이 있거나 도움이 필요하신가요? 저희 지원팀에 문의해 주세요.
            </p>
            <ul className="text-sm space-y-2">
                <li><strong>이메일:</strong> support@reseller-ai.com</li>
                <li><strong>전화:</strong> 02-1234-5678</li>
            </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">자주 묻는 질문 (FAQ)</h3>
           <div className="space-y-3 text-sm">
                <div>
                    <p className="font-semibold">어떤 파일 형식을 지원하나요?</p>
                    <p className="text-gray-500 dark:text-gray-400">현재 CSV, XLS, XLSX 파일을 지원합니다.</p>
                </div>
                 <div>
                    <p className="font-semibold">AI 탐지 정확도는 어느 정도인가요?</p>
                    <p className="text-gray-500 dark:text-gray-400">저희 모델은 수백만 건의 거래 데이터를 기반으로 지속적으로 학습하여 높은 정확도를 제공합니다.</p>
                </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
