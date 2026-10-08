import { useState } from "react";

import type { PostResponse } from "../../api/post";

interface PostMenuProps {
  post: PostResponse;
  isMyPost: boolean;
  onEdit: (post: PostResponse) => void;
  onDelete: (postId: number) => void;
  onReport: (post: PostResponse) => void;
}

function PostMenu({
  post,
  isMyPost,
  onEdit,
  onDelete,
  onReport,
}: PostMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* ... 버튼 */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="
          flex h-8 w-8 items-center justify-center
          rounded-full text-gray-500
          transition hover:bg-gray-100
        "
        aria-label="게시글 메뉴"
      >
        <i className="bi bi-three-dots text-xl" />
      </button>

      {/* 드롭다운 */}
      {isMenuOpen && (
        <div
          className="
            absolute right-0 top-10 z-20
            w-[160px]
            rounded-xl border border-gray-200
            bg-white p-2
            shadow-lg
          "
        >
          {/* 위쪽 삼각형 */}
          <div
            className="
              absolute -top-[7px] right-[10px]
              h-3 w-3 rotate-45
              border-l border-t border-gray-200
              bg-white
            "
          />

          {isMyPost ? (
            <>
              {/* 수정 */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(post);
                }}
                className="
                  relative z-10
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-left text-sm text-gray-700
                  transition hover:bg-gray-50
                "
              >
                <i className="bi bi-pencil" />
                <span>수정하기</span>
              </button>

              {/* 삭제 */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(post.id);
                }}
                className="
                  relative z-10
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-left text-sm text-red-500
                  transition hover:bg-red-50
                "
              >
                <i className="bi bi-trash3" />
                <span>삭제하기</span>
              </button>
            </>
          ) : (
            /* 다른 사람 게시글 */
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onReport(post);
              }}
              type="button"
              className="
                relative z-10
                flex w-full items-center gap-3
                rounded-lg px-3 py-2.5
                text-left text-sm text-gray-700
                transition hover:bg-gray-50
              "
            >
              <i className="bi bi-exclamation-octagon" />
              <span>신고하기</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PostMenu;
