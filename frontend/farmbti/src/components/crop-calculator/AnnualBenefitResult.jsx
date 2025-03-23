const AnnualBenefitResult = ({
  myTotalPrice,
  myTotalOperatingPrice,
  mymyTotalRealPrice,
  myRate,
  isHouse,
}) => {
  return (
    <div className="">
      <p>연간 예상 작물 수익</p>
      {isHouse && <p>본 수치는 시설 재배를 기준으로 합니다.</p>}
      <div></div>
      <div>
        <span>총 매출액 대비 순 수익은</span>
        <span>{myRate}%</span>
        <span>입니다.</span>
      </div>
    </div>
  );
};

export default AnnualBenefitResult;
