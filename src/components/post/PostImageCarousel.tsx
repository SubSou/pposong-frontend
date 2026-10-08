import { useState } from "react";

interface PostImageCarouselProps {
  imageUrls: string[];
}

function PostImageCarousel({ imageUrls }: PostImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      return;
    }

    const distance = touchStart - touchEnd;

    // 너무 조금 움직인 경우는 스와이프로 처리하지 않음
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // 왼쪽으로 밀기 → 다음 사진
      setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    }

    if (distance < -minSwipeDistance) {
      // 오른쪽으로 밀기 → 이전 사진
      setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    // PostCard 클릭 이벤트 방지
    event.stopPropagation();

    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    // PostCard 클릭 이벤트 방지
    event.stopPropagation();

    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="
        relative mt-4
        w-full overflow-hidden
        rounded-xl
        bg-gray-100
      "
    >
      {/* 현재 이미지 */}
      <div
        className="aspect-[4/3] w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageUrls[currentIndex]}
          alt={`게시글 이미지 ${currentIndex + 1}`}
          className="
            h-full w-full
            object-cover
          "
        />
      </div>

      {/* 이미지가 2장 이상일 때만 표시 */}
      {imageUrls.length > 1 && (
        <>
          {/* 이전 버튼 */}
          <button
            type="button"
            onClick={handlePrev}
            className="
              absolute left-3 top-1/2
              flex h-8 w-8
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-black/40
              text-white
              transition
              hover:bg-black/60
            "
          >
            <i className="bi bi-chevron-left" />
          </button>

          {/* 다음 버튼 */}
          <button
            type="button"
            onClick={handleNext}
            className="
              absolute right-3 top-1/2
              flex h-8 w-8
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-black/40
              text-white
              transition
              hover:bg-black/60
            "
          >
            <i className="bi bi-chevron-right" />
          </button>

          {/* 현재 사진 번호 */}
          <div
            className="
              absolute right-3 top-3
              rounded-full
              bg-black/50
              px-2.5 py-1
              text-xs font-medium
              text-white
            "
          >
            {currentIndex + 1} / {imageUrls.length}
          </div>

          {/* 아래 점 */}
          <div
            className="
              absolute bottom-3
              left-1/2
              flex -translate-x-1/2
              gap-1.5
            "
          >
            {imageUrls.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`
                  h-2 w-2
                  rounded-full
                  transition
                  ${currentIndex === index ? "bg-white" : "bg-white/50"}
                `}
                aria-label={`${index + 1}번째 이미지`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PostImageCarousel;
