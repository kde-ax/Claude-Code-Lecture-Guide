import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeIpFile } from '../services/api';

const progressSteps = [
  { percent: 0, text: '🔄 분석 초기화 중...' },
  { percent: 15, text: '📁 IP 파일 읽기 중...' },
  { percent: 30, text: '🌐 중복 IP 탐지 중...' },
  { percent: 50, text: '📊 다중 주소 패턴 분석 중...' },
  { percent: 70, text: '📱 다중 전화번호 분석 중...' },
  { percent: 85, text: '👥 다중 수령인 분석 중...' },
  { percent: 95, text: '✨ 위험도 계산 중...' },
  { percent: 100, text: '🎉 분석 완료!' },
];

const IpAnalysisProgressPage = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(progressSteps[0].text);
  const navigate = useNavigate();
  const location = useLocation();
  const hasStarted = useRef(false);
  
  const ipFile = location.state?.ipFile as File | undefined;

  useEffect(() => {
    if (!ipFile) {
      alert('파일 정보가 없습니다.');
      navigate('/ip-analysis');
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    const performAnalysis = async () => {
      try {
        const startTime = Date.now();
        const estimatedDuration = 8000;
        let analysisCompleted = false;
        
        const progressInterval = setInterval(() => {
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

        const result = await analyzeIpFile(ipFile);
        
        analysisCompleted = true;
        setStatusText('🎉 분석 완료!');
        
        setTimeout(() => {
          clearInterval(progressInterval);
          navigate('/ip-analysis', { 
            state: { 
              results: result.results,
              stats: result.stats
            },
            replace: true
          });
        }, 1500);
        
      } catch (error) {
        console.error('분석 실패:', error);
        navigate('/ip-analysis/error', { replace: true });
      }
    };

    performAnalysis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          IP 분석 진행 중
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          AI가 IP 데이터를 분석하고 있습니다. 잠시만 기다려 주세요.
        </p>
        
        <div className="my-8">
          <svg 
            className="animate-spin h-12 w-12 text-purple-600 mx-auto" 
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
              progress === 100 ? 'bg-green-600' : 'bg-purple-600'
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

export default IpAnalysisProgressPage;