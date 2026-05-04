
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface ResultDetailModalProps {
  onClose: () => void;
}

const ResultDetailModal: React.FC<ResultDetailModalProps> = ({ onClose }) => {
  const { selectedResult, blacklist, addToBlacklist, removeFromBlacklist } = useAppContext();
  const [memo, setMemo] = useState('');

  const isBlacklisted = selectedResult ? blacklist.some(item => item.result.id === selectedResult.id) : false;

  useEffect(() => {
    if (selectedResult) {
      const blacklistItem = blacklist.find(item => item.result.id === selectedResult.id);
      setMemo(blacklistItem ? blacklistItem.memo : '');
    }
  }, [selectedResult, blacklist]);

  if (!selectedResult) return null;

  const handleAddToBlacklist = () => {
    addToBlacklist(selectedResult, memo);
    alert('블랙리스트에 추가/수정되었습니다.');
    onClose();
  };

  const handleRemoveFromBlacklist = () => {
    removeFromBlacklist(selectedResult.id);
    alert('블랙리스트에서 제거되었습니다.');
    onClose();
  };

  const handleExclude = () => {
    alert('의심 리스트 제외 기능은 관리자에게 문의하세요. (기능 준비 중)');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">분석 결과 상세</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600">고객 정보</h3>
              <p><strong>이름:</strong> {selectedResult.customerName}</p>
              <p><strong>연락처:</strong> {selectedResult.customerContact}</p>
              <p><strong>주소:</strong> {selectedResult.orderAddress}</p>
            </div>
            <div className="space-y-4">
               <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600">주문 정보</h3>
              <p><strong>주문 ID:</strong> {selectedResult.orderId}</p>
              <p><strong>주문 일자:</strong> {selectedResult.orderDate}</p>
              <p><strong>위험도:</strong> <Badge riskLevel={selectedResult.riskLevel} /></p>
            </div>
          </div>
          <div className="mt-6">
             <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600">판단 근거</h3>
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">{selectedResult.reason}</p>
          </div>
           {/* <div className="mt-6">
             <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600">블랙리스트 관리</h3>
             <textarea 
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="블랙리스트 관련 메모를 남겨주세요..."
                className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={3}
              />
          </div> */}
        </div>
        {/* <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={handleExclude}>의심리스트에서 제외</Button>
            {isBlacklisted && <Button variant="danger" onClick={handleRemoveFromBlacklist}>블랙리스트에서 제거</Button>}
            <Button variant="primary" onClick={handleAddToBlacklist}>{isBlacklisted ? '메모 수정' : '블랙리스트에 추가'}</Button>
        </div> */}
      </div>
    </div>
  );
};

export default ResultDetailModal;
