import { useEffect, useRef, useState } from "react";

interface CommentMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

function CommentMenu({ onEdit, onDelete }: CommentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* ⋯ 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex h-8 w-8
          items-center justify-center
          rounded-full
          text-gray-400
          transition
          hover:bg-gray-100
          hover:text-gray-600
        "
      >
        <i className="bi bi-three-dots" />
      </button>

      {/* 메뉴 */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-8
            z-30
            w-24
            overflow-hidden
            rounded-lg
            border border-gray-200
            bg-white
            py-1
            shadow-lg
          "
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="
              w-full
              px-4 py-2
              text-left
              text-sm
              text-gray-700
              hover:bg-gray-50
            "
          >
            수정
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="
              w-full
              px-4 py-2
              text-left
              text-sm
              text-red-500
              hover:bg-gray-50
            "
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentMenu;
