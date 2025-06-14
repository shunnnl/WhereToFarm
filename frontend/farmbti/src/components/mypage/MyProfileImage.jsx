import { useState, useEffect, useCallback } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage, deleteImage } from "../../API/mypage/MyPageAPI";
import { handleError } from "../../utils/ErrorUtil";

const MyProfileImage = ({ imageUrl, isDefaultImage }) => {
  const [profileData, setProfileData] = useState({
    isDefaultImage: isDefaultImage,
    imageUrl: imageUrl || "/api/placeholder/200/200",
  });

  const [isLoading, setIsLoading] = useState(false); // 이미지 업로드 로딩 상태
  const [isLoadingImg, setIsLoadingImg] = useState(true); // 이미지 로딩 상태

  // 이미지 미리 로드 함수
  const preloadImage = useCallback((url) => {
    setIsLoadingImg(true);

    // 안전장치: 5초 후 강제로 로딩 상태 해제
    const timeoutId = setTimeout(() => {
      setIsLoadingImg(false);
      console.log("이미지 로드 타임아웃, 강제 완료");
    }, 5000);

    const img = new Image();

    img.onload = () => {
      console.log("이미지 미리 로드 완료:", url);
      setIsLoadingImg(false);
      clearTimeout(timeoutId);
    };

    img.onerror = () => {
      console.log("이미지 미리 로드 실패:", url);
      setIsLoadingImg(false);
      clearTimeout(timeoutId);
    };

    img.src = url;

    return () => clearTimeout(timeoutId);
  }, []);

  // 로컬 스토리지 업데이트 함수
  const updateLocalStorageUser = useCallback((newImageUrl) => {
    try {
      // 로컬 스토리지에서 기존 사용자 데이터 가져오기
      const userDataString = localStorage.getItem("user");
      if (!userDataString) return;

      // JSON 파싱 및 새 이미지 URL로 업데이트
      const userData = JSON.parse(userDataString);
      userData.profileImage = newImageUrl;

      // 업데이트된 데이터를 로컬 스토리지에 저장
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("로컬 스토리지 프로필 이미지 업데이트 완료:", newImageUrl);
    } catch (error) {
      console.error("로컬 스토리지 업데이트 실패:", error);
    }
  }, []);

  // 이미지 URL이 변경될 때 처리
  useEffect(() => {
    if (imageUrl) {
      setProfileData({
        isDefaultImage: isDefaultImage,
        imageUrl: imageUrl,
      });
      console.log("프로필 이미지 URL:", imageUrl);

      // S3 URL이면 미리 로드
      if (imageUrl.includes("s3.") || imageUrl.includes("amazonaws.com")) {
        return preloadImage(imageUrl);
      } else {
        // 기본 이미지나 내부 리소스는 바로 로드 완료 처리
        setIsLoadingImg(false);
      }
    }
  }, [imageUrl, isDefaultImage, preloadImage]);

  // profileData가 변경될 때 로컬 스토리지 업데이트
  useEffect(() => {
    // 이미지 URL이 유효하고 초기값이 아닐 때만 로컬 스토리지 업데이트
    if (
      profileData.imageUrl &&
      profileData.imageUrl !== "/api/placeholder/200/200"
    ) {
      updateLocalStorageUser(profileData.imageUrl);
    }
  }, [profileData.imageUrl, updateLocalStorageUser]);

  // 파일 유효성 검사 함수
  const validateFile = (file) => {
    // 1. 파일 확장자 확인
    const fileName = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = "." + fileName.split(".").pop();

    if (!validExtensions.includes(fileExtension)) {
      toast.warning("JPG, JPEG, PNG 형식의 이미지만 업로드 가능합니다.");
      return false;
    }

    // 2. MIME 타입 확인
    const validMimeTypes = ["image/jpeg", "image/png"];
    if (!validMimeTypes.includes(file.type)) {
      toast.warning("JPG, JPEG, PNG 형식의 이미지만 업로드 가능합니다.");
      return false;
    }

    // 3. 파일 크기 확인 (5MB 제한)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.warning("이미지 크기는 5MB 이하여야 합니다.");
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

      try {
        await validateImageContent(file);
      } catch (error) {
        toast.warning(error.message);
        e.target.value = "";
        setIsLoading(false);
        return; // ← 여기서 함수 종료, 외부 catch로 가지 않음
      }

      // 이미지 로드 가능 여부 확인 (손상된 이미지 감지)
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = async () => {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await uploadImage(formData);

          setProfileData({
            isDefaultImage: false,
            imageUrl: response.imageUrl,
          });

          // 로컬 스토리지 업데이트는 useEffect에서 처리됨

          toast.success("프로필 이미지가 업로드되었습니다.");
        } catch (error) {
          handleError(error);
          console.error("이미지 업로드 실패:", error);
          URL.revokeObjectURL(imageUrl);
        } finally {
          setIsLoading(false);
          e.target.value = "";
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        toast.warning("손상된 이미지 파일입니다. 다른 이미지를 선택해주세요.");
        e.target.value = "";
        setIsLoading(false);
      };

      img.src = imageUrl;
    } catch (error) {
      handleError(error);
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

      setProfileData({
        isDefaultImage: true,
        imageUrl: response.imageUrl,
      });

      // 로컬 스토리지 업데이트는 useEffect에서 처리됨

      toast.success("기본 프로필 이미지로 변경되었습니다.");
    } catch (error) {
      handleError(error);
      console.error("이미지 초기화 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-image">
      <div className="relative mb-2">
        <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-primaryGreen">
          {/* 로딩 UI와 이미지 렌더링 */}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* 이미지가 완전히 로드되기 전에 표시할 로딩 스피너 */}
              {isLoadingImg && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                </div>
              )}

              {/* 이미지 - DOM에는 항상 존재하지만 로딩 중일 때는 숨김 처리 */}
              <img
                src={profileData.imageUrl}
                alt="Profile"
                className={`w-full h-full object-cover bg-[#4891E0] rounded-full text-[#4891E0] transition-opacity duration-300 ${
                  isLoadingImg ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          )}
        </div>

        {/* 조건부 버튼 렌더링 - 업로드 중이 아닐 때만 표시 */}
        {!isLoading && (
          <div className="absolute bottom-0 right-0 flex">
            {/* 이미지 업로드 버튼 */}
            <button
              className="bg-primaryGreen text-white p-1 rounded-md w-8 h-8 flex justify-center items-center"
              onClick={handleButtonClick}
              title="이미지 업로드는 5MB 이하의 JPG, PNG 형식만 가능합니다."
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
