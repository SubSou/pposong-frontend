import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
  type CommentResponse,
} from "../../api/comment";

import { deletePost, getPost, type PostResponse } from "../../api/post";

import { toggleLike } from "../../api/like";

import { getMyInfo, type UserResponse } from "../../api/auth";

import PostMenu from "../../components/post/PostMenu";
import EditPostModal from "../../components/post/EditPostModal";
import ReportModal from "../../components/post/ReportModal";
import CommentMenu from "../../components/comment/CommentMenu";

import PostImageCarousel from "../../components/post/PostImageCarousel";

import { formatDateTime } from "../../utils/date";

function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [editingCommentContent, setEditingCommentContent] = useState("");

  const [editingPost, setEditingPost] = useState<PostResponse | null>(null);

  const [reportingPost, setReportingPost] = useState<PostResponse | null>(null);

  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const [likeLoading, setLikeLoading] = useState(false);

  // 어떤 원댓글에 답글을 작성 중인지
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // 누구에게 답글을 작성하는지
  const [replyingToUser, setReplyingToUser] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState("");

  const [post, setPost] = useState<PostResponse | null>(null);

  const [comments, setComments] = useState<CommentResponse[]>([]);

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * 게시글 + 댓글 조회
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const id = Number(postId);

        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const [postData, commentData, userData] = await Promise.all([
          getPost(id),
          getComments(id),
          getMyInfo(token),
        ]);

        setPost(postData);
        setComments(commentData);
        setCurrentUser(userData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("게시글을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  /*
   * 게시글 삭제
   */
  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePost(postId);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  /*
   * 좋아요
   */
  const handleLike = async () => {
    if (!post || likeLoading) {
      return;
    }

    const previousLiked = post.liked;
    const previousLikeCount = post.likeCount;

    const nextLiked = !post.liked;

    setPost((prev) =>
      prev
        ? {
            ...prev,
            liked: nextLiked,
            likeCount: nextLiked
              ? prev.likeCount + 1
              : Math.max(0, prev.likeCount - 1),
          }
        : prev,
    );

    try {
      setLikeLoading(true);

      const result = await toggleLike(post.id);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              liked: result.liked,
              likeCount: result.likeCount,
            }
          : prev,
      );
    } catch (error) {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              liked: previousLiked,
              likeCount: previousLikeCount,
            }
          : prev,
      );

      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  /*
   * 일반 댓글 작성
   */
  const handleSubmit = async () => {
    if (!postId) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const newComment = await createComment(Number(postId), {
        content: trimmedContent,
      });

      setComments((prev) => [...prev, newComment]);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              commentCount: prev.commentCount + 1,
            }
          : prev,
      );

      setContent("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("댓글 작성에 실패했습니다.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  /*
   * 답글 작성
   */
  const handleReplySubmit = async (parentCommentId: number) => {
    if (!postId) {
      return;
    }

    const trimmedContent = replyContent.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      /*
       * 현재 백엔드에서는
       * 대댓글도 원댓글의 ID를 parentId로 저장한다.
       *
       * 태그는 현재 화면 표현용으로
       * content 앞에 붙여서 저장한다.
       */
      const newReply = await createComment(Number(postId), {
        content: trimmedContent,
        parentId: parentCommentId,
        mentionUsername: replyingToUser,
      });

      setComments((prev) => [...prev, newReply]);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              commentCount: prev.commentCount + 1,
            }
          : prev,
      );

      setReplyingTo(null);
      setReplyingToUser(null);
      setReplyContent("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("답글 작성에 실패했습니다.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  /*
   * 댓글 삭제
   */
  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm("댓글을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment.id !== commentId && comment.parentId !== commentId,
        ),
      );

      setPost((prev) => {
        if (!prev) {
          return prev;
        }

        const deletedCount = comments.filter(
          (comment) =>
            comment.id === commentId || comment.parentId === commentId,
        ).length;

        return {
          ...prev,
          commentCount: Math.max(0, prev.commentCount - deletedCount),
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("댓글 삭제에 실패했습니다.");
      }
    }
  };

  /*
   * 댓글 수정 시작
   */
  const handleStartEditComment = (comment: CommentResponse) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);

    // 답글 입력창이 열려 있다면 닫기
    setReplyingTo(null);
    setReplyingToUser(null);
    setReplyContent("");
  };

  /*
   * 댓글 수정 취소
   */
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  /*
   * 댓글 수정 저장
   */
  const handleUpdateComment = async (commentId: number) => {
    const trimmedContent = editingCommentContent.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setError("");

      const updatedComment = await updateComment(commentId, {
        content: trimmedContent,
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      );

      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("댓글 수정에 실패했습니다.");
      }
    }
  };

  /*
   * 답글 입력 시작
   *
   * parentCommentId:
   * 실제 DB에 저장할 원댓글 ID
   *
   * username:
   * @태그로 표시할 사용자 이름
   */
  const handleStartReply = (parentCommentId: number, username: string) => {
    setReplyingTo(parentCommentId);
    setReplyingToUser(username);
    setReplyContent("");

    // 수정 중이었다면 수정 종료
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const isMyPost = post !== null && currentUser?.id === post.userId;

  /*
   * 로딩
   */
  if (loading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center justify-center
          bg-[#F5F4FF]
        "
      >
        <p className="text-sm text-gray-500">게시글을 불러오는 중...</p>
      </div>
    );
  }

  /*
   * 게시글 없음
   */
  if (!post) {
    return (
      <div
        className="
          flex min-h-screen flex-col
          items-center justify-center
          gap-4
          bg-[#F5F4FF]
        "
      >
        <p className="text-sm text-red-500">
          {error || "게시글을 찾을 수 없습니다."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            text-sm font-medium
            text-[#8B7CF6]
          "
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4FF]">
      <div
        className="
          relative mx-auto
          flex min-h-screen
          w-full max-w-[760px]
          flex-col
          bg-white
        "
      >
        {/* 상단 */}
        <header
          className="
            sticky top-0 z-20
            flex h-[60px]
            items-center
            border-b border-gray-200
            bg-white px-5
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mr-3 flex
              h-9 w-9
              items-center justify-center
              rounded-full
              transition
              hover:bg-gray-100
            "
          >
            <i className="bi bi-arrow-left text-lg" />
          </button>

          <h1 className="text-base font-semibold text-gray-900">게시글</h1>
        </header>

        <main
          className="
            flex-1
            px-6
            pb-[100px]
          "
        >
          {/* 게시글 */}
          <article className="py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {post.profileImageUrl ? (
                  <img
                    src={post.profileImageUrl}
                    alt={`${post.username} 프로필`}
                    className="
      h-11 w-11
      shrink-0
      rounded-full
      object-cover
    "
                  />
                ) : (
                  <div
                    className="
      flex
      h-11 w-11
      shrink-0
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
                  <p className="text-sm font-semibold text-gray-900">
                    {post.username}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatDateTime(post.createdAt)}
                  </p>
                </div>
              </div>

              <PostMenu
                post={post}
                isMyPost={isMyPost}
                onEdit={setEditingPost}
                onDelete={handleDeletePost}
                onReport={setReportingPost}
              />
            </div>

            <p
              className="
                mt-5
                whitespace-pre-wrap
                break-words
                text-[16px]
                leading-7
                text-gray-800
              "
            >
              {post.content}
            </p>

            {/* 게시글 이미지 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <PostImageCarousel imageUrls={post.imageUrls} />
            )}

            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className="
                mt-5
                flex items-center gap-2
                transition
                hover:text-red-500
                disabled:cursor-default
              "
            >
              <i
                className={
                  post.liked ? "bi bi-heart-fill text-red-500" : "bi bi-heart"
                }
              />

              <span>{post.likeCount}</span>
            </button>
          </article>

          <div className="border-t border-gray-200" />

          {/* 댓글 */}
          <section className="py-5">
            {comments.length === 0 ? (
              <div className="py-12 text-center">
                <i className="bi bi-chat text-2xl text-gray-300" />

                <p className="mt-2 text-sm text-gray-400">
                  아직 댓글이 없습니다.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  첫 댓글을 작성해보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments
                  .filter((comment) => comment.parentId == null)
                  .map((comment) => (
                    <div key={comment.id}>
                      {/* 원댓글 */}
                      <div className="flex gap-3">
                        {comment.profileImageUrl ? (
                          <img
                            src={comment.profileImageUrl}
                            alt={`${comment.username} 프로필`}
                            className="
      h-9 w-9
      shrink-0
      rounded-full
      object-cover
    "
                          />
                        ) : (
                          <div
                            className="
      flex
      h-9 w-9
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-gray-200
      text-gray-500
    "
                          >
                            <i className="bi bi-person-fill text-base" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          {/* 작성자 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {comment.username}
                              </span>

                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {currentUser?.id === comment.userId &&
                              editingCommentId !== comment.id && (
                                <CommentMenu
                                  onEdit={() => handleStartEditComment(comment)}
                                  onDelete={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                />
                              )}
                          </div>

                          {/* 원댓글 내용 */}
                          {editingCommentId === comment.id ? (
                            <div className="mt-3">
                              <textarea
                                value={editingCommentContent}
                                onChange={(e) =>
                                  setEditingCommentContent(e.target.value)
                                }
                                maxLength={500}
                                rows={3}
                                className="
                                  w-full
                                  resize-none
                                  rounded-xl
                                  border border-gray-200
                                  bg-white
                                  px-4 py-3
                                  text-sm
                                  text-gray-700
                                  outline-none
                                  transition
                                  focus:border-[#8B7CF6]
                                "
                              />

                              <div className="mt-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={handleCancelEditComment}
                                  className="
                                    rounded-lg
                                    px-3 py-2
                                    text-sm
                                    text-gray-500
                                    hover:bg-gray-100
                                  "
                                >
                                  취소
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateComment(comment.id)
                                  }
                                  disabled={!editingCommentContent.trim()}
                                  className="
                                    rounded-lg
                                    bg-[#8B7CF6]
                                    px-4 py-2
                                    text-sm
                                    font-medium
                                    text-white
                                    hover:opacity-90
                                    disabled:opacity-50
                                  "
                                >
                                  저장
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-700">
                              {comment.content}
                            </p>
                          )}

                          {/* 원댓글 답글 */}
                          <button
                            type="button"
                            onClick={() =>
                              handleStartReply(comment.id, comment.username)
                            }
                            className="
                              mt-2
                              text-xs font-medium
                              text-gray-500
                              transition
                              hover:text-[#8B7CF6]
                            "
                          >
                            답글
                          </button>

                          {/* 답글 입력 */}
                          {replyingTo === comment.id && (
                            <div className="mt-3">
                              {/* 누구에게 답하는지 */}
                              {replyingToUser && (
                                <p className="mb-2 text-xs font-medium text-[#8B7CF6]">
                                  @{replyingToUser}
                                  님에게 답글
                                </p>
                              )}

                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      !submitLoading &&
                                      replyContent.trim()
                                    ) {
                                      handleReplySubmit(comment.id);
                                    }
                                  }}
                                  maxLength={500}
                                  placeholder={
                                    replyingToUser
                                      ? `@${replyingToUser} 답글을 입력하세요...`
                                      : "답글을 입력하세요..."
                                  }
                                  className="
                                    h-10 flex-1
                                    rounded-lg
                                    border border-gray-200
                                    bg-[#F5F4FF]
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-[#8B7CF6]
                                  "
                                />

                                <button
                                  type="button"
                                  onClick={() => handleReplySubmit(comment.id)}
                                  disabled={
                                    submitLoading || !replyContent.trim()
                                  }
                                  className="
                                    rounded-lg
                                    bg-[#8B7CF6]
                                    px-4
                                    text-sm font-medium
                                    text-white
                                    disabled:opacity-50
                                  "
                                >
                                  등록
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyingToUser(null);
                                    setReplyContent("");
                                  }}
                                  className="
                                    px-2
                                    text-sm
                                    text-gray-400
                                  "
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 대댓글 목록 */}
                      <div className="ml-12 mt-4 space-y-4">
                        {comments
                          .filter((reply) => reply.parentId === comment.id)
                          .map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              {/* 대댓글 표시 */}
                              <div className="pt-2 text-gray-300">
                                <i className="bi bi-arrow-return-right" />
                              </div>

                              {/* 프로필 */}
                              {reply.profileImageUrl ? (
                                <img
                                  src={reply.profileImageUrl}
                                  alt={`${reply.username} 프로필`}
                                  className="
      h-8 w-8
      shrink-0
      rounded-full
      object-cover
    "
                                />
                              ) : (
                                <div
                                  className="
      flex
      h-8 w-8
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-gray-200
      text-gray-500
    "
                                >
                                  <i className="bi bi-person-fill text-sm" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                {/* 작성자 */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {reply.username}
                                    </span>

                                    <span className="text-xs text-gray-400">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleString()}
                                    </span>
                                  </div>

                                  {currentUser?.id === reply.userId &&
                                    editingCommentId !== reply.id && (
                                      <CommentMenu
                                        onEdit={() =>
                                          handleStartEditComment(reply)
                                        }
                                        onDelete={() =>
                                          handleDeleteComment(reply.id)
                                        }
                                      />
                                    )}
                                </div>

                                {/* 대댓글 내용 */}
                                {editingCommentId === reply.id ? (
                                  <div className="mt-3">
                                    <textarea
                                      value={editingCommentContent}
                                      onChange={(e) =>
                                        setEditingCommentContent(e.target.value)
                                      }
                                      maxLength={500}
                                      rows={3}
                                      className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border border-gray-200
                                        bg-white
                                        px-4 py-3
                                        text-sm
                                        text-gray-700
                                        outline-none
                                        focus:border-[#8B7CF6]
                                      "
                                    />

                                    <div className="mt-2 flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelEditComment}
                                        className="
                                          rounded-lg
                                          px-3 py-2
                                          text-sm
                                          text-gray-500
                                          hover:bg-gray-100
                                        "
                                      >
                                        취소
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateComment(reply.id)
                                        }
                                        disabled={!editingCommentContent.trim()}
                                        className="
                                          rounded-lg
                                          bg-[#8B7CF6]
                                          px-4 py-2
                                          text-sm
                                          font-medium
                                          text-white
                                          hover:opacity-90
                                          disabled:opacity-50
                                        "
                                      >
                                        저장
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-700">
                                    {reply.mentionUsername && (
                                      <span className="mr-1 font-medium text-[#8B7CF6]">
                                        @{reply.mentionUsername}
                                      </span>
                                    )}

                                    {reply.content}
                                  </p>
                                )}

                                {/* 대댓글에도 답글 표시 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartReply(comment.id, reply.username)
                                  }
                                  className="
                                    mt-2
                                    text-xs font-medium
                                    text-gray-500
                                    transition
                                    hover:text-[#8B7CF6]
                                  "
                                >
                                  답글
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {error && <p className="mt-5 text-sm text-red-500">{error}</p>}
          </section>
        </main>

        {/* 하단 일반 댓글 입력 */}
        <div
          className="
            fixed bottom-0
            left-1/2 z-20
            w-full
            max-w-[760px]
            -translate-x-1/2
            border-t
            border-gray-200
            bg-white
            px-5 py-3
          "
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !submitLoading && content.trim()) {
                  handleSubmit();
                }
              }}
              maxLength={500}
              placeholder="댓글을 입력하세요..."
              className="
                h-11
                flex-1
                rounded-lg
                border border-gray-200
                bg-[#F5F4FF]
                px-4
                text-sm
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-[#8B7CF6]
              "
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading || !content.trim()}
              className="
                flex
                h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[#8B7CF6]
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitLoading ? (
                <i className="bi bi-hourglass-split" />
              ) : (
                <i className="bi bi-send-fill" />
              )}
            </button>
          </div>

          <div className="mt-1 text-right text-xs text-gray-400">
            {content.length}/500
          </div>
        </div>
      </div>

      {/* 게시글 수정 */}
      {editingPost && (
        <EditPostModal
          postId={editingPost.id}
          initialContent={editingPost.content}
          initialImageUrls={post.imageUrls}
          onClose={() => setEditingPost(null)}
          onUpdated={async () => {
            const updatedPost = await getPost(editingPost.id);

            setPost(updatedPost);
          }}
        />
      )}

      {/* 게시글 신고 */}
      {reportingPost && (
        <ReportModal
          postId={reportingPost.id}
          onClose={() => setReportingPost(null)}
        />
      )}
    </div>
  );
}

export default PostDetailPage;
