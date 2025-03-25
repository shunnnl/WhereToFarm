import { useState, useEffect } from "react";

const MentorSettingContent = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    Year: initialData?.Year || "",
    foodType: initialData?.foodType || "",
    description: initialData?.description || "",
  });

  const [selectedFoods, setSelectedFoods] = useState(
    initialData?.foodType ? initialData.foodType.split(",") : []
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

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

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 작물 선택 토글
  const toggleFood = (foodId) => {
    setSelectedFoods((prev) => {
      if (prev.includes(foodId)) {
        return prev.filter((id) => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
  };

  // 소개 텍스트 핸들러
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 선택된 작물과 설명을 formData에 반영
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      foodType: selectedFoods.join(","),
      description,
    }));
  }, [selectedFoods, description]);

  // formData가 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      {/* 날짜선택 */}
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium">귀농 등록</h3>
        <div className="grid grid-cols-3 gap-4 w-80">
          <select
            name="Year"
            value={formData.Year}
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

      {/* 텍스트입력 */}
      <div className="flex items-center space-x-4">
        <h3 className="text-xl font-medium whitespace-nowrap">멘토 소개</h3>
        <div className="flex flex-wrap justify-center w-full">
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full max-w-4xl px-3 py-2 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-green-500 
            focus:border-transparent resize-y"
            placeholder="여기에 텍스트를 입력하세요"
            required
          />
        </div>
      </div>
    </form>
  );
};

export default MentorSettingContent;
