import React, { useEffect } from 'react';

const PolicyModal = ({ policy, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 첫 번째 오버레이 - 전체 화면을 덮는 검은 배경 */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70" 
        style={{ 
          zIndex: 99998,
          margin: 0,
          padding: 0
        }}
      />
      
      {/* 두 번째 오버레이 - 모달 컨테이너 */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
        style={{ 
          zIndex: 99999,
          margin: 0,
          padding: 0
        }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{policy.title}</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-4">지역: {policy.region}</span>
              <span>등록일: {policy.registrationDate}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">사업 개요</h3>
              <p className="text-gray-700">{policy.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">지원 대상</h3>
              <p className="text-gray-700">{policy.target || '지원 대상 정보가 없습니다.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">지원 내용</h3>
              <p className="text-gray-700">{policy.support || '지원 내용 정보가 없습니다.'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyModal; 