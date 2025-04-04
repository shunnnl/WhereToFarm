import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportTitle from '../../../components/recommendation/report/ReportTitle';
import FarmerDescription from '../../../components/recommendation/report/FarmerDescription';
import FarmScores from '../../../components/recommendation/report/FarmScores';
import RecommendedRegions from '../../../components/recommendation/report/RecommendedRegions';
import { getReport } from '../../../API/report/ReportAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { handleError } from '../../../utils/ErrorUtil';

const ReportPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await getReport(reportId);
        console.log('Report GET 응답:', response);
        setReportData(response);
        setError(null);
      } catch (error) {
        console.error('리포트 조회 실패:', error);
        handleError(error)
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReportData();
    }
  }, [reportId]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return <LoadingSpinner text="리포트를 불러오는 중..." />;
  }

  if (error || !reportData) {
    return <div className="text-red-500 text-center p-8">{error || '리포트 데이터를 찾을 수 없습니다.'}</div>;
  }

  const farmerType = {
    id: reportData.reportId,
    title: reportData.characterTypeName,
    subtitle: reportData.characterSubtitle,
    description: reportData.characterTypeDescription,
    characterTypeImage: reportData.characterTypeImage
  };

  const farmScores = {
    F: reportData.fratio,
    A: reportData.aratio,
    R: reportData.rratio,
    M: reportData.mratio
  };

  return (
    <div className="min-h-screen bg-[#F8F9F3] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <ReportTitle farmerType={farmerType} />
          <div className="px-8 py-6">
            <FarmerDescription farmerType={farmerType} />
            <FarmScores scores={farmScores} />
          </div>
        </div>
        <RecommendedRegions regions={reportData.topRegions} />
        
        {/* 네비게이션 버튼 섹션 */}
        <div className="flex justify-center gap-4 mt-8 mb-12">
          <button
            onClick={() => handleNavigate('/mypage')}
            className="px-6 py-3 bg-[#7AB98E] text-white rounded-lg hover:bg-[#3B6E54] transition-colors flex items-center gap-2"
          >
            <span>마이페이지</span>
            <span>→</span>
          </button>
          
          <button
            onClick={() => handleNavigate('/surveyintro')}
            className="px-6 py-3 bg-white text-[#7AB98E] border-2 border-[#7AB98E] rounded-lg hover:bg-[#F8F9F3] transition-colors flex items-center gap-2"
          >
            <span>다시 설문하기</span>
            <span>↻</span>
          </button>
          
          <button
            onClick={() => handleNavigate('/')}
            className="px-6 py-3 bg-white text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span>홈으로</span>
            <span>🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage; 