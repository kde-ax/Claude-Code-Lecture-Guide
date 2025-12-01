import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { BlacklistResult, BlacklistStats, BlacklistRiskLevel } from '../types';


const BlacklistPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [blacklistFile, setBlacklistFile] = useState<File | null>(null);
    const [suspiciousFile, setSuspiciousFile] = useState<File | null>(null);
    const [dailyFile, setDailyFile] = useState<File | null>(null);
    
    const blacklistInputRef = useRef<HTMLInputElement>(null);
    const suspiciousInputRef = useRef<HTMLInputElement>(null);
    const dailyInputRef = useRef<HTMLInputElement>(null);
    
    const resultsFromAnalysis = location.state?.results;
    const statsFromAnalysis = location.state?.stats;
    
    const [results, setResults] = useState<BlacklistResult[] | null>(resultsFromAnalysis || null);
    const [stats, setStats] = useState<BlacklistStats | null>(statsFromAnalysis || null);
    
    const [filter, setFilter] = useState<BlacklistRiskLevel>('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedOrder, setSelectedOrder] = useState<BlacklistResult | null>(null);

    useEffect(() => {
        const shouldReset = sessionStorage.getItem('shouldResetBlacklist');
        if (shouldReset === 'true') {
            handleReset();
            sessionStorage.removeItem('shouldResetBlacklist');
        }
    }, []);

    useEffect(() => {
        if (resultsFromAnalysis) {
            setResults(resultsFromAnalysis);
            setStats(statsFromAnalysis);
        }
    }, [resultsFromAnalysis, statsFromAnalysis]);

    const handleFileChange = (file: File | null, type: 'blacklist' | 'suspicious' | 'daily') => {
        if (type === 'blacklist') setBlacklistFile(file);
        else if (type === 'suspicious') setSuspiciousFile(file);
        else setDailyFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'blacklist' | 'suspicious' | 'daily') => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
            handleFileChange(droppedFile, type);
        } else {
            alert('Excel 파일(.xlsx, .xls)만 업로드 가능합니다.');
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAnalyze = () => {
        if (!blacklistFile || !suspiciousFile || !dailyFile) {
            alert('모든 파일을 업로드해주세요.');
            return;
        }

        navigate('/blacklist/progress', {
            state: {
                blacklistFile,
                suspiciousFile,
                dailyFile
            }
        });
    };

    const handleReset = () => {
        setBlacklistFile(null);
        setSuspiciousFile(null);
        setDailyFile(null);
        setResults(null);
        setStats(null);
        setFilter('All');
        setSearchTerm('');
        setSelectedOrder(null);
    };

    const filteredResults = useMemo(() => {
        if (!results) return [];
        
        let filtered = results;
        
        if (filter !== 'All') {
            filtered = filtered.filter((result) => result.riskLevel === filter);
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(result => 
                result.customerName.toLowerCase().includes(term) ||
                result.customerContact.toLowerCase().includes(term) ||
                result.orderAddress.toLowerCase().includes(term) ||
                result.orderId.toLowerCase().includes(term) ||
                result.productName.toLowerCase().includes(term)
            );
        }
        
        return filtered;
    }, [results, filter, searchTerm]);

    const exportToCSV = () => {
        if (!filteredResults.length) return;
        
        const headers = ['주문번호', '고객명', '연락처', '주소', '주문일자', '수량', '상품명', '위험도', '판단근거'];
        const csvContent = [
            headers.join(','),
            ...filteredResults.map(row => [
                row.orderId,
                row.customerName,
                row.customerContact,
                `"${row.orderAddress}"`,
                row.orderDate,
                row.quantity,
                `"${row.productName}"`,
                row.riskLevel,
                `"${row.reason}"`
            ].join(','))
        ].join('\n');
        
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `블랙리스트_분석_결과_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatCard = ({ 
        icon, 
        label, 
        value, 
        bgColor, 
        iconColor 
    }: { 
        icon: React.ReactNode; 
        label: string; 
        value: number; 
        bgColor: string;
        iconColor: string;
    }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
                <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );

    const FileUploadBox = ({ 
        label, 
        file, 
        onChange, 
        type,
        bgColor = 'bg-blue-50',
        inputRef
    }: { 
        label: string; 
        file: File | null; 
        onChange: (file: File | null) => void;
        type: 'blacklist' | 'suspicious' | 'daily';
        bgColor?: string;
        inputRef: React.RefObject<HTMLInputElement>;
    }) => (
        <div 
            className={`${bgColor} dark:bg-gray-800 border-2 border-dashed ${
                file 
                    ? 'border-green-400 dark:border-green-500' 
                    : 'border-gray-300 dark:border-gray-600'
            } rounded-xl p-8 text-center transition-all hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer`}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={handleDragOver}
            onClick={() => !file && inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
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

    const getRiskBadge = (riskLevel: string) => {
        const colors = {
            'Blacklist': 'bg-black text-white',
            'Suspicious': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };

        const labels = {
            'Blacklist': '블랙리스트',
            'Suspicious': '의심리스트',
            'High': '고위험',
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[riskLevel as keyof typeof colors]}`}>
                {labels[riskLevel as keyof typeof labels]}
            </span>
        );
    };

    const DetailModal = ({ order, onClose }: { order: BlacklistResult; onClose: () => void }) => {
    // 판단 근거를 여러 줄로 분리
        const reasons = order.reason.split(/[,;]/).map(r => r.trim()).filter(r => r);
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    {/* 헤더 */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">주문 상세 정보</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* 2단 레이아웃: 고객 정보(좌) + 주문 정보(우) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 왼쪽: 고객 정보 */}
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    고객 정보
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[70px]">이름:</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[70px]">전화번호:</span>
                                        <span className="text-gray-900 dark:text-white">{order.customerContact}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[70px]">주소:</span>
                                        <span className="text-gray-900 dark:text-white text-sm break-all">{order.orderAddress}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[70px]">위험도:</span>
                                        {getRiskBadge(order.riskLevel)}
                                    </div>
                                </div>

                                {/* 판단 근거 */}
                                <div className="mt-4">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        판단 근거
                                    </h4>
                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                                        <ul className="space-y-2 text-sm">
                                            {reasons.map((reason, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-red-800 dark:text-red-300">
                                                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 주문 내역 */}
                            <div>
                                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    주문 내역 <span className="text-sm font-normal text-gray-500">({order.totalOrderCount}건)</span>
                                </h4>
                                
                                {/* 하나의 박스에 모든 주문 정보 */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 space-y-4">
                                    {/* 주문번호 목록 */}
                                    <div>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">주문번호</span>
                                        <div className="mt-1 space-y-1">
                                            {order.orderDetails.map((detail, idx) => (
                                                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                    {idx + 1}. {detail.orderId} <span className="text-xs text-gray-500">({detail.orderDate})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 상품명 목록 */}
                                    <div>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">상품명</span>
                                        <div className="mt-1 space-y-1">
                                            {order.orderDetails.map((detail, idx) => (
                                                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                                    {idx + 1}. {detail.product} <span className="text-xs font-semibold text-blue-600">x{detail.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 배송지 목록 */}
                                    <div>
                                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">배송지</span>
                                        <div className="mt-1 space-y-1">
                                            {[...new Set(order.orderDetails.map(d => d.address))].map((address, idx) => (
                                                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 break-all">
                                                    {idx + 1}. {address}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 총 수량 */}
                                    <div className="pt-3 border-t border-blue-300 dark:border-blue-700">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-blue-700 dark:text-blue-300">총 주문 수량:</span>
                                            <span className="font-bold text-lg text-blue-900 dark:text-blue-100">
                                                {order.orderDetails.reduce((sum, d) => sum + d.quantity, 0)}개
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 푸터 */}
                    <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="secondary" onClick={onClose}>
                            닫기
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">블랙리스트 분석</h2>
                {results && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        다시 분석하기
                    </Button>
                )}
            </div>

            {/* 3개 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    }
                    label="블랙리스트"
                    value={stats?.blacklistCount || 0}
                    bgColor="bg-black/5 dark:bg-black/20"
                    iconColor="text-black dark:text-white"
                />
                <StatCard
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                    label="의심리스트"
                    value={stats?.suspiciousCount || 0}
                    bgColor="bg-orange-50 dark:bg-orange-900/20"
                    iconColor="text-orange-600 dark:text-orange-400"
                />
                <StatCard
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    label="고위험"
                    value={stats?.highRiskCount || 0}
                    bgColor="bg-red-50 dark:bg-red-900/20"
                    iconColor="text-red-600 dark:text-red-400"
                />
            </div>

            {!results ? (
                <>
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">새 분석 시작하기</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <FileUploadBox
                                label="블랙리스트 업로드"
                                file={blacklistFile}
                                onChange={(file) => handleFileChange(file, 'blacklist')}
                                type="blacklist"
                                bgColor="bg-red-50 dark:bg-red-900/10"
                                inputRef={blacklistInputRef}
                            />
                            <FileUploadBox
                                label="의심리스트 업로드"
                                file={suspiciousFile}
                                onChange={(file) => handleFileChange(file, 'suspicious')}
                                type="suspicious"
                                bgColor="bg-orange-50 dark:bg-orange-900/10"
                                inputRef={suspiciousInputRef}
                            />
                            <FileUploadBox
                                label="당일 발주서 업로드"
                                file={dailyFile}
                                onChange={(file) => handleFileChange(file, 'daily')}
                                type="daily"
                                bgColor="bg-blue-50 dark:bg-blue-900/10"
                                inputRef={dailyInputRef}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                disabled={!blacklistFile && !suspiciousFile && !dailyFile}
                            >
                                초기화
                            </Button>
                            <Button
                                onClick={handleAnalyze}
                                disabled={!blacklistFile || !suspiciousFile || !dailyFile}
                            >
                                분석 시작
                            </Button>
                        </div>
                    </Card>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                                    블랙리스트 탐지 분석 안내 (3단계)
                                </h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>• <strong>블랙리스트:</strong> 이름 제외한 나머지(전화번호, 주소, 이메일) 중 1개라도 일치</li>
                                    <li>• <strong>의심리스트:</strong> 이름 제외한 나머지(전화번호, 주소, 이메일) 중 1개라도 일치</li>
                                    <li>• <strong>고위험:</strong> 한 사람이 6개 이상 주문 OR 같은 제품 3개 이상 주문</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Card>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">분석 결과</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    총 {results.length}건 중 {filteredResults.length}건 표시
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Button variant="secondary" size="sm" onClick={exportToCSV}>
                                    CSV 다운로드
                                </Button>
                            </div>
                        </div>

                        {/* 필터 영역 */}
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="flex flex-wrap gap-2">
                                {(['All', 'Blacklist', 'Suspicious', 'High'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFilter(level)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                                            filter === level
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {{
                                            'All': '전체',
                                            'Blacklist': '블랙리스트',
                                            'Suspicious': '의심리스트',
                                            'High': '고위험'
                                        }[level]}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="고객명, 연락처, 주소, 주문ID, 상품명으로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 테이블 */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">고객 정보</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">주문 정보</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">상품명</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">수량</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">위험도</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">판단 근거</th>
                                        <th className="px-6 py-3 text-gray-700 dark:text-gray-300">액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map((result, index) => (
                                        <tr 
                                            key={`${result.orderId}-${index}`}
                                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">{result.customerName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{result.customerContact}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 dark:text-white max-w-xs truncate">{result.orderAddress}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    ID: {result.orderId} | {result.orderDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-gray-700 dark:text-gray-300">{result.productName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRiskBadge(result.riskLevel)}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="truncate text-gray-700 dark:text-gray-300">{result.reason}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(result)}
                                                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-sm font-medium"
                                                >
                                                    상세보기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredResults.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400">필터 조건에 맞는 결과가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}

            {selectedOrder && (
                <DetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default BlacklistPage;