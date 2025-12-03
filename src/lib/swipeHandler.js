export const useSwipe = (onLeft, onRight) => {
  let touchStartX = 0;
  let touchEndX = 0;

  const onTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  };

  const handleGesture = () => {
    if (touchEndX < touchStartX - 50) onLeft(); // Swipe Left (Right to Left) -> Next
    if (touchEndX > touchStartX + 50) onRight(); // Swipe Right (Left to Right) -> Prev
  };

  return { onTouchStart, onTouchEnd };
};
