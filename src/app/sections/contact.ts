import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, gsap } from '../core/motion';
import { Magnetic, Reveal } from '../core/directives';
import { Icon } from '../shared/icon';
import { profile, socialLinks } from '../data/portfolio.data';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Magnetic, Reveal, Icon],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly profile = profile;
  protected readonly socials = socialLinks;
  protected readonly year = new Date().getFullYear();
  protected readonly copied = signal(false);
  protected readonly motion = inject(Motion);

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.motion.start();
      if (this.motion.reduced()) return;

      const ctx = gsap.context(() => {
        // The footer wordmark rises into place as the page bottoms out
        gsap.fromTo(
          '.wordmark',
          { yPercent: 60, autoAlpha: 0, filter: 'blur(12px)' },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        );
        gsap.from('.social', {
          scale: 0,
          rotate: -90,
          duration: 1.2,
          ease: 'back.out(1.6)',
          stagger: 0.08,
          scrollTrigger: { trigger: '.socials', start: 'top 92%' },
        });
      }, this.root().nativeElement);

      destroyRef.onDestroy(() => ctx.revert());
    });
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(profile.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  }
}
