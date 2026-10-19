import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { skillGroups } from '../portfolio.data';

@Component({
  selector: 'app-skills',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="section">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title" reveal="mask">My <span class="grad-text">toolkit</span></h2>
        </header>
      </div>

      <!-- Two oversized rows drifting in opposite directions; each row is doubled for a seamless loop -->
      <div class="marquees" aria-hidden="true">
        @for (row of rows; track $index; let odd = $odd) {
          <div class="marquee" [class.reverse]="odd">
            @for (copy of [0, 1]; track copy) {
              <ul class="run">
                @for (skill of row; track skill) {
                  <li>{{ skill }}</li>
                }
              </ul>
            }
          </div>
        }
      </div>

      <div class="container groups">
        @for (group of skillGroups; track group.title) {
          <article class="group glass" reveal="up" [revealDelay]="$index * 120">
            <span class="group-icon"><app-icon [name]="group.icon" /></span>
            <h3>{{ group.title }}</h3>
            <ul class="tag-list">
              @for (skill of group.skills; track skill) {
                <li>{{ skill }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .section {
      overflow: clip;
    }

    .marquees {
      display: grid;
      gap: 0.5rem;
      margin-block: 0 clamp(3rem, 6vw, 5rem);
      mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
    }

    .marquee {
      display: flex;
      width: max-content;
    }

    .run {
      display: flex;
      flex-shrink: 0;
    }

    .run li {
      display: flex;
      align-items: center;
      padding-right: clamp(1.5rem, 3vw, 3rem);
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 400;
      font-variant-numeric: lining-nums;
      line-height: 1.2;
      white-space: nowrap;
      color: transparent;
      -webkit-text-stroke: 1px var(--border);
      transition: color 0.4s, -webkit-text-stroke-color 0.4s;
    }

    .run li::after {
      content: '';
      width: 0.12em;
      height: 0.12em;
      margin-left: clamp(1.5rem, 3vw, 3rem);
      border-radius: 50%;
      background: var(--brand);
      color: var(--brand);
      -webkit-text-stroke: 0;
    }

    .marquee:not(.reverse) .run li:nth-child(3n + 1) {
      color: var(--text-2);
      -webkit-text-stroke-color: transparent;
    }

    .reverse .run li:nth-child(3n + 2) {
      font-style: italic;
      background: var(--grad);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-stroke-color: transparent;
    }

    @media (prefers-reduced-motion: no-preference) {
      .marquee {
        animation: slide 90s linear infinite;
      }

      .marquee.reverse {
        animation-direction: reverse;
        animation-duration: 110s;
      }
    }

    @keyframes slide {
      to {
        translate: -50% 0;
      }
    }

    .groups {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
    }

    .group {
      padding: clamp(1.5rem, 3vw, 2rem);
    }

    .group-icon {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1.6rem;
      border: 1px solid var(--hairline);
      border-radius: 50%;
      font-size: 1.1rem;
      color: var(--brand);
    }

    h3 {
      margin-bottom: 1.2rem;
      font-size: 1.7rem;
      font-weight: 500;
    }

    @media (max-width: 900px) {
      .groups {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class SkillsComponent {
  protected readonly skillGroups = skillGroups;
  private readonly all = skillGroups.flatMap((group) => group.skills);
  protected readonly rows = [this.all.slice(0, 9), this.all.slice(9)];
}
