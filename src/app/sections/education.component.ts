import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { education } from '../portfolio.data';

@Component({
  selector: 'app-education',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="education" class="section">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title" reveal="mask"><span class="grad-text">Education</span></h2>
        </header>

        <ol class="cards">
          @for (item of education; track item.degree) {
            <li class="card glass" tilt reveal="up" [revealDelay]="$index * 120">
              <div class="top">
                <span class="icon"><app-icon name="cap" /></span>
                <span class="chip">{{ item.period }}</span>
              </div>
              <p class="type">{{ item.type }}</p>
              <h3>{{ item.degree }}</h3>
              <p class="school">{{ item.institution }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
    }

    .card {
      padding: clamp(1.5rem, 3vw, 2rem);
    }

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1.6rem;
    }

    .icon {
      display: grid;
      place-items: center;
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 14px;
      font-size: 1.1rem;
      color: var(--brand);
      background: color-mix(in oklab, var(--brand) 14%, transparent);
    }

    .type {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-3);
    }

    h3 {
      margin-top: 0.4rem;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .school {
      margin-top: 0.4rem;
      color: var(--text-2);
      font-size: 0.95rem;
    }

    @media (max-width: 900px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class EducationComponent {
  protected readonly education = education;
}
