import React from 'react';
import { useLocation } from 'react-router-dom';
import ReportTitle from '../../../components/recommendation/report/ReportTitle';
import FarmerDescription from '../../../components/recommendation/report/FarmerDescription';
import FarmScores from '../../../components/recommendation/report/FarmScores';
import RecommendedRegions from '../../../components/recommendation/report/RecommendedRegions';

const ReportPage = () => {
  const location = useLocation();
  console.log('ReportPage - location:', location);
  console.log('ReportPage - location.state:', location.state);
  const reportData = location.state?.reportData;
  console.log('ReportPage - reportData:', reportData);

  if (!reportData) {
    return <div className="text-red-500 text-center p-8">리포트 데이터를 찾을 수 없습니다.</div>;
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