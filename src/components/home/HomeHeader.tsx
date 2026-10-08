interface HomeHeaderProps {
  onMenuClick: () => void;
}

function HomeHeader({ onMenuClick }: HomeHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div
        className="
          mx-auto flex h-full max-w-[1200px]
          items-center px-4
          lg:px-6
        "
      >
        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={onMenuClick}
          className="
            mr-3 flex h-10 w-10
            items-center justify-center
            rounded-lg text-gray-700
            transition hover:bg-gray-100
            lg:hidden
          "
          aria-label="메뉴 열기"
        >
          <i className="bi bi-list text-2xl" />
        </button>

        {/* 로고 */}
        <h1 className="text-xl font-bold text-[#8B7CF6]">뽀송</h1>
      </div>
    </header>
  );
}

export default HomeHeader;
