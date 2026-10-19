import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { experience, profile } from '../portfolio.data';

@Component({
  selector: 'app-about',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title" reveal="mask">Building software that <span class="grad-text">just works</span>.</h2>
        </header>

        <div class="layout">
          <figure class="portrait" reveal="zoom" data-cursor="Hello">
            <picture>
              <source [srcset]="profile.aboutPhoto.avif" type="image/avif">
              <img [src]="profile.aboutPhoto.jpg" [alt]="'Portrait of ' + profile.name" loading="lazy" decoding="async"
                [width]="profile.aboutPhoto.width" [height]="profile.aboutPhoto.height">
            </picture>
          </figure>

          <div class="story">
            <p class="lit" scrollProgress [style.--n]="words.length">
              @for (word of words; track $index) {
                <span class="w" [style.--i]="$index">{{ word }}</span>{{ ' ' }}
              }
            </p>

            <div class="facts">
              <article class="fact glass" reveal [revealDelay]="0">
                <app-icon name="briefcase" class="fact-icon" />
                <strong>{{ current.title }}</strong>
                <span>at {{ current.company }}</span>
              </article>
              <article class="fact glass" reveal [revealDelay]="120">
                <app-icon name="pin" class="fact-icon" />
                <strong>{{ profile.location }}</strong>
                <span>Based in India</span>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
      gap: clamp(2rem, 6vw, 6rem);
      align-items: start;
    }

    .portrait {
      position: sticky;
      top: 7rem;
      overflow: hidden;
      border-radius: var(--radius);
      /* Matches the photo's own backdrop so its edges disappear */
      background: #faf9f7;
      box-shadow: var(--shadow);
    }

    .portrait picture {
      display: contents;
    }

    .portrait img {
      width: 100%;
      height: auto;
      transition: scale 1.2s var(--ease-out);
    }

    @media (hover: hover) {
      .portrait:hover img {
        scale: 1.05;
      }
    }

    /* Each word brightens as the paragraph scrolls through the viewport (--p from scrollProgress) */
    .lit {
      --lit: calc((var(--p, 1) - 0.12) / 0.42);
      font-family: var(--font-display);
      font-variant-numeric: lining-nums;
      font-size: clamp(1.25rem, 2.2vw, 1.8rem);
      font-weight: 300;
      line-height: 1.55;
      letter-spacing: -0.015em;
    }

    /* Unlit words use --text-3, which still meets contrast, so the paragraph stays readable throughout */
    .w {
      color: color-mix(in oklab, var(--text) calc(clamp(0, var(--lit) * var(--n) - var(--i) + 1, 1) * 100%), var(--text-3));
      transition: color 0.2s linear;
    }

    @media (prefers-reduced-motion: reduce) {
      .w {
        color: var(--text);
      }
    }

    .facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-top: clamp(2.5rem, 5vw, 3.5rem);
    }

    .fact {
      display: grid;
      gap: 0.3rem;
      padding: 1.5rem;
    }

    .fact-icon {
      margin-bottom: 1.4rem;
      font-size: 1.2rem;
      color: var(--brand);
    }

    .fact strong {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1.3;
    }

    .fact span {
      color: var(--text-3);
      font-size: 0.92rem;
    }

    @media (max-width: 860px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .portrait {
        position: relative;
        top: 0;
        width: min(380px, 100%);
        justify-self: center;
      }
    }

    @media (max-width: 480px) {
      .facts {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AboutComponent {
  protected readonly profile = profile;
  protected readonly current = experience[0];
  protected readonly words = profile.about.split(/\s+/);
}
