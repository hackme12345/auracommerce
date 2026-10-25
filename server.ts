import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper to instantiate GoogleGenAI
function getGenAIClient(customKey?: string): GoogleGenAI | null {
  const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health and key status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    hasEnvKey,
    model: 'gemini-3.8-flash',
    version: '3.8.0',
    timestamp: new Date().toISOString(),
  });
});

// Prompt Builder based on tool type
function buildPrompt(params: {
  toolType: string;
  productTitle: string;
  targetAudience: string;
  tone: string;
  keyUSPs: string;
  targetPlatform: string;
  competitorInfo?: string;
  brandName?: string;
}) {
  const { toolType, productTitle, targetAudience, tone, keyUSPs, targetPlatform, competitorInfo, brandName } = params;
  const brand = brandName || 'AuraCommerce';

  switch (toolType) {
    case 'tiktok_hooks':
      return `
You are the world's most elite short-form video viral strategist for 7-and-8-figure high-ticket brands.
Product: "${productTitle}"
Target Audience: "${targetAudience}"
Tone & Aesthetic: "${tone}"
Key USPs / Angles: "${keyUSPs}"
Target Platform: "${targetPlatform || 'TikTok & Reels'}"

Create 5 distinct, explosive viral hook concepts formatted with:
1. Hook Script (The exact 3-second spoken sentence)
2. Visual Cue / Action (What appears on screen in frames 0-90)
3. Psychological Mechanism (Pattern Interrupt, Negative Bias, Luxury Contrast, Velvet Rope Scarcity, or Counter-Intuitive Revelation)
4. Sound / Audio Direction (Trending luxury audio cue, ASMR Foley, or cinematic synth rise)
5. Retention Rate Prediction & Script Body Teaser (How the video delivers on the hook)

Ensure the copy feels refined, magnetic, high-status, and ruthlessly converts scroll attention into obsessive interest. Return in clear, beautiful Markdown with headings.
`;

    case 'product_descriptions':
      return `
You are a legendary luxury copywriter and conversion rate optimization architect (specialized in Shopify Plus & Amazon A9 algorithms).
Product: "${productTitle}"
Target Audience: "${targetAudience}"
Tone & Aesthetic: "${tone}"
Key Features & USPs: "${keyUSPs}"
Primary Marketplace: "${targetPlatform || 'Shopify Plus'}"

Generate a complete, high-converting luxury product listing containing:
1. High-Impact Headline & Hero Tagline (Emotional, high-status proposition)
2. Editorial Storytelling Body (2 visceral paragraphs tapping into sensory prestige, status elevation, and effortless excellence)
3. 5 Bulleted Sensory Benefit Drivers (Formatted with bold benefit headlines followed by sensory and technical justification)
4. "The Craft & Engineering" Specification Breakdown (Materials, origin, tactile experience)
5. Amazon / Shopify Optimized Meta Description & SEO Keyword Clusters (Under 160 characters for search snippet, plus 8 high-intent conversion keywords)
6. Compelling, High-Ticket Call to Action (Micro-copy with subtle urgency and guarantee)

Format cleanly with Markdown, ready for copy-pasting into Shopify or Amazon.
`;

    case 'ad_copy':
      return `
You are an executive direct-response advertising director managing $20M+/yr ad spend on Meta (Instagram/Facebook) and Google.
Product: "${productTitle}"
Target Audience: "${targetAudience}"
Tone & Aesthetic: "${tone}"
Key USPs: "${keyUSPs}"
Target Platform: "${targetPlatform || 'Meta Ads (Instagram & Facebook)'}"

Generate 3 high-converting ad copy angles:
Angle 1: The Problem-Agitation-Solution (PAS) High-Status Angle
Angle 2: The AIDA (Attention-Interest-Desire-Action) Luxury Lifestyle Angle
Angle 3: The Before-After-Bridge (BAB) Counter-Intuitive Angle

For EACH angle, provide:
- Primary Text (Long/Medium form hook + visceral pitch)
- 3 Scroll-Stopping Headlines (Under 40 characters)
- Link Description (Under 30 characters)
- Recommended Creative Directive (Image/video concept that pairs seamlessly with this copy)
- Estimated Neuro-Conversion Impact Multiplier

Format in high-polish Markdown.
`;

    case 'competitor_gap':
      return `
You are a ruthless high-ticket corporate brand strategist and market intelligence analyst.
Target Product: "${productTitle}"
Competitors / Incumbent Flaws: "${competitorInfo || 'Generic market competitors with low-quality materials, generic mass-market messaging, and bloated pricing'}"
Target Audience: "${targetAudience}"
Our USPs: "${keyUSPs}"
Tone: "${tone}"

Deliver an Executive Competitor Gap & Value Extraction Teardown:
1. The Incumbent Weakness Matrix (Where current market alternatives fail customers emotionally and technically)
2. The Luxury Counter-Positioning Angle (The exact narrative pivot that makes our product appear in a category of one)
3. 3 Uncopyable "Moat" Value Propositions (Phrased for instant consumer resonance)
4. Objection-Obliterating FAQs (3 top customer hesitations and the exact high-status rebuttals)
5. The "Velvet Rope" Conversion Pitch (A 60-word closing manifesto that makes buying anything else feel like a compromise)

Output in structured, analytical Markdown.
`;

    default:
      return `
Generate ultra-luxury e-commerce conversion copy for:
Product: "${productTitle}"
Audience: "${targetAudience}"
Tone: "${tone}"
USPs: "${keyUSPs}"
Platform: "${targetPlatform}"
`;
  }
}

// Generation API Route
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const {
      toolType = 'product_descriptions',
      productTitle = 'Aether Precision Titanium Watch',
      targetAudience = 'Discerning high-net-worth executives and collectors',
      tone = 'Luxury & Haute Exclusivity',
      keyUSPs = 'Grade 5 aerospace titanium, Swiss mechanical movement, sapphire crystal',
      targetPlatform = 'Shopify',
      competitorInfo = '',
      brandName = 'AuraCommerce',
    } = req.body;

    const customKey = req.headers['x-gemini-key'] as string || req.body.customApiKey;
    const ai = getGenAIClient(customKey);

    if (!ai) {
      return res.status(401).json({
        error: 'NO_API_KEY',
        message: 'No Google Gemini API key found. Please set GEMINI_API_KEY in .env or enter your key in the Settings modal.',
      });
    }

    const prompt = buildPrompt({
      toolType,
      productTitle,
      targetAudience,
      tone,
      keyUSPs,
      targetPlatform,
      competitorInfo,
      brandName,
    });

    const systemInstruction = `You are AuraCommerce AI, an elite copywriting engine built for 7-to-8 figure luxury e-commerce brands, direct-to-consumer powerhouses, and high-ticket sellers. Your writing style is sophisticated, visceral, elegant, and backed by direct-response psychology. Do not use generic corporate filler or cheap buzzwords like 'revolutionize', 'game-changer', 'delve', 'tapestry'. Use crisp sensory prose, sharp rhythm, and precise value articulation.`;

    // Attempt generation with primary model 'gemini-3.8-flash', with fallback to 'gemini-3.1-flash-lite'
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let outputText = '';
    let usedModel = 'gemini-3.8-flash';

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.75,
          },
        });
        outputText = response.text || '';
        if (outputText) {
          usedModel = model;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[AuraCommerce AI] Generation with ${model} encountered transient issue:`, err?.message || err);
        // Wait 800ms before fallback attempt
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    if (!outputText && lastError) {
      throw lastError;
    }

    const wordCount = outputText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = outputText.length;
    const readingTimeSec = Math.ceil((wordCount / 200) * 60);

    res.json({
      success: true,
      data: {
        text: outputText,
        metrics: {
          wordCount,
          charCount,
          readingTimeSec,
          model: usedModel,
          toolType,
        },
      },
    });
  } catch (error: any) {
    console.error('Error generating copy with Gemini:', error);
    let readableMessage = error?.message || 'An error occurred while communicating with Gemini API.';
    try {
      const parsed = JSON.parse(readableMessage);
      if (parsed?.error?.message) {
        readableMessage = parsed.error.message;
      }
    } catch {}

    res.status(500).json({
      error: 'GENERATION_FAILED',
      message: readableMessage,
    });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AuraCommerce AI] Server running at http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('[AuraCommerce AI] Fatal startup error:', err);
  process.exit(1);
});
