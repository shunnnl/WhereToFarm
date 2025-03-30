import React, { useState, useEffect, useRef } from 'react';

const FarmScores = ({ scores }) => {
  const [animated, setAnimated] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({
    F: 0, A: 0, R: 0, M: 0
  });
  const [displayScores, setDisplayScores] = useState({
    F: 0, A: 0, R: 0, M: 0
  });

  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    // 컴포넌트가 마운트되면 애니메이션 시작
    setAnimated(true);
    
    const animationDuration = 2000; // 2초로 변경

    const animate = (currentTime) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // easeOutQuart 이징 함수 적용
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const newScores = {};
      Object.entries(scores).forEach(([key, targetScore]) => {
        newScores[key] = targetScore * easeProgress;
      });

      setDisplayScores(newScores);
      setAnimatedScores(newScores);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [scores]);

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
                    width: `${displayScores[key]*100}%`,
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>
            </div>
            <div className="w-16 text-right">
              <span className="text-gray-900 font-bold">
                {Math.round(displayScores[key]*100)}점
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmScores;