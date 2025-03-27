import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../components/recommendation/survey/ProgressBar';
import SurveyQuestion from '../../../components/recommendation/survey/SurveyQuestion';
import NavigationButtons from '../../../components/recommendation/survey/NavigationButtons';
import { questions } from '../../../data/surveyQuestions';

const SurveyPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));

  // 진행률 계산 (전체 문항 수로 나누기)
  const progress = Math.round((currentQuestion / (questions.length - 1)) * 100);

  // 응답 저장
  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  // FARM 점수 계산
  const calculateResults = () => {
    const results = {
      F: 0, A: 0, R: 0, M: 0
    };
    const counts = {
      F: 0, A: 0, R: 0, M: 0
    };

    questions.forEach((q, index) => {
      if (answers[index] !== null) {
        results[q.category] += answers[index];
        counts[q.category]++;
      }
    });

    Object.keys(results).forEach(key => {
      if (counts[key] > 0) {
        results[key] = (results[key] / (counts[key] * 5)).toFixed(2);
      }
    });

    navigate('/recommendation/result', { state: { results } });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      {/* 진행 상태 표시 */}
      <ProgressBar progress={progress} />

      <div className="max-w-4xl mx-auto px-4">
        {/* 설문 문항 */}
        <SurveyQuestion
          questionNumber={currentQuestion + 1}
          question={questions[currentQuestion].question}
          selectedValue={answers[currentQuestion]}
          onValueChange={handleAnswer}
        />

        {/* 이전/다음 버튼 */}
        <NavigationButtons 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          hasAnswer={answers[currentQuestion] !== null}
          onPrev={() => setCurrentQuestion(prev => prev - 1)}
          onNext={() => {
            if (currentQuestion === questions.length - 1) {
              calculateResults();
            } else {
              setCurrentQuestion(prev => prev + 1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SurveyPage;