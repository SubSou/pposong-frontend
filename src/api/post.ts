import { API_BASE_URL } from "../config/api";

export interface PostResponse {
  id: number;
  content: string;
  userId: number;
  username: string;
  createdAt: string;

  likeCount: number;
  liked: boolean;

  commentCount: number;

  imageUrls: string[];

  profileImageUrl: string | null;
}

export interface CreatePostRequest {
  content: string;
  imageUrls?: string[];
}

export interface UpdatePostRequest {
  content: string;
  imageUrls?: string[];
}

export async function getPosts(): Promise<PostResponse[]> {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("게시글을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function createPost(data: CreatePostRequest): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("게시글 작성에 실패했습니다.");
  }
}

export async function deletePost(postId: number): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("게시글 삭제에 실패했습니다.");
  }
}

export async function updatePost(
  postId: number,
  request: UpdatePostRequest,
): Promise<PostResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }

  return response.json();
}

export async function getPost(postId: number): Promise<PostResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || "게시글을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getMyPosts(): Promise<PostResponse[]> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("내 게시글을 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getLikedPosts(): Promise<PostResponse[]> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/posts/liked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("좋아요한 게시글을 불러오지 못했습니다.");
  }

  return response.json();
}
