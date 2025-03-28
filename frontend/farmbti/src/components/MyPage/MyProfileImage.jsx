import { useState, useEffect } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage, deleteImage } from "../../API/mypage/MyPageAPI";

const MyProfileImage = ({ imageUrl, isDefaultImage }) => {
  const [profileData, setProfileData] = useState({
    isDefaultImage: isDefaultImage,
    imageUrl: imageUrl || "/api/placeholder/200/200",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setProfileData({
        isDefaultImage: isDefaultImage,
        imageUrl: imageUrl,
      });
      console.log("프로필 이미지 URL:", imageUrl);
    }
  }, [imageUrl, isDefaultImage]);

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
      // 로딩 상태 시작
      setIsLoading(true);

      // 기본 유효성 검사
      if (!validateFile(file)) {
        // 입력 필드 초기화
        e.target.value = "";
        setIsLoading(false);
        return;
      }

      // 매직 넘버를 통한 파일 내용 검증
      await validateImageContent(file).catch((error) => {
        toast.error(error.message);
        e.target.value = "";
        setIsLoading(false);
        throw error;
      });

      // 이미지 로드 가능 여부 확인 (손상된 이미지 감지)
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = async () => {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await uploadImage(formData);

          // setProfileData({
          //   isDefaultImage: false, 
          //   imageUrl: response.profileImage, 
          // });

          toast.success("프로필 이미지가 업로드되었습니다.");
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          toast.error(error.message);
          URL.revokeObjectURL(imageUrl);
        } finally {
          setIsLoading(false);
          e.target.value = "";
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        toast.error("손상된 이미지 파일입니다. 다른 이미지를 선택해주세요.");
        e.target.value = "";
        setIsLoading(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("이미지 유효성 검사 오류:", error);
      e.target.value = "";
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  // 기본 이미지로 초기화 함수
  const resetToDefaultImage = async () => {
    try {
      setIsLoading(true);

      const response = await deleteImage();

      // setProfileData({
      //   isDefaultImage: true,
      //   imageUrl: response.profileImage,
      // });

      toast.success("기본 프로필 이미지로 변경되었습니다.");
    } catch (error) {
      console.error("이미지 초기화 실패:", error);
      toast.error("기본 이미지로 변경하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-image">
      <div className="relative mb-2">
        <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-primaryGreen">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <img
              src={profileData.imageUrl || "/api/placeholder/200/200"} // 기본 이미지 폴백 추가
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 조건부 버튼 렌더링 - 로딩 중이 아닐 때만 표시 */}
        {!isLoading && (
          <div className="absolute bottom-0 right-0 flex">
            {/* 이미지 업로드 버튼 */}
            <button
              className="bg-primaryGreen text-white p-1 rounded-md w-8 h-8 flex justify-center items-center"
              onClick={handleButtonClick}
              title="이미지 업로드는 5MB 이하의 JPG, PNG, GIF 형식만 가능합니다."
              disabled={isLoading}
            >
              <Camera size={20} strokeWidth={1} />
            </button>

            {/* 기본 이미지로 변경 버튼 - 사용자 이미지일 때만 표시 */}
            {!profileData.isDefaultImage && (
              <button
                className="bg-gray-500 text-white p-1 rounded-md w-8 h-8 flex justify-center items-center"
                onClick={resetToDefaultImage}
                title="기본 이미지로 변경"
                disabled={isLoading}
              >
                <RefreshCw size={20} strokeWidth={1} />
              </button>
            )}
          </div>
        )}
      </div>
      {/* 숨겨진 파일 입력 요소 */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleUploadImage}
        disabled={isLoading}
      />
    </div>
  );
};

export default MyProfileImage;
