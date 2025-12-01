import React from 'react';
import { IpAnalysisResult } from '../../types';
import Badge from '../ui/Badge';

interface IpDetailModalProps {
  result: IpAnalysisResult;
  onClose: () => void;
}

const IpDetailModal: React.FC<IpDetailModalProps> = ({ result, onClose }) => {
  //  안전하게 배열로 변환
  const recipientsList = Array.isArray(result.recipients) 
    ? result.recipients 
    : [];

  const phonesList = Array.isArray(result.phones) 
    ? result.phones 
    : [];

  // 주소별 수령인 매핑
  const addressWithRecipients = result.orderDetails
    ? result.orderDetails.reduce((acc, detail) => {
        if (!acc[detail.address]) {
          acc[detail.address] = new Set<string>();
        }
        acc[detail.address].add(detail.recipient);
        return acc;
      }, {} as Record<string, Set<string>>)
    : {};

  // 날짜별 주문자 및 건수 매핑
  const dateWithOrders = result.orderDetails
    ? result.orderDetails.reduce((acc, detail) => {
        const date = detail.datetime.split(' ')[0];
        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][detail.recipient]) {
          acc[date][detail.recipient] = 0;
        }
        acc[date][detail.recipient]++;
        return acc;
      }, {} as Record<string, Record<string, number>>)
    : {};

  // 전화번호별 주문자 및 건수 매핑
  const phoneWithOrders = result.orderDetails
    ? result.orderDetails.reduce((acc, detail) => {
        const phone = detail.phone;
        if (!phone) return acc;
        
        if (!acc[phone]) {
          acc[phone] = {};
        }
        if (!acc[phone][detail.recipient]) {
          acc[phone][detail.recipient] = 0;
        }
        acc[phone][detail.recipient]++;
        return acc;
      }, {} as Record<string, Record<string, number>>)
    : {};

  // 날짜 정렬
  const sortedDates = Object.keys(dateWithOrders).sort();
  const sortedPhones = Object.keys(phoneWithOrders).sort();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4" 
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">분석 결과 상세</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* 고객 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600 text-gray-900 dark:text-white">
                고객 정보
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>IP 주소:</strong> 
                <span className="ml-2 font-mono">{result.ip}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>주문자명:</strong> 
                <span className="ml-2">
                  {recipientsList.length > 0 ? recipientsList.join(', ') : '정보없음'}
                </span>
              </p>
              
              {/* 주소 - 전체 리스트 표시 */}
              <div className="text-gray-700 dark:text-gray-300">
                <strong>주소:</strong>
                {Object.keys(addressWithRecipients).length > 0 ? (
                  <div className="ml-4 mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(addressWithRecipients).map(([address, recipients], idx) => {
                      // ⭐ Set을 배열로 변환
                      const recipientArray = Array.from(recipients as Set<string>);
                      recipientArray.sort();
                      return (
                        <div key={idx} className="text-xs border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                          <p className="text-gray-900 dark:text-white font-medium mb-1">
                            {idx + 1}. ({recipientArray.join(', ')})
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 ml-4">
                            {address}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="ml-2">정보없음</span>
                )}
              </div>

              
              {/* 전화번호 */}
              <div className="text-gray-700 dark:text-gray-300">
                <strong>전화번호:</strong>
                {Object.keys(phoneWithOrders).length > 0 ? (
                  <div className="ml-4 mt-2 max-h-64 overflow-y-auto">
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {Object.entries(phoneWithOrders).map(([phone, orders], idx) => {
                        const orderText = Object.entries(orders)
                          .map(([name, count]) => `${name} - ${count}건`)
                          .join(', ');
                        
                        return (
                          <p key={idx}>
                            {phone} ({orderText})
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="ml-2">
                    {phonesList.length > 0 ? phonesList.join(', ') : '정보없음'}
                  </span>
                )}
              </div>
            </div>

            {/* 주문 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600 text-gray-900 dark:text-white">
                주문 정보
              </h3>
              
              {/* 주문 일자 - 날짜별 주문자 및 건수 */}
              <div className="text-gray-700 dark:text-gray-300">
                <strong>주문 일자:</strong>
                {sortedDates.length > 0 ? (
                  <div className="ml-4 mt-2 max-h-64 overflow-y-auto">
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {sortedDates.map((date, idx) => {
                        const orders = dateWithOrders[date];
                        const orderText = Object.entries(orders)
                          .map(([name, count]) => `${name} - ${count}건`)
                          .join(', ');
                        
                        return (
                          <p key={idx}>
                            {date} ({orderText})
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="ml-2">정보없음</span>
                )}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">
                <strong>위험도:</strong> 
                <span className="ml-2">
                  <Badge riskLevel={result.riskLevel} />
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>총 주문수:</strong> 
                <span className="ml-2">{result.orderCount}건</span>
              </p>
            </div>
          </div>

          {/* 판단 근거 */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg border-b pb-2 mb-2 dark:border-gray-600 text-gray-900 dark:text-white">
              판단근거
            </h3>
            <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
              {result.reason}
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex justify-end">
          {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            닫기
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default IpDetailModal;