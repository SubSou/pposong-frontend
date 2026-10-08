import { API_BASE_URL } from "../config/api";

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export async function toggleLike(postId: number): Promise<LikeResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "좋아요 처리에 실패했습니다.");
  }

  return response.json();
}
