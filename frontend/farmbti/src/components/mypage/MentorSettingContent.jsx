import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const MentorSettingContent = forwardRef(({ onChange, initialData }, ref) => {
  // 작물 데이터
  const topFood = [
    { id: "apple", name: "사과", img: "apple.png" },
    { id: "pear", name: "배", img: "pear.png" },
    { id: "tangerine", name: "감귤", img: "tangerine.png" },
    { id: "grape", name: "포도", img: "grape.png" },
    { id: "watermelon", name: "수박", img: "watermelon.png" },
    { id: "cucumber", name: "오이", img: "cucumber.png" },
    { id: "greenonion", name: "대파", img: "greenonion.png" },
    { id: "onion", name: "양파", img: "onion.png" },
    { id: "lettuce", name: "상추", img: "lettuce.png" },
    { id: "sweetpotato", name: "고구마", img: "sweetpotato.png" },
  ];

  // 작물명과 ID 간 변환 도우미 함수
  const getIdFromLabel = (label) => {
    const food = topFood.find((food) => food.name === label);
    return food ? food.id : null;
  };

  const [formData, setFormData] = useState({
    farmingYears: initialData?.farmingYears || "",
    cropNames: initialData?.cropNames || "",
    bio: initialData?.bio || "",
  });

  // 선택된 작물 초기화 - 작물명 배열을 ID 배열로 변환
  const [selectedFoods, setSelectedFoods] = useState(() => {
    if (!initialData?.cropNames) return [];

    const cropNamesArray = Array.isArray(initialData.cropNames)
      ? initialData.cropNames
      : initialData.cropNames.split(",");

    // 작물명을 ID로 변환 - 이미 ID라면 그대로 사용
    return cropNamesArray
      .map((cropName) => {
        // 이미 topFood의 id 중 하나와 일치하는지 확인
        if (topFood.some((food) => food.id === cropName)) {
          return cropName;
        }
        // 아니라면 label로 간주하고 id로 변환
        return getIdFromLabel(cropName);
      })
      .filter((id) => id !== null);
  });

  const [bio, setDescription] = useState(initialData?.bio || "");
  const [errors, setErrors] = useState({});

  // 날짜 옵션 생성
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // 폼 리셋 함수 정의
  const resetForm = () => {
    setFormData({
      farmingYears: initialData?.farmingYears || "",
      cropNames: initialData?.cropNames || "",
      bio: initialData?.bio || "",
    });

    setSelectedFoods(() => {
      if (!initialData?.cropNames) return [];

      const cropNamesArray = Array.isArray(initialData.cropNames)
        ? initialData.cropNames
        : initialData.cropNames.split(",");

      return cropNamesArray
        .map((cropName) => {
          if (topFood.some((food) => food.id === cropName)) {
            return cropName;
          }
          return getIdFromLabel(cropName);
        })
        .filter((id) => id !== null);
    });

    setDescription(initialData?.bio || "");
    setErrors({});
  };

  // useImperativeHandle을 사용하여 리셋 함수 노출
  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  // 유효성 검사 함수
  const validateField = (name, value) => {
    switch (name) {
      case "farmingYears":
        if (!value) return "연도를 선택해주세요";
        if (value < 1980 || value > currentYear)
          return "유효한 연도를 선택해주세요";
        return "";

      case "cropNames":
        if (!value || value.length === 0)
          return "최소 한 개 이상의 작물을 선택해주세요";
        if (value.length > 5) return "최대 5개까지 선택 가능합니다";
        return "";

      case "bio":
        const trimmedValue = typeof value === "string" ? value.trim() : "";
        if (!trimmedValue) return "멘토 소개를 입력해주세요";
        if (trimmedValue.length < 10) return "10자 이상 입력해주세요";
        if (trimmedValue.length > 100) return "100자 이내로 입력해주세요";
        return "";

      default:
        return "";
    }
  };

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 유효성 검사 실행 및 오류 상태 업데이트
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // 작물 선택 토글
  const toggleFood = (foodId) => {
    // 새로운 선택된 작물 배열 계산
    const newSelectedFoods = selectedFoods.includes(foodId)
      ? selectedFoods.filter((id) => id !== foodId)
      : [...selectedFoods, foodId];

    // 상태 업데이트
    setSelectedFoods(newSelectedFoods);

    // 유효성 검사 수행: 최소 1개 이상의 작물이 선택되어야 함
    const errorMessage =
      newSelectedFoods.length === 0
        ? "최소 1개 이상의 작물을 선택해주세요"
        : "";

    // 오류 상태 업데이트
    setErrors((prev) => ({
      ...prev,
      cropNames: errorMessage,
    }));
  };

  // 소개 텍스트 핸들러
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value); // UI에서는 사용자가 입력한 그대로 표시

    // 유효성 검사 실행
    const errorMessage = validateField("bio", value);
    setErrors((prev) => ({
      ...prev,
      bio: errorMessage,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 선택된 작물 ID를 작물명으로 변환하여 formData에 업데이트
  useEffect(() => {
    const selectedLabels = selectedFoods
      .map((foodId) => {
        const food = topFood.find((item) => item.id === foodId);
        return food ? food.name : "";
      })
      .filter((name) => name !== "");

    setFormData((prev) => ({
      ...prev,
      cropNames: selectedLabels,
      bio: bio.trim(), // formData에 저장할 때는 trim된 값 사용
    }));
  }, [selectedFoods, bio]);

  // 부모 컴포넌트에 데이터 및 유효성 상태 전달
  useEffect(() => {
    if (onChange) {
      // 폼 데이터와 함께 유효성 검사 상태 포함
      onChange({
        data: formData,
        isValid: Object.values(errors).every((error) => !error),
        errors,
      });
    }
  }, [formData, errors, onChange]);

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      {/* 날짜선택 */}
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium">귀농 등록</h3>
        <div className="grid grid-cols-3 gap-4 w-80">
          <select
            name="farmingYears"
            value={formData.farmingYears}
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.farmingYears && (
        <p className="ml-24 text-red-500 text-sm mt-1">{errors.farmingYears}</p>
      )}

      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium whitespace-nowrap">재배 작물</h3>
        <div className="flex flex-wrap justify-center">
          {topFood.map((food) => (
            <div key={food.id} className="w-1/5 p-2 flex flex-col items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={food.id}
                  name="cropNames"
                  checked={selectedFoods.includes(food.id)}
                  onChange={() => toggleFood(food.id)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                />
                <label htmlFor={food.id} className="cursor-pointer pl-6">
                  <div className="w-16 h-16 bg-primaryGreen rounded-full flex items-center justify-center text-white">
                    <img
                      src={`https://farmbticropbucket.s3.ap-northeast-2.amazonaws.com/crop/${food.img}`}
                      alt={food.name}
                      className="w-14 h-14"
                    />
                  </div>
                </label>
                <div className="absolute -top-1 -left-1"></div>
              </div>
              <span className="mt-2 text-sm text-end">{food.name}</span>
            </div>
          ))}
        </div>
      </div>
      {errors.cropNames && (
        <div className="ml-24 text-red-500 text-sm mt-1">
          {errors.cropNames}
        </div>
      )}

      {/* 텍스트입력 */}
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium whitespace-nowrap">멘토 소개</h3>
        <div className="flex flex-wrap justify-center w-full">
          <div className="w-full max-w-4xl relative">
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={handleDescriptionChange}
              className="w-full max-w-4xl px-3 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-green-500 
            focus:border-transparent resize-y"
              placeholder="여기에 텍스트를 입력하세요"
              maxLength={100}
              required
            />
            <div
              className={`absolute bottom-2 right-2 text-sm ${
                bio.trim().length > 100 || bio.trim().length < 10
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {bio.trim().length}/100
            </div>
          </div>
        </div>
      </div>
      {errors.bio && (
        <div className="ml-24 text-red-500 text-sm mt-1">{errors.bio}</div>
      )}
    </form>
  );
});

export default MentorSettingContent;
