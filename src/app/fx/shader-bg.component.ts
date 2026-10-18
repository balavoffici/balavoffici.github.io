import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../core/motion';

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Domain-warped fractal noise ("nebula") tinted with the theme's --fx-* colours, pulled toward the cursor
const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBg, uC1, uC2, uC3;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.045;

  p += (m - p) * 0.12 * smoothstep(1.1, 0.0, length(p - m));

  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 3.1));
  vec2 r = vec2(fbm(p * 1.5 + 2.0 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.5 + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.2 * r);

  vec3 col = mix(uBg, uC1, smoothstep(0.2, 0.9, f));
  col = mix(col, uC2, smoothstep(0.4, 1.05, length(q)) * 0.8);
  col = mix(col, uC3, smoothstep(0.5, 1.0, r.x) * 0.55);
  col += uC2 * 0.22 * exp(-5.0 * length(p - m));

  float vignette = smoothstep(1.45, 0.15, length(p * vec2(0.8, 1.0)));
  col = mix(uBg, col, vignette * (0.35 + 0.65 * uv.y));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Full-bleed animated WebGL background for the hero. Loaded lazily via @defer. */
@Component({
  selector: 'app-shader-bg',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: block;
      opacity: 0;
      transition: opacity 1.6s ease;
    }

    :host(.ready) {
      opacity: 1;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
})
export class ShaderBgComponent {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const document = inject(DOCUMENT);
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) {
        return; // CSS gradient behind the canvas stays as the fallback
      }

      const program = createProgram(gl);
      if (!program) {
        return;
      }
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const uRes = uniform('uRes');
      const uTime = uniform('uTime');
      const uMouse = uniform('uMouse');

      const applyColors = () => {
        const styles = getComputedStyle(host);
        for (const [name, token] of [['uBg', '--fx-bg'], ['uC1', '--fx-1'], ['uC2', '--fx-2'], ['uC3', '--fx-3']]) {
          gl.uniform3fv(uniform(name), toRgb(styles.getPropertyValue(token)));
        }
      };
      applyColors();

      // Soft nebula hides upscaling, so render at half resolution to spare mobile GPUs
      const resize = () => {
        const scale = Math.min(devicePixelRatio, 1.5) * 0.5;
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
      };
      resize();

      const mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 };
      const onPointer = (event: PointerEvent) => {
        mouse.tx = event.clientX / innerWidth;
        mouse.ty = 1 - event.clientY / innerHeight;
      };

      const reduced = prefersReducedMotion();
      const frameBudget = hasFinePointer() ? 0 : 1000 / 30; // cap touch devices at 30fps
      const started = performance.now();
      let frame = 0;
      let lastDraw = 0;
      let visible = true;

      const draw = (now: number) => {
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        gl.uniform1f(uTime, reduced ? 12 : (now - started) / 1000);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (now - lastDraw >= frameBudget) {
          lastDraw = now;
          draw(now);
        }
      };

      const start = () => {
        if (!frame && visible && !reduced && document.visibilityState === 'visible') {
          frame = requestAnimationFrame(loop);
        }
      };
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };

      draw(performance.now());
      host.classList.add('ready');
      start();

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      });
      io.observe(host);

      const ro = new ResizeObserver(() => {
        resize();
        draw(performance.now());
      });
      ro.observe(canvas);

      const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
      document.addEventListener('visibilitychange', onVisibility);
      if (!reduced) {
        addEventListener('pointermove', onPointer, { passive: true });
      }

      // Re-tint when the theme flips
      const themeObserver = new MutationObserver(() => {
        applyColors();
        draw(performance.now());
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      destroyRef.onDestroy(() => {
        stop();
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        removeEventListener('pointermove', onPointer);
      });
    });
  }
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) {
    return null;
  }
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** Any CSS colour (hex, oklch, …) → linear 0–1 RGB, by letting a 1px 2D canvas resolve it */
function toRgb(color: string): [number, number, number] {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) {
    return [0, 0, 0];
  }
  ctx.fillStyle = color.trim() || '#000';
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}
