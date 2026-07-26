# 🎨 Sublima Studio AI

> **IDE Profissional para Criação de Estampas e Sublimação com IA Generativa, Visualização 3D Realista e Controle de Produção.**

![Sublima Studio AI](https://img.shields.io/badge/Sublima%20Studio-AI-06b6d4?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)

---

## 🚀 Sobre o Projeto

O **Sublima Studio AI** é uma plataforma web completa desenvolvida para designers de sublimação, estamparias e profissionais de produtos personalizados. Ele une ferramentas avançadas de design vetorial/raster 2D, IA generativa para criação de artes e uma renderização em tempo real de mockup 3D interativo via **WebGL (Three.js)**.

Com ele, é possível visualizar exatamente como a estampa ficará no produto real (canecas, camisetas, squeezes, almofadas, capas de celular e mais) antes de realizar a impressão e prensagem térmica.

---

## ✨ Funcionalidades

- 🧊 **Visualização 3D Realista Interativa (Three.js)**:
  - Renderização 3D em tempo real com mapeamento UV preciso das estampas.
  - Vários mockups sublimáticos: **Caneca Cerâmica 11oz**, **Camiseta de Poliéster**, **Copo Térmico**, **Almofada 40x40**, **Capa de Celular**, **Squeeze de Alumínio**, **Quebra-Cabeça** e **Mousepad**.
  - Ajustes de iluminação de estúdio (Studio, Soft, Dramatic, Glossy, Matte).
  - Controle interativo de câmera com rotação 360°, zoom e auto-fit.

- 🎨 **Editor de Estamparia 2D de Alta Precisão**:
  - Resolução ajustada para impressão profissional (**CMYK 300 DPI**).
  - Guia de sangria/bleed (+3mm) e margens de corte seguras.
  - Réguas interativas em pixels e milímetros.
  - Suporte a múltiplas camadas (Layers) com visibilidade, bloqueio, opacidade e modos de mesclagem (*Multiply, Screen, Overlay, etc.*).

- 🤖 **IA Generativa para Estampas (Google Gemini API)**:
  - Geração de estampas exclusivas através de prompts de texto.
  - Seleção de estilos de arte (*Vibrante, Aquarela, Vetorial, Abstrato, Cyberpunk, Vintage Sublimation*).
  - Geração automática de variações e sugestões de paleta de cores.

- 🖨️ **Módulo de Impressão e Prensa Térmica**:
  - **Espelhamento Automático de Imagem** (indispensável para papel sublimático).
  - Tabela de tempo e temperatura para cada tipo de material (ex: Caneca 190°C / 180s).
  - Exportação em altíssima resolução (PNG/PDF) para impressão.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Renderização 3D**: Three.js (WebGL 2.0).
- **IA**: Google GenAI SDK (`@google/genai`).
- **Build System**: Vite 6, Esbuild.

---

## 📦 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### Passo a passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU-USUARIO/sublima-studio-ai.git
   cd sublima-studio-ai
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto (baseado em `.env.example`):
   ```env
   GEMINI_API_KEY=sua_chave_da_api_gemini
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 🌐 Como Publicar no GitHub Pages

Para hospedar o **Sublima Studio AI** no **GitHub Pages**, siga as instruções abaixo:

### 1. Ajustar o `vite.config.ts`

O `vite.config.ts` já vem pré-configurado para detectar automaticamente o nome do seu repositório no GitHub Actions (`process.env.GITHUB_REPOSITORY`):

```typescript
export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : './';

  return {
    base: repoName,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
```
*Isso garante que todos os arquivos `.js` e `.css` sejam servidos a partir de `https://seu-usuario.github.io/Sublima-Studio-AI/` sem dar erro 404/MIME.*

---

### 2. Método Recomendado: Deploy Automático via GitHub Actions

1. No seu repositório no GitHub, vá em **Settings** > **Pages**.
2. Em **Source**, selecione **GitHub Actions**.
3. No seu projeto local, crie o arquivo `.github/workflows/deploy.yml` com o seguinte conteúdo:

```yaml
name: Deploy para GitHub Pages

on:
  push:
    branches: [ main, master ]

# Concede permissões necessárias para o GITHUB_TOKEN implantar no GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Build do Projeto
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Configurar Pages
        uses: actions/configure-pages@v5

      - name: Upload do artefato de build
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy no GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Faça commit e envie as alterações para a branch principal (`main` ou `master`):
   ```bash
   git add .
   git commit -m "ci: adiciona workflow de deploy do GitHub Pages"
   git push origin main
   ```

---

### 3. Método Alternativo: Deploy com o pacote `gh-pages`

Se preferir fazer o deploy manualmente via terminal:

1. Instale o pacote `gh-pages` como dependência de desenvolvimento:
   ```bash
   npm install -D gh-pages
   ```

2. Adicione os scripts no seu `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Execute o comando de deploy:
   ```bash
   npm run deploy
   ```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p center="align">
Desenvolvido com ❤️ para a comunidade de sublimação e estamparia digital.
</p>
