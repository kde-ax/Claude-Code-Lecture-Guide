
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const AnalysisErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">분석 실패</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          분석 중 오류가 발생했습니다. 지원되지 않는 파일 형식이거나 서버 문제일 수 있습니다.
        </p>
        <Button onClick={() => navigate('/')}>
          대시보드로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default AnalysisErrorPage;
