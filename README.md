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

## Telas

| Aba | O que mostra |
|---|---|
| **Início** | Estatísticas, atividade monitorada dos últimos 7 dias e alertas recentes. |
| **Alertas** | Histórico completo, com filtro por prioridade. |
| **Detalhe** | Por que o alerta apareceu, categorias com probabilidade, sinais encontrados, contexto da análise, prioridade e o que fazer. |
| **Segurança** | Central com os 11 tipos de risco que a DIANA monitora e orientação para cada um. |
| **Configurações** | Preferências de proteção, privacidade e conta. Salvam ao alternar. |

## A regra que organiza a tela (RF-16)

> O responsável vê a **análise do risco** — nunca a conversa do filho.

A tela não tem como exibir mensagem: o backend simplesmente não envia. O que
chega são sinais (“pedido de segredo”, “pedido de imagem”), com confiança e
número de ocorrências, mais a explicação de por que aquilo virou alerta. O
detalhe mostra inclusive um aviso de que a análise é automatizada e não
determina, sozinha, que houve crime.

## Configuração

| Variável | Para quê | Padrão |
|---|---|---|
| `DIANA_API_URL` | Backend para onde o Vite encaminha `/api` em desenvolvimento. | `http://localhost:8080` |
| `VITE_API_BASE` | Base das chamadas em produção (quando não há proxy). | `/api` |

```bash
DIANA_API_URL=http://192.168.0.10:8080 npm run dev
```

## Comandos

```bash
npm run dev        # desenvolvimento, com proxy para o backend
npm run build      # typecheck + build de produção
npm run typecheck  # só a verificação de tipos
npm run preview    # serve o build
```

## Como o visual se mantém fiel

Os componentes, os tokens de cor e a moldura vieram do protótipo da landing
page — não foram reescritos “parecidos”. O que mudou foi só a fonte dos dados:
onde havia dado estático, agora há chamada ao backend, com estado de
carregamento e de erro.

Os tipos de `src/ml/types.ts` e `src/data/types.ts` espelham o que a API
devolve: se o contrato mudar no backend, o `typecheck` acusa aqui antes de a
tela quebrar na frente de alguém.

## Limites honestos

- **Sem autenticação.** Qualquer pessoa com a URL vê os alertas. O backend
  aceita uma chave simples (`x-api-key`), mas isso é um freio de demonstração —
  não há identidade nem autorização por responsável. Fase 2.
- **Os itens “Perfil”, “Criança vinculada” e “Preferências de notificação”**
  aparecem como link e ainda não abrem tela.
- **A lista atualiza a cada 15 segundos** por polling simples. Notificação
  push de verdade depende de service worker e de um canal de envio.
- **A Central de Segurança é conteúdo fixo** — é material de orientação, não
  resultado de análise.

## Se você chegou aqui por um caso real

**Disque 100** (violência contra crianças e adolescentes) e **CVV 188** (apoio
emocional) são gratuitos e funcionam 24h no Brasil.
