import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { MOTION } from '../core/directives';
import { introDelayMs, prefersReducedMotion } from '../core/motion';
import { ShaderBgComponent } from '../fx/shader-bg.component';
import { IconComponent } from '../icon.component';
import { heroStack, profile, projects, skillGroups, socialLinks } from '../portfolio.data';

@Component({
  selector: 'app-hero',
  imports: [IconComponent, ShaderBgComponent, ...MOTION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly profile = profile;
  protected readonly socialLinks = socialLinks;
  protected readonly stack = heroStack;
  protected readonly years = parseInt(profile.experience, 10);
  protected readonly projectCount = projects.length;
  protected readonly techCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);

  /** Name split into words of letters; `i` staggers the letters across the whole name */
  protected readonly nameWords = (() => {
    let i = 0;
    return profile.name.split(' ').map((word) => [...word].map((char) => ({ char, i: i++ })));
  })();

  protected readonly word = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion()) {
        return;
      }
      let timer = 0;
      const begin = setTimeout(() => {
        timer = window.setInterval(() => this.word.update((i) => (i + 1) % this.stack.length), 2600);
      }, introDelayMs() + 1400);
      destroyRef.onDestroy(() => {
        clearTimeout(begin);
        clearInterval(timer);
      });
    });
  }

  protected scrollTo(event: Event, id: string) {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
