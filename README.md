# CyberSafe Connect

**Safer digital communities through youth collaboration.**

CyberSafe Connect is a youth-focused web platform that combines practical
cybersecurity awareness with a collaborative project-building tool inspired
by UN Sustainable Development Goal 17: Partnerships for the Goals.

## Description

The platform is built around two core experiences:

1. **CyberSafe Youth** — an interactive cybersecurity awareness experience,
   including a personalized digital safety assessment, a "spot the scam"
   challenge, and a set of practical learning cards.
2. **SDG Connect** — a project-building tool that lets users combine a
   community problem, a personal contribution, and a potential partner to
   generate a project concept grounded in SDG 17 thinking.

## Features

- **Digital Safety Check** — a 7-question assessment covering passwords,
  two-factor authentication, phishing awareness, privacy settings, public
  Wi-Fi, suspicious links, and app permissions. Generates a safety score,
  a category breakdown, and personalized recommendations.
- **Can You Spot the Scam?** — a 5-round challenge using fictional
  messages, with instant feedback and explanations for each answer.
- **Cybersecurity Learning Cards** — 7 flip-cards covering key digital
  safety topics, each with a practical takeaway.
- **SDG Connect Project Builder** — an interactive tool that generates a
  project concept from a chosen problem, contribution, and partner,
  including an explanation of its SDG 17 connection.
- Fully responsive design, built for desktop and mobile.

## Technologies

- HTML5 (semantic structure)
- CSS3 (custom properties, Flexbox, Grid, responsive design)
- Vanilla JavaScript (no frameworks, no dependencies)
- Google Fonts (Space Grotesk, Inter)

## How It Works

The site is a static, client-side application — all logic (the quiz
scoring, scam challenge, card flipping, and project generation) runs
entirely in the browser using JavaScript, with no backend, database, or
external API. No personal data is collected or stored.

## How to Run Locally

1. Clone or download this repository.
2. Open the project folder in a code editor (e.g. VS Code).
3. Open `index.html` directly in a browser, or use a local development
   server such as the VS Code "Live Server" extension for auto-reloading.

## How to Deploy

This project is deployed as a static site via **GitHub Pages**:

1. Push the project to a GitHub repository.
2. In the repository settings, go to **Pages**.
3. Under "Source," select the `main` branch and the root folder.
4. Save — GitHub will publish the site and provide a public URL.
5. To update the live site after making changes, commit and push the
   updated files to the `main` branch; GitHub Pages redeploys
   automatically.

## Future Improvements

- Expand the learning card library with more topics.
- Add more scam examples across different formats (SMS, social media).
- Allow users to save or export their generated SDG Connect project
  concept.
- Add multi-language support.

---

Built as a youth-led concept combining digital safety, technology, and
social impact.