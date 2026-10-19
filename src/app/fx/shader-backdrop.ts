import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { Motion, ScrollTrigger } from '../core/motion';

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Drifting haze in the site palette (orange & teal), a soft light that
// trails the pointer with a thin horizontal flare through it. The colours
// warm gradually as the page scrolls.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.035;

  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 4.7));
  float n = fbm(p * 1.7 + q * 1.8 + vec2(0.0, -uScroll * 1.2));

  vec2 lp = (uPointer - 0.5) * vec2(aspect, 1.0);
  float d = length(p - lp);
  float key = exp(-d * 2.4);
  float streak = exp(-abs(p.y - lp.y) * 38.0) * exp(-abs(p.x - lp.x) * 0.9);

  vec3 base = vec3(0.016, 0.018, 0.022);
  vec3 teal = vec3(0.04, 0.26, 0.28);
  vec3 amber = vec3(1.0, 0.52, 0.18);

  vec3 col = mix(base, teal, smoothstep(0.35, 0.95, n) * 0.85);
  col += amber * key * (0.22 + 0.28 * n);
  col += vec3(0.45, 0.7, 1.0) * streak * 0.16;
  col = mix(col, col * vec3(1.25, 0.95, 0.8), uScroll * 0.8);

  float vig = smoothstep(1.2, 0.2, length(uv - 0.5) * 1.35);
  col *= vig;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

@Component({
  selector: 'app-shader-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 70% 30%, rgb(67 211 200 / 0.08), transparent 60%), var(--bg);
    }
    canvas {
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 2.4s ease;
    }
    canvas.live {
      opacity: 1;
    }
  `,
})
export class ShaderBackdrop {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      const canvas = this.canvas().nativeElement;
      const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) return; // the CSS gradient on :host is the fallback

      const program = link(gl, VERT, FRAG);
      if (!program) return;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'uRes');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uPointer = gl.getUniformLocation(program, 'uPointer');
      const uScroll = gl.getUniformLocation(program, 'uScroll');

      // The haze is soft, so rendering under native resolution is invisible and much cheaper
      const resize = () => {
        const scale = Math.min(devicePixelRatio, 1) * 0.6;
        canvas.width = Math.round(innerWidth * scale);
        canvas.height = Math.round(innerHeight * scale);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
      };
      resize();

      const target = { x: 0.72, y: 0.62 };
      const pointer = { ...target };
      const onPointer = (e: PointerEvent) => {
        target.x = e.clientX / innerWidth;
        target.y = 1 - e.clientY / innerHeight;
      };

      const start = performance.now();
      let raf = 0;
      const frame = () => {
        pointer.x += (target.x - pointer.x) * 0.04;
        pointer.y += (target.y - pointer.y) * 0.04;
        const max = ScrollTrigger.maxScroll(window) || 1;
        gl.uniform1f(uTime, (performance.now() - start) / 1000);
        gl.uniform2f(uPointer, pointer.x, pointer.y);
        gl.uniform1f(uScroll, Math.min(scrollY / max, 1));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!motion.reduced()) raf = requestAnimationFrame(frame);
      };

      const onVisibility = () => {
        cancelAnimationFrame(raf);
        if (!document.hidden) frame();
      };

      frame();
      requestAnimationFrame(() => canvas.classList.add('live'));
      addEventListener('resize', resize);
      addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        removeEventListener('resize', resize);
        removeEventListener('pointermove', onPointer);
        document.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }
}

function link(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const program = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}
