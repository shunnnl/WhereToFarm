import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const MyPageModal = forwardRef(
  (
    {
      title,
      children,
      confrimText = "수정",
      cancelText = "취소",
      onConfirm = () => {},
      onCancel = () => {},
    },
    ref
  ) => {
    const modalRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        dialogRef.current?.showModal();
      },
      close: () => {
        dialogRef.current?.close();
      },
    }));

    // 모달이 열려있지 않으면 null 반환
    if (!isOpen) return null;

    // dialog가 닫힐 때 onCancel 호출, 명시적, 암시적 닫기 모두 처리
    useEffect(() => {
      const dialogElement = dialogRef.current;

      const handleClose = () => {
        if (!dialogElement.returnValue) {
          onCancel();
        }
      };

      if (dialogElement) {
        dialogElement.addEventListener("close", handleClose);

        return () => {
          dialogElement.removeEventListener("close", handleClose);
        };
      }
    }, [onCancel]);

    const handleConfirm = () => {
      onConfirm();
      dialogRef.current?.close();
    };

    const handleCancel = () => {
      onCancel();
      dialogRef.current?.close();
    };
  }
);
