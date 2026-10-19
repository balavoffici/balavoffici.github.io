import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Motion, ScrollTrigger, gsap } from '../core/motion';
import { Magnetic } from '../core/directives';
import { Icon } from '../shared/icon';
import { profile, sections } from '../data/portfolio.data';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Magnetic, Icon, DecimalPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { '[class.hidden]': 'hidden()', '[class.open]': 'menuOpen()' },
})
export class Header {
  protected readonly profile = profile;
  protected readonly sections = sections;
  protected readonly active = signal('home');
  protected readonly hidden = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly time = signal('');

  private readonly clock = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
  private readonly motion = inject(Motion);
  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');
  private readonly overlay = viewChild.required<ElementRef<HTMLElement>>('overlay');
  private readonly menuLinks = viewChildren<ElementRef<HTMLElement>>('menuLink');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.motion.start();

      // Which scene is on screen — the band across the middle of the viewport decides
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && this.active.set(e.target.id)),
        { rootMargin: '-45% 0px -50% 0px' },
      );
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      // Hide on the way down, return on the way up
      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          this.progress().nativeElement.style.transform = `scaleX(${self.progress})`;
          if (!this.menuOpen()) this.hidden.set(self.direction === 1 && self.scroll() > 240);
        },
      });

      // Local time where I work, so visitors can tell whether it's office hours
      const tick = () => this.time.set(this.clock.format(new Date()));
      tick();
      const timer = setInterval(tick, 15_000);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        trigger.kill();
        clearInterval(timer);
      });
    });
  }

  protected go(event: Event, id: string): void {
    event.preventDefault();
    const navigate = () => this.motion.scrollTo(`#${id}`);
    if (this.menuOpen()) {
      this.toggleMenu();
      setTimeout(navigate, 500);
    } else {
      navigate();
    }
  }

  protected toggleMenu(): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    this.motion.lock(open);
    if (this.motion.reduced()) return;

    const overlay = this.overlay().nativeElement;
    const links = this.menuLinks().map((l) => l.nativeElement);
    gsap.killTweensOf([overlay, ...links]);
    if (open) {
      gsap.fromTo(overlay, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 120 }, { yPercent: 0, duration: 1, stagger: 0.06, delay: 0.35 });
    } else {
      gsap.to(overlay, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' });
    }
  }
}
