import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const IpAnalysisErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">IP 분석 실패</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          IP 분석 중 오류가 발생했습니다. 파일 형식을 확인하거나 다시 시도해주세요.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            • 지원 형식: Excel (.xlsx, .xls), CSV, TXT
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            • 필수 컬럼: 구매자 아이피, 수령인, 수령인 주소, 주문자 휴대전화
          </p>
        </div>
        <div className="mt-6">
          <Button onClick={() => navigate('/ip-analysis')}>
            IP 분석으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IpAnalysisErrorPage;