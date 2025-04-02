import { useState, useEffect } from "react";

const MyPasswordContent = ({ onChange }) => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});

  // 폼 데이터 변경 핸들러 - 상태만 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 모든 유효성 검사를 useEffect로 처리
  useEffect(() => {
    const newErrors = {};

    // 현재 비밀번호 검증
    newErrors.password = !formData.password ? "비밀번호는 필수값입니다." : "";

    // 새 비밀번호 검증
    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호는 필수값입니다.";
    } else if (
      formData.newPassword.length < 8 ||
      !/[A-Za-z]/.test(formData.newPassword) ||
      !/\d/.test(formData.newPassword)
    ) {
      newErrors.newPassword =
        "비밀번호는 최소 8자 이상이며, 문자와 숫자를 포함해야 합니다.";
    } else if (formData.newPassword === formData.password) {
      newErrors.newPassword = "현재 비밀번호와 다르게 입력해주세요.";
    } else {
      newErrors.newPassword = "";
    }

    // 새 비밀번호 확인 검증
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "새 비밀번호 확인은 필수값입니다.";
    } else if (formData.confirmNewPassword !== formData.newPassword) {
      newErrors.confirmNewPassword = "비밀번호가 일치하지 않습니다.";
    } else {
      newErrors.confirmNewPassword = "";
    }

    setErrors(newErrors);
  }, [formData]); // formData가 변경될 때마다 모든 유효성 검사 실행

  // formData나 errors가 변경될 때마다 부모에게 알림
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
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-xl mx-auto">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          현재 비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="비밀번호를 입력해주세요"
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          새 비밀번호
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          placeholder="새 비밀번호를 입력해주세요"
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          새 비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
          placeholder="새 비밀번호를 다시 입력해주세요"
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {errors.confirmNewPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmNewPassword}
          </p>
        )}
      </div>
    </form>
  );
};

export default MyPasswordContent;
