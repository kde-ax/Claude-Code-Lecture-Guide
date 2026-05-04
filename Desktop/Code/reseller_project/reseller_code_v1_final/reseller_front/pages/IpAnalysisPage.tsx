import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUpload from '../components/dashboard/FileUpload';
import Badge from '../components/ui/Badge';
import IpDetailModal from '../components/modals/IpDetailModal';  
import type { IpAnalysisResult, IpAnalysisStats } from '../types';
import * as XLSX from 'xlsx';
const IpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const BlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const IpAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [ipFile, setIpFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<IpAnalysisResult[] | null>(null);
  const [analysisStats, setAnalysisStats] = useState<IpAnalysisStats | null>(null);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low' | 'Safe'>('All');
  const [selectedIp, setSelectedIp] = useState<IpAnalysisResult | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const ipInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('📊 location.state:', location.state);
    
    if (location.state?.results !== undefined && location.state?.stats) {
      console.log('✅ 결과 수신:', location.state.results.length, '건');
      setAnalysisResults(location.state.results);
      setAnalysisStats(location.state.stats);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleStartAnalysis = () => {
    if (!ipFile) {
      alert('IP 주소 파일을 업로드해주세요!');
      return;
    }

    navigate('/ip-analysis/progress', { 
      state: { ipFile } 
    });
  };

  const handleReset = () => {
    setIpFile(null);
    setAnalysisResults(null);
    setAnalysisStats(null);
    setFilter('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (result: IpAnalysisResult) => {
    setSelectedIp(result);
    setIsDetailModalOpen(true);
  };

  const filteredResults = analysisResults?.filter(result => 
    filter === 'All' || result.riskLevel === filter
  ) || [];

  const exportToExcel = () => {
    if (!filteredResults.length) return;
    
    const sheet1Data = filteredResults.map((row, index) => {
      const addressWithDates = row.orderDetails && row.orderDetails.length > 0
        ? row.orderDetails.map(detail => 
            `[${detail.recipient}] ${detail.datetime} (${detail.address})`
          ).join('\n')
        : '정보없음';
      
      const uniqueRecipients = [...new Set(row.recipients)];
      const recipientList = uniqueRecipients.join(', ');
      
      const uniquePhones = [...new Set(row.phones)];
      const phoneList = uniquePhones.join(', ');
      
      return {
        '순위': index + 1,
        'IP': row.ip,
        '총주문수': row.orderCount,
        '고유주소수': row.uniqueAddresses,
        '고유수령인수': row.uniqueRecipients,
        '고유전화수': row.uniquePhones,
        '의심점수': row.suspicionScore,
        '주소및날짜': addressWithDates,
        '수령인목록': recipientList,
        '전화번호목록': phoneList
      };
    });
    
    const sheet2Data: any[] = [];
    filteredResults.forEach(row => {
      if (row.orderDetails && row.orderDetails.length > 0) {
        row.orderDetails.forEach(detail => {
          sheet2Data.push({
            'IP': row.ip,
            '주소': detail.address,
            '수령인': detail.recipient,
            '주문일시': detail.datetime,
            '전화번호': detail.phone,
            '포인트': detail.point
          });
        });
      }
    });
    
    sheet2Data.sort((a, b) => {
      if (a.IP !== b.IP) return a.IP.localeCompare(b.IP);
      if (a.주소 !== b.주소) return a.주소.localeCompare(b.주소);
      return a.주문일시.localeCompare(b.주문일시);
    });
    
    const sheet3Data = filteredResults.map(row => ({
      'IP': row.ip,
      '총주문': row.orderCount,
      '총포인트': row.orderDetails 
        ? row.orderDetails.reduce((sum, detail) => sum + (detail.point || 0), 0)
        : 0,
      '고유주소': row.uniqueAddresses,
      '고유수령인': row.uniqueRecipients,
      '고유전화': row.uniquePhones
    }));
    
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
    XLSX.utils.book_append_sheet(wb, ws1, '의심IP요약');
    
    const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
    XLSX.utils.book_append_sheet(wb, ws2, '주소별상세');
    
    const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
    XLSX.utils.book_append_sheet(wb, ws3, 'IP통계');
    
    ws1['!cols'] = [
      { wch: 6 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, 
      { wch: 12 }, { wch: 10 }, { wch: 60 }, { wch: 40 }, { wch: 40 }
    ];
    
    ws2['!cols'] = [
      { wch: 15 }, { wch: 50 }, { wch: 10 }, { wch: 18 }, { wch: 15 }, { wch: 12 }
    ];
    
    ws3['!cols'] = [
      { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }
    ];
    
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `ip_analysis_${date}_${time}.xlsx`;
    
    XLSX.writeFile(wb, filename);
  };

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
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.txt'))) {
      onChange(droppedFile);
    } else {
      alert('Excel, CSV 또는 TXT 파일만 업로드 가능합니다.');
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
        accept=".xlsx,.xls,.csv,.txt"
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

  // ⭐ 수정: analysisResults가 null이 아니면 결과 화면 표시 (빈 배열도 포함)
  const hasResults = analysisResults !== null && analysisStats !== null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          IP 주소 분석
        </h2>
        {hasResults && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 분석하기
          </button>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <IpIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 IP 주소 수
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisStats?.totalIps?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <WarningIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                의심 IP 건수
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisStats?.suspiciousIps?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <BlockIcon />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                차단 권장 IP
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisStats?.highRisk?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {!hasResults ? (
        <>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">새 분석 시작하기</h3>
            </div>

            <div className="mb-6">
              <FileUploadBox
                label="IP 주소 업로드"
                file={ipFile}
                onChange={setIpFile}
                bgColor="bg-purple-50 dark:bg-purple-900/10"
                inputRef={ipInputRef}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={handleReset}>
                초기화
              </Button>
              <Button 
                onClick={handleStartAnalysis} 
                disabled={!ipFile}
              >
                분석 시작
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">📋 IP 분석 안내</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• IP 주소 목록 파일을 업로드하면 자동으로 분석이 진행됩니다.</p>
              <p>• 중복 IP, 다중 주소/전화번호/수령인 사용 패턴을 탐지합니다.</p>
              <p>• 분석 결과는 위험도별(고/중/저)로 분류되어 표시됩니다.</p>
              <p>• 차단 권장 IP 목록을 Excel로 다운로드할 수 있습니다.</p>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  <span className="font-semibold">💡 Tip:</span> 의심점수가 6점 이상이면 고위험으로 분류됩니다. 동일 IP에서 여러 주소/수령인으로 주문한 경우 리셀러일 가능성이 높습니다.
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* ⭐ 추가: 의심 IP가 0개일 때 표시할 안심 메시지 */}
          {analysisResults.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  🎉 정상 주문 패턴
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  의심스러운 IP 패턴이 발견되지 않았습니다!
                </p>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">분석된 총 IP 수</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysisStats.totalIps}개</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">정상 고객</span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">{analysisStats.totalIps}개 (100%)</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  모든 IP가 정상적인 주문 패턴을 보이고 있습니다.
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">분석 결과 상세</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    총 {analysisResults.length}건 중 {filteredResults.length}개의 일치하는 항목을 찾았습니다.
                  </p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="secondary" onClick={exportToExcel}>Excel 내보내기</Button>
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                {(['All', 'High', 'Medium', 'Low', 'Safe'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
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
                      <th scope="col" className="px-6 py-3" style={{ width: '10%' }}>IP 주소</th>
                      <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>주문수</th>
                      <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>수령인수</th>
                      <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>위험도</th>
                      <th scope="col" className="px-6 py-3" style={{ width: '55%' }}>판단 근거</th>
                      <th scope="col" className="px-6 py-3 text-center" style={{ width: '10%' }}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, idx) => (
                      <tr 
                        key={idx}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" style={{ height: '70px' }}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white font-mono" style={{ width: '10%' }}>
                          {result.ip}
                        </td>
                        <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                          {result.orderCount}건
                        </td>
                        <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                          {result.uniqueRecipients}명
                        </td>
                        <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                          <Badge riskLevel={result.riskLevel} />
                        </td>
                        <td className="px-6 py-4" style={{ width: '55%' }}>
                          <div className="text-xs">{result.reason}</div>
                        </td>
                        <td className="px-6 py-4 text-center" style={{ width: '10%' }}>
                          <button
                            onClick={() => handleViewDetails(result)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
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
          )}
        </>
      )}

      {isDetailModalOpen && selectedIp && (
        <IpDetailModal
          result={selectedIp}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedIp(null);
          }}
        />
      )}
    </div>
  );
};

export default IpAnalysisPage;