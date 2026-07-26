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
