import React from 'react';
import { useLocation } from 'react-router-dom';
import { findFarmerType } from '../../../data/reportResult';
import ReportTitle from '../../../components/recommendation/report/ReportTitle';
import FarmerDescription from '../../../components/recommendation/report/FarmerDescription';
import FarmScores from '../../../components/recommendation/report/FarmScores';
import RecommendedRegions from '../../../components/recommendation/report/RecommendedRegions';

const ReportPage = () => {
  const location = useLocation();
  const scores = location.state?.results || {};
  const farmerType = findFarmerType(scores);

  if (!farmerType) {
    return <div>결과를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9F3] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <ReportTitle farmerType={farmerType} />
          <div className="px-8 py-6">
            <FarmerDescription farmerType={farmerType} />
            <FarmScores scores={scores} />
          </div>
        </div>
        <RecommendedRegions />
      </div>
    </div>
  );
};

export default ReportPage;