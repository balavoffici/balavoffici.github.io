import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { ScrollEngine, prefersReducedMotion } from './core/motion';
import { CursorComponent } from './fx/cursor.component';
import { IconComponent } from './icon.component';
import { HeaderComponent } from './layout/header.component';
import { profile } from './portfolio.data';
import { AboutComponent } from './sections/about.component';
import { ContactComponent } from './sections/contact.component';
import { EducationComponent } from './sections/education.component';
import { ExperienceComponent } from './sections/experience.component';
import { HeroComponent } from './sections/hero.component';
import { ProjectsComponent } from './sections/projects.component';
import { SkillsComponent } from './sections/skills.component';

@Component({
  selector: 'app-root',
  imports: [
    IconComponent,
    CursorComponent,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    EducationComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');

  protected readonly profile = profile;
  protected readonly year = new Date().getFullYear();
  protected readonly introLetters = [...profile.name];

  constructor() {
    const engine = inject(ScrollEngine);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const bar = this.progress().nativeElement;
      const root = this.document.documentElement;
      const stop = engine.watch(
        () => scrollY / Math.max(root.scrollHeight - innerHeight, 1),
        (value) => bar.style.setProperty('--p', value.toFixed(4)),
      );
      destroyRef.onDestroy(stop);
    });
  }

  /** Click anywhere on the opening titles to jump straight to the page */
  protected skipIntro(event: Event) {
    (event.currentTarget as HTMLElement).classList.add('skip');
    this.document.documentElement.setAttribute('data-intro', 'seen');
  }

  protected toTop(event: Event) {
    event.preventDefault();
    scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
