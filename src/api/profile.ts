import { API_BASE_URL } from "../config/api";

export interface ProfileResponse {
  id: number;
  username: string;
  profileImageUrl: string | null;
  bio: string | null;
  postCount: number;
  receivedLikeCount: number;
}

export interface UpdateProfileRequest {
  username: string;
  bio: string;
  profileImageUrl: string | null;
}

export async function getMyProfile(): Promise<ProfileResponse> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("프로필 정보를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function updateMyProfile(
  data: UpdateProfileRequest,
): Promise<void> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("프로필 수정에 실패했습니다.");
  }
}
