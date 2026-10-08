import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProfileStore } from "../../stores/profileStore";
import { updateMyProfile } from "../../api/profile";

import { uploadImage } from "../../api/image";

function ProfileEditPage() {
  const profile = useProfileStore((state) => state.profile);

  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  // 프로필이 없을 때만 서버에서 조회
  useEffect(() => {
    if (!profile) {
      void fetchProfile();
    }
  }, [profile, fetchProfile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F5F4FF]">
        <p className="py-10 text-center text-sm text-gray-500">
          프로필을 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <ProfileEditForm
      initialUsername={profile.username}
      initialBio={profile.bio ?? ""}
      initialProfileImageUrl={profile.profileImageUrl}
      fetchProfile={fetchProfile}
    />
  );
}

interface ProfileEditFormProps {
  initialUsername: string;
  initialBio: string;
  initialProfileImageUrl: string | null;
  fetchProfile: () => Promise<void>;
}

function ProfileEditForm({
  initialUsername,
  initialBio,
  initialProfileImageUrl,
  fetchProfile,
}: ProfileEditFormProps) {
  const navigate = useNavigate();

  // 여기서 처음부터 profile 값을 사용
  const [username, setUsername] = useState(initialUsername);

  const [bio, setBio] = useState(initialBio);

  const [saving, setSaving] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );

  // 이미지 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    setProfileImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setProfileImagePreview(previewUrl);
  };

  const handleSave = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (bio.length > 100) {
      alert("소개는 100자 이하로 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      let profileImageUrl = initialProfileImageUrl;

      // 새로운 프로필 사진을 선택했다면
      if (profileImageFile) {
        profileImageUrl = await uploadImage(profileImageFile);
      }

      // 이름 + 소개 + S3 사진 URL 저장
      await updateMyProfile({
        username: trimmedUsername,
        bio: bio.trim(),
        profileImageUrl,
      });

      // Zustand 프로필 최신화
      await fetchProfile();

      navigate("/profile");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "프로필 수정 중 오류가 발생했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4FF]">
      <main className="mx-auto min-h-screen max-w-[850px] bg-white">
        {/* 상단 */}
        <header className="flex h-16 items-center gap-4 px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            <i className="bi bi-arrow-left text-xl" />
          </button>

          <h1 className="font-bold text-gray-900">프로필 수정</h1>
        </header>

        {/* 프로필 이미지 */}
        <div className="mt-6 flex justify-center">
          <div className="relative">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="프로필 미리보기"
                className="
                  h-[120px]
                  w-[120px]
                  rounded-full
                  object-cover
                "
              />
            ) : initialProfileImageUrl ? (
              <img
                src={initialProfileImageUrl}
                alt="프로필"
                className="
                  h-[120px]
                  w-[120px]
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  h-[120px]
                  w-[120px]
                  rounded-full
                  bg-black
                "
              />
            )}

            {/* 실제 파일 선택 */}
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />

            {/* 사진 변경 버튼 */}
            <label
              htmlFor="profileImage"
              className="
                absolute
                bottom-0
                right-0
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-full
                border-4
                border-white
                bg-white
                text-gray-700
                shadow-sm
                transition
                hover:bg-gray-50
              "
            >
              <i className="bi bi-camera text-xl" />
            </label>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="mx-auto mt-24 max-w-[600px] px-6">
          {/* 이름 */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-gray-600"
            >
              이름
            </label>

            <input
              id="username"
              type="text"
              value={username}
              maxLength={50}
              onChange={(e) => setUsername(e.target.value)}
              className="
                w-full
                rounded-md
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#8B7CF6]
              "
            />
          </div>

          {/* 소개 */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="bio"
                className="text-sm font-semibold text-gray-600"
              >
                소개
              </label>

              <span className="text-xs text-gray-400">{bio.length}/100</span>
            </div>

            <textarea
              id="bio"
              value={bio}
              maxLength={100}
              onChange={(e) => setBio(e.target.value)}
              className="
                h-[100px]
                w-full
                resize-none
                rounded-md
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#8B7CF6]
              "
            />
          </div>

          {/* 하단 버튼 */}
          <div className="mt-40 flex justify-center gap-20">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="
                w-[120px]
                rounded-md
                border
                border-gray-200
                py-3
                text-sm
                text-gray-500
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                w-[120px]
                rounded-md
                bg-[#8B7CF6]
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileEditPage;
