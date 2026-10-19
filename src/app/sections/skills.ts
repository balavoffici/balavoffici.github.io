import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Motion, gsap } from '../core/motion';
import { Reveal, Spotlight } from '../core/directives';
import { Icon } from '../shared/icon';
import { skillGroups } from '../data/portfolio.data';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Spotlight, Icon, DecimalPipe],
  template: `
    <section id="skills" class="scene" #root aria-labelledby="skills-title">
      <div class="container">
        <h2 class="scene-title" id="skills-title" appReveal="chars">Skills &amp; <em>tools</em></h2>
      </div>

      <div class="marquees" aria-hidden="true">
        @for (row of rows; track $index; let odd = $odd) {
          <div class="marquee" [class.reverse]="odd">
            <div class="marquee-track">
              @for (copy of [0, 1]; track copy) {
                @for (s of row; track s) {
                  <span class="m-item">{{ s }}<i>✦</i></span>
                }
              }
            </div>
          </div>
        }
      </div>

      <div class="container">
        <ul class="groups">
          @for (g of groups; track g.title; let i = $index) {
            <li class="group" appSpotlight appReveal [revealDelay]="i * 0.12">
              <div class="g-head">
                <span class="g-icon"><app-icon [name]="g.icon" /></span>
                <span class="g-no">{{ i + 1 | number: '2.0-0' }}</span>
              </div>
              <h3>{{ g.title }}</h3>
              <ul class="list">
                @for (s of g.skills; track s; let j = $index) {
                  <li><span>{{ j + 1 | number: '2.0-0' }}</span>{{ s }}</li>
                }
              </ul>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .scene {
      padding-left: 0;
      padding-right: 0;
    }
    .container {
      max-width: calc(var(--max) + 2 * var(--gutter));
      padding: 0 var(--gutter);
    }
    .marquees {
      display: grid;
      gap: 8px;
      margin: clamp(48px, 7vw, 88px) 0;
      rotate: -2deg;
    }
    .marquee {
      overflow: hidden;
      padding: 10px 0;
      border-block: 1px solid var(--line);
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }
    .marquee.reverse {
      background: var(--amber);
      color: var(--bg);
      border-color: transparent;
    }
    .marquee-track {
      display: flex;
      width: max-content;
    }
    .m-item {
      display: inline-flex;
      align-items: center;
      gap: 28px;
      padding-right: 28px;
      font-family: var(--font-display);
      font-size: clamp(36px, 6vw, 84px);
      line-height: 1.1;
      white-space: nowrap;
    }
    .m-item i {
      font-style: normal;
      font-size: 0.4em;
      color: var(--amber);
    }
    .reverse .m-item {
      font-style: italic;
    }
    .reverse .m-item i {
      color: var(--bg);
    }
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .group {
      position: relative;
      padding: 32px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      overflow: hidden;
      transition:
        border-color 0.4s,
        transform 0.6s var(--ease-out);
    }
    .group:hover {
      border-color: var(--line-strong);
      transform: translateY(-6px);
    }
    .group::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(360px circle at var(--mx, -999px) var(--my, -999px), rgb(67 211 200 / 0.1), transparent 60%);
      pointer-events: none;
    }
    .g-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .g-icon {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: var(--teal-soft);
      color: var(--teal);
    }
    .g-icon ::ng-deep svg {
      width: 22px;
      height: 22px;
    }
    .g-no {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-faint);
    }
    h3 {
      margin-top: 28px;
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 32px;
      line-height: 1.1;
    }
    .list {
      margin-top: 20px;
    }
    .list li {
      display: flex;
      gap: 14px;
      padding: 11px 0;
      border-top: 1px solid var(--line);
      font-size: 15px;
      transition:
        padding 0.4s var(--ease-out),
        color 0.3s;
    }
    .list li:hover {
      padding-left: 8px;
      color: var(--amber);
    }
    .list span {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 2.1;
      color: var(--text-faint);
    }
  `,
})
export class Skills {
  protected readonly groups = skillGroups;
  private readonly all = skillGroups.flatMap((g) => g.skills);
  protected readonly rows = [this.all.slice(0, Math.ceil(this.all.length / 2)), this.all.slice(Math.ceil(this.all.length / 2))];

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced()) return;

      const ctx = gsap.context(() => {
        // Each track holds two copies, so sliding by half its width loops seamlessly
        const loops = gsap.utils.toArray<HTMLElement>('.marquee').map((m) => {
          const reverse = m.classList.contains('reverse');
          return gsap.fromTo(
            m.querySelector('.marquee-track'),
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: 38, ease: 'none', repeat: -1 },
          );
        });

        // Start deep into the loop so a negative timeScale never hits time zero
        loops.forEach((l) => l.totalTime(l.duration() * 1000));

        // Scrolling throttles the marquees up and flips them with direction
        let direction = 1;
        let speed = 1;
        const throttle = () => {
          const v = motion.velocity;
          if (Math.abs(v) > 0.5) direction = Math.sign(v);
          const target = direction * (1 + Math.min(Math.abs(v) * 0.25, 8));
          speed += (target - speed) * 0.08;
          loops.forEach((l) => l.timeScale(speed));
        };
        gsap.ticker.add(throttle);
        return () => gsap.ticker.remove(throttle);
      }, this.root().nativeElement);

      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
