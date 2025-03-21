const AreaInputSection = ({
  area,
  setArea,
  convertedArea,
  onSubmit,
  isActive,
  error,
}) => {
  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };
  return (
    <div
      className={`transition-opacity duration-300 mx-6 ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="px-8 py-4 bg-accentGreen-light rounded-t-lg shadow-md mb-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-primaryGreen">
          재배 평수 입력
        </h2>
        <p className="text-sm text-textColor-darkgray mb-4">
          *본 예상 수익 계산기는 농촌진흥청에서 제공된 &lt;2023 지역별 농산물
          소득 자료&gt;와 농식품 빅데이터 거래소 &lt;공영도매시장 농협 공판장
          품목 산지별 물량 및 금액&gt; 데이터를 기반으로 한 것으로, 실제 수익과
          차이가 있을 수 있습니다. 따라서 참고용으로만 활용하시길 바랍니다.
        </p>

        {error && <p className="text-sm text-fail-highlight flex items-center justify-center mb-3">
          {error}
        </p>}

        <div className="flex items-center justify-center mb-4">
          <label className="text-lg font-semibold mr-4 text-textColor-black">
            총 경지 면적 =
          </label>
          <input
            type="number"
            className="border border-textColor-gray rounded-lg px-3 py-2 w-48 mr-2"
            placeholder="평수 입력(100~1500)"
            value={area}
            onChange={handleAreaChange}
            disabled={!isActive}
            step={100}
          />
          <span className="mr-2 text-textColor-black">평</span>
          <span className="mx-2 text-textColor-black">×</span>
          <span className="mr-2 text-textColor-black">3.3058m² =</span>
          <span className="mr-2 text-primaryGreen">{convertedArea}</span>
          <span>m²</span>

          <button
            className={`ml-4 px-4 py-2 bg-supportGreen text-white rounded-lg ${
              !isActive
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primaryGreen"
            }`}
            onClick={onSubmit}
            disabled={!isActive}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaInputSection;
