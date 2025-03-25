import authImage from "../../asset/auth/login.svg";
import { useState } from "react";

const UserDeletePage = () => {
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    checkbox: "",
    server: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      password: "",
      checkbox: "",
      server: "",
    };

    // 비밀번호 검증
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    }

    // 체크박스 검증
    if (!agreeToTerms) {
      newErrors.checkbox = "탈퇴 동의 사항에 체크해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAccountDelete = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // API 호출 예시
      // const response = await deleteUserAccount(password);

      // 성공 처리
      console.log("회원 탈퇴 진행 성공");
      // 탈퇴 성공 후 리디렉션
      // window.location.href = "/goodbye";
    } catch (error) {
      // 서버 오류 처리
      setErrors({
        ...errors,
        server:
          error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* 좌측 이미지 섹션 */}
      <div
        className="w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-2xl rounded-br-2xl"
        style={{
          backgroundImage: `url(${authImage})`,
          backgroundSize: "cover",
        }}
      ></div>

      {/* 우측 섹션 */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">회원 탈퇴</h2>
          <p className="text-gray-500">정말 탈퇴하시겠습니까?</p>
          <p className="text-red-500 mb-8">
            탈퇴 시 모든 개인정보 및 서비스 이용 기록이 삭제되며, 탈퇴 이후에는
            복구가 불가능합니다.
          </p>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleAccountDelete} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호를 입력해주세요"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  모든 데이터가 삭제되며 복구가 불가능함을 이해했습니다
                </label>
              </div>
            </div>
            {errors.checkbox && (
              <p className="mt-1 text-sm text-red-600">{errors.checkbox}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {isLoading ? "처리 중..." : "회원 탈퇴"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDeletePage;
