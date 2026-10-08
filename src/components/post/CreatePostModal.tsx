import { useEffect, useMemo, useState } from "react";
import { createPost } from "../../api/post";

import { uploadImage } from "../../api/image";

interface CreatePostModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreatePostModal({ onClose, onCreated }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [images, setImages] = useState<File[]>([]);

  /*
   * 선택한 이미지 미리보기 URL
   */
  const previewUrls = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images],
  );

  /*
   * 만들어진 미리보기 URL 정리
   */
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  /*
   * 이미지 선택
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (images.length + files.length > 10) {
      alert("사진은 최대 10장까지 추가할 수 있습니다.");

      event.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // 같은 사진을 다시 선택할 수 있도록 초기화
    event.target.value = "";
  };

  /*
   * 선택한 이미지 제거
   */
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  /*
   * 게시글 작성
   */
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("게시글 내용을 입력해주세요.");
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * 1. 선택한 이미지들을 S3에 업로드
       */
      const imageUrls = await Promise.all(
        images.map((image) => uploadImage(image)),
      );

      /*
       * 2. 게시글 + S3 이미지 URL 저장
       */
      await createPost({
        content: content.trim(),
        imageUrls,
      });

      /*
       * 3. 게시글 목록 다시 불러오기
       */
      onCreated();

      /*
       * 4. 모달 닫기
       */
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "게시글 작성 중 오류가 발생했습니다.",
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
          w-full max-w-[520px]
          rounded-2xl bg-white
          p-6
        "
      >
        {/* 제목 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">게시글 작성</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              text-2xl text-gray-400
              hover:text-gray-600
            "
          >
            ×
          </button>
        </div>

        {/* 게시글 내용 */}
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="무슨 생각을 하고 계신가요?"
          maxLength={1000}
          className="
            min-h-[160px] w-full
            resize-none rounded-xl
            border border-gray-200
            p-4 outline-none
            focus:border-[#8B7CF6]
          "
        />

        {/* 사진 추가 */}
        <div className="mt-2">
          <label
            className="
              inline-flex cursor-pointer
              items-center gap-2
              rounded-lg px-3 py-2
              text-sm font-medium
              text-[#8B7CF6]
              transition
              hover:bg-[#F5F4FF]
            "
          >
            <i className="bi bi-image" />
            사진 추가
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* 이미지 미리보기 */}
        {images.length > 0 && (
          <div className="mt-2">
            <div className="mb-2 text-xs text-gray-500">
              {images.length} / 10
            </div>

            {/* 한 줄 최대 5개 */}
            <div className="grid grid-cols-5 gap-1.5">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${image.lastModified}-${index}`}
                  className="
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-lg
                      border border-gray-200
                      bg-gray-100
                    "
                >
                  <img
                    src={previewUrls[index]}
                    alt={`선택한 이미지 ${index + 1}`}
                    className="
                        h-full w-full
                        object-cover
                      "
                  />

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={loading}
                    className="
                        absolute right-1 top-1
                        flex h-5 w-5
                        items-center justify-center
                        rounded-full
                        bg-black/50
                        text-[10px]
                        text-white
                        transition
                        hover:bg-black/70
                      "
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 에러 / 글자 수 */}
        <div className="mt-2 flex justify-between">
          <div>{error && <p className="text-sm text-red-500">{error}</p>}</div>

          <span className="text-sm text-gray-400">{content.length}/1000</span>
        </div>

        {/* 버튼 */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex-1 rounded-lg
              border border-gray-200
              py-3 font-semibold
              text-gray-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="
              flex-1 rounded-lg
              bg-[#8B7CF6]
              py-3 font-semibold
              text-white
              hover:bg-[#7868E6]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "게시 중..." : "게시"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
