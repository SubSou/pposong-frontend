import { useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthButton from "../../components/auth/AuthButton";

function SignupCompletePage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0EDFF]">
          <i className="bi bi-check-circle-fill text-3xl text-[#8B7CF6]" />
        </div>

        <h1 className="mb-3 text-xl font-bold text-gray-900">회원가입 완료!</h1>

        <p className="mb-8 text-sm leading-7 text-gray-500">
          뽀송에 가입해 주셔서 감사합니다.
          <br />
          관리자 승인 후 서비스를 이용할 수 있습니다.
        </p>

        <AuthButton onClick={() => navigate("/login")}>
          로그인으로 돌아가기
        </AuthButton>
      </div>
    </AuthLayout>
  );
}

export default SignupCompletePage;
