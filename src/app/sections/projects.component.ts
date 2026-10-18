import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { ScrollEngine, prefersReducedMotion } from '../core/motion';
import { projects } from '../portfolio.data';

/** Wide enough for the reel; whether the cards also fit the height is measured, not guessed */
const PIN_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

@Component({
  selector: 'app-projects',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  protected readonly projects = projects.map((project) => ({
    ...project,
    // "SSI - Sales, Stock & Intake" → "SSI", shown as a large backdrop glyph
    glyph: project.title.split(' - ')[0],
    name: project.title.split(' - ')[1] ?? project.title,
  }));

  /** Section pinned and vertical scroll drives the track sideways */
  protected readonly pinned = signal(false);
  /** Carousel arrows: whether there is more to see in each direction */
  protected readonly canPrev = signal(false);
  protected readonly canNext = signal(true);

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly reel = viewChild.required<ElementRef<HTMLElement>>('reel');
  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    const engine = inject(ScrollEngine);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const section = this.section().nativeElement;
      const reel = this.reel().nativeElement;
      const viewport = this.viewport().nativeElement;
      const track = this.track().nativeElement;
      const query = matchMedia(PIN_QUERY);
      let lastDistance = -1;

      const stop = engine.watch(
        () => {
          // Read the pinned layout only once it is actually rendered
          if (!section.classList.contains('pinned')) {
            return { distance: 0, fits: true };
          }
          return {
            // Horizontal travel = how much taller the reel is made, so scrolling maps 1:1
            distance: Math.max(track.scrollWidth - track.clientWidth, 0),
            // Cards taller than the window can't be pinned (their bottoms would be cut off)
            fits: viewport.scrollHeight <= viewport.clientHeight + 1,
          };
        },
        ({ distance, fits }) => {
          if (!fits) {
            this.pinned.set(false);
            return;
          }
          if (distance !== lastDistance) {
            lastDistance = distance;
            reel.style.setProperty('--dist', `${distance}px`);
          }
        },
      );

      // Try pinning again whenever the window size or motion preference changes
      let resizeTimer = 0;
      const evaluate = () => this.pinned.set(query.matches);
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(evaluate, 200);
      };
      evaluate();
      query.addEventListener('change', evaluate);
      addEventListener('resize', onResize, { passive: true });

      const updateArrows = () => {
        this.canPrev.set(track.scrollLeft > 4);
        this.canNext.set(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
      };
      track.addEventListener('scroll', updateArrows, { passive: true });
      updateArrows();

      destroyRef.onDestroy(() => {
        stop();
        clearTimeout(resizeTimer);
        query.removeEventListener('change', evaluate);
        removeEventListener('resize', onResize);
        track.removeEventListener('scroll', updateArrows);
      });
    });

    // Measure (and check the fit) once the pinned/unpinned layout has been rendered
    afterRenderEffect(() => {
      this.pinned();
      engine.refresh();
    });
  }

  /** Carousel mode: step one card left or right */
  protected step(direction: 1 | -1) {
    const track = this.track().nativeElement;
    const card = track.querySelector<HTMLElement>('.project-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * ((card?.offsetWidth ?? track.clientWidth) + gap),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}
