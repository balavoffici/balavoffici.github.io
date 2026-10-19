import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, SplitText, gsap } from '../core/motion';
import { profile } from '../data/portfolio.data';

declare global {
  interface Window {
    __introSafety?: number;
  }
}

/**
 * Preloader: the name rises in over a 0–100 counter, then the panel wipes
 * upward to uncover the hero. Shown once per session; the inline script in
 * index.html decides by adding `html.intro`.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[class.playing]': 'playing()' },
  template: `
    <div class="intro" #root>
      <div class="inner">
        <p class="role" #role>{{ profile.title }} — Portfolio</p>
        <p class="name" #name>{{ profile.name }}</p>
      </div>
      <div class="foot">
        <span class="count" #count>000</span>
        <div class="line"><span #line></span></div>
      </div>
      <button type="button" class="skip" (click)="skip()" tabindex="-1">Skip</button>
    </div>
  `,
  styles: `
    :host {
      display: none;
    }
    :host-context(html.intro),
    :host(.playing) {
      display: block;
    }
    .intro {
      position: fixed;
      inset: 0;
      z-index: 800;
      display: grid;
      place-items: center;
      background: var(--bg-raise);
      clip-path: inset(0 0 0 0);
    }
    .inner {
      display: grid;
      gap: 16px;
      text-align: center;
      padding: 0 var(--gutter);
    }
    .role {
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
    .name {
      font-family: var(--font-display);
      font-style: italic;
      font-size: clamp(48px, 9vw, 128px);
      line-height: 1;
      color: var(--text);
    }
    .foot {
      position: absolute;
      left: var(--gutter);
      right: var(--gutter);
      bottom: 32px;
      display: grid;
      gap: 12px;
    }
    .count {
      font-family: var(--font-display);
      font-size: clamp(56px, 8vw, 112px);
      line-height: 1;
      color: var(--text);
      font-variant-numeric: tabular-nums;
    }
    .line {
      height: 1px;
      background: var(--line);
    }
    .line span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--teal), var(--amber));
      transform: scaleX(0);
      transform-origin: left;
    }
    .skip {
      position: absolute;
      top: 28px;
      right: var(--gutter);
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-faint);
      transition: color 0.3s;
    }
    .skip:hover {
      color: var(--text);
    }
  `,
})
export class Intro {
  protected readonly profile = profile;
  protected readonly playing = signal(false);

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly role = viewChild.required<ElementRef<HTMLElement>>('role');
  private readonly name = viewChild.required<ElementRef<HTMLElement>>('name');
  private readonly count = viewChild.required<ElementRef<HTMLElement>>('count');
  private readonly line = viewChild.required<ElementRef<HTMLElement>>('line');

  private readonly motion = inject(Motion);
  private timeline?: gsap.core.Timeline;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.motion.start();
      if (!document.documentElement.classList.contains('intro')) {
        this.motion.finishIntro();
        return;
      }
      clearTimeout(window.__introSafety);
      this.playing.set(true);
      try {
        sessionStorage.setItem('bb-intro', '1');
      } catch {}

      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.skip();
      addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => removeEventListener('keydown', onKey));

      this.timeline = this.build();
    });
  }

  protected skip(): void {
    this.timeline?.progress(1, false);
  }

  private build(): gsap.core.Timeline {
    const count = this.count().nativeElement;
    const name = SplitText.create(this.name().nativeElement, { type: 'chars', mask: 'chars' });
    const progress = { v: 0 };
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        name.revert();
        this.playing.set(false);
      },
    });

    tl.from(name.chars, { yPercent: 120, duration: 1.2, stagger: 0.03 }, 0)
      .from(this.role().nativeElement, { autoAlpha: 0, y: 12, duration: 1 }, 0.2)
      .to(progress, {
        v: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => (count.textContent = String(Math.round(progress.v)).padStart(3, '0')),
      }, 0)
      .to(this.line().nativeElement, { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0)
      .to([name.chars, this.role().nativeElement], { yPercent: -120, autoAlpha: 0, duration: 0.6, stagger: 0.01, ease: 'power3.in' }, 2)
      .call(() => this.motion.finishIntro(), undefined, 2.3)
      .to(this.root().nativeElement, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 2.3);

    return tl;
  }
}
