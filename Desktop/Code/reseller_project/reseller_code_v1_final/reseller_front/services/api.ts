import type { AnalysisResult } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export async function analyzeFiles(
  monthlyFile: File,
  dailyFile: File
): Promise<AnalysisResult[]> {
  const formData = new FormData();
  formData.append('monthly_file', monthlyFile);
  formData.append('daily_file', dailyFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '분석 실패');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const analyzeIpFile = async (ipFile: File) => {
  const formData = new FormData();
  formData.append('ip_file', ipFile);

  const response = await fetch(`${API_BASE_URL}/api/analyze-ip`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`IP 분석 실패: ${error}`);
  }

  return response.json();
};