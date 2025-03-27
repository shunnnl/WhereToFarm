import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  text = "로딩 중...",
  fullScreen = false,
  overlay = false,
}) => {
  // 크기에 따른 클래스
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  // 색상에 따른 클래스
  const colorClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    white: "border-white border-t-transparent",
  };

  // 스피너 컨테이너 클래스
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "flex items-center justify-center";

  // 오버레이 배경 클래스
  const overlayClasses = overlay ? "bg-black bg-opacity-50" : "";

  return (
    <div className={`${containerClasses} ${overlayClasses}`}>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
          role="status"
          aria-label="loading"
        />
        {text && (
          <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
