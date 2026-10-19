import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Cursor } from './fx/cursor';
import { Intro } from './fx/intro';
import { ShaderBackdrop } from './fx/shader-backdrop';
import { Header } from './layout/header';
import { About } from './sections/about';
import { Contact } from './sections/contact';
import { Education } from './sections/education';
import { Experience } from './sections/experience';
import { Hero } from './sections/hero';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Intro, ShaderBackdrop, Cursor, Header, Hero, About, Experience, Projects, Skills, Education, Contact],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
