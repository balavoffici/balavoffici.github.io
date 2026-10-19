import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { experience } from '../portfolio.data';

@Component({
  selector: 'app-experience',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="section">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title" reveal="mask">Where I’ve <span class="grad-text">worked</span></h2>
          <p class="section-lede" reveal="blur" [revealDelay]="150">
            From trainee to System Engineer — building Angular and Node.js products end to end.
          </p>
        </header>

        <ol class="timeline" scrollProgress>
          @for (job of experience; track job.title + job.period; let i = $index) {
            <li class="item" reveal="right">
              <span class="node" aria-hidden="true"></span>
              <article class="card glass">
                <div class="top">
                  <span class="chip">{{ job.period }}</span>
                  @if (i === 0) {
                    <span class="now"><span class="now-dot"></span>Current</span>
                  }
                </div>
                <h3 class="role">{{ job.title }}</h3>
                <p class="meta">
                  <strong>{{ job.company }}</strong>
                  <span class="where"><app-icon name="pin" />{{ job.location }}</span>
                </p>
                <ul class="bullet-list">
                  @for (item of job.responsibilities; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </article>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .timeline {
      position: relative;
      display: grid;
      gap: 1.75rem;
      max-width: 940px;
      padding-left: clamp(2.25rem, 5vw, 3.5rem);
    }

    /* Rail, and the beam drawn over it as the list scrolls through (--p) */
    .timeline::before,
    .timeline::after {
      content: '';
      position: absolute;
      left: 0.6rem;
      top: 0.5rem;
      bottom: 0.5rem;
      width: 1px;
      background: var(--border-strong);
    }

    .timeline::after {
      background: var(--brand);
      transform-origin: top;
      transform: scaleY(clamp(0, calc((var(--p, 1) - 0.2) * 1.9), 1));
    }

    .item {
      position: relative;
    }

    .node {
      position: absolute;
      left: calc(-1 * clamp(2.25rem, 5vw, 3.5rem) + 0.6rem + 0.5px);
      top: 2.2rem;
      width: 0.6rem;
      height: 0.6rem;
      translate: -50% 0;
      border-radius: 50%;
      background: var(--border-strong);
      transition: background-color 0.6s 0.3s, box-shadow 0.6s 0.3s;
    }

    .item.in .node {
      background: var(--brand);
      box-shadow: 0 0 0 5px var(--bg), 0 0 0 6px var(--hairline);
    }

    .card {
      padding: clamp(1.4rem, 3vw, 2.1rem);
    }

    .top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
    }

    .now {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.68rem;
      font-weight: 400;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--brand);
    }

    .now-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    .role {
      margin-top: 1.1rem;
      font-size: clamp(1.7rem, 3vw, 2.3rem);
      font-weight: 500;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem 1rem;
      margin: 0.5rem 0 1.25rem;
      font-size: 0.95rem;
      color: var(--text-3);
    }

    .meta strong {
      color: var(--text-2);
      font-weight: 600;
    }

    .where {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      .timeline::after {
        transform: none;
      }
    }

    @media (max-width: 560px) {
      .timeline {
        padding-left: 1.85rem;
      }

      .timeline::before,
      .timeline::after {
        left: 0.35rem;
      }

      .node {
        left: calc(-1.85rem + 0.35rem + 0.5px);
      }
    }
  `,
})
export class ExperienceComponent {
  protected readonly experience = experience;
}
