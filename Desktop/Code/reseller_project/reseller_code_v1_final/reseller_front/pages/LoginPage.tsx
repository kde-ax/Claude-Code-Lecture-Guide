
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const { login } = useAppContext();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          리셀러 탐지 AI
        </h1>
        <p className="mt-2 mb-8 text-gray-600 dark:text-gray-400">
          AI 기반 분석으로 재판매자를 식별하세요.
        </p>
        <Button onClick={login} className="w-full flex items-center justify-center" variant="primary">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8.354l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571l6.19 5.238C42.011 35.391 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Google 계정으로 로그인
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
