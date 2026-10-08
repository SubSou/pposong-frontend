import { useEffect, useMemo, useState } from "react";

import { updatePost } from "../../api/post";
import { uploadImage } from "../../api/image";

interface EditPostModalProps {
  postId: number;
  initialContent: string;
  initialImageUrls?: string[];
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

function EditPostModal({
  postId,
  initialContent,
  initialImageUrls = [],
  onClose,
  onUpdated,
}: EditPostModalProps) {
  const [content, setContent] = useState(initialContent);

  const [existingImageUrls, setExistingImageUrls] =
    useState<string[]>(initialImageUrls);

  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * 새로 선택한 이미지 미리보기
   */
  const previewUrls = useMemo(
    () => newImages.map((image) => URL.createObjectURL(image)),
    [newImages],
  );

  /*
   * 미리보기 URL 정리
   */
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  /*
   * 기존 이미지 삭제
   */
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );

    setError("");
  };

  /*
   * 새 이미지 선택
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    const currentImageCount = existingImageUrls.length + newImages.length;

    if (currentImageCount + files.length > 10) {
      setError("사진은 최대 10장까지 등록할 수 있습니다.");

      event.target.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    setError("");

    // 같은 파일을 다시 선택할 수 있도록 초기화
    event.target.value = "";
  };

  /*
   * 새 이미지 삭제
   */
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );

    setError("");
  };

  /*
   * 게시글 수정
   */
  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
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
       * 새로 추가한 이미지들을 S3에 업로드
       */
      const newImageUrls = await Promise.all(
        newImages.map((image) => uploadImage(image)),
      );

      /*
       * 기존 이미지 + 새 이미지
       *
       * 이 배열이 수정 후 최종 이미지 목록
       */
      const imageUrls = [...existingImageUrls, ...newImageUrls];

      /*
       * 게시글 수정
       */
      await updatePost(postId, {
        content: trimmedContent,
        imageUrls,
      });

      await onUpdated();

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "게시글 수정 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * 내용이나 이미지가 변경되었는지 확인
   */
  const hasContentChanged = content.trim() !== initialContent.trim();

  const hasImageChanged =
    existingImageUrls.length !== initialImageUrls.length ||
    existingImageUrls.some((url, index) => url !== initialImageUrls[index]) ||
    newImages.length > 0;

  const canSubmit =
    !loading && !!content.trim() && (hasContentChanged || hasImageChanged);

  /*
   * 현재 전체 이미지 개수
   */
  const totalImageCount = existingImageUrls.length + newImages.length;

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
          rounded-2xl bg-white p-6
        "
      >
        {/* 제목 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">게시글 수정</h2>

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
          onChange={(event) => {
            setContent(event.target.value);
            setError("");
          }}
          maxLength={1000}
          className="
            min-h-[160px] w-full resize-none
            rounded-xl border border-gray-200
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
              disabled={loading || totalImageCount >= 10}
              className="hidden"
            />
          </label>

          <span className="ml-2 text-xs text-gray-400">
            {totalImageCount} / 10
          </span>
        </div>

        {/* 기존 + 새 이미지 */}
        {totalImageCount > 0 && (
          <div className="mt-2">
            <div className="grid grid-cols-5 gap-1.5">
              {/* 기존 이미지 */}
              {existingImageUrls.map((imageUrl, index) => (
                <div
                  key={`existing-${imageUrl}`}
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
                    src={imageUrl}
                    alt={`기존 이미지 ${index + 1}`}
                    className="
                        h-full w-full
                        object-cover
                      "
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
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

              {/* 새 이미지 */}
              {newImages.map((image, index) => (
                <div
                  key={`new-${image.name}-${image.lastModified}-${index}`}
                  className="
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-lg
                      border border-[#8B7CF6]
                      bg-gray-100
                    "
                >
                  <img
                    src={previewUrls[index]}
                    alt={`새 이미지 ${index + 1}`}
                    className="
                        h-full w-full
                        object-cover
                      "
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
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
            disabled={!canSubmit}
            className="
              flex-1 rounded-lg
              bg-[#8B7CF6]
              py-3 font-semibold
              text-white
              transition
              hover:bg-[#7868E6]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "수정 중..." : "수정"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPostModal;
