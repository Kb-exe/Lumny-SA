# Lumina SA (LUMNY SA) — Grade 12 NSC Learning & Exam Prep

A complete web platform built for South African Grade 12 learners preparing for the National Senior Certificate (NSC) examinations aligned with the Department of Basic Education (DBE) CAPS syllabus.

---

## Features

- **Personalized Learner Dashboard**:
  - Matric finals countdown clock.
  - Enrolled Grade 12 subjects with direct exam prep shortcuts.
  - Daily CAPS exam question challenge with marking guidelines.
  - 25-minute Pomodoro matric focus study timer.
- **Mzansi Tutor AI Engine**:
  - High-yield study summaries from uploaded files (**PDF**, **Word .docx**, **PowerPoint .pptx**, **Images PNG/JPG**, TXT) or pre-loaded CAPS guides.
  - Multi-modal support: directly reads diagrams, geometric shapes, and handwritten exam questions from images using Gemini 3.8 Flash.
  - Long and short questions with official DBE mark breakdowns and marking memos.
  - Interactive Multiple Choice Questions (MCQs) with instant scoring and explanations.
  - Digital Flashcards with 3D flip and active recall mastery tracking.
  - Fill-in-the-gap exercises with hint reveals.
  - South African AI Tutor assistant chat (works online with Gemini API and offline with client-side CAPS knowledge engine).
- **Comprehensive Past Papers Archive**:
  - NSC past examination papers (Paper 1 & Paper 2) spanning 2021–2024.
  - Split-screen viewer: Question Paper and Official Marking Memorandum side-by-side.
  - One-click "Analyze in Mzansi Tutor" to generate customized questions and summaries from any past paper.
- **Strict South African Matric Authentication (Learner Portal)**:
  - High school selection (Pretoria Boys, Durban High, St John's, Crawford, Hoërskool Menlopark, etc.).
  - 7 Grade 12 subjects selection.
  - 15-character strict password rule (length, uppercase, number, symbol).
  - OTP verification simulator (via Gmail or SMS).
  - Forgot Password reset with OTP.
- **Separate Administrator Authorization Gate**:
  - 100% separated from learner accounts. Learners have zero access to the admin account.
  - Admin login accessible exclusively via discrete Staff & Admin Gate using specific administrator credentials.
  - Admin credential manager: administrator can update their confidential username and master password at any time.
- **Subscription Plans**:
  - **7-Day Free Trial** ($0 due today).
  - **Monthly Subscription**: **$6.99 / month** (approx. R125/mo).
  - **Yearly Subscription**: **$49.99 / year** (save 30% for the matric year).
  - Simulated payment methods: Card, Capitec Pay, Instant EFT, Google Pay.
- **Admin Portal**:
  - Learner analytics: Total learners, verified accounts, active trial members, and revenue metrics.
  - Ranked visual distribution of most popular Grade 12 subjects across South Africa.
  - User management: Search, filter, ban accounts with suspension reasons, or permanently delete users.

---

## Why GitHub Pages Showed a Blank White Page & How It's Fixed

If a Vite/React application shows a blank white page when deployed to GitHub Pages, it is typically caused by four specific issues:

1. **GitHub Pages Source Selection (Serving Unbuilt Source Files)**:
   - *Problem*: In GitHub repository **Settings -> Pages**, if the source was set to **"Deploy from a branch: main / (root)"**, GitHub Pages served `index.html` from the root directory. That raw file pointed to `<script type="module" src="/src/main.tsx"></script>`. Browsers cannot execute raw `.tsx` TypeScript files natively, which causes an immediate failure and renders a blank screen.
   - *Fix*: The repository now includes an automated workflow (`.github/workflows/static.yml`). When you set GitHub Pages source to **GitHub Actions**, GitHub automatically compiles the TypeScript code and deploys the production `./dist` bundle.

2. **Absolute Asset Path 404s (`base` URL)**:
   - *Problem*: Vite's default `base: '/'` tries to fetch files from `https://username.github.io/assets/...` instead of `https://username.github.io/repository-name/assets/...`, returning 404 for all CSS and JS bundles.
   - *Fix*: `vite.config.ts` is configured with `base: process.env.BASE_PATH || './'`. In `dist/index.html`, all script and style assets load via relative `./assets/...`, working on any repository name or custom domain.

3. **Jekyll Static Site Generator Blocking Files**:
   - *Problem*: GitHub Pages automatically executes Jekyll by default, which ignores folders or files starting with underscores or special characters and can break asset loading.
   - *Fix*: Added `.nojekyll` in both `public/` and `dist/`, instructing GitHub Pages to bypass Jekyll processing completely.

4. **Missing SPA 404 Route Fallback**:
   - *Problem*: Reloading or navigating on a client-side single page app returns a GitHub 404 page.
   - *Fix*: Added `404.html` in `public/` and `dist/` to redirect back to `index.html` while preserving parameters.

5. **Peer Dependency Conflict in GitHub Actions**:
   - *Problem*: `npm ci` previously failed in GitHub Actions because of an outdated `esbuild` peer dependency conflict with Vite 8.
   - *Fix*: Resolved dependencies in `package.json` and generated a clean `package-lock.json`.

6. **Uncaught Error Screen Fallback**:
   - *Problem*: If an unexpected exception occurred during initial mount, React would unmount the root without an error message.
   - *Fix*: Added an `ErrorBoundary` component in `src/components/ErrorBoundary.tsx` that catches runtime issues and provides a "Reload" and "Reset Cache" interface.

---

## How to Deploy to GitHub Pages (Step-by-Step)

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Configure Lumina SA for GitHub Pages deployment"
   git push origin main
   ```

2. On GitHub, navigate to your repository:
   - Click **Settings** (top navigation tab).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown.

3. The automated workflow **"Deploy Lumina SA to GitHub Pages"** will run in the **Actions** tab.
   - When finished (usually ~45 seconds), your live URL will appear at the top of the Pages settings page:
   `https://<your-username>.github.io/<your-repo-name>/`
   - The app will load with all features, styling, and assets working.
