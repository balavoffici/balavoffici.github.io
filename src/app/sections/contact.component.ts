import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MOTION } from '../core/directives';
import { IconComponent } from '../icon.component';
import { profile, socialLinks } from '../portfolio.data';

@Component({
  selector: 'app-contact',
  imports: [IconComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section">
      <div class="container">
        <div class="panel" reveal="zoom">
          <div class="aura" aria-hidden="true"></div>

          <h2 class="title">
            <span class="line" reveal="mask">Let's build something</span>
            <span class="line grad-text" reveal="mask" [revealDelay]="150">great together.</span>
          </h2>
          <p class="text" reveal="blur" [revealDelay]="300">
            Feel free to reach out for any queries or to connect. I'm always happy to help!
          </p>

          <div class="actions" reveal="up" [revealDelay]="420">
            <a class="btn btn-primary btn-xl" [href]="'mailto:' + profile.email" magnetic="0.2">
              <app-icon name="mail" />
              {{ profile.email }}
            </a>
            <button type="button" class="btn btn-ghost btn-xl" magnetic="0.2" (click)="copyEmail()">
              <app-icon [name]="copied() ? 'check' : 'copy'" />
              {{ copied() ? 'Copied!' : 'Copy email' }}
            </button>
          </div>
          <p class="sr-status" role="status">{{ copied() ? 'Email address copied to clipboard' : '' }}</p>

          <ul class="details" reveal="up" [revealDelay]="520">
            <li>
              <a [href]="tel"><app-icon name="phone" />{{ profile.mobile }}</a>
            </li>
            <li><app-icon name="pin" />{{ profile.location }}</li>
          </ul>

          <ul class="socials" reveal="up" [revealDelay]="620">
            @for (link of socialLinks; track link.name) {
              <li>
                <a [href]="link.url" class="social" target="_blank" rel="noopener noreferrer" magnetic="0.3">
                  <app-icon [name]="link.icon" />
                  {{ link.name }}
                  <app-icon name="arrow-up-right" class="out" />
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .panel {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: clamp(3rem, 9vw, 7rem) clamp(1.25rem, 5vw, 4rem);
      border: 1px solid var(--border);
      border-radius: clamp(24px, 4vw, 44px);
      background: var(--bg-elev);
      text-align: center;
      box-shadow: var(--shadow);
    }

    /* Slowly turning conic light behind the copy */
    .aura {
      position: absolute;
      inset: -60% -20%;
      z-index: -1;
      background: conic-gradient(from var(--angle), transparent, color-mix(in oklab, var(--brand) 35%, transparent),
          transparent 30%, color-mix(in oklab, var(--brand-2) 30%, transparent), transparent 60%,
          color-mix(in oklab, var(--brand-3) 25%, transparent), transparent);
      filter: blur(70px);
      opacity: 0.8;
    }

    @media (prefers-reduced-motion: no-preference) {
      .aura {
        animation: turn 18s linear infinite;
      }
    }

    @keyframes turn {
      to {
        --angle: 360deg;
      }
    }

    .title {
      display: grid;
      font-size: clamp(2.4rem, 7.5vw, 6.2rem);
      font-weight: 820;
      letter-spacing: -0.055em;
      line-height: 1;
    }

    .line {
      display: block;
      padding-bottom: 0.06em;
    }

    .text {
      max-width: 34rem;
      margin: 1.5rem auto 0;
      font-size: clamp(1.02rem, 1.6vw, 1.2rem);
      color: var(--text-2);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.8rem;
      margin-top: 2.5rem;
    }

    .btn-xl {
      min-height: 3.75rem;
      padding-inline: 1.9rem;
      font-size: 1.02rem;
    }

    .sr-status {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .details {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem 2rem;
      margin-top: 2rem;
      color: var(--text-2);
    }

    .details li,
    .details a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 2.75rem;
    }

    .details a:hover {
      color: var(--text);
    }

    .socials {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem;
      margin-top: 1.5rem;
    }

    .social {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 2.75rem;
      padding: 0.55rem 1.05rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--glass);
      font-size: 0.92rem;
      font-weight: 500;
    }

    .out {
      font-size: 0.8rem;
      color: var(--text-3);
      transition: translate 0.4s var(--ease-out), color 0.3s;
    }

    @media (hover: hover) {
      .social:hover {
        border-color: var(--brand);
      }

      .social:hover .out {
        translate: 2px -2px;
        color: var(--brand);
      }
    }

    @media (max-width: 560px) {
      .actions .btn {
        flex: 1 1 100%;
        padding-inline: 1.1rem;
        font-size: 0.92rem;
        white-space: normal;
        overflow-wrap: anywhere;
      }
    }
  `,
})
export class ContactComponent {
  protected readonly profile = profile;
  protected readonly socialLinks = socialLinks;
  protected readonly tel = `tel:${profile.mobile.replace(/\s/g, '')}`;
  protected readonly copied = signal(false);

  protected async copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  }
}
