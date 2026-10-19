# Balavenkatesh B · Portfolio

Personal portfolio of Balavenkatesh B, Full Stack Developer at Tata Consultancy Services with 7+ years of experience building scalable web applications with Angular, Node.js, MongoDB, MySQL and MS SQL Server.

**Live:** [balavoffici.github.io](https://balavoffici.github.io)

## Highlights

- **Preloader**: the name rises in over a 0–100 counter, then the panel wipes away to reveal the hero (once per session; `Esc` skips)
- **Live WebGL background**: drifting haze in orange and teal with a soft light that follows the pointer
- **Scroll-driven animation**: the hero lifts away, the About text brightens word by word, stats count up, and experience cards swing in along a timeline that draws itself
- **Projects**: on desktop, the section pins and the project cards scroll sideways with parallax inside each card
- **Skills marquees** that speed up and change direction with your scroll
- Live Chennai local time in the header, a scroll progress bar, a custom cursor, magnetic buttons and subtle grain

Everything degrades gracefully. With *Reduce Motion* on, there's no preloader and no smooth scroll, every section is laid out statically, and projects become a vertical list.

## Tech

- **Angular 22**: standalone components, signals, signal-based `viewChild`/`input`, zoneless change detection, built-in control flow
- **Static prerendering (SSG)** with client hydration and event replay: full HTML on first paint, crawlable, works without JS
- **[GSAP 3](https://gsap.com)** with ScrollTrigger, SplitText and ScrambleText for every timeline and scroll-scrubbed move
- **[Lenis](https://lenis.darkroom.engineering)** smooth scrolling, driven from GSAP's ticker so both share one clock
- **Raw WebGL** fragment shader (no 3D library) rendered at reduced resolution and paused in background tabs
- Self-hosted Geist, Geist Mono and Instrument Serif fonts

## Project structure

```
src/
  index.html             SEO tags, structured data, pre-paint preloader script
  styles.css             design tokens, base styles, buttons, grain
  app/
    app.*                shell: layers the preloader, background, header and sections
    data/                portfolio.data.ts — all content (+ spec)
    core/                Motion service (GSAP + Lenis) and directives: reveal, scramble, magnetic, spotlight
    fx/                  preloader, WebGL background, cursor
    layout/              header, local-time clock, mobile menu
    sections/            one component per page section
    shared/              icon set
public/                  images, résumé, favicon, robots.txt, sitemap.xml
```

To update text, experience or projects, edit `src/app/data/portfolio.data.ts`.

## Development

```bash
npm ci          # install
npm start       # dev server at http://localhost:4200
npm test        # unit tests (Vitest)
npm run build   # static, prerendered site in dist/profile_2.0/browser
```

To replay the preloader, open a new tab or clear `bb-intro` from session storage.

Pushes are built and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Contact

- **Email:** balavenkatesh1997@gmail.com
- **Phone:** +91 86674 90991
- **Location:** Chennai, Tamil Nadu
- **LinkedIn:** [linkedin.com/in/balavoffici](https://linkedin.com/in/balavoffici)
- **GitHub:** [github.com/balavoffici](https://github.com/balavoffici)
- **Instagram:** [instagram.com/balavoffici](https://instagram.com/balavoffici)
- **WhatsApp:** [+91 86674 90991](https://wa.me/918667490991)
