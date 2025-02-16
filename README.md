# Axon
Your AI-powered morning companion that delivers personalized, bias-aware news briefings through newsletters and podcasts.

## Features
- **Personalized News Synthesis**: Custom newsletters using multi-model AI generation
- **Audio Briefings**: AI-powered podcast generation via ElevenLabs
- **Deep Research**: Interactive source exploration and fact-checking forked from [scira](https://github.com/zaidmukaddam/scira)
- **Multi-Source Analysis**: Cross-reference information across the political spectrum
- **Real-time Updates**: Daily customized briefings delivered to your inbox
- **Bias Detection**: System for balanced reporting

## Stack
- **Text Generation**: 
  - OpenAI GPT-4 Turbo
  - Anthropic Claude 3.5 Sonnet
  - Groq Inference API
- **Audio Generation**: 
  - ElevenLabs Voice AI
- **Scoring System**:
  - Custom RL implementation
  - Multi-model feedback loop

## Tech Stack
### Frontend
- Next.js 15 (App Router)
- TypeScript / React 18
- Tailwind CSS + Plugins
- Radix UI / shadcn
- Framer Motion
- Three.js / React Three Fiber
- Mapbox GL
- ECharts / Recharts

### Backend
- AWS Services (S3, Queue System)
- Supabase
- Python Services
- IMAP Integration
- Scrapybara VM
- E2B Code Interpreter



## Architecture
![System Architecture](https://media.discordapp.net/attachments/927412560783896608/1340705463003775049/Screenshot_2025-02-16_at_7.24.48_AM.png?ex=67b354c3&is=67b20343&hm=feece541ba2a7a8e7f0db4eeb811778527af0563bce42a934cebd954fb630553&=&format=webp&quality=lossless&width=1562&height=1000)




## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- Scira for deep research implementation
- Supabase for database and auth
- AWS for infrastructure
- OpenAI and Anthropic for AI models
- ElevenLabs for voice synthesis
- Scrapybara for web scraping capabilities
