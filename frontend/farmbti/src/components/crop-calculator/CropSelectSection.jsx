import { useState } from "react";

const CropSelectSection = ({
  selectedCrop,
  setSelectedCrop,
  onSubmit,
  isActive,
  isCompleted,
  error,
}) => {
  const [cropsList, setCropList] = useState([
    "사과",
    "배",
    "감귤",
    "수박",
    "포도",
    "고구마",
    "상추",
    "오이",
    "양파",
    "대파",
  ]);
  return (
    <div
      className={`transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="crop-select-section bg-primaryGreen flex justify-between">
        {cropsList.map((crop) => {
          return (
            <button
              key={crop}
              className="text-textColor-white w-32 h-32 hover:bg-supportGreen hover:shadow-lg"
              onClick={onSubmit}
            >
              {crop}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CropSelectSection;
