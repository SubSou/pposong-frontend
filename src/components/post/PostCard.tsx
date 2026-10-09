import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { toggleLike } from "../../api/like";

import type { PostResponse } from "../../api/post";

import PostMenu from "./PostMenu";

import PostImageCarousel from "./PostImageCarousel";

interface PostCardProps {
  post: PostResponse;
  currentUserId?: number;
  onEdit: (post: PostResponse) => void;
  onDelete: (postId: number) => void;
  onReport: (post: PostResponse) => void;
  onLikeChanged?: () => void;
}

function PostCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onReport,
  onLikeChanged,
}: PostCardProps) {
  console.log("post");

  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeLoading, setLikeLoading] = useState(false);

  const isMyPost = currentUserId === post.userId;

  const handlePostClick = () => {
    // 홈에서 현재 보고 있던 스크롤 위치 저장
    sessionStorage.setItem("homeScrollY", window.scrollY.toString());

    navigate(`/posts/${post.id}`);
  };

  const handleLike = async () => {
    if (likeLoading) {
      return;
    }

    const previousLiked = liked;
    const previousLikeCount = likeCount;

    // 낙관적 업데이트
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      setLikeLoading(true);

      const result = await toggleLike(post.id);

      // 서버의 최종 상태로 맞춤
      setLiked(result.liked);
      setLikeCount(result.likeCount);

      // 부모 컴포넌트에 좋아요 상태 변경 알림
      onLikeChanged?.();
    } catch (error) {
      // 실패하면 원래 상태로 롤백
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);

      console.error(error);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <article
      onClick={handlePostClick}
      className="
    relative
    cursor-pointer
    rounded-xl
    bg-white
    p-5
  "
    >
      {/* 게시글 상단 */}
      <div className="mb-3 flex items-start justify-between">
        {/* 작성자 */}
        <div className="flex items-center gap-3">
          {post.profileImageUrl ? (
            <img
              src={post.profileImageUrl}
              alt={`${post.username} 프로필`}
              className="
        h-10
        w-10
        rounded-full
        object-cover
      "
            />
          ) : (
            <div
              className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-gray-200
        text-gray-500
      "
            >
              <i className="bi bi-person-fill text-lg" />
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900">{post.username}</p>

            <p className="text-xs text-gray-400">{post.createdAt}</p>
          </div>
        </div>

        {/* 게시글 메뉴 */}
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PostMenu
            post={post}
            isMyPost={isMyPost}
            onEdit={onEdit}
            onDelete={onDelete}
            onReport={onReport}
          />
        </div>
      </div>

      {/* 게시글 내용 */}
      <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>

      {/* 게시글 이미지 */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <PostImageCarousel imageUrls={post.imageUrls} />
      )}

      <div className="mt-4 flex items-center gap-5">
        {/* 좋아요 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          disabled={likeLoading}
          className="
      flex items-center gap-2
      text-sm text-gray-500
      transition
      hover:text-red-500
      disabled:cursor-default
    "
        >
          <i
            className={liked ? "bi bi-heart-fill text-red-500" : "bi bi-heart"}
          />

          <span>{likeCount}</span>
        </button>

        {/* 댓글 */}
        <button
          type="button"
          className="
    flex items-center gap-2
    text-sm text-gray-500
    transition
    hover:text-[#8B7CF6]
  "
        >
          <i className="cursor-pointer bi bi-chat" />
          <span className="cursor-pointer">{post.commentCount}</span>
        </button>
      </div>
    </article>
  );
}

export default PostCard;
