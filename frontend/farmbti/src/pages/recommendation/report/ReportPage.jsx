import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReportTitle from '../../../components/recommendation/report/ReportTitle';
import FarmerDescription from '../../../components/recommendation/report/FarmerDescription';
import FarmScores from '../../../components/recommendation/report/FarmScores';
import RecommendedRegions from '../../../components/recommendation/report/RecommendedRegions';
import { getReport } from '../../../API/report/ReportAPI';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const ReportPage = () => {
  const { reportId } = useParams();
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
        setError('리포트를 불러오는데 실패했습니다.');
        toast.error('리포트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReportData();
    }
  }, [reportId]);

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
      </div>
    </div>
  );
};

export default ReportPage; 