import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { X } from 'lucide-react'; // X 아이콘 import

const MyPageModal = forwardRef(
  (
    {
      title,
      children,
      confrimText = "수정",
      cancelText = "취소",
      onConfirm = () => {}, // 확인 시 수정 api 요청
      onCancel = () => {}, // 취소 시 창 닫김
    },
    ref
  ) => {
    const dialogRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setIsOpen(true);
        dialogRef.current?.showModal();
      },
      closeModal: () => {
        setIsOpen(false);
        dialogRef.current?.close();
      },
    }));

    // dialog가 닫힐 때 onCancel 호출, 명시적, 암시적 닫기 모두 처리
    useEffect(() => {
      const dialogElement = dialogRef.current;

      const handleClose = () => {
        if (!dialogElement.returnValue) {
          onCancel();
        }
        setIsOpen(false);
      };

      if (dialogElement) {
        dialogElement.addEventListener("close", handleClose);

        return () => {
          dialogElement.removeEventListener("close", handleClose);
        };
      }
    }, [isOpen, onCancel]);

    const handleConfirm = () => {
      onConfirm();
      dialogRef.current?.close();
    };

    const handleCancel = () => {
      onCancel();
      dialogRef.current?.close();
    };

    const handleBackdropClick = (e) => {
      if (e.target === dialogRef.current) {
        dialogRef.current?.close();
      }
    };

    return (
      <dialog
        ref={dialogRef}
        className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-white shadow-lg"
        onClick={handleBackdropClick}
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
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              {confrimText}
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);

export default MyPageModal;
