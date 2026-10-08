import { useState } from "react";

import { createReport, type ReportReason } from "../../api/report";

interface ReportModalProps {
  postId: number;
  onClose: () => void;
}

const reportReasons: {
  value: ReportReason;
  label: string;
}[] = [
  {
    value: "SPAM",
    label: "스팸 / 홍보",
  },
  {
    value: "ABUSE",
    label: "욕설 / 비방",
  },
  {
    value: "INAPPROPRIATE",
    label: "부적절한 콘텐츠",
  },
  {
    value: "OTHER",
    label: "기타",
  },
];

function ReportModal({ postId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReport = async () => {
    if (!reason) {
      setError("신고 사유를 선택해주세요.");
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createReport({
        postId,
        reason,
      });

      alert("게시글 신고가 접수되었습니다.");

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "게시글 신고 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 px-4
      "
    >
      <div
        className="
          w-full max-w-[420px]
          rounded-2xl bg-white p-6
        "
      >
        {/* 제목 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">게시글 신고</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex h-8 w-8
              items-center justify-center
              text-gray-400
              hover:text-gray-600
            "
            aria-label="신고 창 닫기"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">신고 사유를 선택해주세요.</p>

        {/* 신고 사유 */}
        <div className="mt-5 space-y-2">
          {reportReasons.map((item) => (
            <label
              key={item.value}
              className="
                flex cursor-pointer
                items-center gap-3
                rounded-xl border
                border-gray-200
                px-4 py-3
                transition
                hover:bg-gray-50
              "
            >
              <input
                type="radio"
                name="reportReason"
                value={item.value}
                checked={reason === item.value}
                onChange={() => {
                  setReason(item.value);
                  setError("");
                }}
                className="accent-[#8B7CF6]"
              />

              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        {/* 에러 */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* 버튼 */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex-1 rounded-lg
              border border-gray-200
              py-3 font-semibold
              text-gray-600
            "
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleReport}
            disabled={!reason || loading}
            className="
              flex-1 rounded-lg
              bg-[#8B7CF6]
              py-3 font-semibold
              text-white
              transition
              hover:bg-[#7868E6]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "신고 중..." : "신고하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
