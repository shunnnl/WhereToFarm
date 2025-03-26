import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { X } from "lucide-react"; // X 아이콘 import

const MyPageModal = forwardRef(
  (
    {
      title,
      children,
      confrimText = "수정",
      cancelText = "취소",
      isLoading,
      onConfirm = () => {}, // 확인 시 수정 api 요청
      onCancel = () => {}, // 취소 시 창 닫김
      isFormValid = true,
    },
    ref
  ) => {
    const dialogRef = useRef(null);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        dialogRef.current?.showModal();
      },
      closeModal: () => {
        dialogRef.current?.close();
      },
    }));

    // 확인 버튼 핸들러
    const handleConfirm = () => {
      onConfirm();
    };

    // 취소 버튼 핸들러
    const handleCancel = () => {
      onCancel();
      dialogRef.current?.close();
    };

    // 백드롭 클릭 처리
    useEffect(() => {
      const dialog = dialogRef.current;

      const handleBackdropClick = (event) => {
        if (event.target === dialog) {
          dialog.close();
        }
      };

      dialog?.addEventListener("click", handleBackdropClick);

      return () => {
        dialog?.removeEventListener("click", handleBackdropClick);
      };
    }, []);

    return (
      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-white shadow-lg"
      >
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleCancel}
            className="absolute right-0 top-0 text-gray-700 hover:text-gray-900"
          >
            <X size={24} />
          </button>
          {/* 타이틀 */}
          <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
          {/* 모달 내용 */}
          <div className="mb-8">{children}</div>
          {/* 버튼 영역 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCancel}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "처리중..." : confrimText}
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

export default MyPageModal;
