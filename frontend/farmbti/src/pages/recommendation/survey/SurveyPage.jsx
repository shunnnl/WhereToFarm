import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../components/recommendation/survey/ProgressBar';
import SurveyQuestion from '../../../components/recommendation/survey/SurveyQuestion';
import NavigationButtons from '../../../components/recommendation/survey/NavigationButtons';
import { questions } from '../../../data/surveyQuestions';
import { createReport } from '../../../API/report/ReportAPI';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const SurveyPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 컴포넌트 마운트 시 questions 배열 확인
  useEffect(() => {
    console.log('질문 목록:', questions);
    console.log('총 질문 수:', questions.length);
  }, []);

  // 진행률 계산 (전체 문항 수로 나누기)
  const progress = Math.round((currentQuestion / (questions.length - 1)) * 100);

  // 응답 저장
  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    console.log('현재까지의 응답:', newAnswers);
  };

  // FARM 점수 계산 및 API 요청
  const calculateResults = async () => {
    console.log('calculateResults 함수 실행 시작');
    try {
      setIsSubmitting(true);
      
      // FARM 점수 계산
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
          results[key] = Number((results[key] / (counts[key] * 5)).toFixed(2));
        }
      });

      console.log('계산된 FARM 점수:', results);

      // API 요청
      console.log('API 요청 시작');
      const response = await createReport(results);
      console.log('설문 결과 API 응답:', response);

      if (!response || !response.reportId) {
        throw new Error('유효하지 않은 API 응답');
      }

      console.log('이동할 reportId:', response.reportId);
      console.log('ReportPage로 전달할 데이터:', response);
      
      // 결과 페이지로 이동
      navigate(`/report/${response.reportId}`, { 
        state: { 
          reportData: response
        } 
      });
      console.log('navigate 호출 완료');
      
    } catch (error) {
      console.error('결과 제출 중 오류 발생:', error);
      toast.error('결과 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    console.log('다음 버튼 클릭');
    console.log('현재 질문:', currentQuestion);
    console.log('전체 질문 수:', questions.length);
    
    if (currentQuestion === questions.length - 1) {
      console.log('마지막 질문에서 완료 버튼 클릭');
      await calculateResults();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner text="결과를 분석하는 중..." />;
  }

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
          onNext={handleNext}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default SurveyPage; 