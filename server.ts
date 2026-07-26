import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));

  // Shared Gemini client instance
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Sublima Studio AI' });
  });

  // AI Prompt Enhancement Endpoint
  app.post('/api/ai/enhance-prompt', async (req, res) => {
    try {
      const { prompt, style } = req.body;
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Você é um especialista em design para sublimação de alta qualidade.
Melhore e expanda o seguinte prompt para geração de arte de sublimação vibrante e profissional em português/inglês.
Prompt original: "${prompt || 'Arte tropical para sublimação'}"
Estilo desejado: "${style || 'Vibrante'}"

Retorne uma descrição detalhada com sugestões de elementos, paleta de cores, iluminação e estilo artístico ideais para estamparia e sublimação de canecas, camisetas e almofadas.
Mantenha a resposta em até 100 palavras.`,
      });

      res.json({ success: true, enhancedPrompt: response.text });
    } catch (error: any) {
      console.error('Error in enhance-prompt:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Falha ao aprimorar prompt com IA',
      });
    }
  });

  // AI Image & Artwork Synthesis Endpoint (Supports free SVG, Pollinations AI, and Gemini Flash Lite Image)
  app.post('/api/ai/generate-image', async (req, res) => {
    try {
      const { prompt, style, palette, model } = req.body;
      const ai = getGeminiClient();

      const selectedModel = model || 'gemini-svg-free';
      const paletteList = palette && palette.length > 0 ? palette : ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];
      const paletteStr = paletteList.join(', ');

      // Mode 1: Gemini 3.6 Flash Vector SVG Generator (FREE / STANDARD KEY)
      if (selectedModel === 'gemini-svg-free' || selectedModel === 'gemini-3.6-flash-svg' || selectedModel === 'Sublima Flash Vector') {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Atue como um gerador avançado de ilustrações vetoriais SVG para sublimação e estamparia digital em produtos (canecas, camisetas, almofadas).
Crie o código SVG completo, independente e válido para a seguinte estampa:
Prompt: "${prompt || 'Arte tropical vibrante com folhas e flores'}"
Estilo artístico: "${style || 'Vibrante'}"
Cores recomendadas: "${paletteStr}"

Instruções estritas de formatação SVG:
1. Comece diretamente com a tag <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%">
2. Crie um fundo rico (com <rect width="1080" height="1350" .../>), formas geométricas/orgânicas coloridas, gradientes vibrantes (<defs><linearGradient/></defs>), ilustrações detalhadas com <path>, <circle>, <polygon> ou <ellipse>.
3. Inclua um título ou elemento tipográfico com <text> estilizado, com boa legibilidade.
4. NUNCA inclua texto explicativo fora das tags SVG. Retorne apenas o código <svg>...</svg>.`,
        });

        let rawText = response.text || '';
        let svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
        let svgCode = svgMatch ? svgMatch[0] : '';

        if (!svgCode) {
          svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%">
            <rect width="1080" height="1350" fill="#0f172a"/>
            <circle cx="540" cy="500" r="320" fill="${paletteList[0] || '#f59e0b'}"/>
            <path d="M 200 800 Q 540 500 880 800 Z" fill="${paletteList[1] || '#06b6d4'}"/>
            <text x="540" y="1120" fill="#ffffff" font-size="54" font-weight="900" font-family="sans-serif" text-anchor="middle">${prompt.slice(0, 30).toUpperCase()}</text>
          </svg>`;
        }

        const variations = [
          {
            id: `var-svg-${Date.now()}-1`,
            title: `Vetor Sublimação V1`,
            desc: 'Cores CMYK + Traços Limpos',
            type: 'vector',
            svg: svgCode,
            content: svgCode,
          },
          {
            id: `var-svg-${Date.now()}-2`,
            title: `Vetor Sublimação V2`,
            desc: 'Aura Neon & Contraste',
            type: 'vector',
            svg: svgCode.replace('#0f172a', '#1e1b4b').replace('#10b981', '#ec4899'),
            content: svgCode.replace('#0f172a', '#1e1b4b').replace('#10b981', '#ec4899'),
          },
          {
            id: `var-svg-${Date.now()}-3`,
            title: `Vetor Sublimação V3`,
            desc: 'Fundo Escuro Premium',
            type: 'vector',
            svg: svgCode.replace('#0f172a', '#020617').replace('#38bdf8', '#facc15'),
            content: svgCode.replace('#0f172a', '#020617').replace('#38bdf8', '#facc15'),
          },
        ];

        return res.json({
          success: true,
          modelUsed: 'Gemini 3.6 Flash Vetor SVG (Gratuito)',
          type: 'vector',
          content: svgCode,
          svg: svgCode,
          title: prompt,
          variations,
        });
      }

      // Mode 2: Pollinations AI Flux (FREE / NO API KEY REQUIRED)
      if (selectedModel === 'pollinations-flux-free' || selectedModel === 'Sublima Ultra-HD') {
        const seed1 = Math.floor(Math.random() * 900000) + 100000;
        const seed2 = Math.floor(Math.random() * 900000) + 100000;
        const seed3 = Math.floor(Math.random() * 900000) + 100000;

        const fullPrompt = `${prompt}, sublimation t-shirt print graphic design, ${style} style, vibrant cmyk colors, clean background, 8k resolution`;
        const encodedPrompt = encodeURIComponent(fullPrompt);

        const img1 = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed1}&nologo=true&model=flux`;
        const img2 = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed2}&nologo=true&model=flux`;
        const img3 = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed3}&nologo=true&model=flux`;

        const variations = [
          {
            id: `var-pol-${Date.now()}-1`,
            title: `Arte Flux HD V1`,
            desc: 'Saturação de Cores 1024px',
            type: 'raster',
            imageUrl: img1,
            content: img1,
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${img1}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`,
          },
          {
            id: `var-pol-${Date.now()}-2`,
            title: `Arte Flux HD V2`,
            desc: 'Variação de Semente S1',
            type: 'raster',
            imageUrl: img2,
            content: img2,
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${img2}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`,
          },
          {
            id: `var-pol-${Date.now()}-3`,
            title: `Arte Flux HD V3`,
            desc: 'Variação de Semente S2',
            type: 'raster',
            imageUrl: img3,
            content: img3,
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${img3}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`,
          },
        ];

        return res.json({
          success: true,
          modelUsed: 'Pollinations AI Flux (Gratuito / Sem limites)',
          type: 'raster',
          content: img1,
          imageUrl: img1,
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${img1}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`,
          title: prompt,
          variations,
        });
      }

      // Mode: GitHub Models API (Using GITHUB_TOKEN environment variable)
      if (selectedModel === 'github-models-ai') {
        const ghToken = process.env.GITHUB_TOKEN;
        if (ghToken) {
          try {
            const ghRes = await fetch('https://models.inference.ai.azure.com/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ghToken}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: 'Você é um gerador especialista em ilustrações vetoriais SVG para estamparia e sublimação. Retorne APENAS o código SVG válido começando em <svg> e terminando em </svg>.',
                  },
                  {
                    role: 'user',
                    content: `Crie uma estampa em vetor SVG nítida para sublimação: Prompt "${prompt}", Estilo "${style}", Cores "${paletteStr}". ViewBox: 0 0 1080 1350.`,
                  },
                ],
              }),
            });

            const ghData = await ghRes.json();
            const rawContent = ghData?.choices?.[0]?.message?.content || '';
            const svgMatch = rawContent.match(/<svg[\s\S]*?<\/svg>/i);
            const svgCode = svgMatch ? svgMatch[0] : '';

            if (svgCode) {
              return res.json({
                success: true,
                modelUsed: 'GitHub Models API (gpt-4o-mini)',
                type: 'vector',
                content: svgCode,
                svg: svgCode,
                title: prompt,
                variations: [
                  {
                    id: `var-gh-${Date.now()}-1`,
                    title: 'GitHub Models SVG V1',
                    desc: 'Gerado via GitHub Models API',
                    type: 'vector',
                    svg: svgCode,
                    content: svgCode,
                  },
                ],
              });
            }
          } catch (ghErr: any) {
            console.warn('GitHub Models API call error:', ghErr?.message);
          }
        }
      }

      // Mode 3: Gemini 3.1 Flash Lite Image (Google GenAI SDK)
      if (selectedModel === 'gemini-3.1-flash-lite-image' || selectedModel === 'Sublima AI Pro') {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [
                {
                  text: `Sublimation artwork graphic design for t-shirt/mug print: ${prompt}, style: ${style}, colors: ${paletteStr}`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: '1:1',
              },
            },
          });

          let base64Image = '';
          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                base64Image = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
          }

          if (base64Image) {
            const wrappedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${base64Image}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`;

            return res.json({
              success: true,
              modelUsed: 'Gemini 3.1 Flash Lite Image (Google GenAI)',
              type: 'raster',
              content: base64Image,
              imageUrl: base64Image,
              svg: wrappedSvg,
              title: prompt,
              variations: [
                {
                  id: `var-gem-${Date.now()}-1`,
                  title: 'Gemini AI Image V1',
                  desc: 'Sintetizado por Gemini 3.1 Flash Lite',
                  type: 'raster',
                  imageUrl: base64Image,
                  content: base64Image,
                  svg: wrappedSvg,
                },
              ],
            });
          }
        } catch (gemErr: any) {
          console.warn('Gemini Flash Lite Image requires paid key or encountered limit, falling back to Pollinations AI Flux:', gemErr?.message);
        }

        // Fallback to Pollinations AI
        const encodedPrompt = encodeURIComponent(`${prompt}, ${style} style sublimation graphic design, 8k`);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 900000) + 100000}&nologo=true&model=flux`;
        const wrappedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${fallbackUrl}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`;

        return res.json({
          success: true,
          modelUsed: 'Pollinations AI Flux (Gratuito - Fallback)',
          type: 'raster',
          content: fallbackUrl,
          imageUrl: fallbackUrl,
          svg: wrappedSvg,
          title: prompt,
          fallbackNote: 'Usado modelo gratuito rápido para geração de imagem.',
          variations: [
            {
              id: `var-fb-${Date.now()}-1`,
              title: 'Arte Generativa V1',
              desc: 'Gerada com Modelo Gratuito HD',
              type: 'raster',
              imageUrl: fallbackUrl,
              content: fallbackUrl,
              svg: wrappedSvg,
            },
          ],
        });
      }

      // Default Fallback
      const encodedPrompt = encodeURIComponent(`${prompt}, ${style} style sublimation design`);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=42&nologo=true&model=flux`;
      const wrappedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="100%" height="100%"><rect width="1080" height="1350" fill="#0f172a"/><image href="${fallbackUrl}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/></svg>`;

      return res.json({
        success: true,
        modelUsed: 'Pollinations AI (Gratuito)',
        type: 'raster',
        content: fallbackUrl,
        imageUrl: fallbackUrl,
        svg: wrappedSvg,
        title: prompt,
        variations: [
          {
            id: `var-def-${Date.now()}-1`,
            title: 'Arte Generativa',
            desc: 'Modelo Gratuito Flux',
            type: 'raster',
            imageUrl: fallbackUrl,
            content: fallbackUrl,
            svg: wrappedSvg,
          },
        ],
      });
    } catch (error: any) {
      console.error('Error in /api/ai/generate-image:', error);
      res.status(500).json({ success: false, error: error.message || 'Erro ao gerar imagem' });
    }
  });

  // AI Image/Art Concept Generator
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, style, palette, modelName } = req.body;
      const ai = getGeminiClient();

      // Generating detailed AI breakdown and composition layers
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Atue como o motor generativo de arte do Sublima Studio AI.
O usuário solicitou criar uma arte de sublimação com as seguintes configurações:
- Prompt: "${prompt}"
- Estilo: "${style}"
- Paleta de Cores: "${palette ? palette.join(', ') : 'Vibrante'}"
- Modelo de IA: "${modelName || 'Sublima AI Pro'}"

Gere uma resposta em JSON com o seguinte formato:
{
  "title": "Nome do Projeto",
  "description": "Descrição poética e técnica do conceito gerado",
  "suggestedColors": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "recommendedLayers": [
    { "name": "Nome da Camada 1", "type": "vector|raster|text", "blendMode": "normal|multiply|overlay" },
    { "name": "Nome da Camada 2", "type": "vector|raster|text", "blendMode": "normal|multiply|overlay" }
  ],
  "dpi": 300,
  "colorMode": "CMYK",
  "sublimationTip": "Dica de temperatura/tempo para prensa térmica"
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      let parsed = {};
      try {
        parsed = JSON.parse(response.text || '{}');
      } catch (e) {
        parsed = { description: response.text };
      }

      res.json({ success: true, result: parsed });
    } catch (error: any) {
      console.error('Error in generate:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Falha na geração de arte com IA',
      });
    }
  });

  // AI Vectorization & Background Removal Analysis
  app.post('/api/ai/vectorize', async (req, res) => {
    try {
      const { layerName } = req.body;
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analise a camada "${layerName || 'Arte Central'}" para vetorização e remoção de fundo com IA para impressão de sublimação. Forneça 3 passos de otimização em JSON.`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      res.json({ success: true, analysis: response.text });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sublima Studio AI running on http://localhost:${PORT}`);
  });
}

startServer();
