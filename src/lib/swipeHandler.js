export const useSwipe = (onLeft, onRight) => {
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  const onTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };

  const onTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
  };

  const handleGesture = () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // 0 interference with scroll: if vertical scroll is dominant, ignore horizontal swipe
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (diffX < -50) onLeft(); // Swipe Left (Right to Left) -> Next
    if (diffX > 50) onRight(); // Swipe Right (Left to Right) -> Prev
  };

  return { onTouchStart, onTouchEnd };
};
