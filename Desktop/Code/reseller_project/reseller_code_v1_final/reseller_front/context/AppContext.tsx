
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import type { AnalysisResult, AnalysisStats, User, BlacklistItem } from '../types';
// import { simulateAnalysis } from '../services/analysisService';
import { analyzeFiles } from '../services/api';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;

  monthlyFile: File | null;
  dailyFile: File | null;
  setMonthlyFile: (file: File | null) => void;
  setDailyFile: (file: File | null) => void;
  analysisResults: AnalysisResult[] | null;
  analysisStats: AnalysisStats;
  isAnalyzing: boolean;
  startAnalysis: () => Promise<{ success: boolean }>;
  resetAnalysis: () => void;

  blacklist: BlacklistItem[];
  selectedResult: AnalysisResult | null;
  selectResult: (result: AnalysisResult | null) => void;
  addToBlacklist: (result: AnalysisResult, memo: string) => void;
  removeFromBlacklist: (orderId: string) => void;
  updateBlacklistMemo: (orderId: string, memo: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // App specific state
  const [monthlyFile, setMonthlyFile] = useState<File | null>(null);
  const [dailyFile, setDailyFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats>({
    totalOrders: 0,
    suspectedResellers: 0,
    highRiskOrders: 0,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

  const login = useCallback(() => {
    const mockUser: User = {
        id: '12345',
        name: '데모 사용자',
        email: 'demo.user@example.com',
        avatar: 'https://picsum.photos/100/100',
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    resetAnalysis();
    setBlacklist([]);
  }, []);

  const selectResult = useCallback((result: AnalysisResult | null) => {
    setSelectedResult(result);
  }, []);

  const addToBlacklist = useCallback((result: AnalysisResult, memo: string) => {
    setBlacklist(prev => {
      const existing = prev.find(item => item.result.id === result.id);
      if (existing) {
        return prev.map(item => item.result.id === result.id ? { ...item, memo } : item);
      }
      return [...prev, { result, memo, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromBlacklist = useCallback((orderId: string) => {
    setBlacklist(prev => prev.filter(item => item.result.id !== orderId));
  }, []);
  
  const updateBlacklistMemo = useCallback((orderId: string, memo: string) => {
    setBlacklist(prev => prev.map(item => item.result.id === orderId ? { ...item, memo } : item));
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!monthlyFile || !dailyFile) {
      return { success: false };
    }
    setIsAnalyzing(true);
    try {
      const results = await analyzeFiles(monthlyFile, dailyFile);
      setAnalysisResults(results);
      
      // ⭐ 수정된 통계 계산
      const totalOrders = results.length;  // 당일 전체 건수 (정상 포함)
      const suspectedResellers = results.filter(
        r => r.riskLevel === 'High' || r.riskLevel === 'Medium' || r.riskLevel === 'Low'
      ).length;  // 고 + 중 + 저
      const highRiskOrders = results.filter(r => r.riskLevel === 'High').length;
      
      setAnalysisStats({ totalOrders, suspectedResellers, highRiskOrders });

      setIsAnalyzing(false);
      return { success: true };
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
      setAnalysisResults(null);
      return { success: false };
    }
  }, [monthlyFile, dailyFile]);

  const resetAnalysis = useCallback(() => {
    setMonthlyFile(null);
    setDailyFile(null);
    setAnalysisResults(null);
    setAnalysisStats({
      totalOrders: 0,
      suspectedResellers: 0,
      highRiskOrders: 0,
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        monthlyFile,
        dailyFile,
        setMonthlyFile,
        setDailyFile,
        analysisResults,
        analysisStats,
        isAnalyzing,
        startAnalysis,
        resetAnalysis,
        blacklist,
        selectedResult,
        selectResult,
        addToBlacklist,
        removeFromBlacklist,
        updateBlacklistMemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
