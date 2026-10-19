import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { Motion, ScrollTrigger, gsap } from '../core/motion';
import { Reveal, Spotlight } from '../core/directives';
import { Icon } from '../shared/icon';
import { experience } from '../data/portfolio.data';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Spotlight, Icon],
  template: `
    <section id="experience" class="scene" #root aria-labelledby="experience-title">
      <div class="container">
        <h2 class="scene-title" id="experience-title" appReveal="chars">Work <em>experience</em></h2>
        <p class="intro" appReveal="lines">From software trainee to system engineer, building and shipping enterprise web applications end to end.</p>

        <div class="timeline">
          <div class="rail" aria-hidden="true"><span class="rail-fill"></span></div>
          <ol class="takes">
          @for (job of jobs; track job.title + job.period; let i = $index) {
            <li class="take">
              <span class="marker" aria-hidden="true"></span>
              <article class="card" appSpotlight>
                <header>
                  <span class="take-no">{{ job.company }}</span>
                  <span class="period">{{ job.period }}</span>
                </header>
                <h3>{{ job.title }}</h3>
                <p class="company">
                  <span class="loc"><app-icon name="pin" />{{ job.location }}</span>
                </p>
                <ul>
                  @for (r of job.responsibilities; track r) {
                    <li>{{ r }}</li>
                  }
                </ul>
              </article>
            </li>
          }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: `
    .intro {
      max-width: 520px;
      margin-top: 28px;
      color: var(--text-dim);
      font-size: 18px;
    }
    .timeline {
      position: relative;
      margin-top: clamp(56px, 8vw, 104px);
      padding-left: clamp(40px, 7vw, 120px);
    }
    .takes {
      display: grid;
      gap: clamp(28px, 4vw, 48px);
    }
    .rail {
      position: absolute;
      top: 8px;
      bottom: 8px;
      left: 11px;
      width: 1px;
      background: var(--line);
    }
    .rail-fill {
      position: absolute;
      inset: 0;
      background: linear-gradient(var(--teal), var(--amber));
      transform-origin: top;
      box-shadow: 0 0 12px var(--amber);
    }
    .take {
      position: relative;
      perspective: 1200px;
    }
    .marker {
      position: absolute;
      top: 34px;
      left: calc(-1 * clamp(40px, 7vw, 120px) + 5px);
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid var(--line-strong);
      background: var(--bg);
      transition:
        background 0.5s,
        border-color 0.5s,
        box-shadow 0.5s;
    }
    .take.lit .marker {
      background: var(--amber);
      border-color: var(--amber);
      box-shadow: 0 0 0 6px var(--amber-soft);
    }
    .card {
      position: relative;
      padding: clamp(24px, 3vw, 40px);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      overflow: hidden;
      transform-origin: 0 50%;
    }
    .card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), rgb(255 159 69 / 0.09), transparent 60%);
      pointer-events: none;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px 24px;
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.08em;
      color: var(--text-dim);
    }
    .take-no {
      color: var(--amber);
      text-transform: uppercase;
    }
    h3 {
      margin-top: 18px;
      font-family: var(--font-display);
      font-weight: 400;
      font-size: clamp(30px, 3.6vw, 48px);
      line-height: 1.05;
    }
    .company {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 18px;
      margin-top: 8px;
      font-weight: 500;
    }
    .loc {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 400;
      font-size: 14px;
      color: var(--text-dim);
    }
    .loc ::ng-deep svg {
      width: 14px;
      height: 14px;
    }
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 10px 32px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }
    ul li {
      position: relative;
      padding-left: 20px;
      color: var(--text-dim);
      font-size: 15px;
    }
    ul li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.75em;
      width: 8px;
      height: 1px;
      background: var(--amber);
    }
  `,
})
export class Experience {
  protected readonly jobs = experience;
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced()) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.rail-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: true } },
        );

        gsap.utils.toArray<HTMLElement>('.take').forEach((take) => {
          // Each card swings in on a hinge from its left edge
          gsap.from(take.querySelector('.card'), {
            rotateY: -24,
            x: 80,
            autoAlpha: 0,
            duration: 1.6,
            scrollTrigger: { trigger: take, start: 'top 82%' },
          });
          gsap.from(take.querySelectorAll('ul li'), {
            autoAlpha: 0,
            x: 24,
            duration: 1,
            stagger: 0.06,
            delay: 0.4,
            scrollTrigger: { trigger: take, start: 'top 82%' },
          });
          ScrollTrigger.create({ trigger: take, start: 'top 60%', toggleClass: 'lit' });
        });
      }, this.root().nativeElement);

      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
