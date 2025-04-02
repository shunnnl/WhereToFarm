import { useState, useEffect } from "react";

const CropSelectSection = ({
  selectedCrop,
  setSelectedCrop,
  onSubmit,
  isActive,
  isCompleted,
  error,
}) => {
  const [cropsList, setCropList] = useState([
    { name: "사과", img: "apple.png" },
    { name: "배", img: "pear.png" },
    { name: "감귤", img: "tangerine.png" },
    { name: "포도", img: "grape.png" },
    { name: "수박", img: "watermelon.png" },
    { name: "오이", img: "cucumber.png" },
    { name: "대파", img: "greenonion.png" },
    { name: "양파", img: "onion.png" },
    { name: "상추", img: "lettuce.png" },
    { name: "고구마", img: "sweetpotato.png" },
  ]);

  // selectedCrop이 변경될 때마다 onSubmit 호출
  useEffect(() => {
    // selectedCrop이 있고, 컴포넌트가 활성화 상태일 때만 onSubmit 호출
    if (selectedCrop && isActive) {
      // 작물이 선택되면 onSubmit 호출
      onSubmit();
    }
  }, [selectedCrop, isActive, onSubmit]);

  // 작물 선택 핸들러
  const handleCropSelect = (crop) => {
    if (!isActive) return;

    // 작물 선택 상태 업데이트
    setSelectedCrop(crop);
  };

  return (
    <div
      className={`transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="crop-select-section bg-primaryGreen flex justify-between">
        {cropsList.map((crop) => {
          const isSelected = selectedCrop && selectedCrop.name == crop.name;
          return (
            <button
              key={crop.name}
              className={`
                text-textColor-white w-32 h-32 m-2 
                flex flex-col justify-center items-center 
                transition-all duration-200
                ${
                  isActive
                    ? "hover:bg-supportGreen hover:shadow-lg"
                    : "cursor-not-allowed"
                }
                ${
                  isSelected
                    ? "bg-supportGreen border-2  shadow-lg scale-105"
                    : "bg-transparent"
                }
              `}
              onClick={() => handleCropSelect(crop)}
              disabled={!isActive}
            >
              <img
                src={`https://farmbticropbucket.s3.ap-northeast-2.amazonaws.com/crop/${crop.img}`}
                alt={crop.name}
                className={`w-14 h-14 transition-transform ${
                  isSelected ? "scale-110" : ""
                }`}
              />
              <p className={`mt-2 ${isSelected ? "font-bold" : ""}`}>
                {crop.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CropSelectSection;
