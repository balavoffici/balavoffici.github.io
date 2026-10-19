import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Motion, gsap } from '../core/motion';
import { Reveal } from '../core/directives';
import { projects } from '../data/portfolio.data';

/** Cover colours for each project card, cycled. */
const TONES = [
  { a: '#ff9f45', b: '#1b6f6a' },
  { a: '#43d3c8', b: '#5a2a1a' },
  { a: '#ffcf7a', b: '#253a68' },
  { a: '#ff6b5a', b: '#16403f' },
];

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, DecimalPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly reels = projects.map((p, i) => {
    const [short, ...rest] = p.title.split(' - ');
    return { ...p, short, subtitle: rest.join(' - '), tone: TONES[i % TONES.length], current: p.period.includes('Present') };
  });

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      // Desktop: pin the section and scroll the project cards sideways
      mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.querySelector<HTMLElement>('.track')!;
        const counter = root.querySelector<HTMLElement>('.counter-now')!;
        const bar = root.querySelector<HTMLElement>('.reel-progress span')!;
        const distance = () => track.scrollWidth - innerWidth;

        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              bar.style.transform = `scaleX(${self.progress})`;
              counter.textContent = String(Math.round(self.progress * (this.reels.length - 1)) + 1).padStart(2, '0');
            },
          },
        });

        gsap.utils.toArray<HTMLElement>('.panel').forEach((panel) => {
          const inView = { containerAnimation: pan, trigger: panel, scrub: true };
          gsap.fromTo(
            panel.querySelector('.poster-no'),
            { xPercent: 40 },
            { xPercent: -40, ease: 'none', scrollTrigger: { ...inView, start: 'left right', end: 'right left' } },
          );
          gsap.from(panel.querySelector('.poster'), {
            scale: 0.82,
            rotate: -3,
            ease: 'none',
            scrollTrigger: { ...inView, start: 'left right', end: 'left 35%' },
          });
          gsap.from(panel.querySelectorAll('.details > *'), {
            autoAlpha: 0,
            x: 80,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { ...inView, start: 'left 85%', end: 'left 30%' },
          });
        });

        motion.refresh();
      });

      // Vertical fallback still gets an entrance per card
      mm.add('(max-width: 959px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.panel').forEach((panel) => {
          gsap.from(panel.querySelector('.poster'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: panel, start: 'top 80%' },
          });
          gsap.from(panel.querySelectorAll('.details > *'), {
            autoAlpha: 0,
            y: 30,
            stagger: 0.08,
            scrollTrigger: { trigger: panel, start: 'top 65%' },
          });
        });
      });

      destroyRef.onDestroy(() => mm.revert());
    });
  }
}
