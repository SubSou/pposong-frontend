import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getMyInfo } from "../../api/auth";

import OnlineUserSocket from "../websocket/OnlineUserSocket";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = sessionStorage.getItem("accessToken");

      // 토큰 자체가 없는 경우
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        // 실제 백엔드에 JWT가 유효한지 확인
        await getMyInfo(token);

        setIsAuthenticated(true);
      } catch {
        // 만료되었거나 잘못된 JWT라면 삭제
        sessionStorage.removeItem("accessToken");

        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  // 인증 확인 중
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F4FF]">
        <p className="text-gray-500">로그인 정보를 확인하고 있습니다...</p>
      </div>
    );
  }

  // 인증 실패
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 인증 성공
  return (
    <>
      <OnlineUserSocket />
      {children}
    </>
  );
}

export default ProtectedRoute;
