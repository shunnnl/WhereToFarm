import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import ResultSummary from "../crop-calculator/ResultSummary";
import AnnualBenefitResult from "../crop-calculator/AnnualBenefitResult";
import BenefitForecastGraph from "../crop-calculator/BenefitForecastGraph";

const CalculateResultModal = forwardRef(({ reportId }, ref) => {
  const [report, setReport] = useState({});
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  // 모달 열렸을 때 스크롤 방지
  useEffect(() => {
    const preventBackdropScroll = (e) => {
      if (dialogRef.current && dialogRef.current.open) {
        if (e.target === dialogRef.current) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('wheel', preventBackdropScroll, { passive: false });
    document.addEventListener('touchmove', preventBackdropScroll, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventBackdropScroll);
      document.removeEventListener('touchmove', preventBackdropScroll);
    };
  }, []);

  // 부모 컴포넌트에서 접근할 수 있는 메소드 노출
  useImperativeHandle(ref, () => ({
    showModal: () => {
      dialogRef.current?.showModal();
      // 모달 열릴 때 body 스크롤 비활성화
      document.body.style.overflow = 'hidden';
      
      // 스크롤 위치 초기화
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    },
    close: () => {
      dialogRef.current?.close();
      // 모달 닫힐 때 body 스크롤 다시 활성화
      document.body.style.overflow = '';
    },
    updateData: (data) => {
      setReport(data);
      // 데이터 업데이트 시에도 스크롤 위치 초기화
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 0);
    },
  }));

  const handleCancel = () => {
    dialogRef.current?.close();
    document.body.style.overflow = '';
  };

  // 배경 클릭시 닫힘 방지 (필요시 사용)
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      e.preventDefault();
    }
  };

  // 모달이 닫힐 때 이벤트 리스너
  useEffect(() => {
    const resetScroll = () => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    };

    dialogRef.current?.addEventListener('close', resetScroll);
    
    return () => {
      dialogRef.current?.removeEventListener('close', resetScroll);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-5xl mx-auto p-0 rounded-xl bg-white shadow-lg"
      onClick={handleDialogClick}
      onClose={() => { document.body.style.overflow = ''; }}
    >
      {/* 스크롤 영역을 모달 내부에 있도록 처리 */}
      <div className="relative w-full h-full">
        {/* 상단 닫기 버튼 영역 - 스크롤되지 않음 */}
        <div className="sticky top-0 right-0 pt-4 pr-4 flex justify-end z-10 bg-white">
          <button
            onClick={handleCancel}
            className="text-gray-700 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* 스크롤 컨테이너 */}
        <div 
          ref={contentRef}
          className="px-6 pb-6 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {/* 타이틀 */}
          <h2 className="text-2xl font-bold text-center mb-8">
            나의 예상 수익 보고서
          </h2>

          {/* 데이터가 로드되었을 때만 컴포넌트 렌더링 */}
          {Object.keys(report).length > 0 ? (
            <>
              <ResultSummary
                cropsName={report.cropsName}
                myAreaVolume={report.myAreaVolume}
                myAreaField={report.myAreaField}
                myTotalQuantity={report.myTotalQuantity}
              />
              <AnnualBenefitResult
                myTotalPrice={report.myTotalPrice}
                myTotalOperatingPrice={report.myTotalOperatingPrice}
                myTotalRealPrice={report.myTotalRealPrice}
                myRate={report.myRate}
                isHouse={report.house}
              />
              <BenefitForecastGraph
                cropsName={report.cropsName}
                myForecast={report.myMonthlyPrice}
                pastPrice={report.myPastPrice}
                isInModal={true}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default CalculateResultModal;