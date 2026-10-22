// The page-transition curtain: an ink brush stroke (animated by src/engine/transition.ts).
// viewBox 0..100 stretched to the viewport; the main stroke is wide enough to cover every corner.
const PATH = 'M -40 92 C 0 15, 35 118, 58 50 S 92 -12, 140 26';

export function Curtain() {
  return (
    <div id="curtain" aria-hidden="true">
      <svg className="curtain__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="curtain-brush" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>
        <g className="curtain__brush">
          <path data-stroke className="curtain__body" d={PATH} pathLength={1} />
          {/* Bristle streaks: lighter and darker hairlines riding inside the stroke. */}
          <path data-stroke className="curtain__bristle curtain__bristle--a" d={PATH} pathLength={1} transform="translate(0 -22)" />
          <path data-stroke className="curtain__bristle curtain__bristle--b" d={PATH} pathLength={1} transform="translate(0 9)" />
          <path data-stroke className="curtain__bristle curtain__bristle--c" d={PATH} pathLength={1} transform="translate(0 31)" />
        </g>
      </svg>
    </div>
  );
}
