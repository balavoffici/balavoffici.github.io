import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { Motion, SplitText, gsap } from './motion';

type RevealMode = 'lines' | 'words' | 'chars' | 'fade' | 'clip';

/**
 * Scroll-triggered entrance. Text modes split with SplitText and rise each
 * piece out of a mask.
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  readonly mode = input<RevealMode | ''>('', { alias: 'appReveal' });
  readonly delay = input(0, { alias: 'revealDelay' });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced()) return;

      const mode = this.mode() || 'fade';
      const trigger = { trigger: el, start: 'top 88%', once: true };

      if (mode === 'fade' || mode === 'clip') {
        const tween =
          mode === 'fade'
            ? gsap.from(el, { autoAlpha: 0, y: 48, filter: 'blur(8px)', duration: 1.4, delay: this.delay(), scrollTrigger: trigger })
            : gsap.from(el, {
                clipPath: 'inset(100% 0% 0% 0%)',
                scale: 1.15,
                duration: 1.6,
                ease: 'expo.inOut',
                delay: this.delay(),
                scrollTrigger: trigger,
              });
        destroyRef.onDestroy(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        return;
      }

      // Returning the tween from onSplit lets SplitText rebuild it on resize
      const split = SplitText.create(el, {
        type: mode === 'lines' ? 'lines' : `words,${mode}`,
        mask: mode === 'chars' ? 'words' : mode,
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self[mode], {
            yPercent: 115,
            rotate: mode === 'chars' ? 6 : 2,
            duration: 1.3,
            stagger: mode === 'chars' ? 0.025 : 0.08,
            delay: this.delay(),
            scrollTrigger: trigger,
          }),
      });
      destroyRef.onDestroy(() => split.revert());
    });
  }
}

/** Pulls the element toward the pointer, then springs back. */
@Directive({ selector: '[appMagnetic]' })
export class Magnetic {
  readonly strength = input(0.35, { alias: 'appMagnetic', transform: (v: number | '') => (v === '' ? 0.35 : v) });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced() || !matchMedia('(pointer: fine)').matches) return;

      const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * this.strength());
        y((e.clientY - (r.top + r.height / 2)) * this.strength());
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
  }
}

/** Exposes the pointer position as --mx/--my for CSS spotlight effects. */
@Directive({
  selector: '[appSpotlight]',
  host: { '(pointermove)': 'track($event)' },
})
export class Spotlight {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  track(e: PointerEvent): void {
    const r = this.el.getBoundingClientRect();
    this.el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    this.el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
}
