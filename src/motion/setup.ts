// Global motion: runs once on the client, before the first page initializes.
import { onScroll } from '@/engine';

export function setupMotion() {
  // Header (and the Recruiter mode button) step aside on scroll down and return on a deliberate scroll
  // up. Hysteresis (40px down / 96px up) keeps small corrections and smooth-scroll overshoot from
  // bringing them back over the content; always visible near the top. Runs on every page.
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
    if (!hidden && y - anchor > 40) {
      hidden = true;
      root.classList.add('frame-away');
      anchor = y;
    } else if (hidden && anchor - y > 96) {
      hidden = false;
      root.classList.remove('frame-away');
      anchor = y;
    }
    if ((hidden && y > anchor) || (!hidden && y < anchor)) anchor = y;
  });
}
