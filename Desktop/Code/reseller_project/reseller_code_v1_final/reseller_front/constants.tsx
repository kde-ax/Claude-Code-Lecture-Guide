
import React from 'react';


function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function BookmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function LifebuoyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l1.414 1.414m-1.414-1.414a9 9 0 10-12.728 0M18.364 5.636a9 9 0 010 12.728m-12.728 0l-1.414-1.414m1.414 1.414a9 9 0 0112.728 0M5.636 5.636l-1.414 1.414m1.414-1.414a9 9 0 000 12.728m12.728 0l1.414 1.414M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export const NAV_LINKS = [
  { name: '한달&당일 주문 분석', path: '/', icon: <HomeIcon /> },
  { name: 'IP 분석', path: '/ip-analysis', icon: <CreditCardIcon /> },
  { name: '블랙리스트', path: '/blacklist', icon: <BookmarkIcon /> },
  // { name: '요금제', path: '/pricing', icon: <CreditCardIcon /> },
  // { name: '설정 및 지원', path: '/settings-support', icon: <LifebuoyIcon /> },
];