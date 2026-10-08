import { API_BASE_URL } from "../config/api";

export type ReportReason = "SPAM" | "ABUSE" | "INAPPROPRIATE" | "OTHER";

export interface CreateReportRequest {
  postId: number;
  reason: ReportReason;
}

export async function createReport(data: CreateReportRequest): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "게시글 신고에 실패했습니다.");
  }
}
