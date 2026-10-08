import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { signup } from "../../api/auth";

function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 입력값 검증
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const passwordMatch = password === passwordConfirm;

  // 회원가입
  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
    setError("");

    // 이름 검사
    if (!username.trim()) {
      return;
    }

    // 이메일 검사
    if (!emailValid) {
      return;
    }

    // 비밀번호 검사
    if (!passwordValid) {
      return;
    }

    // 비밀번호 확인
    if (!passwordConfirm || !passwordMatch) {
      return;
    }

    // 중복 요청 방지
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // Spring Boot 회원가입 API 호출
      await signup({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      // 회원가입 성공 페이지 이동
      navigate("/signup/complete");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-xl font-bold">회원가입</h1>

      <form onSubmit={handleSignup} noValidate>
        <AuthInput
          label="이름"
          icon="person"
          placeholder="이름을 입력하세요"
          value={username}
          onChange={setUsername}
          error={
            submitted && !username.trim() ? "이름을 입력해 주세요." : undefined
          }
        />

        <AuthInput
          label="이메일"
          icon="envelope"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={setEmail}
          error={
            submitted && !emailValid
              ? "올바른 이메일을 입력해 주세요."
              : undefined
          }
        />

        <AuthInput
          label="비밀번호"
          icon="lock"
          type="password"
          placeholder="8자 이상 입력하세요"
          value={password}
          onChange={setPassword}
          error={
            submitted && !passwordValid
              ? "비밀번호는 8자 이상이어야 합니다."
              : undefined
          }
        />

        <AuthInput
          label="비밀번호 확인"
          icon="shield-lock"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          error={
            submitted && (!passwordConfirm || !passwordMatch)
              ? "비밀번호가 일치하지 않습니다."
              : undefined
          }
        />

        {/* 서버 오류 메시지 */}
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* 기존 공통 버튼 사용 */}
        <AuthButton type="submit" disabled={loading}>
          {loading ? "가입 처리 중..." : "회원가입"}
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-semibold text-[#8B7CF6]">
          로그인
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
