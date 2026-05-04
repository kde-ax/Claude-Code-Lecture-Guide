import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  riskLevel: RiskLevel;
}

const Badge: React.FC<BadgeProps> = ({ riskLevel }) => {
  const riskConfig = {
    [RiskLevel.High]: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-200',
      label: '고위험'
    },
    [RiskLevel.Medium]: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
      label: '중위험'
    },
    [RiskLevel.Low]: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-200',
      label: '저위험'
    },
    [RiskLevel.Safe]: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      label: '안심고객'
    }
  };

  const config = riskConfig[riskLevel];

  return (
    <span 
      className={`inline-flex items-center justify-center ${config.bg} ${config.text}`}
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
        fontSize: '13px',
        fontWeight: '500',
        padding: '4px 12px',
        borderRadius: '9999px',
        minWidth: '60px',
        height: '26px',
        whiteSpace: 'nowrap'
      }}
    >
      {config.label}
    </span>
  );
};

export default Badge;