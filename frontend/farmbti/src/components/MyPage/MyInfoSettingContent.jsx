import { useState, useEffect } from "react";
import { Link } from "react-router";

const MyInfoSettingContent = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender || "",
    Year: initialData?.Year || "",
    Month: initialData?.Month || "",
    Day: initialData?.Day || "",
    address: initialData?.address || "",
  });

  const [errors, setErrors] = useState({});

  // 날짜 옵션 생성
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // 선택한 연도와 월에 따라 일 옵션 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const dayOptions =
    formData.Year && formData.Month
      ? Array.from(
          { length: getDaysInMonth(formData.Year, formData.Month) },
          (_, i) => i + 1
        )
      : Array.from({ length: 31 }, (_, i) => i + 1);

  // 유효성 검사 함수
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value ? "이름을 입력해주세요" : "";
      case "gender":
        return !value ? "성별을 선택해주세요" : "";
      case "Year":
      case "Month":
      case "Day":
        return !value ? "생년월일을 모두 선택해주세요" : "";
      case "address":
        return !value ? "주소를 입력해주세요" : "";
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

  // 성별 선택 핸들러
  const handleGenderChange = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));

    // 유효성 검사 업데이트
    const errorMessage = validateField("gender", gender);
    setErrors((prev) => ({
      ...prev,
      gender: errorMessage,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 초기 마운트 시 유효성 검사
  useEffect(() => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value);
    });
    setErrors(newErrors);
  }, []);

  // formData가 변경될 때마다 부모에게 알림 (유효성 검사 결과 포함)
  useEffect(() => {
    if (onChange) {
      onChange({
        data: formData,
        isValid: Object.values(errors).every((error) => !error),
        errors,
      });
    }
  }, [formData, errors, onChange]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 w-full max-w-xl mx-auto"
      >
        {/* 이름 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">이름</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
          />
          {errors.name && (
            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
          )}
        </div>

        {/* 성별 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">성별</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="남성"
                checked={formData.gender === "남성"}
                onChange={() => handleGenderChange("남성")}
                className="w-5 h-5 text-blue-500"
              />
              <span className="ml-2">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="여성"
                checked={formData.gender === "여성"}
                onChange={() => handleGenderChange("여성")}
                className="w-5 h-5 text-blue-500"
              />
              <span className="ml-2">여성</span>
            </label>
          </div>
          {errors.gender && (
            <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
          )}
        </div>

        {/* 생년월일 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">생년월일</h2>
          <div className="grid grid-cols-3 gap-4">
            <select
              name="Year"
              value={formData.Year}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              <option value="">연도</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="Month"
              value={formData.Month}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              <option value="">월</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              name="Day"
              value={formData.Day}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              <option value="">일</option>
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {(errors.Year || errors.Month || errors.Day) && (
            <div className="text-red-500 text-sm mt-1">
              생년월일을 모두 선택해주세요
            </div>
          )}
        </div>

        {/* 주소 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">주소</h2>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
          />
          {errors.address && (
            <div className="text-red-500 text-sm mt-1">{errors.address}</div>
          )}
        </div>
      </form>
      <div className="mt-3 flex justify-end px-6 text-textColor-gray underline hover:text-textColor-darkgray hover:underline">
        <Link to={"/account/delete"}>회원 탈퇴 하기</Link>
      </div>
    </>
  );
};

export default MyInfoSettingContent;
