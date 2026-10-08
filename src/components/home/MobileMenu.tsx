import { useLocation, useNavigate } from "react-router-dom";
import { useOnlineUserStore } from "../../stores/onlineUserStore";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const onlineUsers = useOnlineUserStore((state) => state.users);

  // 현재 페이지 확인
  const isHome = location.pathname === "/";

  const isProfile =
    location.pathname === "/profile" ||
    location.pathname.startsWith("/profile/");

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (!confirmed) {
      return;
    }

    sessionStorage.removeItem("accessToken");

    onClose();
    navigate("/login");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 뒤쪽 어두운 배경 */}
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* 메뉴 */}
      <aside
        className="
          relative z-10
          flex h-full w-[280px]
          flex-col
          bg-[#F5F4FF]
          p-5
          shadow-xl
        "
      >
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#8B7CF6]">뽀송</h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-white
            "
            aria-label="메뉴 닫기"
          >
            <i className="bi bi-x-lg text-xl" />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="mt-8 space-y-2">
          {/* 홈 */}
          <button
            type="button"
            onClick={() => handleNavigate("/")}
            aria-current={isHome ? "page" : undefined}
            className={`
              flex w-full items-center gap-3
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
            onClick={() => handleNavigate("/profile")}
            aria-current={isProfile ? "page" : undefined}
            className={`
              flex w-full items-center gap-3
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

          {/* 로그아웃 */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3
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

        {/* 구분선 */}
        <div className="my-6 border-t border-gray-200" />

        {/* 실시간 접속자 */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">실시간 접속자</h3>

            <span
              className="
                flex h-5 min-w-5
                items-center justify-center
                rounded-full
                bg-[#8B7CF6]
                px-1.5
                text-xs font-semibold text-white
              "
            >
              {onlineUsers.length}
            </span>
          </div>

          {onlineUsers.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">
              접속 중인 사용자가 없습니다.
            </p>
          ) : (
            <div className="mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
              {onlineUsers.map((user) => (
                <div key={user.userId} className="flex items-center gap-3">
                  {/* 프로필 사진 */}
                  <div className="relative shrink-0">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.username}
                        className="
                          h-9 w-9
                          rounded-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-full
                          bg-white
                        "
                      >
                        <i className="bi bi-person-fill text-gray-400" />
                      </div>
                    )}

                    {/* 접속 중 표시 */}
                    <span
                      className="
                        absolute bottom-0 right-0
                        h-3 w-3
                        rounded-full
                        border-2 border-[#F5F4FF]
                        bg-green-500
                      "
                    />
                  </div>

                  {/* 사용자 이름 */}
                  <span
                    className="
                      min-w-0 truncate
                      text-sm font-medium
                      text-gray-700
                    "
                  >
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
