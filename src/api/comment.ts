import { API_BASE_URL } from "../config/api";

export interface CommentResponse {
  id: number;
  content: string;
  userId: number;
  username: string;
  createdAt: string;
  parentId: number | null;
  mentionUsername: string | null;

  profileImageUrl: string | null;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number | null;
  mentionUsername?: string | null;
}

export interface UpdateCommentRequest {
  content: string;
}

// 댓글 목록 조회
export async function getComments(postId: number): Promise<CommentResponse[]> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "댓글을 불러오지 못했습니다.");
  }

  return response.json();
}

// 댓글 작성
export async function createComment(
  postId: number,
  data: CreateCommentRequest,
): Promise<CommentResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
  }

  return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message ?? "댓글 삭제에 실패했습니다.");
  }
}

export async function updateComment(
  commentId: number,
  data: UpdateCommentRequest,
): Promise<CommentResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "댓글 수정에 실패했습니다.");
  }

  return response.json();
}
