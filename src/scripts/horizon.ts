// Animated "horizon" backdrop for the hero: a tiny WebGL fragment shader that
// recreates the palette poster (wine → crimson → peach glow → navy) with a
// slowly drifting, noise-warped horizon line. Falls back to the CSS gradient.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;

const vec3 NAVY_900 = vec3(0.086, 0.118, 0.184);
const vec3 NAVY_700 = vec3(0.141, 0.184, 0.286);
const vec3 NAVY_500 = vec3(0.220, 0.263, 0.345);
const vec3 PEACH    = vec3(1.000, 0.647, 0.525);
const vec3 CRIMSON  = vec3(0.710, 0.102, 0.169);
const vec3 WINE     = vec3(0.329, 0.102, 0.180);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.06;

  // Horizon height, gently warped by noise and nudged by the pointer.
  float warp = fbm(vec2(p.x * 1.4 + t, t * 0.7)) - 0.5;
  float horizon = 0.60 + warp * 0.10 + (u_pointer.y - 0.5) * 0.03
                + sin(p.x * 1.7 + t * 2.0) * 0.012;
  float d = uv.y - horizon;

  // Sky: crimson near the horizon, deepening to wine at the top.
  vec3 sky = mix(CRIMSON, WINE, smoothstep(0.0, 0.42, d));
  // Ground: slate just below the horizon, sinking into deep navy.
  vec3 ground = mix(NAVY_500, NAVY_700, smoothstep(0.0, 0.18, -d));
  ground = mix(ground, NAVY_900, smoothstep(0.18, 0.6, -d));
  vec3 col = d > 0.0 ? sky : ground;

  // Peach glow hugging the horizon, softer above than below.
  float spread = d > 0.0 ? 0.075 : 0.045;
  float glow = exp(-abs(d) / spread);
  float shimmer = 0.85 + 0.15 * fbm(vec2(p.x * 3.0 - t * 3.0, uv.y * 8.0));
  col = mix(col, PEACH, glow * 0.85 * shimmer);

  // Soft light bloom following the pointer along the horizon.
  float bloom = exp(-length(vec2((uv.x - u_pointer.x) * aspect, d * 3.0)) * 2.2);
  col += PEACH * bloom * 0.08;

  // Slow-moving haze in the sky for depth.
  float haze = fbm(p * vec2(1.5, 4.0) + vec2(t * 1.5, 0.0));
  col = mix(col, WINE, smoothstep(0.1, 0.5, d) * haze * 0.35);

  // Film grain (also kills gradient banding).
  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export function startHorizon(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uPointer = gl.getUniformLocation(program, 'u_pointer');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };

  const resize = () => {
    // Cap the resolution: the image is soft, so full DPR is wasted fill-rate.
    const scale = Math.min(window.devicePixelRatio, 1.5) * 0.75;
    const w = Math.round(canvas.clientWidth * scale);
    const h = Math.round(canvas.clientHeight * scale);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    },
    { passive: true },
  );

  // Single rAF loop; paused while the hero is off-screen.
  let raf = 0;
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
  }).observe(canvas);

  const start = performance.now();
  let first = true;

  function frame(now: number) {
    raf = 0;
    resize();
    pointer.x += (target.x - pointer.x) * 0.04;
    pointer.y += (target.y - pointer.y) * 0.04;
    const time = reducedMotion.matches ? 12 : (now - start) / 1000;

    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.uniform1f(uTime, time);
    gl!.uniform2f(uPointer, pointer.x, pointer.y);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    if (first) {
      canvas.classList.add('is-ready');
      first = false;
    }
    if (visible && !reducedMotion.matches) schedule();
  }

  schedule();
  window.addEventListener('resize', schedule);
}
