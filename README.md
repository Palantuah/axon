# Axon

A minimalistic AI-powered search engine that helps you find information on the internet.

## Powered By

<div align="center">
  <div style="display: flex; justify-content: center; align-items: center; gap: 80px; margin: 20px 0;">
    <a href="https://sdk.vercel.ai/docs">
      <img src="/public/one.svg" alt="Vercel AI SDK" height="40" />
    </a>
    <a href="https://tavily.com">
      <img src="/public/four.svg" alt="Tavily AI" height="40" />
    </a>
  </div>
</div>

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - For AI model integration and streaming
- [Tavily AI](https://tavily.com) - For search grounding and web search capabilities

## Features

- **AI-powered search**: Get answers to your questions using Anthropic's Models.
- **Web search**: Search the web using Tavily's API.
- **URL Specific search**: Get information from a specific URL.

Web Search API](<https://exa.ai/>).

- **Academic Search**: Search for academic papers [powered by Exa.AI - the Web Search API](https://exa.ai/).

## LLM used

- [Anthropic's Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet)
- [Meta's Llama 3.3 70B by Cerebras](https://inference-docs.cerebras.ai/introduction)
- [Deepseek R1 Distill by Groq Inc](https://console.groq.com/docs/model/deepseek-r1-distill-llama-70b)
- [OpenAI's o3-mini](https://openai.com/index/openai-o3-mini/)

## Built with

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Exa.AI](https://exa.ai/)
- [Tavily](https://tavily.com/)
- [E2B](https://e2b.dev/)
- [Google Maps](https://developers.google.com/maps)

## Set Axon as your default search engine

1. **Open the Chrome browser settings**:
   - Click on the three vertical dots in the upper right corner of the browser.
   - Select "Settings" from the dropdown menu.

2. **Go to the search engine settings**:
   - In the left sidebar, click on "Search engine."
   - Then select "Manage search engines and site search."

3. **Add a new search engine**:
   - Click on "Add" next to "Site search."

4. **Set the search engine name**:
   - Enter `Axon` in the "Search engine" field.

5. **Set the search engine URL**:
   - Enter `https://axon.app?q=%s` in the "URL with %s in place of query" field.

6. **Set the search engine shortcut**:
   - Enter `sh` in the "Shortcut" field.

7. **Set Default**:
   - Click on the three dots next to the search engine you just added.
   - Select "Make default" from the dropdown menu.

After completing these steps, you should be able to use Axon as your default search engine in Chrome.

### Local development

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use. OpenAI and Anthropic are required, Tavily is required for the web search feature.
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env.local`.
4. `pnpm install` to install the required dependencies.
5. `pnpm dev` to launch the development server.

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
