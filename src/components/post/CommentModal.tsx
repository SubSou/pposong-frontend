import { useEffect, useState } from "react";
import {
  createComment,
  getComments,
  type CommentResponse,
} from "../../api/comment";

interface CommentModalProps {
  postId: number;
  onClose: () => void;
}

function CommentModal({ postId, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");

  // 댓글 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getComments(postId);

        setComments(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // 댓글 작성
  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const newComment = await createComment(postId, {
        content: trimmedContent,
      });

      // 새 댓글을 기존 댓글 목록 마지막에 추가
      setComments((prev) => [...prev, newComment]);

      // 입력창 초기화
      setContent("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4
      "
      onClick={onClose}
    >
      <div
        className="
          flex max-h-[80vh] w-full max-w-[560px]
          flex-col
          rounded-2xl bg-white
          shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className="
            flex items-center justify-between
            border-b border-gray-200
            px-5 py-4
          "
        >
          <h2 className="text-lg font-semibold">댓글</h2>

          <button
            type="button"
            onClick={onClose}
            className="
              text-xl text-gray-400
              transition hover:text-gray-700
            "
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-400">
              댓글을 불러오는 중...
            </p>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              아직 작성된 댓글이 없습니다.
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {comment.username}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p
                    className="
                      mt-1 whitespace-pre-wrap
                      break-words
                      text-sm text-gray-700
                    "
                  >
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>

        {/* 댓글 입력 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="댓글을 입력하세요..."
              className="
                min-h-[44px] flex-1 resize-none
                rounded-xl border border-gray-200
                bg-[#F5F4FF]
                px-4 py-3
                text-sm
                outline-none
                transition
                focus:border-[#8B7CF6]
              "
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading || !content.trim()}
              className="
                h-[44px] rounded-xl
                bg-[#8B7CF6]
                px-4
                text-sm font-medium text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitLoading ? "등록 중..." : "등록"}
            </button>
          </div>

          <div className="mt-1 text-right text-xs text-gray-400">
            {content.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
