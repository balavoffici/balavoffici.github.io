import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { IconComponent } from './icon.component';
import {
  education,
  experience,
  profile,
  projects,
  sections,
  skillGroups,
  socialLinks,
} from './portfolio.data';

@Component({
  selector: 'app-root',
  imports: [IconComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  readonly currentYear = new Date().getFullYear();
  readonly profile = profile;
  readonly experience = experience;
  readonly projects = projects;
  readonly education = education;
  readonly skillGroups = skillGroups;
  readonly socialLinks = socialLinks;
  readonly sections = sections;
  readonly techCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);
  readonly marquee = skillGroups.flatMap((group) => group.skills);

  readonly currentSection = signal('home');
  readonly emailCopied = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Highlight the nav link of the section crossing the middle of the viewport
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.currentSection.set(entry.target.id);
            }
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );

      for (const section of this.sections) {
        const element = this.document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      }

      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    this.document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

    const menu = this.document.getElementById('mobile-nav');
    if (menu?.matches(':popover-open')) {
      menu.hidePopover();
    }
  }

  // Initial theme is applied by the inline script in index.html
  toggleTheme(event: MouseEvent) {
    const root = this.document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {}
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // Reveal the new theme as a circle growing from the toggle button
    root.style.setProperty('--vt-x', `${event.clientX}px`);
    root.style.setProperty('--vt-y', `${event.clientY}px`);
    this.document.startViewTransition(apply);
  }

  spotlight(event: PointerEvent) {
    // The glow follows a cursor; touch scrolling over a card would only cause style writes
    if (event.pointerType !== 'mouse') {
      return;
    }
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.profile.email);
      this.emailCopied.set(true);
      setTimeout(() => this.emailCopied.set(false), 2000);
    } catch {
      window.location.href = `mailto:${this.profile.email}`;
    }
  }
}
