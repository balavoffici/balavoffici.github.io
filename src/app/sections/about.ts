import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { Motion, SplitText, gsap } from '../core/motion';
import { Reveal } from '../core/directives';
import { experience, profile, projects, skillGroups } from '../data/portfolio.data';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section id="about" class="scene" #root aria-labelledby="about-title">
      <div class="container">
        <h2 class="scene-title" id="about-title" appReveal="chars">About <em>me</em></h2>

        <div class="grid">
          <figure class="photo">
            <div class="frame">
              <picture>
                <source [srcset]="profile.aboutPhoto.avif" type="image/avif" />
                <img
                  [src]="profile.aboutPhoto.jpg"
                  [width]="profile.aboutPhoto.width"
                  [height]="profile.aboutPhoto.height"
                  alt="{{ profile.name }} at work"
                  loading="lazy"
                />
              </picture>
            </div>
            <figcaption>{{ profile.location }}</figcaption>
          </figure>

          <div class="copy">
            <p class="story">{{ profile.about }}</p>

            <dl class="stats">
              @for (s of stats; track s.label) {
                <div class="stat" appReveal>
                  <dt>{{ s.label }}</dt>
                  <dd>
                    <span class="value" [attr.data-value]="s.value">{{ s.value }}</span><span class="suffix">{{ s.suffix }}</span>
                  </dd>
                </div>
              }
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: minmax(240px, 0.8fr) 1.4fr;
      gap: clamp(32px, 6vw, 96px);
      margin-top: clamp(48px, 8vw, 96px);
      align-items: start;
    }
    .photo {
      position: sticky;
      top: calc(var(--header-h) + 32px);
    }
    .frame {
      aspect-ratio: 664 / 1120;
      max-height: 72svh;
      overflow: hidden;
      border-radius: 6px;
      background: var(--bg-raise);
    }
    .frame img {
      width: 100%;
      height: 118%;
      object-fit: cover;
      filter: grayscale(0.4) contrast(1.05);
    }
    figcaption {
      margin-top: 14px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-faint);
    }
    .story {
      font-family: var(--font-display);
      font-size: clamp(28px, 3.3vw, 48px);
      line-height: 1.18;
      letter-spacing: -0.01em;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      margin: clamp(48px, 7vw, 88px) 0 0;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .stat {
      display: flex;
      flex-direction: column-reverse;
      gap: 6px;
      padding: 28px;
      background: var(--bg);
    }
    dt {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
    dd {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(48px, 6vw, 80px);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .suffix {
      color: var(--amber);
    }
    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .photo {
        position: relative;
        top: 0;
        max-width: 420px;
      }
    }
  `,
})
export class About {
  protected readonly profile = profile;
  protected readonly stats = [
    { label: 'Years of experience', value: parseInt(profile.experience, 10), suffix: '+' },
    { label: 'Major projects', value: projects.length, suffix: '' },
    { label: 'Roles held', value: experience.length, suffix: '' },
    { label: 'Technologies', value: skillGroups.flatMap((g) => g.skills).length, suffix: '' },
  ];

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced()) return;

      const ctx = gsap.context(() => {
        // Words brighten as the reader scrolls through them
        const split = SplitText.create('.story', { type: 'words' });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top 80%', end: 'bottom 40%', scrub: true } },
        );

        gsap.fromTo(
          '.frame img',
          { yPercent: -12 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.grid', start: 'top bottom', end: 'bottom top', scrub: true } },
        );
        gsap.from('.frame', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.frame', start: 'top 80%' } });

        gsap.utils.toArray<HTMLElement>('.value').forEach((el) => {
          const counter = { v: 0 };
          el.textContent = '0';
          gsap.to(counter, {
            v: Number(el.dataset['value']),
            duration: 2.2,
            ease: 'power3.out',
            snap: { v: 1 },
            onUpdate: () => (el.textContent = String(counter.v)),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      }, this.root().nativeElement);

      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
