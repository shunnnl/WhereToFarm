import { useState, useEffect } from "react";

const MentorSettingContent = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    farmingYears: initialData?.farmingYears || "",
    cropNames: initialData?.cropNames || "",
    bio: initialData?.bio || "",
  });

  const [bio, setDescription] = useState(initialData?.bio || "");

  const [errors, setErrors] = useState({});

  // 날짜 옵션 생성
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // 작물 데이터
  const topFood = [
    {
      id: "apple",
      label: "사과",
      iconSrc: "../../asset/mentor/icons/apple.png",
    },
    {
      id: "cucumber",
      label: "오이",
      iconSrc: "../../asset/mentor/icons/cucumber.png",
    },
    {
      id: "grape",
      label: "포도",
      iconSrc: "../../asset/mentor/icons/grape.png",
    },
    {
      id: "greenonion",
      label: "대파",
      iconSrc: "../../asset/mentor/icons/greenonion.png",
    },
    {
      id: "lettuce",
      label: "상추",
      iconSrc: "../../asset/mentor/icons/lettuce.png",
    },
    {
      id: "onion",
      label: "양파",
      iconSrc: "../../asset/mentor/icons/onion.png",
    },
    { id: "pear", label: "배", iconSrc: "../../asset/mentor/icons/pear.png" },
    {
      id: "sweetpotato",
      label: "고구마",
      iconSrc: "../../asset/mentor/icons/sweetpotato.png",
    },
    {
      id: "tangerine",
      label: "감귤",
      iconSrc: "../../asset/mentor/icons/tangerine.png",
    },
    {
      id: "watermelon",
      label: "수박",
      iconSrc: "../../asset/mentor/icons/watermelon.png",
    },
  ];

  // 작물명을 ID로 변환하는 함수
  const getIdFromLabel = (label) => {
    const food = topFood.find((food) => food.label === label);
    return food ? food.id : null;
  };

  // 초기 선택 작물 설정
  const [selectedFoods, setSelectedFoods] = useState(() => {
    if (!initialData?.cropNames) return [];

    const cropNamesArray = Array.isArray(initialData.cropNames)
      ? initialData.cropNames
      : initialData.cropNames.split(",");

    // 작물명을 ID로 변환
    return cropNamesArray
      .map((cropName) => getIdFromLabel(cropName))
      .filter((id) => id !== null); // 유효한 ID만 반환
  });

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
        if (!value) return "멘토 소개를 입력해주세요";
        if (value.length < 10) return "10자 이상 입력해주세요";
        if (value.length > 100) return "100자 이내로 입력해주세요";
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
      foodType: errorMessage,
    }));
  };

  // 소개 텍스트 핸들러
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setDescription(e.target.value);
    // 유효성 검사 실행 및 오류 상태 업데이트
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 선택된 작물과 설명을 formData에 반영
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      cropNames: selectedFoods.join(","),
      bio: bio,
    }));
  }, [selectedFoods, bio]);

  // onChange 콜백 수정
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
            name="farmingYears" // "Year"에서 "farmingYears"로 변경
            value={formData.farmingYears} // "Year"에서 "farmingYears"로 변경
            onChange={handleChange}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">연도</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.Year && (
        <p className="ml-24 text-red-500 text-sm mt-1">{errors.Year}</p>
      )}

      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium whitespace-nowrap">재배 작물</h3>
        <div className="flex flex-wrap justify-center">
          {topFood.map((food) => (
            <div key={food.id} className="w-1/5 p-2 flex flex-col items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox" // radio를 checkbox로 변경하여 다중 선택 가능
                  id={food.id}
                  name="foodType"
                  checked={selectedFoods.includes(food.id)}
                  onChange={() => toggleFood(food.id)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                />
                <label htmlFor={food.id} className="cursor-pointer pl-6">
                  <div className="w-16 h-16 bg-primaryGreen rounded-full flex items-center justify-center text-white">
                    <img
                      src={food.iconSrc}
                      alt={food.label}
                      className="w-14 h-14"
                    />
                  </div>
                </label>
                <div className="absolute -top-1 -left-1"></div>
              </div>
              <span className="mt-2 text-sm text-end">{food.label}</span>
            </div>
          ))}
        </div>
      </div>
      {errors.foodType && (
        <div className="ml-24 text-red-500 text-sm mt-1">{errors.foodType}</div>
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
              required
            />
            <div
              className={`absolute bottom-2 right-2 text-sm ${
                bio.length > 100 || bio.length < 10
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {bio.length}/100
            </div>
          </div>
        </div>
      </div>
      {errors.bio && (
        <div className="ml-24 text-red-500 text-sm mt-1">{errors.bio}</div>
      )}
    </form>
  );
};

export default MentorSettingContent;
