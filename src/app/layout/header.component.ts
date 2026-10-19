import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { MagneticDirective } from '../core/directives';
import { ScrollEngine, prefersReducedMotion } from '../core/motion';
import { IconComponent } from '../icon.component';
import { profile, sections } from '../portfolio.data';

@Component({
  selector: 'app-header',
  imports: [IconComponent, MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'banner',
    '[class.tucked]': 'tucked()',
    '[class.scrolled]': 'scrolled()',
  },
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly profile = profile;
  protected readonly links = sections.filter((section) => section.id !== 'home');
  protected readonly current = signal('home');
  protected readonly tucked = signal(false);
  protected readonly scrolled = signal(false);
  private menuOpen = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const engine = inject(ScrollEngine);

    afterNextRender(() => {
      // Active link: the section crossing the middle of the viewport
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.current.set(entry.target.id);
            }
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const section of sections) {
        const element = this.document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      }

      // Tuck the bar away while scrolling down, bring it back on any scroll up
      let lastY = scrollY;
      const stop = engine.watch(
        () => scrollY,
        (y) => {
          const delta = y - lastY;
          if (Math.abs(delta) > 6) {
            this.tucked.set(delta > 0 && y > 320 && !this.menuOpen);
            lastY = y;
          }
          this.scrolled.set(y > 24);
        },
      );

      destroyRef.onDestroy(() => {
        observer.disconnect();
        stop();
      });
    });
  }

  protected go(event: Event, id: string) {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    const menu = this.document.getElementById('menu');
    if (menu?.matches(':popover-open')) {
      menu.hidePopover();
    }
  }

  protected onMenuToggle(event: ToggleEvent) {
    this.menuOpen = event.newState === 'open';
    this.document.documentElement.classList.toggle('menu-open', this.menuOpen);
  }

  // Initial theme comes from the inline script in index.html
  protected toggleTheme(event: MouseEvent) {
    const root = this.document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {}
    };

    if (!this.document.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }
    root.style.setProperty('--vt-x', `${event.clientX}px`);
    root.style.setProperty('--vt-y', `${event.clientY}px`);
    this.document.startViewTransition(apply);
  }
}
