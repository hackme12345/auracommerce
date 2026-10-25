# AuraCommerce AI — Ultra-Premium E-Commerce Conversion Intelligence

> **Obsidian & Champagne Glow Architecture** for 7-and-8-figure high-ticket brands, Shopify Plus powerhouses, and direct-to-consumer advertising agencies.

A complete, production-ready Micro-SaaS platform powered by Google Gemini 3.8 Flash, React 19, TypeScript, Tailwind CSS v4, and Node.js Express.

---

## 💎 Features & Direct-Response Engines

1. **Viral TikTok & Reels 3-Second Hook Generator**
   - 5 psychological pattern interrupts (Sensory Dopamine, Negative Bias, Velvet Rope Scarcity, Morbid Curiosity, Authority Challenge).
   - Micro-frame visual cues (frames 0–90) and binaural sound directives for video editors.
   - Algorithmic retention prediction metric.

2. **Shopify Plus & Amazon A9 Luxury Listings**
   - Sensory benefit drivers and visceral storytelling narrative.
   - Amazon A9 keyword-indexed bullet points.
   - Under-160 character Google SEO meta descriptions and intent keyword clusters.
   - 1-click clean semantic HTML export for instant CMS paste.

3. **Neuro-Targeted Meta & Google Ad Suite**
   - High-converting direct response angles: PAS (Problem-Agitation-Solution), AIDA, and Before-After-Bridge.
   - Character counter compliance (headlines under 40 characters, descriptions under 30 characters).
   - Creative director recommendations for photographers and media buyers.

4. **Competitor Feature & Value Gap Extractor**
   - Dissects incumbent market weaknesses and cheap OEM shortcuts.
   - Formulates uncopyable "category-of-one" value propositions.
   - Objection-obliterating FAQ scripts and 60-word Velvet Rope closing pitch.

5. **Executive Studio Workspace**
   - Multi-tab output viewer: Rich Formatted Preview, Raw Markdown, and Semantic Shopify HTML.
   - Word count, character count, and estimated reading time telemetry.
   - LocalStorage History Vault with instant load & recall.
   - Quick preset loader with luxury archetypes (Haute Horlogerie, Botanical Retinol, Scandinavian Ergonomics, Kyoto Cold Brew).

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion
- **Backend**: Node.js Express with full-stack proxy routing (`/api/*`)
- **AI Intelligence**: `@google/genai` (Official Google Gen AI SDK) using `gemini-3.8-flash`
- **Build System**: Vite 6, TSX

---

## 🚀 Quickstart & Development

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```
> *Note: End users can also enter their Gemini API key directly in the web app's built-in Settings modal, where it is persisted safely in browser `localStorage`.*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the luxury landing page and studio.

---

## 🚢 Production Deployment

### Option A: One-Click Vercel Deployment
1. Import this repository into your Vercel Dashboard.
2. Under **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Set the build command to `npm run build` and start command to `npm run start`.
4. Deploy.

### Option B: Google Cloud Run / Docker
This application includes full-stack Express server configuration with production static asset serving.
```bash
npm run build
npm run start
```
The application will bind to `0.0.0.0:3000` (or `process.env.PORT`).

---

## 🏷 White-Labeling & Reselling Guide

AuraCommerce AI is architected from the ground up to be turnkey white-labeled for agencies and SaaS resellers:

1. **Brand Wordmark & Navigation Logo**:
   - In the live app, click the **Key/Settings** icon in the top navigation.
   - Enter your custom brand name in the **White-Label Brand Wordmark** field and click Save.
   - The brand name instantly updates across the navigation bar, headers, and metadata.
2. **Color Palette & Accents**:
   - Global design tokens are defined in `/src/index.css`.
   - Modify `#E6C875` (Champagne Gold) or `#10B981` (Emerald Accent) to match your corporate identity.
3. **Custom Presets**:
   - Add your own industry presets in `/src/data/presets.ts`.

---

## 📄 License
Commercial Micro-SaaS License. Distributed under Apache-2.0.
