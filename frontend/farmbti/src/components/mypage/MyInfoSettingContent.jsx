import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router";
import useKakaoAddressService from "../../API/useKakaoAddressService";

const MyInfoSettingContent = forwardRef(({ onChange, initialData }, ref) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender !== undefined ? Number(initialData.gender) : "",
    year: initialData?.year || "",
    month: initialData?.month || "",
    day: initialData?.day || "",
    address: initialData?.address || "",
  });

  const [errors, setErrors] = useState({});
  const [nameInput, setNameInput] = useState(initialData?.name || "");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const resetForm = () => {
    setFormData({
      name: initialData?.name || "",
      gender:
        initialData?.gender !== undefined ? Number(initialData.gender) : "",
      year: initialData?.year || "",
      month: initialData?.month || "",
      day: initialData?.day || "",
      address: initialData?.address || "",
    });
    
    setNameInput(initialData?.name || "");
    setErrors({});
  };

  useImperativeHandle(ref, () => ({
    resetForm,
  }));

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const dayOptions =
    formData.year && formData.month
      ? Array.from(
          { length: getDaysInMonth(formData.year, formData.month) },
          (_, i) => i + 1
        )
      : Array.from({ length: 31 }, (_, i) => i + 1);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        const trimmedValue = typeof value === 'string' ? value.trim() : '';
        if (!trimmedValue) return "이름을 입력해주세요";
        if (trimmedValue.length < 2) return "이름은 최소 2자 이상이어야 합니다";
        if (trimmedValue.length > 10) return "이름은 최대 10자까지 입력 가능합니다";
        if (/[^가-힣a-zA-Z\s]/.test(trimmedValue))
          return "이름에는 특수문자와 숫자를 사용할 수 없습니다";
        return "";

      case "gender":
        if (value !== 0 && value !== 1 && value !== "0" && value !== "1")
          return "성별을 선택해주세요";
        return "";

      case "year":
        if (!value) return "출생 연도를 선택해주세요";
        return "";

      case "month":
        if (!value) return "출생 월을 선택해주세요";
        return "";

      case "day":
        if (!value) return "출생일을 선택해주세요";
        return "";

      case "address":
        const trimmedAddress = typeof value === 'string' ? value.trim() : '';
        if (!trimmedAddress) return "주소를 입력해주세요";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      setNameInput(value); // UI에는 사용자가 입력한 그대로 표시
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleGenderChange = (gender) => {
    const genderValue = gender === "남성" ? 0 : 1;

    setFormData((prev) => ({
      ...prev,
      gender: genderValue,
    }));

    const errorMessage = validateField("gender", genderValue);
    setErrors((prev) => ({
      ...prev,
      gender: errorMessage,
    }));
  };

  const handleAddressSelected = (addressData) => {
    const address = addressData.address.trim();
    setFormData((prev) => ({
      ...prev,
      address: address,
    }));
    
    const errorMessage = validateField("address", address);
    setErrors((prev) => ({
      ...prev,
      address: errorMessage,
    }));
  };

  const { openAddressSearch } = useKakaoAddressService(handleAddressSelected);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 이름 입력값 변경 시 trim된 값으로 formData 업데이트
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: nameInput.trim(),
    }));
  }, [nameInput]);

  // 컴포넌트가 마운트될 때 초기 데이터 검증
  useEffect(() => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value);
    });
    setErrors(newErrors);
  }, []);

  // 폼 데이터나 에러가 변경될 때 부모 컴포넌트에 알림
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
            value={nameInput}
            onChange={handleChange}
            placeholder="이름를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            maxLength={20}
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
                checked={formData.gender === 0 || formData.gender === "0"}
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
                checked={formData.gender === 1 || formData.gender === "1"}
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
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {(errors.year || errors.month || errors.day) && (
            <div className="text-red-500 text-sm mt-1">
              생년월일을 모두 선택해주세요
            </div>
          )}
        </div>

        {/* 주소 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">주소</h2>
          <div className="flex gap-2">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="주소를 입력하세요"
              readOnly={true}
              onFocus={(e) => e.target.blur()}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportGreen"
            />
            <button
              type="button"
              onClick={openAddressSearch}
              className="whitespace-nowrap px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              주소 검색
            </button>
          </div>
          {errors.address && (
            <div className="text-red-500 text-sm mt-1">{errors.address}</div>
          )}
        </div>
      </form>
      <div className="mt-5 flex justify-start px-6 text-textColor-gray underline hover:text-textColor-darkgray hover:underline">
        <Link to={"/account/delete"}>회원 탈퇴 하기</Link>
      </div>
    </>
  );
});

export default MyInfoSettingContent;