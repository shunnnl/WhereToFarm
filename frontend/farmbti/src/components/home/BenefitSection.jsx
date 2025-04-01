import { useEffect, useState } from "react";
import { getTop3Support } from "../../API/home/Top3SupportAPI";
import BenefitCard from "./BenefitCard";
import { Link } from "react-router";

const BenefitSection = () => {
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    const fetchBenfit = async () => {
      try {
        const response = await getTop3Support();
        console.log(response)
        setBenefits(response);
      } catch (err) {
        setError("혜택을 불러오는 데 실패했습니다.");
        console.error("혜택 데이터 요청 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenfit();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        <p className="font-bold">오류가 발생했습니다</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-16 mb-12">
      <Link
        to="/support"
        className="group inline-flex items-center gap-2 mb-8 hover:text-primaryGreen transition-colors cursor-pointer"
      >
        <span className="font text-4xl font-bold mb-6">
          📢 관심있는 혜택을 찾아보세요
        </span>
        <svg
          className="w-7 h-7 -mt-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benefits.map((card, index) => (
          <BenefitCard
            key={index}
            region={card.region}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitSection;
