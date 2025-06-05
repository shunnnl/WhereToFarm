import React from 'react';

const FarmScores = ({ scores }) => {
  const farmCategories = {
    F: { 
      title: ['F', 'unds'],
      subtext: '(비용)',
      color: 'bg-[#7AB98E]' 
    },
    A: { 
      title: ['A', 'ccess'],
      subtext: '(접근성)',
      color: 'bg-[#7AB98E]' 
    },
    R: { 
      title: ['R', 'elationship'],
      subtext: '(지역 공동체)',
      color: 'bg-[#7AB98E]' 
    },
    M: { 
      title: ['M', 'ood'],
      subtext: '(환경)',
      color: 'bg-[#7AB98E]' 
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 mx-8 mt-8 shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)]">
      <h2 className="text-xl font-bold mb-6">FARM 유형별 지수 결과</h2>
      <div className="space-y-6">
        {Object.entries(scores).map(([key, score]) => (
          <div key={key} className="flex items-center gap-4">
            <div className="w-32">
              <div className="text-gray-700 font-medium">
                <div>
                  <span className="text-[#7AB98E] font-bold">{farmCategories[key].title[0]}</span>
                  {farmCategories[key].title[1]}
                </div>
                <div className="text-xs text-gray-500">{farmCategories[key].subtext}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${farmCategories[key].color}`}
                  style={{ 
                    width: `${score*100}%`
                  }}
                />
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-gray-900 font-bold">
                {Math.round(score*100)}점
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmScores;