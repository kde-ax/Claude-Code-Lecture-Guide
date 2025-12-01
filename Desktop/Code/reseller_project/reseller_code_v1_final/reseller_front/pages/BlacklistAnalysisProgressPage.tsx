import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const progressSteps = [
  { percent: 0, text: '🔄 분석 초기화 중...' },
  { percent: 10, text: '📁 파일 읽기 중...' },
  { percent: 20, text: '📊 Excel 파일 로드 중...' },
  { percent: 35, text: '🔍 블랙리스트 매칭 중...' },
  { percent: 55, text: '⚠️ 의심리스트 매칭 중...' },
  { percent: 75, text: '🎯 당일 주문 패턴 분석 중...' },
  { percent: 90, text: '✨ 분석 결과 정리 중...' },
  { percent: 100, text: '🎉 분석 완료!' },
];

const BlacklistAnalysisProgressPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(progressSteps[0].text);
  const navigate = useNavigate();
  const location = useLocation();
  
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const { blacklistFile, suspiciousFile, dailyFile } = location.state || {};

    if (!blacklistFile || !suspiciousFile || !dailyFile) {
      alert('파일이 전달되지 않았습니다.');
      navigate('/blacklist');
      return;
    }

    performAnalysis(blacklistFile, suspiciousFile, dailyFile);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const performAnalysis = async (
    blacklistFile: File,
    suspiciousFile: File,
    dailyFile: File
  ) => {
    let progressInterval: NodeJS.Timeout | null = null; 
    
    try {
      const startTime = Date.now();
      const estimatedDuration = 30000; // 30초 예상
      let analysisCompleted = false;
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (analysisCompleted) {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return Math.min(prev + 5, 100);
          }
          
          const elapsed = Date.now() - startTime;
          const calculatedProgress = Math.min((elapsed / estimatedDuration) * 95, 95);
          const newProgress = prev + (calculatedProgress - prev) * 0.15;
          
          const currentStep = progressSteps
            .slice()
            .reverse()
            .find(step => newProgress >= step.percent);
          
          if (currentStep && currentStep.text !== statusText) {
            setStatusText(currentStep.text);
          }
          
          return newProgress;
        });
      }, 100);

      const formData = new FormData();
      formData.append('daily_file', dailyFile);
      formData.append('blacklist_file', blacklistFile);
      formData.append('suspicious_file', suspiciousFile);

      const response = await fetch('http://localhost:8000/api/analyze-blacklist', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('분석 실패');
      }

      const data = await response.json();
      
      analysisCompleted = true;
      
      setStatusText('🎉 분석 완료!');
      setTimeout(() => {
        clearInterval(progressInterval);
        navigate('/blacklist', {
          state: {
            results: data.results,
            stats: data.stats
          }
        });
      }, 1500);
      
    } catch (error) {
    console.error('블랙리스트 분석 실패:', error);
    if (progressInterval) {  // ⬅️ null 체크 추가
      clearInterval(progressInterval);
    }
    navigate('/blacklist/error');
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          블랙리스트 분석 중
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          AI가 블랙리스트를 분석하고 있습니다. 잠시만 기다려 주세요.
        </p>
        
        <div className="my-8">
          <svg 
            className="animate-spin h-12 w-12 text-indigo-600 mx-auto" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ease-linear ${
              progress === 100 ? 'bg-green-600' : 'bg-indigo-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className={`text-sm font-medium ${
          progress === 100 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {statusText} ({Math.round(progress)}%)
        </p>
      </div>
    </div>
  );
};

export default BlacklistAnalysisProgressPage;