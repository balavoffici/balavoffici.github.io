import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { profile, projects, sections } from './portfolio.data';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the name in the hero heading, letter-split but readable', async () => {
    const h1 = (await render()).querySelector('h1')!;
    expect(h1.textContent).toContain(profile.name);
    expect(h1.getAttribute('aria-label')).toBe(profile.name);
  });

  it('renders a card for every project', async () => {
    expect((await render()).querySelectorAll('.project-card').length).toBe(projects.length);
  });

  it('has a target for every navigation link', async () => {
    const page = await render();
    for (const section of sections) {
      expect(page.querySelector(`#${section.id}`)).withContext(section.id).not.toBeNull();
    }
  });
});
