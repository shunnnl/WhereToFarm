import { useState, useEffect } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const MyProfileImage = ({ imageUrl }) => {
  const [profileData, setProfileData] = useState({
    hasCustomImage: false,
    imageUrl: null, // 초기값은 null로 설정
  });

  const [isLoading, setIsLoading] = useState(true);

  // API에서 프로필 정보 가져오기
  useEffect(() => {
    // 이미지 URL이 들어오면 프로필 데이터 설정
    if (imageUrl) {
      setProfileData({
        hasCustomImage: true,
        imageUrl: imageUrl,
      });
      console.log(imageUrl)
    } else {
      // 이미지 URL이 없으면 기본 이미지 설정
      setProfileData({
        hasCustomImage: false,
        imageUrl: "/api/placeholder/200/200", // 기본 이미지 경로
      });
    }

    // 로딩 상태 해제
    setIsLoading(false);
  }, [imageUrl]);

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

      img.onload = async () => {
        try {
          // 로딩 상태 시작
          // setIsLoading(true);

          // 이미지 업로드 API 호출
          const formData = new FormData();
          formData.append("profileImage", file);

          // API 호출 예시
          // const response = await fetch('/api/myprofile/image', {
          //   method: 'POST',
          //   body: formData
          // });
          // const data = await response.json();

          // 성공했다고 가정하고 상태 업데이트
          setProfileData({
            hasCustomImage: true,
            imageUrl: imageUrl, // 실제로는 서버에서 반환한 URL로 설정
          });

          toast.success("프로필 이미지가 업로드되었습니다.");
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          toast.error("이미지 업로드에 실패했습니다.");
          URL.revokeObjectURL(imageUrl);
        } finally {
          // setIsLoading(false);
          e.target.value = "";
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        toast.error("손상된 이미지 파일입니다. 다른 이미지를 선택해주세요.");
        e.target.value = "";
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("이미지 유효성 검사 오류:", error);
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  // 기본 이미지로 초기화 함수
  const resetToDefaultImage = async () => {
    try {
      setIsLoading(true);

      // 이미지 삭제 API 호출
      // const response = await fetch('/api/myprofile/image', {
      //   method: 'DELETE'
      // });

      // 성공했다고 가정하고 상태 업데이트
      setProfileData({
        hasCustomImage: false,
        imageUrl: "/api/placeholder/200/200", // 기본 이미지 경로로 변경
      });

      toast.info("기본 프로필 이미지로 변경되었습니다.");
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
        <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-accentGreen">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <img
              src={profileData.imageUrl || "/api/placeholder/200/200"} // 기본 이미지 폴백 추가
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 이미지로 대체
                // e.target.src = "/api/placeholder/200/200";
                if (profileData.hasCustomImage) {
                  // 사용자 이미지가 로드 실패한 경우만 알림
                  toast.error("프로필 이미지를 불러올 수 없습니다.");
                }
              }}
            />
          )}
        </div>

        {/* 조건부 버튼 렌더링 - 로딩 중이 아닐 때만 표시 */}
        {!isLoading &&
          (profileData.hasCustomImage ? (
            <div className="absolute bottom-0 right-0 flex">
              {/* 이미지 업로드 버튼 */}
              <button
                className="bg-primaryGreen text-white p-1 rounded-full w-10 h-10 mr-2"
                onClick={handleButtonClick}
                title="5MB 이하의 JPG, PNG, GIF 형식만 가능합니다."
                disabled={isLoading}
              >
                <Camera size={32} strokeWidth={0.75} />
              </button>

              {/* 기본 이미지로 변경 버튼 */}
              <button
                className="bg-gray-500 text-white p-1 rounded-full w-10 h-10"
                onClick={resetToDefaultImage}
                title="기본 이미지로 변경"
                disabled={isLoading}
              >
                <RefreshCw size={32} strokeWidth={0.75} />
              </button>
            </div>
          ) : (
            <button
              className="absolute bottom-0 right-0 bg-primaryGreen text-white p-1 rounded-full w-10 h-10"
              onClick={handleButtonClick}
              title="5MB 이하의 JPG, PNG, GIF 형식만 가능합니다."
              disabled={isLoading}
            >
              <Camera size={32} strokeWidth={0.75} />
            </button>
          ))}
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
