import { getMyInfo, type UserResponse } from "../../api/auth";

import { useEffect, useState } from "react";

import { deletePost, getPosts, type PostResponse } from "../../api/post";

import CreatePostModal from "../../components/post/CreatePostModal";
import EditPostModal from "../../components/post/EditPostModal";
import PostCard from "../../components/post/PostCard";

import HomeSidebar from "../../components/home/HomeSidebar";
import OnlineUsers from "../../components/home/OnlineUsers";

import HomeHeader from "../../components/home/HomeHeader";
import MobileMenu from "../../components/home/MobileMenu";
import ReportModal from "../../components/post/ReportModal";

import { useProfileStore } from "../../stores/profileStore";

import { useOnlineUserStore } from "../../stores/onlineUserStore";

function HomePage() {
  const [reportingPost, setReportingPost] = useState<PostResponse | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const onlineUsers = useOnlineUserStore((state) => state.users);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingPost, setEditingPost] = useState<PostResponse | null>(null);

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  // 처음 홈 화면에 들어왔을 때 게시글 조회
  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const [postData, userData] = await Promise.all([
          getPosts(),
          getMyInfo(token),
        ]);

        if (!cancelled) {
          setPosts(postData);
          setCurrentUser(userData);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // 상세페이지에서 뒤로 왔을 때 기존 스크롤 위치 복원
  useEffect(() => {
    if (loading || error) {
      return;
    }

    const savedScrollY = sessionStorage.getItem("homeScrollY");

    if (!savedScrollY) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({
        top: Number(savedScrollY),
        behavior: "instant",
      });

      sessionStorage.removeItem("homeScrollY");
    });
  }, [loading, error]);

  // 게시글 작성 후 목록 다시 조회
  const refreshPosts = async () => {
    try {
      const data = await getPosts();

      setPosts(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "게시글을 불러오지 못했습니다.",
      );
    }
  };

  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deletePost(postId);

      // 삭제 후 게시글 목록 다시 조회
      await refreshPosts();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "게시글 삭제 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4FF]">
      {/* 상단 헤더 */}
      <HomeHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* 메인 영역 */}
      <main
        className="
            mx-auto grid max-w-[1200px]
    grid-cols-1
    gap-6 px-4 py-6
    lg:grid-cols-[200px_minmax(0,1fr)_240px]
    lg:px-6
        "
      >
        {/* 왼쪽 메뉴 */}
        <HomeSidebar />

        {/* 가운데 게시글 영역 */}
        <section className="min-w-0">
          {/* 게시글 작성 버튼 */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="
    flex w-full items-center gap-3
    cursor-pointer
    rounded-xl bg-white p-5
    text-left text-gray-400
    transition hover:bg-gray-50
  "
          >
            {/* 내 프로필 사진 */}
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="내 프로필"
                className="
        h-10 w-10
        shrink-0
        rounded-full
        object-cover
      "
              />
            ) : (
              <div
                className="
        flex
        h-10 w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-gray-200
        text-gray-500
      "
              >
                <i className="bi bi-person-fill text-lg" />
              </div>
            )}

            <span>무슨 생각을 하고 계신가요?</span>
          </button>

          {/* 게시글 목록 */}
          <div className="mt-4 space-y-4">
            {/* 로딩 */}
            {loading && (
              <div className="rounded-xl bg-white p-5">
                <p className="text-gray-400">게시글을 불러오는 중...</p>
              </div>
            )}

            {/* 에러 */}
            {!loading && error && (
              <div className="rounded-xl bg-white p-5">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* 게시글 없음 */}
            {!loading && !error && posts.length === 0 && (
              <div className="rounded-xl bg-white p-5">
                <p className="text-gray-400">아직 작성된 게시글이 없습니다.</p>
              </div>
            )}

            {/* 게시글 */}
            {!loading &&
              !error &&
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser?.id}
                  onEdit={setEditingPost}
                  onDelete={handleDeletePost}
                  onReport={setReportingPost}
                />
              ))}
          </div>
        </section>

        {/* 오른쪽 영역 */}
        <OnlineUsers users={onlineUsers} />
      </main>

      {/* 게시글 작성 모달 */}
      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={refreshPosts}
        />
      )}

      {/* 게시글 수정 모달 */}
      {editingPost && (
        <EditPostModal
          postId={editingPost.id}
          initialContent={editingPost.content}
          initialImageUrls={editingPost.imageUrls ?? []}
          onClose={() => setEditingPost(null)}
          onUpdated={refreshPosts}
        />
      )}

      {/* 게시글 신고 모달 */}
      {reportingPost && (
        <ReportModal
          postId={reportingPost.id}
          onClose={() => setReportingPost(null)}
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

export default HomePage;
