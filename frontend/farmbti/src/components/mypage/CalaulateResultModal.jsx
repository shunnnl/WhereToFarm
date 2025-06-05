import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { X } from "lucide-react";
import ResultSummary from "../crop-calculator/ResultSummary";
import AnnualBenefitResult from "../crop-calculator/AnnualBenefitResult";
import BenefitForecastGraph from "../crop-calculator/BenefitForecastGraph";

const CalculateResultModal = forwardRef(({ reportId }, ref) => {
  const [report, setReport] = useState({});
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // 모달 상태 관리 및 백그라운드 스크롤 제어를 위한 효과적인 방법
  useEffect(() => {
    if (isOpen) {
      // 모달 열렸을 때 body 스크롤 방지 - position fixed 방식 추가
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 모달 닫혔을 때 원래 스크롤 위치로 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
  }, [isOpen]);

  // 모든 스크롤 이벤트 캡처 및 방지 (터치 이벤트 포함)
  useEffect(() => {
    const preventScroll = (e) => {
      if (isOpen && !contentRef.current?.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    };

    // 더 많은 이벤트 리스너 추가
    const options = { passive: false, capture: true };

    if (isOpen) {
      document.addEventListener("wheel", preventScroll, options);
      document.addEventListener("touchmove", preventScroll, options);
      document.addEventListener("touchstart", preventScroll, options);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") handleCancel();
      });
    }

    return () => {
      document.removeEventListener("wheel", preventScroll, options);
      document.removeEventListener("touchmove", preventScroll, options);
      document.removeEventListener("touchstart", preventScroll, options);
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") handleCancel();
      });
    };
  }, [isOpen]);

  // 부모 컴포넌트에서 접근할 수 있는 메소드 노출
  useImperativeHandle(ref, () => ({
    showModal: () => {
      setIsOpen(true);
      dialogRef.current?.showModal();

      // 스크롤 위치 초기화
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    },
    close: () => {
      setIsOpen(false);
      dialogRef.current?.close();
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
    setIsOpen(false);
    dialogRef.current?.close();
  };

  // 배경 클릭시 닫힘 방지
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 모달이 닫힐 때 이벤트 리스너
  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    };

    dialogRef.current?.addEventListener("close", handleClose);

    return () => {
      dialogRef.current?.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-5xl mx-auto p-0 rounded-xl bg-white shadow-lg"
      onClick={handleDialogClick}
      onClose={() => setIsOpen(false)}
      aria-modal="true"
      inert={!isOpen ? "" : undefined}
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
