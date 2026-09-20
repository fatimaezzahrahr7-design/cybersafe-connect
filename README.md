# CyberSafe Connect

**A youth-led digital safety initiative.**

CyberSafe Connect helps young people build real digital safety habits through
honest self-assessment, realistic decision-based scenarios, practical
learning, and tools to turn what they learn into an actual community project.
It's built to be usable in real school workshops, not just browsed as a
static page.

**Live site:** https://fatimaezzahrahr7-design.github.io/cybersafe-connect/

## Description

The core learning loop is: **assess → decide → learn → build.**

1. **Digital Safety Profile** — a 7-question assessment across 7 categories
   (passwords, 2FA, phishing, privacy, public Wi-Fi, suspicious links, AI &
   deepfakes), giving category-specific advice rather than just a score.
   Includes a retake-and-compare feature so users can see improvement between
   attempts.
2. **What Would You Do?** — 8 realistic scenarios young people actually
   encounter (fake bank calls, compromised accounts, impersonation, QR code
   scams, fake scholarships, threats, and more), each with reasoning
   explaining why one response is safer than the others.
3. **Cybersecurity Learning Hub** — 10 topics (passwords & MFA, phishing,
   social media privacy, digital footprints, device security, public Wi-Fi,
   AI scams & deepfakes, online financial safety, cyberbullying, digital
   identity), each with a Learn → Try → Challenge structure.
4. **SDG Connect Project Builder** — generates a real project concept from a
   chosen problem, contribution, partner, and target reach, mapped to
   relevant SDGs and explained through an SDG 17 (Partnerships for the
   Goals) lens.
5. **Youth Cyber Awareness Campaign Builder** — generates a campaign plan
   (audience, topic, format, goal, deliverables) that could be run in
   practice.
6. **For Schools** — explains how the platform can support classroom
   workshops, with a direct contact link for interested educators.
7. **Badges** — light, non-competitive progress recognition (no
   leaderboard) for completing the assessment, scenarios, learning hub, and
   project builder.
8. **Impact section** — deliberately shows honest placeholders rather than
   invented statistics, to be filled in once the platform has real usage
   data from workshops or schools.

## Technologies

- HTML5 (semantic structure, accessibility attributes)
- CSS3 (custom properties/design tokens, Flexbox, Grid, responsive design)
- Vanilla JavaScript (no frameworks, no dependencies)
- Google Fonts (Manrope, Inter)

## How It Works

CyberSafe Connect is a static, client-side application — all logic
(assessment scoring, scenario feedback, learning hub content, project and
campaign generation) runs entirely in the browser. Badges and the
previous-assessment-score comparison are stored locally in the browser via
`localStorage`, so nothing is transmitted anywhere. No personal data is
collected, and no backend or database is currently in use.

## Data & Privacy

The platform currently collects no personal data and has no backend. The
"Impact" section intentionally shows placeholders rather than real numbers
until the platform is used at real scale (e.g. in school workshops), at
which point a minimal, privacy-conscious data layer (anonymous session data
only — no names, no contact info) could be added.

## How to Run Locally

1. Clone or download this repository.
2. Open the project folder in a code editor (e.g. VS Code).
3. Open `index.html` directly in a browser, or use a local development
   server such as the VS Code "Live Server" extension for auto-reloading.

## How to Deploy

Deployed as a static site via **GitHub Pages**:

1. Push the project to the `main` branch of this repository.
2. In repository Settings → Pages, set Source to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
3. GitHub publishes the site automatically and provides the public URL.
4. Any future push to `main` redeploys the live site automatically.

## Future Improvements

- Optional lightweight backend (e.g. Supabase) for real anonymous aggregate
  data collection, once the platform has genuine workshop or school usage
- Downloadable/printable versions of generated SDG and campaign project
  concepts
- Additional scenario and learning hub content
- Multi-language support

---

CyberSafe Connect — a youth cybersecurity and collaboration concept.
Founded by Fatimaezzahra Hrimech.