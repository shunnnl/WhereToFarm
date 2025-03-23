const AnnualBenefitResult = ({
  myTotalPrice,
  myTotalOperatingPrice,
  myTotalRealPrice,
  myRate,
  isHouse,
}) => {
  const forrmatedMyTotalPrice = myTotalPrice.toLocaleString("ko-KR", {
    maximumFractionDigits: 0, // 소수점 이하 표시하지 않음 (반올림됨)
  });

  const forrmatedMyTotalOperatingPrice = myTotalOperatingPrice.toLocaleString(
    "ko-KR",
    {
      maximumFractionDigits: 0,
    }
  );
  const forrmatedMyTotalRealPrice = myTotalRealPrice.toLocaleString("ko-KR", {
    maximumFractionDigits: 0,
  });
  return (
    <div className="bg-accentGreen-light rounded-lg shadow-md m-8 p-6 flex flex-col justify-center items-center">
      <div className="text-center mb-5">
        <p className="text-2xl font-bold mb-2">연간 예상 작물 수익</p>
        {isHouse ? (
          <p className="text-textColor-darkgray">
            *본 수치는 시설 재배를 기준으로 합니다.
          </p>
        ) :
        (<p className="text-textColor-darkgray">
            *본 수치는 노지 재배를 기준으로 합니다.
          </p>)}
      </div>
      <div className="px-10 mb-5 w-full flex justify-between text-center items-center">
        <div className="totalPrice w-1/5">
          <p className="text-lg text-textColor-black m-2">연간 총 매출액</p>
          <div className="bg-secondaryYellow">
            <span className="text-xl text-textColor-black font-semibold">{forrmatedMyTotalPrice}</span>
            <span className="text-lg text-textColor-black font-semibold"> 원</span>
          </div>
        </div>
        <div className="bg-accentGreen w-10 h-10 rounded-full">
          <p className="text-3xl text-textColor-black">-</p>
        </div>
        <div className="totaOpertaingPrice w-1/5">
          <p className="text-lg text-textColor-black m-2">연간 총 경영비</p>
          <div className="bg-secondaryYellow">
            <span className="text-xl text-textColor-black font-semibold">{forrmatedMyTotalOperatingPrice}</span>
            <span className="text-lg text-textColor-black font-semibold"> 원</span>
          </div>
        </div>
        <div className="bg-accentGreen w-10 h-10 rounded-full">
          <p className="text-3xl text-textColor-black">=</p>
        </div>
        <div className="totalRealPrice w-1/5">
          <p className="text-lg text-textColor-black m-2">연간 예상 순 수익</p>
          <div className="bg-secondaryYellow">
            <span className="text-xl text-textColor-black font-semibold">{forrmatedMyTotalRealPrice}</span>
            <span className="text-lg text-textColor-black font-semibold"> 원</span>
          </div>
        </div>
      </div>
      <div className="bg-secondaryYellow px-5">
        <span className="text-xl text-textColor-black">총 매출액 대비 순 수익은</span>
        <span className="text-xl text-textColor-black font-semibold"> {myRate.toFixed(2)}%</span>
        <span className="text-xl text-textColor-black">입니다.</span>
      </div>
    </div>
  );
};

export default AnnualBenefitResult;
