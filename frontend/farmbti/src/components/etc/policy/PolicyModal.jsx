import React from 'react';

const PolicyModal = ({ policy, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
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
  );
};

export default PolicyModal;