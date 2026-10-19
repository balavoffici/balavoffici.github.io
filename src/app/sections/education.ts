import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/directives';
import { Icon } from '../shared/icon';
import { education } from '../data/portfolio.data';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Icon],
  template: `
    <section id="education" class="scene" aria-labelledby="education-title">
      <div class="container">
        <h2 class="scene-title" id="education-title" appReveal="chars"><em>Education</em></h2>

        <ol class="credits">
          @for (e of education; track e.degree; let i = $index) {
            <li class="row" appReveal [revealDelay]="i * 0.1">
              <span class="type"><app-icon name="graduation" />{{ e.type }}</span>
              <span class="degree">{{ e.degree }}</span>
              <span class="leader" aria-hidden="true"></span>
              <span class="inst">{{ e.institution }}</span>
              <span class="period">{{ e.period }}</span>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .credits {
      margin-top: clamp(48px, 7vw, 88px);
      border-top: 1px solid var(--line);
    }
    .row {
      display: grid;
      grid-template-columns: 180px auto 1fr auto 140px;
      align-items: baseline;
      gap: 24px;
      padding: 32px 0;
      border-bottom: 1px solid var(--line);
      transition: background 0.4s;
    }
    .row:hover {
      background: linear-gradient(90deg, transparent, var(--amber-soft), transparent);
    }
    .type {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
    .type ::ng-deep svg {
      width: 16px;
      height: 16px;
      color: var(--amber);
    }
    .degree {
      font-family: var(--font-display);
      font-size: clamp(28px, 3.2vw, 44px);
      line-height: 1.1;
    }
    /* Dotted leader between degree and institution */
    .leader {
      height: 1px;
      background: repeating-linear-gradient(90deg, var(--line-strong) 0 2px, transparent 2px 8px);
    }
    .inst {
      color: var(--text-dim);
      text-align: right;
    }
    .period {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--amber);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    @media (max-width: 860px) {
      .row {
        grid-template-columns: 1fr auto;
        gap: 8px 16px;
      }
      .type {
        grid-column: 1 / -1;
      }
      .leader {
        display: none;
      }
      .inst {
        grid-column: 1;
        text-align: left;
      }
      .period {
        grid-row: 2;
        grid-column: 2;
      }
    }
  `,
})
export class Education {
  protected readonly education = education;
}
