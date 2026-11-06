// One GPU at a time: a full-screen GL moment (the Work entrance) holds the other scenes (the About
// globe) while it runs. Holders get a release function; scenes check glHeld() before drawing.
let holds = 0;

export const glHeld = () => holds > 0;

export function holdGL() {
  holds++;
  let done = false;
  return () => {
    if (done) return;
    done = true;
    holds--;
  };
}
