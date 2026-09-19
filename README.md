# DIANA · app do responsável

A tela que o responsável abre quando a DIANA identifica risco em uma conversa
monitorada. Consome a API do
[backend](https://github.com/Rafazls/app-diana-monitoring).

```bash
npm install
npm run dev
```

Abra **http://localhost:5173** — com o backend rodando em `localhost:8080`.

No celular o app ocupa a tela inteira; no desktop aparece dentro do smartphone
virtual, exatamente como a tela é apresentada na landing page.

## Definição oficial da DIANA

### O que é a DIANA?

A **DIANA** é uma plataforma de proteção digital infantil baseada em análise
contextual de conversas. Ela:

1. captura periodicamente dados de uma fonte de conversa (hoje, o Telegram);
2. organiza e protege esses dados, sem expor o conteúdo bruto a ninguém além
   do próprio pipeline de análise;
3. reconstrói uma janela temporal de contexto a partir dos lotes de mensagens
   recentes de uma conversa;
4. interpreta padrões comportamentais nessa janela;
5. identifica sinais associados a categorias de risco (aliciamento, ameaça,
   pedido de imagem, autolesão, entre outras);
6. consolida esses sinais em uma pontuação de risco (score, nível e
   prioridade);
7. gera um **alerta estruturado** quando há evidência suficiente para
   justificar a atenção do responsável.

Este repositório (`app-diana-guardian-web`) implementa o passo 7: a tela onde
o responsável recebe e consulta esse alerta. Os passos 1–6 — ingestão,
análise e consolidação — ficam no backend,
[`app-diana-monitoring`](https://github.com/Rafazls/app-diana-monitoring).

### O que a DIANA não é?

A DIANA não é:

- um aplicativo de espionagem;
- um sistema que mostra ao responsável a conversa inteira — esta tela nunca
  recebe o texto bruto, apenas a análise já consolidada (regra RF-16 do
  backend, reforçada aqui pelo próprio contrato de dados que a tela consome);
- um filtro baseado exclusivamente em palavras proibidas;
- um mecanismo que classifica cada mensagem isoladamente, sem contexto;
- um sistema que rotula uma pessoa como criminosa;
- uma afirmação de que um abuso ocorreu só porque uma classificação
  probabilística disparou — todo alerta mostrado aqui carrega os sinais que o
  justificam, e a decisão final é sempre de um humano.

### Arquitetura geral

A DIANA é composta por dois repositórios que se comunicam por HTTP:

```
┌──────────────── app-diana-monitoring (backend) ────────────────┐
│ Telegram / fixtures → ingestion → analyzer → AlertStore         │
│                                                    │             │
│                                          API HTTP Fastify :8080  │
└────────────────────────────────────────────────────┬───────────┘
                                                       │ REST (/dashboard, /alerts, /settings…)
                                                       ▼
┌──────────────── app-diana-guardian-web (este repositório) ─────┐
│ SPA React consumida pelo responsável — só a análise, nunca a    │
│ conversa. Sem back-end, sem banco de dados próprios.            │
└──────────────────────────────────────────────────────────────────┘
```

Este repositório é um **cliente puro** da API do backend: todo dado exibido
(estatísticas, alertas, detalhe da análise, preferências) é buscado ou salvo
via `src/api.ts`, que fala com `VITE_API_BASE` (padrão `/api`, com proxy em
desenvolvimento para `DIANA_API_URL`, padrão `http://localhost:8080`). Não há
lógica de negócio, persistência ou autenticação neste lado — tudo isso é
responsabilidade do backend.

### Tecnologias, linguagens e frameworks

- **Linguagem**: TypeScript 5 (modo estrito).
- **Framework**: React 18 + [Vite 5](https://vitejs.dev/) (SPA pura, sem
  Next.js e sem rotas — navegação por abas em estado local).
- **Estilo**: Tailwind CSS + componentes no estilo shadcn/ui sobre Radix UI
  (`class-variance-authority`, `tailwind-merge`).
- **UI/UX**: `framer-motion` (animação), `recharts` (gráfico de atividade),
  `lucide-react` (ícones).
- **Sem gerenciador de estado global** — `useState`/`useCallback` no
  componente raiz, com polling da API a cada 15s.

### APIs, modelos de Inteligência Artificial e bases de dados

Este repositório **não** acessa modelos de IA nem bancos de dados
diretamente. Ele consome, via REST, o resultado já consolidado pelo backend
([`app-diana-monitoring`](https://github.com/Rafazls/app-diana-monitoring)),
que é quem escolhe entre heurística própria, modelo auto-hospedado
(compatível com OpenAI) ou OCI Generative AI, e quem persiste os alertas em
memória, arquivo ou Oracle Autonomous Database — detalhes no README daquele
repositório.

Endpoints consumidos (`src/api.ts`):

| Rota | Uso nesta tela |
|---|---|
| `GET /dashboard` | Aba Início — estatísticas e atividade dos últimos 7 dias |
| `GET /alerts` | Aba Alertas — lista completa |
| `GET /alerts/:id` | Aba Detalhe |
| `POST /alerts/:id/feedback` | Feedback do responsável sobre um alerta |
| `GET` · `PUT /settings` | Aba Configurações |

### Executando tudo localmente (LLM em Docker → backend → front-end)

O quickstart no topo deste README assume que o backend já está rodando em
`localhost:8080`. Para montar a solução completa do zero, incluindo um modelo
de linguagem de verdade:

**1. Suba um modelo compatível com OpenAI via Docker** (pule se o backend for
usar `ANALYZER=mock`):

```bash
docker run -d --name diana-llm -p 11434:11434 -v diana-ollama:/root/.ollama ollama/ollama
docker exec diana-llm ollama pull qwen2.5:3b-instruct
```

**2. Suba o backend apontando para o modelo:**

```bash
git clone git@github.com:Rafazls/app-diana-monitoring.git
cd app-diana-monitoring
npm install
cp .env.example .env
# no .env: ANALYZER=server, MODEL_SERVER_URL=http://localhost:11434/v1,
# MODEL_SERVER_MODEL=qwen2.5:3b-instruct
npm run build && npm start   # http://localhost:8080
```

**3. Suba este front-end:**

```bash
npm install
npm run dev   # http://localhost:5173, com proxy automático para localhost:8080
```

Se o backend não estiver em `localhost:8080`, ajuste `DIANA_API_URL` (proxy
de desenvolvimento) ou `VITE_API_BASE` (build de produção servido sem proxy)
— ver [`.env.example`](.env.example).

## Telas

| Aba | O que mostra |
|---|---|
| **Início** | Estatísticas, atividade monitorada dos últimos 7 dias e alertas recentes. |
| **Alertas** | Histórico completo, com filtro por prioridade. |
| **Detalhe** | Por que o alerta apareceu, categorias com probabilidade, sinais encontrados, contexto da análise, prioridade e o que fazer. |
| **Segurança** | Central com os 11 tipos de risco que a DIANA monitora e orientação para cada um. |
| **Configurações** | Preferências de proteção, privacidade e conta. Salvam ao alternar. |

## Comandos

```bash
npm run dev        # desenvolvimento, com proxy para o backend
npm run build      # typecheck + build de produção
npm run typecheck  # só a verificação de tipos
npm run preview    # serve o build
```

## Se você chegou aqui por um caso real

**Disque 100** (violência contra crianças e adolescentes) e **CVV 188** (apoio
emocional) são gratuitos e funcionam 24h no Brasil.
