'use client';
// InkBreakout: the page ends with a game. Breakout on paper: an ink-drop ball, a pen for a paddle,
// and the bricks are the stack (site.stack items). Hits splatter onto a stain layer drawn above
// the bricks. Clearing every brick reveals the real mailto.
//
// Phases: idle (static board, nothing runs) -> aim (drop parked on the pen) -> play, with paused,
// over and won. One persistent header button (Play / Pause / Resume / Try again / Play again).
// Input:
//   - keyboard, only while focus is inside the game: Left/Right or A/D move the pen (captured only
//     during aim/play), Space/Enter on the board launches (or starts/resumes), Escape pauses.
//   - mouse/pen: the pen follows the pointer over the board only; click launches.
//   - touch: drag on the board steers. The canvas gets touch-action: none only during aim/play, so
//     an idle board never blocks page scroll. A tap launches.
// Clock: gsap.ticker only, and only while there is something to animate; pauses itself when the
// board leaves the viewport, the tab is hidden or focus leaves the game. DPR capped at 2.
// Reduced motion: nothing moves until the visitor presses Play (then the drop is slower and bricks
// vanish without the fade). The InkPad lifts its pen over [data-ink-off].
import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { site } from '@/data/site';
import { prefersReducedMotion, scrollToTarget } from '@/engine';
import { usePage } from '@/engine/next';
import { clamp, family, fill, fitCanvas, rand, tickerLoop, token, watchVisible } from './loop';
import b from './InkBreakout.module.css';

type Phase = 'idle' | 'aim' | 'play' | 'paused' | 'over' | 'won';
type Brick = { x: number; y: number; w: number; h: number; label: string; alive: boolean; fade: number; fs: number };

const B = site.contact.breakout;
const ITEMS = site.stack.flatMap((g) => g.items);
const LIVES = 3;
const SAY_GAP = 3000; // ms between "n of total cleared" announcements

export function InkBreakout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const mailRef = useRef<HTMLAnchorElement>(null);
  const api = useRef({ toggle: () => {} });
  const [phase, setPhase] = useState<Phase>('idle');
  const [wired, setWired] = useState(false);
  const [announce, setAnnounce] = useState('');
  const descId = useId();
  const focusWin = useRef(false);

  useEffect(() => {
    if (phase !== 'won' || !focusWin.current) return;
    focusWin.current = false;
    mailRef.current?.focus({ preventScroll: true });
  }, [phase]);

  usePage(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const btn = btnRef.current;
    if (!root || !stage || !canvas || !btn || !canvas.getContext('2d')) return;
    const reduced = prefersReducedMotion();
    const ink = token('--c-bg', '#0b0b0c');
    const blue = token('--c-accent', '#4d6bff');
    let body = family('--f-body');
    let mono = family('--f-mono');

    let w = 0;
    let h = 0;
    let ctx: CanvasRenderingContext2D;
    let dpr = 1;
    const stain = document.createElement('canvas');
    let sctx: CanvasRenderingContext2D;

    let bricks: Brick[] = [];
    let phase: Phase = 'idle';
    let resumeTo: Phase = 'aim';
    let lives = LIVES;
    let onScreen = false;
    let lastSay = 0;
    let sayPending = false;
    const pen = { x: 0, tx: 0, w: 120, h: 12, y: 0 };
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 8, speed: 0 };
    const keys = { left: false, right: false };

    const cleared = () => bricks.reduce((n, br) => n + (br.alive ? 0 : 1), 0);
    const say = (text: string) => {
      setAnnounce(text);
      lastSay = performance.now();
      sayPending = false;
    };
    const go = (p: Phase) => {
      phase = p;
      setPhase(p);
      sync();
    };
    const baseSpeed = () => clamp(h * 0.75, 380, 620) * (reduced ? 0.7 : 1);

    // ---------- layout ----------
    const layout = () => {
      w = stage.clientWidth;
      h = stage.clientHeight;
      if (!w || !h) return;
      const old = stain.width ? copyOf(stain) : null;
      ({ ctx, dpr } = fitCanvas(canvas, w, h));
      const prev = bricks;
      const phone = w < 640;
      const cols = phone ? 3 : 6;
      const pad = phone ? 10 : 28;
      const gap = phone ? 5 : 10;
      const top = phone ? 44 : 60;
      const bh = phone ? 24 : clamp(h * 0.055, 30, 40);
      const bw = (w - pad * 2 - gap * (cols - 1)) / cols;
      const max = phone ? 13 : 15;
      ctx.font = `500 ${max}px ${body}`;
      bricks = ITEMS.map((label, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const fit = Math.min(max, (max * (bw - 12)) / ctx.measureText(label).width);
        return {
          x: pad + c * (bw + gap),
          y: top + r * (bh + gap),
          w: bw,
          h: bh,
          label,
          alive: prev[i]?.alive ?? true,
          fade: prev[i]?.fade ?? 1,
          fs: Math.max(9, fit),
        };
      });
      pen.w = phone ? 96 : 132;
      pen.y = h - (phone ? 30 : 40);
      pen.x = pen.tx = clamp(pen.x || w / 2, pen.w / 2, w - pen.w / 2);
      ball.r = phone ? 7 : 9;
      const speed = baseSpeed();
      if (phase !== 'play' || !ball.speed) ball.speed = speed;
      ball.x = clamp(ball.x, ball.r, w - ball.r);
      stain.width = canvas.width;
      stain.height = canvas.height;
      sctx = stain.getContext('2d')!;
      // Stains survive a resize, stretched to the new board.
      if (old) sctx.drawImage(old, 0, 0, stain.width, stain.height);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (phase !== 'play') park();
    };
    const copyOf = (src: HTMLCanvasElement) => {
      const c = document.createElement('canvas');
      c.width = src.width;
      c.height = src.height;
      c.getContext('2d')!.drawImage(src, 0, 0);
      return c;
    };

    const park = () => {
      ball.x = pen.x;
      ball.y = pen.y - pen.h / 2 - ball.r - 1;
      ball.vx = ball.vy = 0;
    };

    // ---------- flow ----------
    const reset = () => {
      bricks.forEach((br) => {
        br.alive = true;
        br.fade = 1;
      });
      sctx.setTransform(1, 0, 0, 1, 0, 0);
      sctx.clearRect(0, 0, stain.width, stain.height);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lives = LIVES;
      ball.speed = baseSpeed();
      park();
    };
    // Bring the whole board into view (centred) when a game starts or resumes from the button.
    const show = () => {
      const r = stage.getBoundingClientRect();
      if (r.top >= 0 && r.bottom <= innerHeight) return;
      scrollToTarget(Math.round(scrollY + r.top - Math.max(0, (innerHeight - r.height) / 2)));
    };
    const begin = () => {
      if (phase === 'over' || phase === 'won') reset();
      stage.focus({ preventScroll: true });
      show();
      go('aim');
      say(fill(B.announce.start, { total: bricks.length, lives }));
    };
    const launch = () => {
      const a = rand(-0.5, 0.5);
      ball.vx = Math.sin(a) * ball.speed;
      ball.vy = -Math.cos(a) * ball.speed;
      go('play');
    };
    const pause = () => {
      if (phase !== 'aim' && phase !== 'play') return;
      resumeTo = phase;
      keys.left = keys.right = false;
      go('paused');
      say(B.announce.paused);
    };
    const resume = () => {
      stage.focus({ preventScroll: true });
      show();
      go(resumeTo);
    };
    const toggle = () => {
      if (phase === 'aim' || phase === 'play') pause();
      else if (phase === 'paused') resume();
      else begin();
    };
    api.current.toggle = toggle;

    // The clock runs only while something moves: a live game, or bricks still fading out.
    const loop = tickerLoop((dt) => {
      step(dt);
      draw();
      if (!needsTick()) loop.stop();
    });
    const needsTick = () =>
      onScreen &&
      !document.hidden &&
      (phase === 'aim' || phase === 'play' || bricks.some((br) => !br.alive && br.fade > 0));
    function sync() {
      if (needsTick()) loop.start();
      else {
        loop.stop();
        draw();
      }
    }

    // Ink splatter: a blob, droplets thrown along the drop's direction, a couple of streaks.
    const splat = (x: number, y: number, dx: number, dy: number, big = 1) => {
      const c = sctx;
      c.fillStyle = blue;
      c.globalAlpha = 0.92;
      const R = ball.r * 1.3 * big;
      c.beginPath();
      for (let i = 0; i <= 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const rr = R * rand(0.7, 1.25);
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (i) c.lineTo(px, py);
        else c.moveTo(px, py);
      }
      c.closePath();
      c.fill();
      const dir = Math.atan2(dy, dx);
      const n = Math.round(rand(8, 14) * big);
      for (let i = 0; i < n; i++) {
        const a = dir + rand(-1.3, 1.3);
        const d = R * rand(1.2, 4.2);
        c.globalAlpha = rand(0.6, 0.95);
        c.beginPath();
        c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rand(0.8, R * 0.38), 0, Math.PI * 2);
        c.fill();
      }
      for (let i = 0; i < 2; i++) {
        const a = dir + rand(-0.6, 0.6);
        const d = R * rand(1.4, 2.4);
        c.globalAlpha = 0.85;
        c.beginPath();
        c.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, R * rand(0.5, 0.9), R * 0.18, a, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    };

    // ---------- simulation ----------
    function step(dt: number) {
      if (phase === 'aim' || phase === 'play') {
        if (keys.left) pen.tx -= 820 * dt;
        if (keys.right) pen.tx += 820 * dt;
        pen.tx = clamp(pen.tx, pen.w / 2, w - pen.w / 2);
        pen.x += (pen.tx - pen.x) * (1 - Math.exp(-dt * 22));
      }
      bricks.forEach((br) => {
        if (!br.alive && br.fade > 0) br.fade = reduced ? 0 : Math.max(0, br.fade - dt * 4);
      });
      if (sayPending && performance.now() - lastSay > SAY_GAP) {
        say(fill(B.announce.cleared, { n: cleared(), total: bricks.length }));
      }
      if (phase === 'aim') {
        park();
        return;
      }
      if (phase !== 'play') return;

      // Substeps so the drop never tunnels through a brick.
      const dist = Math.hypot(ball.vx, ball.vy) * dt;
      const n = Math.max(1, Math.ceil(dist / (ball.r * 0.5)));
      const sdt = dt / n;
      for (let k = 0; k < n; k++) {
        ball.x += ball.vx * sdt;
        ball.y += ball.vy * sdt;
        if (ball.x < ball.r) {
          ball.x = ball.r;
          ball.vx = Math.abs(ball.vx);
        }
        if (ball.x > w - ball.r) {
          ball.x = w - ball.r;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y < ball.r) {
          ball.y = ball.r;
          ball.vy = Math.abs(ball.vy);
        }

        // Pen: the bounce angle depends on where the drop lands on it.
        const top = pen.y - pen.h / 2;
        if (ball.vy > 0 && ball.y + ball.r >= top && ball.y < pen.y + pen.h && Math.abs(ball.x - pen.x) <= pen.w / 2 + ball.r) {
          const off = clamp((ball.x - pen.x) / (pen.w / 2), -1, 1);
          const a = off * 1.05;
          ball.vx = Math.sin(a) * ball.speed;
          ball.vy = -Math.cos(a) * ball.speed;
          ball.y = top - ball.r;
        }

        for (const br of bricks) {
          if (!br.alive) continue;
          const nx = clamp(ball.x, br.x, br.x + br.w);
          const ny = clamp(ball.y, br.y, br.y + br.h);
          const dx = ball.x - nx;
          const dy = ball.y - ny;
          if (dx * dx + dy * dy > ball.r * ball.r) continue;
          hit(br, nx, ny);
          // Reflect on the shallower penetration axis.
          const ox = Math.min(Math.abs(ball.x + ball.r - br.x), Math.abs(br.x + br.w - (ball.x - ball.r)));
          const oy = Math.min(Math.abs(ball.y + ball.r - br.y), Math.abs(br.y + br.h - (ball.y - ball.r)));
          if (ox < oy) ball.vx = -ball.vx;
          else ball.vy = -ball.vy;
          ball.speed *= 1.018;
          const sp = Math.hypot(ball.vx, ball.vy);
          ball.vx *= ball.speed / sp;
          ball.vy *= ball.speed / sp;
          if (phase !== 'play') return;
          break;
        }

        if (ball.y - ball.r > h) {
          splat(clamp(ball.x, 10, w - 10), h - 4, 0, -1, 1.4);
          lives -= 1;
          if (lives <= 0) {
            go('over');
            say(fill(B.announce.over, { n: cleared(), total: bricks.length }));
            if (root!.contains(document.activeElement)) btn!.focus({ preventScroll: true });
          } else {
            park();
            go('aim');
            say(lives === 1 ? B.announce.missedOne : fill(B.announce.missed, { lives }));
          }
          return;
        }
      }
    }

    function hit(br: Brick, x: number, y: number) {
      br.alive = false;
      splat(x, y, ball.vx, ball.vy, 1);
      if (bricks.every((o) => !o.alive)) {
        win();
        return;
      }
      if (performance.now() - lastSay > SAY_GAP) say(fill(B.announce.cleared, { n: cleared(), total: bricks.length }));
      else sayPending = true;
    }

    function win() {
      keys.left = keys.right = false;
      go('won');
      say(fill(B.announce.won, { total: bricks.length }));
      // Hand focus to the reward once React has rendered it (see the effect below).
      focusWin.current = root!.contains(document.activeElement);
    }

    // ---------- drawing ----------
    const drawPen = () => {
      const c = ctx;
      const { x, y, w: pw, h: ph } = pen;
      const L = x - pw / 2;
      const nib = ph * 1.6;
      c.save();
      c.fillStyle = ink;
      c.beginPath();
      c.roundRect(L, y - ph / 2, pw - nib, ph, [ph / 2, 2, 2, ph / 2]);
      c.fill();
      c.fillStyle = blue;
      c.fillRect(L + pw * 0.18, y - ph / 2, 6, ph);
      c.fillStyle = ink;
      c.beginPath();
      c.moveTo(L + pw - nib, y - ph / 2);
      c.lineTo(L + pw, y);
      c.lineTo(L + pw - nib, y + ph / 2);
      c.closePath();
      c.fill();
      c.fillStyle = blue;
      c.beginPath();
      c.arc(L + pw - 1.5, y, 1.8, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const drawDrop = (x: number, y: number, r: number, vx: number, vy: number) => {
      const c = ctx;
      const sp = Math.hypot(vx, vy);
      const a = sp > 1 ? Math.atan2(vy, vx) : -Math.PI / 2;
      const tail = sp > 1 ? r * (reduced ? 1.4 : 2.4) : r * 1.4;
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.fillStyle = blue;
      c.beginPath();
      c.moveTo(-tail - r, 0);
      c.quadraticCurveTo(-r * 0.6, -r * 1.05, 0, -r);
      c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
      c.quadraticCurveTo(-r * 0.6, r * 1.05, -tail - r, 0);
      c.fill();
      c.restore();
    };

    function draw() {
      if (!w || !h) return;
      const c = ctx;
      c.clearRect(0, 0, w, h);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      for (const br of bricks) {
        if (!br.alive && br.fade <= 0) continue;
        const k = br.alive ? 1 : br.fade;
        c.save();
        c.globalAlpha = k;
        c.translate(br.x + br.w / 2, br.y + br.h / 2);
        c.scale(0.8 + 0.2 * k, 0.8 + 0.2 * k);
        c.fillStyle = 'rgba(11,11,12,0.04)';
        c.fillRect(-br.w / 2, -br.h / 2, br.w, br.h);
        c.strokeStyle = ink;
        c.lineWidth = 1.25;
        c.strokeRect(-br.w / 2 + 0.5, -br.h / 2 + 0.5, br.w - 1, br.h - 1);
        c.fillStyle = ink;
        c.font = `500 ${br.fs}px ${body}`;
        c.fillText(br.label, 0, 1);
        c.restore();
      }
      c.drawImage(stain, 0, 0, w, h);
      drawPen();
      if (phase !== 'over' && phase !== 'won') drawDrop(ball.x, ball.y, ball.r, ball.vx, ball.vy);
      // HUD: drops left, bricks cleared
      for (let i = 0; i < LIVES; i++) {
        c.globalAlpha = i < lives ? 1 : 0.18;
        drawDrop(18 + i * 22, 22, 6, 0, -1);
      }
      c.globalAlpha = 1;
      c.fillStyle = ink;
      c.textAlign = 'right';
      c.font = `400 12px ${mono}`;
      c.fillText(`${String(cleared()).padStart(2, '0')} / ${bricks.length}`, w - 14, 22);
    }

    // ---------- input ----------
    const offs: (() => void)[] = [];
    const on = <T extends EventTarget, E extends Event>(el: T, type: string, fn: (e: E) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      offs.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };
    const live = () => phase === 'aim' || phase === 'play';
    const localX = (cx: number) => cx - canvas.getBoundingClientRect().left;

    let tap: { id: number; x: number; y: number; t: number } | null = null;
    on(canvas, 'pointermove', (e: PointerEvent) => {
      if (!live()) return;
      if (e.pointerType === 'touch' && tap?.id !== e.pointerId) return;
      pen.tx = localX(e.clientX);
    });
    on(canvas, 'pointerdown', (e: PointerEvent) => {
      if (!live()) return;
      pen.tx = localX(e.clientX);
      if (e.pointerType === 'touch') {
        tap = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp };
        canvas.setPointerCapture(e.pointerId);
      } else if (e.button === 0 && phase === 'aim') {
        launch();
      }
    });
    const lift = (e: PointerEvent) => {
      if (!tap || tap.id !== e.pointerId) return;
      const quick = e.timeStamp - tap.t < 350 && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 12;
      tap = null;
      if (e.type === 'pointerup' && quick && phase === 'aim') launch();
    };
    on(canvas, 'pointerup', lift);
    on(canvas, 'pointercancel', lift);
    // A click (never a scroll gesture) on an idle, paused or finished board starts it.
    on(canvas, 'click', () => {
      if (phase === 'idle' || phase === 'paused' || phase === 'over') toggle();
    });

    on(root, 'keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      const left = k === 'ArrowLeft' || k === 'a' || k === 'A';
      const right = k === 'ArrowRight' || k === 'd' || k === 'D';
      if ((left || right) && live()) {
        e.preventDefault();
        if (left) keys.left = true;
        else keys.right = true;
        return;
      }
      if (k === 'Escape' && live()) {
        e.preventDefault();
        pause();
        btn.focus({ preventScroll: true });
        return;
      }
      if ((k === ' ' || k === 'Enter') && e.target === stage) {
        if (phase === 'won') return;
        e.preventDefault();
        if (phase === 'aim') launch();
        else if (phase !== 'play') toggle();
      }
    });
    on(root, 'keyup', (e: KeyboardEvent) => {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    });
    // Focus leaving the game (or the window) pauses it.
    on(root, 'focusout', (e: FocusEvent) => {
      if (root.contains(e.relatedTarget as Node | null)) return;
      keys.left = keys.right = false;
      pause();
    });
    on(document, 'visibilitychange', () => {
      if (document.hidden) pause();
      sync();
    });

    offs.push(
      watchVisible(stage, (v) => {
        onScreen = v;
        if (!v) pause();
        sync();
      }),
    );

    const ro = new ResizeObserver(() => {
      if (stage.clientWidth === w && stage.clientHeight === h) return;
      layout();
      draw();
    });
    ro.observe(stage);

    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      body = family('--f-body');
      mono = family('--f-mono');
      layout();
      draw();
    });

    layout();
    draw();
    setWired(true);

    return () => {
      alive = false;
      loop.stop();
      ro.disconnect();
      offs.forEach((o) => o());
      api.current.toggle = () => {};
      setWired(false);
      setPhase('idle');
      setAnnounce('');
    };
  });

  const playing = phase === 'aim' || phase === 'play';
  const btnLabel =
    playing ? B.pause : phase === 'paused' ? B.resume : phase === 'over' ? B.retry : phase === 'won' ? B.again : B.play;
  const BtnIcon = playing ? Pause : phase === 'over' || phase === 'won' ? RotateCcw : Play;

  return (
    <div ref={rootRef} className={b.game} data-drop data-ink-off>
      <div className={b.head}>
        <div className={b.headText}>
          <h3 className={b.label}>{B.label}</h3>
          <p className={b.invite}>{B.invite}</p>
        </div>
        <button
          ref={btnRef}
          type="button"
          className={b.btn}
          onClick={() => api.current.toggle()}
          disabled={!wired}
          data-playing={playing || undefined}
        >
          <BtnIcon size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>{btnLabel}</span>
        </button>
      </div>

      <div
        ref={stageRef}
        className={b.stage}
        data-phase={phase}
        role="group"
        aria-label={B.gameLabel}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <canvas
          ref={canvasRef}
          className={b.canvas}
          aria-hidden="true"
          data-cursor={phase === 'idle' || phase === 'paused' || phase === 'over' ? 'play' : undefined}
        />
        <p id={descId} className="sr-only">
          {fill(B.description, { lives: LIVES })}
        </p>

        {phase !== 'play' && phase !== 'won' && (
          <p className={b.msg} aria-hidden="true">
            {phase === 'idle' && (
              <>
                <span className={b.forPointer}>{B.hintPointer}</span>
                <span className={b.forTouch}>{B.hintTouch}</span>
              </>
            )}
            {phase === 'aim' && (
              <>
                <span className={b.forPointer}>{B.launchPointer}</span>
                <span className={b.forTouch}>{B.launchTouch}</span>
              </>
            )}
            {phase === 'paused' && B.paused}
            {phase === 'over' && B.over}
          </p>
        )}

        {phase === 'won' && (
          <div className={b.win}>
            <p className={b.winText}>
              {B.winLead}{' '}
              <a ref={mailRef} className={b.winLink} href={`mailto:${site.email}`}>
                {B.winCta}
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
    </div>
  );
}
