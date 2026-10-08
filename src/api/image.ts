import { API_BASE_URL } from "../config/api";

interface UploadImageResponse {
  imageUrl: string;
}

export async function uploadImage(file: File): Promise<string> {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data: UploadImageResponse = await response.json();

  return data.imageUrl;
}
