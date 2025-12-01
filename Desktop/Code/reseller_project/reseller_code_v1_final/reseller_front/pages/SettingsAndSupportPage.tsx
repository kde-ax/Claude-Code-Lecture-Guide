
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import Button from '../components/ui/Button';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.105-.448 2.105-1.172 2.828l-1.036.936c-.343.309-.622.68-.82 1.087l-.202.403m-2.224-4.593a.92.92 0 00-.996.92c0 .507.41.917.917.917.507 0 .917-.41.917-.917a.92.92 0 00-.917-.917zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const EnvelopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

type Section = 'account' | 'api' | 'faq' | 'contact';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b dark:border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                <span className="font-medium">{question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600 dark:text-gray-400">
                    {answer}
                </div>
            )}
        </div>
    )
}

const SettingsAndSupportPage = () => {
  const [activeSection, setActiveSection] = useState<Section>('account');
  const { user } = useAppContext();

  const sections = [
      { id: 'account', label: '계정 설정', icon: <UserIcon /> },
      { id: 'api', label: 'API 관리', icon: <KeyIcon /> },
      { id: 'faq', label: '자주 묻는 질문', icon: <QuestionMarkCircleIcon /> },
      { id: 'contact', label: '문의하기', icon: <EnvelopeIcon /> },
  ]

  const renderSection = () => {
      switch (activeSection) {
          case 'account':
              return (
                  <div>
                      <h3 className="text-xl font-semibold mb-1">계정 정보</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">프로필 정보, 이메일, 비밀번호를 관리합니다.</p>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">이메일 주소</label>
                              <div className="flex items-center gap-2">
                                <input type="email" readOnly value={user?.email || ''} className="w-full md:w-2/3 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed" />
                                <Button variant="secondary" onClick={() => alert('이메일 변경 기능은 준비 중입니다.')}>업데이트</Button>
                              </div>
                          </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">비밀번호</label>
                              <Button variant="secondary" onClick={() => alert('비밀번호 변경 기능은 준비 중입니다.')}>비밀번호 변경</Button>
                          </div>
                      </div>
                  </div>
              )
          case 'api':
               return (
                  <div>
                      <h3 className="text-xl font-semibold mb-1">API 키 관리</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">서비스 연동을 위한 API 키를 생성하고 관리합니다. (프로 플랜 이상)</p>
                       <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-mono text-sm">sk-******************1234</p>
                                <p className="text-xs text-gray-500">2024년 5월 1일에 생성됨</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText('sk-fake-api-key-1234')}>복사</Button>
                                <Button variant="danger" size="sm">삭제</Button>
                            </div>
                         </div>
                       </div>
                       <Button className="mt-4">새 API 키 생성</Button>
                  </div>
              )
          case 'faq':
               return (
                  <div>
                      <h3 className="text-xl font-semibold mb-1">자주 묻는 질문</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">서비스에 대해 자주 묻는 질문과 답변입니다.</p>
                       <div className="space-y-2">
                          <FAQItem question="어떤 파일 형식을 지원하나요?" answer="현재 CSV, XLS, XLSX 파일을 지원합니다. 템플릿을 다운로드하여 형식에 맞게 데이터를 준비할 수 있습니다." />
                          <FAQItem question="AI 탐지 정확도는 어느 정도인가요?" answer="저희 모델은 수백만 건의 거래 데이터를 기반으로 지속적으로 학습하여 높은 정확도를 제공합니다. 또한, 사용자의 피드백(블랙리스트 제외 등)을 통해 모델이 점진적으로 개선됩니다." />
                          <FAQItem question="분석에 소요되는 시간은 얼마나 걸리나요?" answer="데이터의 크기에 따라 다르지만, 대부분의 분석은 수 분 내에 완료됩니다. 분석 중에는 진행 상황을 실시간으로 확인할 수 있습니다." />
                          <FAQItem question="데이터는 안전하게 관리되나요?" answer="네, 저희는 사용자의 데이터를 최우선으로 생각하며, 모든 데이터는 암호화되어 안전하게 저장 및 처리됩니다." />
                       </div>
                  </div>
              )
          case 'contact':
              return (
                  <div>
                      <h3 className="text-xl font-semibold mb-1">도움이 필요하신가요?</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">궁금한 점이 있거나 기술적인 문제가 발생하면 언제든지 문의해 주세요.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <h4 className="font-semibold">이메일 문의</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">일반 및 기술 문의</p>
                            <a href="mailto:support@reseller-ai.com" className="text-indigo-600 dark:text-indigo-400 font-medium">support@reseller-ai.com</a>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <h4 className="font-semibold">전화 문의</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">엔터프라이즈 플랜 및 긴급 문의</p>
                            <p className="font-medium">02-1234-5678</p>
                        </div>
                      </div>
                  </div>
              )
      }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">설정 및 지원</h2>
      <Card className="p-0 md:p-0">
        <div className="flex flex-col md:flex-row">
            <nav className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r dark:border-gray-700">
                <ul className="space-y-1">
                    {sections.map(section => (
                        <li key={section.id}>
                            <button 
                                onClick={() => setActiveSection(section.id as Section)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeSection === section.id
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-700 dark:text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="w-full md:w-3/4 p-6 md:p-8">
                {renderSection()}
            </main>
        </div>
      </Card>
    </div>
  );
};

export default SettingsAndSupportPage;
