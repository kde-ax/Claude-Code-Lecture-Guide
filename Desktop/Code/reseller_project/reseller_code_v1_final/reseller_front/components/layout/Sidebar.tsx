import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    if (path === '/') {
      // 대시보드로 갈 때 초기화 플래그 설정
      sessionStorage.setItem('shouldResetDashboard', 'true');
    }
    navigate(path);

    if (path === '/blacklist') {
      sessionStorage.setItem('shouldResetBlacklist', 'true');
    }
    
    navigate(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">리셀러 탐지 AI</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_LINKS.map((link) => (
          <div
            key={link.name}
            onClick={() => handleNavClick(link.path)}
            className="cursor-pointer"
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          </div>
        ))}
      </nav>
      {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-gray-700">
            <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">플랜 업그레이드</h4>
            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-300">프리미엄 기능과 무제한 분석을 이용해 보세요.</p>
            <button 
              onClick={() => navigate('/pricing')}
              className="mt-3 w-full bg-indigo-600 text-white text-xs font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition">
                지금 업그레이드
            </button>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;