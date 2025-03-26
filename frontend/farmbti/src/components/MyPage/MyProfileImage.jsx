import { useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";

const MyProfileImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 파일 유효성 검사 함수
  const validateFile = (file) => {
    // 1. 파일 확장자 확인
    const fileName = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = "." + fileName.split(".").pop();

    if (!validExtensions.includes(fileExtension)) {
      toast.error("JPG, JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
      return false;
    }

    // 2. MIME 타입 확인
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(file.type)) {
      toast.error("JPG, JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
      return false;
    }

    // 3. 파일 크기 확인 (5MB 제한)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("이미지 크기는 5MB 이하여야 합니다.");
      return false;
    }

    return true;
  };

  // 매직 넘버를 통한 이미지 형식 검증
  const validateImageContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        if (e.target.readyState === FileReader.DONE) {
          const uint = new Uint8Array(e.target.result);

          // 각 이미지 형식의 매직 넘버 확인
          let isValid = false;

          // JPEG: FF D8 FF
          if (uint[0] === 0xff && uint[1] === 0xd8 && uint[2] === 0xff) {
            isValid = true;
          }
          // PNG: 89 50 4E 47 0D 0A 1A 0A
          else if (
            uint[0] === 0x89 &&
            uint[1] === 0x50 &&
            uint[2] === 0x4e &&
            uint[3] === 0x47
          ) {
            isValid = true;
          }
          // GIF: 47 49 46 38
          else if (
            uint[0] === 0x47 &&
            uint[1] === 0x49 &&
            uint[2] === 0x46 &&
            uint[3] === 0x38
          ) {
            isValid = true;
          }

          if (isValid) {
            resolve(true);
          } else {
            reject(new Error("유효하지 않은 이미지 파일입니다."));
          }
        }
      };

      // 파일의 첫 8바이트만 읽기
      const blob = file.slice(0, 8);
      reader.readAsArrayBuffer(blob);
    });
  };

    const handleUploadImage = async (e) => {
      const file = e.target.files[0];

      // 파일이 선택되었는지 확인
      if (!file) return;

      try {
        // 기본 유효성 검사
        if (!validateFile(file)) {
          // 입력 필드 초기화
          e.target.value = "";
          return;
        }

        // 매직 넘버를 통한 파일 내용 검증
        await validateImageContent(file).catch((error) => {
          toast.error(error.message);
          e.target.value = "";
          throw error;
        });

        // 이미지 로드 가능 여부 확인 (손상된 이미지 감지)
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
          // 이미지 로드 성공, 상태 업데이트
          setSelectedImage(imageUrl);

          // 여기서 API로 전송하는 코드를 추가할 수 있습니다
          // const formData = new FormData();
          // formData.append('profileImage', file);
          // API 호출 코드...
        };

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          toast.error("손상된 이미지 파일입니다. 다른 이미지를 선택해주세요.");
          e.target.value = "";
        };

        img.src = imageUrl;
      } catch (error) {
        console.error("이미지 유효성 검사 오류:", error);
        // 이미 toast.error가 호출되었으므로 여기서는 추가 메시지를 표시하지 않음
      }
    };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="profile-image">
      <div className="relative mb-2">
        <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-accentGreen">
          <img
            src="/api/placeholder/200/200"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          className="absolute bottom-0 right-0 bg-primaryGreen text-white p-1 rounded-full w-10 h-10"
          onClick={handleButtonClick}
        >
          <Camera size={32} strokeWidth={0.75} />
        </button>
      </div>
      {/* 숨겨진 파일 입력 요소 */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default MyProfileImage;
