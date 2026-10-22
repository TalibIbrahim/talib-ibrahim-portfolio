// Global motion: runs once on the client, before the first page initializes.
import { onScroll } from '@/engine';

export function setupMotion() {
  // Header steps aside on scroll down, returns on scroll up. Hysteresis (48px down / 20px up)
  // keeps it from flickering; always visible near the top.
  let anchor = 0;
  let hidden = false;
  const root = document.documentElement;
  onScroll(({ y }) => {
    if (y < 80) {
      if (hidden) root.classList.remove('frame-away');
      hidden = false;
      anchor = y;
      return;
    }
    if (!hidden && y - anchor > 48) {
      hidden = true;
      root.classList.add('frame-away');
      anchor = y;
    } else if (hidden && anchor - y > 20) {
      hidden = false;
      root.classList.remove('frame-away');
      anchor = y;
    }
    if ((hidden && y > anchor) || (!hidden && y < anchor)) anchor = y;
  });
}
