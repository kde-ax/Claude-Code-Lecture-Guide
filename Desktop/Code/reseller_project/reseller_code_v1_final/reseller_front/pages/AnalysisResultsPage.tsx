
import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import type { AnalysisResult } from '../types';
import { RiskLevel } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const AnalysisResultsPage: React.FC = () => {
  const { analysisResults } = useAppContext();
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');

  const filteredResults = useMemo(() => {
    if (!analysisResults) return [];
    if (filter === 'All') return analysisResults;
    return analysisResults.filter((result) => result.riskLevel === filter);
  }, [analysisResults, filter]);

  if (!analysisResults) {
    return <Navigate to="/" replace />;
  }

  const exportToCSV = () => {
    if (!filteredResults.length) return;
    const headers = ['orderId', 'customerName', 'customerContact', 'orderAddress', 'orderDate', 'riskLevel', 'reason'];
    const csvContent = [
      headers.join(','),
      ...filteredResults.map(row => headers.map(header => `"${row[header as keyof AnalysisResult]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'analysis_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Analysis Results</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Found {filteredResults.length} matching records out of {analysisResults.length} total.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="secondary" onClick={exportToCSV}>Export CSV</Button>
          <Button variant="secondary" onClick={() => alert('PDF Export is coming soon!')}>Export PDF</Button>
          <Button variant="secondary" onClick={() => alert('Email Report is coming soon!')}>Send Email</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex space-x-2">
            {(['All', 'High', 'Medium', 'Low'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as RiskLevel | 'All')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                  filter === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Customer Info</th>
                <th scope="col" className="px-6 py-3">Order Info</th>
                <th scope="col" className="px-6 py-3">Risk Level</th>
                <th scope="col" className="px-6 py-3">Judgement Basis</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{result.customerName}</div>
                    <div className="text-xs text-gray-500">{result.customerContact}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{result.orderAddress}</div>
                    <div className="text-xs">ID: {result.orderId} | Date: {result.orderDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge riskLevel={result.riskLevel} />
                  </td>
                  <td className="px-6 py-4 max-w-sm truncate">{result.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResults.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No results match the current filter.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalysisResultsPage;
