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
              key={crop.naem}
              className={`text-textColor-white w-32 h-32 flex flex-col justify-center items-center ${
                isActive
                  ? "hover:bg-supportGreen hover:shadow-lg"
                  : "cursor-not-allowed"
              }`}
              onClick={onSubmit}
            >
              <img
                src={`../src/asset/crops/${crop.img}`}
                alt={crop.name}
                className="w-14 h-14"
              />
              <p>{crop.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CropSelectSection;
