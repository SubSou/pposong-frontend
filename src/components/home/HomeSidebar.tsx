import { useLocation, useNavigate } from "react-router-dom";

function HomeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 페이지 확인
  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (!confirmed) {
      return;
    }

    sessionStorage.removeItem("accessToken");

    navigate("/login");
  };

  return (
    <aside className="hidden lg:block">
      <nav className="flex h-full flex-col">
        {/* 위쪽 메뉴 */}
        <div className="space-y-2">
          {/* 홈 */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`
              flex w-full cursor-pointer items-center gap-3
              rounded-lg
              px-4 py-3
              text-left
              transition
              ${
                isHome
                  ? "bg-white font-semibold text-gray-900"
                  : "text-gray-700 hover:bg-white"
              }
            `}
          >
            <i className="bi bi-house-door text-lg" />
            <span>홈</span>
          </button>

          {/* 프로필 */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`
              flex w-full cursor-pointer items-center gap-3
              rounded-lg
              px-4 py-3
              text-left
              transition
              ${
                isProfile
                  ? "bg-white font-semibold text-gray-900"
                  : "text-gray-700 hover:bg-white"
              }
            `}
          >
            <i className="bi bi-person text-lg" />
            <span>프로필</span>
          </button>
        </div>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-4 flex cursor-pointer w-full items-center gap-3
            rounded-lg
            px-4 py-3
            text-left text-gray-500
            transition
            hover:bg-white
            hover:text-red-500
          "
        >
          <i className="bi bi-box-arrow-right text-lg" />
          <span>로그아웃</span>
        </button>
      </nav>
    </aside>
  );
}

export default HomeSidebar;
