
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import FileUpload from '../components/dashboard/FileUpload';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalysisResult } from '../types';
import { RiskLevel } from '../types';
import ResultDetailModal from '../components/modals/ResultDetailModal';
import EmailReportModal from '../components/modals/EmailReportModal';

const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.275-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.275.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917L12 23l9-2.083c-1.356-4.234-4.269-7.514-8.382-9.934z" /></svg>;

const getChartData = (results: AnalysisResult[] | null) => {
    if (!results) return [];
    const dataByDate: { [key: string]: { name: string; 고위험: number; 중위험: number; 저위험: number } } = {};
    const riskLevelMap = {
        [RiskLevel.High]: '고위험',
        [RiskLevel.Medium]: '중위험',
        [RiskLevel.Low]: '저위험'
    }

    results.forEach(result => {
        // Safe는 차트에서 제외
        if (result.riskLevel === 'Safe') return;
        
        const date = new Date(result.orderDate).toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (!dataByDate[date]) {
            dataByDate[date] = { name: date, '고위험': 0, '중위험': 0, '저위험': 0 };
        }
        dataByDate[date][riskLevelMap[result.riskLevel]]++;
    });

    return Object.values(dataByDate).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
};

const DashboardPage = () => {
  const { monthlyFile, dailyFile, setMonthlyFile, setDailyFile, startAnalysis, analysisStats, analysisResults, resetAnalysis, selectResult } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');
  const [usage] = useState({ current: 750, limit: 1000 });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all');
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  const monthlyInputRef = useRef<HTMLInputElement>(null);
  const dailyInputRef = useRef<HTMLInputElement>(null);

  const usagePercentage = (usage.current / usage.limit) * 100;

  const FileUploadBox = ({ 
    label, 
    file, 
    onChange, 
    bgColor = 'bg-blue-50',
    inputRef
  }: { 
    label: string; 
    file: File | null; 
    onChange: (file: File | null) => void;
    bgColor?: string;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => {
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.csv'))) {
        onChange(droppedFile);
      } else {
        alert('Excel 또는 CSV 파일만 업로드 가능합니다.');
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <div 
        className={`${bgColor} dark:bg-gray-800 border-2 border-dashed ${
          file 
            ? 'border-green-400 dark:border-green-500' 
            : 'border-gray-300 dark:border-gray-600'
        } rounded-xl p-8 text-center transition-all hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
        
        <div className="flex flex-col items-center gap-3">
          <svg 
            className={`w-12 h-12 ${
              file 
                ? 'text-green-500 dark:text-green-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>

          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {label}
          </h4>

          {file ? (
            <div className="space-y-2 w-full">
              <div className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg">
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate block">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
              >
                제거
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              파일을 Drag & Drop 하거나 클릭하여 업로드
            </p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
  // ⭐ 추가: 대시보드 초기화 로직
  const shouldReset = sessionStorage.getItem('shouldResetDashboard');
  if (shouldReset === 'true') {
    resetAnalysis();
    sessionStorage.removeItem('shouldResetDashboard');
  }

  // 기존 코드
  const handleClickOutside = (event: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
          setIsTemplateDropdownOpen(false);
      }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };
}, [resetAnalysis]); // ⭐ [] → [resetAnalysis]로 변경

  const handleStartAnalysis = async () => {
    navigate('/analysis/progress');
  };
  
  const handleViewDetails = (result: AnalysisResult) => {
    selectResult(result);
    setIsDetailModalOpen(true);
  };

  const filteredResults = useMemo(() => {
    if (!analysisResults) return [];
    if (filter === 'All') return analysisResults;
    return analysisResults.filter((result) => result.riskLevel === filter);
  }, [analysisResults, filter]);

    const handleNewAnalysis = () => {
    resetAnalysis(); // 기존 분석 초기화
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 스크롤 맨 위로
  };

  const chartResults = useMemo(() => {
    if (!analysisResults) return [];
    const riskyResults = analysisResults.filter(r => r.riskLevel !== 'Safe');
    if (chartPeriod === 'all') return riskyResults;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let daysToFilter = 0;
    if (chartPeriod === '7d') daysToFilter = 7;
    else if (chartPeriod === '30d') daysToFilter = 30;
    else if (chartPeriod === '90d') daysToFilter = 90;

    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - (daysToFilter - 1));
    cutoffDate.setHours(0, 0, 0, 0);

    return analysisResults.filter(r => new Date(r.orderDate) >= cutoffDate && new Date(r.orderDate) <= today);
  }, [analysisResults, chartPeriod]);

  const exportToCSV = () => {
    if (!filteredResults.length) return;
    const headers = ['orderId', 'customerName', 'customerContact', 'orderAddress', 'orderDate', 'riskLevel', 'reason'];
    const headerKorean = ['주문번호', '고객명', '연락처', '주소', '주문일자', '위험도', '판단 근거'];
    const csvContent = [
      headerKorean.join(','),
      ...filteredResults.map(row => headers.map(header => `"${row[header as keyof AnalysisResult]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', '분석_결과.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  const handleTemplateDownload = (platform: string) => {
    const headers = "주문자ID,주문자명,주문자 이메일,주문자 휴대전화,수령인 주소(전체),상품명,수량,총 상품구매금액,총 결제금액,상품옵션(기본)";
    const blob = new Blob(['\uFEFF' + headers], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${platform}_템플릿.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = getChartData(chartResults);
  const recentHighRiskActivities = analysisResults?.filter(r => r.riskLevel === RiskLevel.High).slice(0, 5) || [];
  const hasResults = analysisResults && analysisResults.length > 0;

  const chartFilterButtons: { label: string; period: typeof chartPeriod }[] = [
    { label: '최근 7일', period: '7d' },
    { label: '최근 30일', period: '30d' },
    { label: '최근 90일', period: '90d' },
    { label: '전체', period: 'all' },
  ];

  return (
    <div className="space-y-6">
      {/* <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div> 
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">이번 달 사용량</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">현재 베이직 플랜을 사용하고 있습니다.</p>
            </div>
            <div className="w-full sm:w-1/3 mt-4 sm:mt-0">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{usage.current} / {usage.limit} 건</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
            </div>
            </div>
        </div>
      </Card> */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">한달&당일 주문 분석</h2>
        {hasResults && (
          <button
            onClick={handleNewAnalysis}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 분석하기
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="총 분석 주문 수" value={analysisStats.totalOrders} icon={<ChartIcon />} color="bg-indigo-100 dark:bg-indigo-900" />
        <StatCard title="리셀러 의심 건수" value={analysisStats.suspectedResellers} icon={<UserGroupIcon />} color="bg-yellow-100 dark:bg-yellow-900" />
        <StatCard title="고위험 주문 건수" value={analysisStats.highRiskOrders} icon={<ShieldExclamationIcon />} color="bg-red-100 dark:bg-red-900" />
      </div>

      {!hasResults ? (
        <>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">새 분석 시작하기</h3>
            {/* <div className="relative" ref={templateDropdownRef}>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                >
                    템플릿 다운로드
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </Button>
                {isTemplateDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleTemplateDownload('cafe24'); setIsTemplateDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                            카페24 양식
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleTemplateDownload('coupang'); setIsTemplateDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                            쿠팡 양식
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleTemplateDownload('smartstore'); setIsTemplateDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                            스마트스토어 양식
                        </a>
                    </div>
                )}
            </div> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FileUploadBox
              label="월간 주문내역 업로드"
              file={monthlyFile}
              onChange={setMonthlyFile}
              bgColor="bg-blue-50 dark:bg-blue-900/10"
              inputRef={monthlyInputRef}
            />
            <FileUploadBox
              label="일일 발주서 업로드"
              file={dailyFile}
              onChange={setDailyFile}
              bgColor="bg-pink-50 dark:bg-pink-900/10"
              inputRef={dailyInputRef}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={resetAnalysis}>초기화</Button>
              <Button onClick={handleStartAnalysis} disabled={!monthlyFile || !dailyFile}>
                  분석 시작
              </Button>
          </div>
        </Card>
         <Card>
      <h3 className="text-lg font-semibold mb-4">📋 한달 & 당일 분석 안내</h3>
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>• 월간 주문내역과 당일 발주서 파일을 업로드하면 자동으로 분석이 진행됩니다.</p>
        <p>• 반복 주문, 대량 주문, 주소/전화번호 중복 등 리셀러 패턴을 AI가 탐지합니다.</p>
        <p>• 분석 결과는 위험도별(고/중/저)로 분류되어 표시됩니다.</p>
        <p>• 취소 권장 목록을 CSV로 다운로드하여 활용할 수 있습니다.</p>
      </div>
      
      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            <span className="font-semibold">💡 Tip:</span> 한달 주문내역은 최소 1개월 이상의 데이터를 포함해야 정확한 분석이 가능합니다. 대량 주문 이력이 있는 고객은 자동으로 고위험으로 분류됩니다.
          </p>
        </div>
      </div>
    </Card>
  </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* <Card className="lg:col-span-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold">위험도 추이 분석</h3>
                    <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-md mt-2 sm:mt-0">
                      {chartFilterButtons.map(({ label, period }) => (
                          <button
                              key={period}
                              onClick={() => setChartPeriod(period)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                                  chartPeriod === period
                                      ? 'bg-indigo-600 text-white shadow'
                                      : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                              }`}
                          >
                              {label}
                          </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                          <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)"/>
                              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                              <Legend wrapperStyle={{fontSize: "12px"}}/>
                              <Bar dataKey="저위험" stackId="a" fill="#22c55e" name="저위험" />
                              <Bar dataKey="중위험" stackId="a" fill="#f59e0b" name="중위험" />
                              <Bar dataKey="고위험" stackId="a" fill="#ef4444" name="고위험" />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </Card> */}
              <Card className="lg:col-span-3">
                  <h3 className="text-lg font-semibold mb-4">최근 고위험 활동</h3>
                  <ul className="space-y-3">
                      {recentHighRiskActivities.map(activity => (
                          <li key={activity.id} className="text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                              <p className="font-semibold">{activity.customerName} - {activity.orderId}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.reason}</p>
                          </li>
                      ))}
                      {recentHighRiskActivities.length === 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">최근 분석에서 고위험 활동이 발견되지 않았습니다.</p>
                      )}
                  </ul>
              </Card>
          </div>

          <Card>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">분석 결과 상세</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  총 {analysisResults.length}건 중 {filteredResults.length}개의 일치하는 항목을 찾았습니다.
                </p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="secondary" onClick={exportToCSV}>CSV 내보내기</Button>
                  <Button variant="secondary" onClick={() => alert('PDF 내보내기 기능은 준비 중입니다!')}>PDF 내보내기</Button>
                  <Button variant="secondary" onClick={() => alert('이메일 리포트 발송 기능은 준비 중입니다!')}>이메일 리포트 발송</Button>
              </div>
            </div>
            
            <div className="flex space-x-2 mb-4">
              {(['All', 'High', 'Medium', 'Low', 'Safe'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level as RiskLevel | 'All')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                    filter === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {{'All': '전체', 'High': '고위험', 'Medium': '중위험', 'Low': '저위험', 'Safe': '안심고객'}[level]}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400" style={{ tableLayout: 'fixed' }}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left" style={{ width: '10%' }}>고객 정보</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{ width: '35%' }}>주문 정보</th>
                    <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>위험도</th>
                    <th scope="col" className="px-6 py-3 text-left" style={{ width: '35%' }}>판단 근거</th>
                    <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                {filteredResults.map((result) => (
                  <tr 
                    key={result.id} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    style={{ height: '72px' }}
                  >
                    <td className="px-6 py-4" style={{ width: '10%' }}>
                      <div className="font-medium text-gray-900 dark:text-white">{result.customerName}</div>
                      <div className="text-xs text-gray-500">{result.customerContact}</div>
                    </td>
                    <td className="px-6 py-4" style={{ width: '35%' }}>
                      <div className="font-medium">{result.orderAddress}</div>
                      <div className="text-xs">ID: {result.orderId} | 날짜: {result.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                      <div className="flex items-center justify-center">
                        <Badge riskLevel={result.riskLevel} />
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ width: '35%' }}>
                      <div className="font-medium" title={result.reason}>{result.reason}</div>
                    </td>
                    <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                      <button 
                        onClick={() => handleViewDetails(result)} 
                        className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
              {filteredResults.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">현재 필터와 일치하는 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
      {isDetailModalOpen && <ResultDetailModal onClose={() => { setIsDetailModalOpen(false); selectResult(null); }} />}
      {isEmailModalOpen && <EmailReportModal onClose={() => setIsEmailModalOpen(false)} />}
    </div>
  );
};

export default DashboardPage;
