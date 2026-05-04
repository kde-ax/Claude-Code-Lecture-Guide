
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        죄송합니다, 찾고 계신 페이지가 존재하지 않습니다.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button>대시보드로 가기</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
