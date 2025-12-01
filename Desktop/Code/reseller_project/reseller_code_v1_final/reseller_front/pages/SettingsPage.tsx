
import React from 'react';
import Card from '../components/ui/Card';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">설정</h2>
      <Card>
        <h3 className="text-lg font-semibold mb-4">계정 설정</h3>
        <p className="text-gray-600 dark:text-gray-400">
          이곳에서 계정 설정을 관리할 수 있습니다. 비밀번호 변경, 이메일 주소 업데이트, 2단계 인증 관리와 같은 기능이 제공될 예정입니다.
        </p>
        <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">API 관리</h3>
            <p className="text-gray-600 dark:text-gray-400">
                기능이 준비되면 이 섹션에서 API 키 및 연동 설정을 관리할 수 있습니다.
            </p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
