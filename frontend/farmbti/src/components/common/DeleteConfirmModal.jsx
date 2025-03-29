const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "삭제 확인",
  message = "정말 삭제하시겠습니까?",
  itemName,
  confirmText = "삭제",
  cancelText = "취소",
}) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 백드롭 - 더 연한 검은색 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="bg-white rounded-lg p-6 w-80 max-w-md relative">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {message}
          <br />
          삭제된 데이터는 복구할 수 없습니다.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
