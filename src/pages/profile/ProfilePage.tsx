import { useEffect, useState } from "react";

import { useProfileStore } from "../../stores/profileStore";

import {
  deletePost,
  getMyPosts,
  getLikedPosts,
  type PostResponse,
} from "../../api/post";

import pposongLogo from "../../assets/pposong_logo.png";

import PostCard from "../../components/post/PostCard";
import EditPostModal from "../../components/post/EditPostModal";

import HomeSidebar from "../../components/home/HomeSidebar";
import HomeHeader from "../../components/home/HomeHeader";
import MobileMenu from "../../components/home/MobileMenu";

import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const [likedPosts, setLikedPosts] = useState<PostResponse[]>([]);
  const [likedPostsLoading, setLikedPostsLoading] = useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [editingPost, setEditingPost] = useState<PostResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  const [myPosts, setMyPosts] = useState<PostResponse[]>([]);

  const [postsLoading, setPostsLoading] = useState(true);

  const profile = useProfileStore((state) => state.profile);

  const loading = useProfileStore((state) => state.loading);

  const error = useProfileStore((state) => state.error);

  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  // 좋아요한 게시글 처음 조회
  useEffect(() => {
    let cancelled = false;

    const fetchLikedPosts = async () => {
      try {
        const posts = await getLikedPosts();

        if (!cancelled) {
          setLikedPosts(posts);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLikedPostsLoading(false);
        }
      }
    };

    void fetchLikedPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // 프로필 정보 조회
  useEffect(() => {
    if (!profile) {
      void fetchProfile();
    }
  }, [profile, fetchProfile]);

  // 내 게시글 다시 조회
  const loadMyPosts = async () => {
    try {
      const posts = await getMyPosts();

      setMyPosts(posts);
    } catch (error) {
      console.error(error);
    }
  };

  // 좋아요한 게시글 다시 조회
  const loadLikedPosts = async () => {
    try {
      const posts = await getLikedPosts();

      setLikedPosts(posts);
    } catch (error) {
      console.error(error);
    }
  };

  // 좋아요 상태가 변경됐을 때
  const handleLikeChanged = async () => {
    // 좋아요한 게시글 목록 갱신
    await loadLikedPosts();

    // 내 게시글의 좋아요 수 갱신
    await loadMyPosts();

    // 작성한 글 / 받은 좋아요 등 프로필 통계 갱신
    await fetchProfile();
  };

  // 프로필 페이지 처음 들어왔을 때 내 게시글 조회
  useEffect(() => {
    let cancelled = false;

    const fetchMyPosts = async () => {
      try {
        const posts = await getMyPosts();

        if (!cancelled) {
          setMyPosts(posts);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setPostsLoading(false);
        }
      }
    };

    void fetchMyPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // 게시글 삭제
  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePost(postId);

      // 내 게시글 다시 조회
      await loadMyPosts();

      // 좋아요한 게시글에서도 삭제된 게시글 제거
      await loadLikedPosts();

      // 작성한 글 개수 등 프로필 정보 다시 조회
      await fetchProfile();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "게시글 삭제 중 오류가 발생했습니다.",
      );
    }
  };

  // 신고
  const handleReport = (post: PostResponse) => {
    console.log("신고", post);
  };

  // 프로필 로딩
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4FF]">프로필을 불러오는 중...</div>
    );
  }

  // 프로필 에러
  if (error) {
    return <div className="min-h-screen bg-[#F5F4FF]">{error}</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F4FF]">
      {/* 상단 뽀송 헤더 */}
      <HomeHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* 전체 레이아웃 */}
      <main
        className="
          mx-auto grid max-w-[1200px]
          grid-cols-1
          gap-6
          px-4 py-6
          lg:grid-cols-[200px_minmax(0,1fr)]
          lg:px-6
        "
      >
        {/* 왼쪽 사이드바 */}
        <HomeSidebar />

        {/* 오른쪽 프로필 영역 */}
        <section className="min-w-0">
          {/* 프로필 카드 */}
          <div className="overflow-hidden rounded-xl bg-white">
            {/* 프로필 상단 이미지 */}
            <div className="h-[180px] w-full overflow-hidden">
              <img
                src={pposongLogo}
                alt="Pposong"
                className="h-full w-full object-cover"
              />
            </div>

            {/* 프로필 정보 */}
            <div className="relative px-8 pb-6">
              {/* 프로필 이미지 */}
              <div className="-mt-[60px] flex justify-center">
                {profile.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt="프로필"
                    className="
                      h-[120px]
                      w-[120px]
                      rounded-full
                      border-4
                      border-white
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      h-[120px]
                      w-[120px]
                      rounded-full
                      border-4
                      border-white
                      bg-black
                    "
                  />
                )}
              </div>

              {/* 프로필 수정 버튼 */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/profile/edit")}
                  className="
                    rounded-md
                    border
                    border-gray-200
                    px-4 py-2
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                >
                  프로필 수정
                </button>
              </div>

              {/* 이름 / 소개 */}
              <div className="-mt-4 text-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {profile.username}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.bio ?? "소개가 없습니다."}
                </p>
              </div>

              {/* 프로필 통계 */}
              <div
                className="
                  mx-auto
                  mt-8
                  grid
                  max-w-[500px]
                  grid-cols-2
                "
              >
                {/* 작성한 글 */}
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {profile.postCount}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">작성한 글</p>
                </div>

                {/* 받은 좋아요 */}
                <div
                  className="
                    border-l
                    border-gray-200
                    text-center
                  "
                >
                  <p className="text-lg font-bold text-gray-900">
                    {profile.receivedLikeCount}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">받은 좋아요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 영역 */}
          <div className="mt-6">
            {/* 게시글 탭 */}
            <div
              className="
                grid
                grid-cols-2
                overflow-hidden
                rounded-xl
                bg-white
              "
            >
              {/* 내 게시글 */}
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`
                  py-4
                  text-sm
                  font-semibold
                  ${
                    activeTab === "posts"
                      ? "border-b-2 border-[#8B7CF6] text-[#8B7CF6]"
                      : "border-b border-gray-200 text-gray-500"
                  }
                `}
              >
                내 게시글
              </button>

              {/* 좋아요한 게시글 */}
              <button
                type="button"
                onClick={() => setActiveTab("likes")}
                className={`
                  py-4
                  text-sm
                  font-semibold
                  ${
                    activeTab === "likes"
                      ? "border-b-2 border-[#8B7CF6] text-[#8B7CF6]"
                      : "border-b border-gray-200 text-gray-500"
                  }
                `}
              >
                좋아요한 게시글
              </button>
            </div>

            {/* 내 게시글 목록 */}
            {activeTab === "posts" && (
              <div className="mt-4">
                {postsLoading ? (
                  <div className="rounded-xl bg-white">
                    <p className="py-10 text-center text-sm text-gray-500">
                      게시글을 불러오는 중...
                    </p>
                  </div>
                ) : myPosts.length === 0 ? (
                  <div className="rounded-xl bg-white">
                    <p className="py-10 text-center text-sm text-gray-500">
                      작성한 게시글이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={profile.id}
                        onEdit={setEditingPost}
                        onDelete={handleDeletePost}
                        onReport={handleReport}
                        onLikeChanged={handleLikeChanged}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 좋아요한 게시글 목록 */}
            {activeTab === "likes" && (
              <div className="mt-4">
                {likedPostsLoading ? (
                  <div className="rounded-xl bg-white">
                    <p className="py-10 text-center text-sm text-gray-500">
                      좋아요한 게시글을 불러오는 중...
                    </p>
                  </div>
                ) : likedPosts.length === 0 ? (
                  <div className="rounded-xl bg-white">
                    <p className="py-10 text-center text-sm text-gray-500">
                      좋아요한 게시글이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {likedPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={profile.id}
                        onEdit={setEditingPost}
                        onDelete={handleDeletePost}
                        onReport={handleReport}
                        onLikeChanged={handleLikeChanged}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 게시글 수정 모달 */}
      {editingPost && (
        <EditPostModal
          postId={editingPost.id}
          initialContent={editingPost.content}
          initialImageUrls={editingPost.imageUrls ?? []}
          onClose={() => setEditingPost(null)}
          onUpdated={async () => {
            // 내 게시글 다시 조회
            await loadMyPosts();

            // 좋아요한 게시글도 다시 조회
            await loadLikedPosts();

            // 프로필 통계 다시 조회
            await fetchProfile();
          }}
        />
      )}

      {/* 모바일 메뉴 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;
