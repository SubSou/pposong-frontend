import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, getMyInfo } from "../../api/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // 1. 로그인
      const result = await login({
        email: email.trim(),
        password,
      });

      // 2. JWT 저장
      sessionStorage.setItem("accessToken", result.token);

      // 3. JWT를 사용해서 내 정보 요청
      const user = await getMyInfo(result.token);

      // 테스트용
      console.log("로그인 사용자 정보:", user);

      // 4. 홈으로 이동
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-xl font-bold">로그인</h1>

      <form onSubmit={handleLogin} noValidate>
        <AuthInput
          label="이메일"
          type="email"
          icon="envelope"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={setEmail}
        />

        <AuthInput
          label="비밀번호"
          type="password"
          icon="lock"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={setPassword}
        />

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <AuthButton type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 계정이 없으신가요?{" "}
        <Link to="/signup" className="font-semibold text-[#8B7CF6]">
          회원가입
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
