# Balavenkatesh B · Portfolio

Personal portfolio of Balavenkatesh B, Full Stack Developer at Tata Consultancy Services with 7+ years of experience building scalable web applications with Angular, Node.js, MongoDB, MySQL and MS SQL Server.

**Live:** [balavoffici.github.io](https://balavoffici.github.io)

![Portfolio preview](public/images/portrait.jpg)

## Highlights

- Cinematic opening titles, a live WebGL nebula in the hero, and scroll-driven reveals
- A pinned "film reel" for projects that scrolls sideways as you scroll down
- Dark and light themes with a circular reveal when switching
- Prerendered to static HTML: fast first paint, readable without JavaScript, crawlable by search engines
- Respects *Reduce Motion*, fully keyboard accessible, and laid out for phones through large monitors

## Tech

- **Angular 22**: standalone components, signals, zoneless change detection, `@defer` for the shader and cursor
- **Plain CSS**: custom properties, container queries, the Popover API, `@starting-style`, anchor positioning, View Transitions
- **No animation library**: one shared scroll listener and `IntersectionObserver` drive every effect
- Self-hosted [Geist](https://vercel.com/font) fonts

## Project structure

```
src/
  index.html               SEO tags, structured data, pre-paint theme script
  styles.css               design tokens, base styles, buttons, reveal effects
  app/
    portfolio.data.ts      all content: profile, experience, projects, skills, education
    app.component.*        shell: opening titles, progress bar, footer
    core/                  scroll engine and motion directives (reveal, tilt, magnetic, count-up)
    fx/                    WebGL background and custom cursor (lazy-loaded)
    layout/                header and mobile menu
    sections/              one component per page section
public/                    images, resume, favicon, robots.txt, sitemap.xml
```

To update text, experience or projects, edit `src/app/portfolio.data.ts`.

## Development

```bash
npm ci          # install
npm start       # dev server at http://localhost:4200
npm test        # unit tests
npm run build   # static, prerendered site in dist/profile_2.0/browser
```

Pushes are built and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Contact

- **Email:** balavenkatesh1997@gmail.com
- **Phone:** +91 86674 90991
- **Location:** Chennai, Tamil Nadu
- **LinkedIn:** [linkedin.com/in/balavoffici](https://linkedin.com/in/balavoffici)
- **GitHub:** [github.com/balavoffici](https://github.com/balavoffici)
- **Instagram:** [instagram.com/balavoffici](https://instagram.com/balavoffici)
- **WhatsApp:** [+91 86674 90991](https://wa.me/918667490991)
