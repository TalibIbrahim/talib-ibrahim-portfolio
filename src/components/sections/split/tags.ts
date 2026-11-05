// Hand-authored marker strokes for the split's graffiti tags: upright letterforms in a 0..400 x 0..220
// box (baseline y=160, x-height y=100, ascender y=25). The group gets a skew + rotate for a quick
// slanted hand. Each stroke is drawn twice: a fat pass and a thin, jittered, offset pass (marker pressure).

export const TAG_VIEWBOX = '0 0 420 230';
export const TAG_SLANT = 'rotate(-9 210 120) skewX(-16)';

export const TAGS = {
  front: [
    'M 78 34 C 70 18 46 16 40 40 C 36 62 36 110 34 160 C 33 182 26 196 12 200',
    'M 74 158 C 76 140 78 118 80 102 C 84 116 92 104 108 98 C 116 96 122 98 126 104',
    'M 164 102 C 144 98 132 120 136 142 C 140 160 162 160 172 144 C 182 128 180 106 164 100 C 158 99 156 106 166 108 C 178 110 190 106 198 102',
    'M 198 160 C 199 142 200 118 202 102 C 206 120 214 102 232 98 C 248 96 252 112 250 130 C 249 142 248 152 250 158 C 256 164 266 156 272 146',
    'M 306 36 C 302 70 296 110 294 140 C 293 160 304 164 322 152',
    'M 14 106 C 34 103 58 100 82 96',
    'M 262 94 C 300 88 344 80 396 66',
  ],
  back: [
    'M 46 22 C 42 64 36 114 32 160 C 40 124 58 100 78 104 C 96 110 92 146 68 156 C 52 162 40 156 36 146',
    'M 150 106 C 130 96 108 116 110 140 C 112 160 134 156 146 132 C 148 124 150 112 152 102 C 150 122 148 138 148 150 C 148 162 158 162 168 150',
    'M 222 108 C 208 96 186 108 186 132 C 186 154 206 160 228 144',
    'M 268 22 C 262 70 256 118 252 160',
    'M 306 94 C 290 110 276 120 258 124 C 274 128 290 142 306 156 C 322 166 346 160 380 140',
  ],
} as const;

/** The thin pressure pass: every coordinate nudged by a fixed sine, so it is stable between renders. */
export function jitter(d: string, amount = 2.4) {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) => (Number(n) + Math.sin(++i * 1.7) * amount).toFixed(1));
}
