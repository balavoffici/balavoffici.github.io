import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { Motion, SplitText, gsap } from '../core/motion';
import { Magnetic } from '../core/directives';
import { Icon } from '../shared/icon';
import { heroStack, profile } from '../data/portfolio.data';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Magnetic, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly profile = profile;
  // The first word is repeated at the end so the loop wraps seamlessly
  protected readonly stack = [...heroStack, heroStack[0]];

  protected readonly motion = inject(Motion);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.motion.start();
      const ctx = gsap.context(() => this.animate(), this.root().nativeElement);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }

  private animate(): void {
    const html = document.documentElement;
    if (this.motion.reduced()) {
      html.classList.add('hero-ready');
      return;
    }

    const name = SplitText.create('.name-line', { type: 'chars', mask: 'chars' });

    // Built paused: the from-states apply immediately, then the gate lifts
    const entrance = gsap
      .timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from(name.chars, { yPercent: 115, rotate: 8, duration: 1.6, stagger: 0.035 }, 0)
      .from('.portrait', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }, 0.1)
      .from('.portrait img', { scale: 1.5, duration: 2.4 }, 0.1)
      .from('[data-enter="fade"]', { autoAlpha: 0, y: 30, filter: 'blur(6px)', duration: 1.4, stagger: 0.1 }, 0.6)
      .from('[data-enter="line"]', { scaleX: 0, transformOrigin: 'left', duration: 1.6 }, 0.4);

    html.classList.add('hero-ready');
    this.motion.introDone.then(() => entrance.play());

    // Rotating tech word in the subtitle
    const words = gsap.utils.toArray<HTMLElement>('.stack-word');
    const cycle = gsap.timeline({ repeat: -1, delay: 2.5 });
    words.slice(1).forEach((_, i) => {
      cycle.to('.stack-track', { yPercent: (-100 * (i + 1)) / words.length, duration: 0.9, ease: 'expo.inOut' }, `+=${1.6}`);
    });
    cycle.set('.stack-track', { yPercent: 0 });

    // Scroll-out: the title lifts away and the portrait recedes
    gsap
      .timeline({ scrollTrigger: { trigger: this.root().nativeElement, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.name', { yPercent: -35, ease: 'none' }, 0)
      .to('.portrait', { yPercent: 18, scale: 0.88, ease: 'none' }, 0)
      .to('.portrait img', { scale: 1.25, ease: 'none' }, 0)
      .to('.hero-inner', { autoAlpha: 0, ease: 'power1.in' }, 0);
  }
}
