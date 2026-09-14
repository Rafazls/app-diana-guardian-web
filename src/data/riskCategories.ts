import type { RiskCategory } from "./types";

export const riskCategories: RiskCategory[] = [
  {
    id: "grooming",
    name: "Possível grooming / aliciamento",
    priority: "alta",
    description:
      "Padrões de aproximação de um adulto com a criança, geralmente com elogios, atenção excessiva e pedidos progressivos, que podem evoluir para solicitações de sigilo, imagens ou encontros.",
    examples: [
      "Elogios excessivos e demonstrações de carinho repentinas",
      "Pedidos de que a conversa fique em segredo",
      "Perguntas pessoais em progressão rápida",
      "Tentativa de isolamento da criança de seus responsáveis",
    ],
    orientation:
      "Converse com a criança com calma, sem julgamento. Preserve as evidências da conversa. Avalie a necessidade de bloquear o contato e, se necessário, busque orientação profissional ou denuncie às autoridades competentes.",
  },
  {
    id: "intimate-image-request",
    name: "Solicitação de imagem íntima",
    priority: "alta",
    description:
      "Solicitação, pressão ou tentativa de obter fotografias ou vídeos da criança, especialmente de caráter pessoal ou íntimo.",
    examples: [
      "Pedidos diretos por fotos ou vídeos",
      "Promessas, presentes ou ameaças em troca de imagens",
      "Normalização de envios de imagens como 'brincadeira'",
      "Pedidos acompanhados de sigilo",
    ],
    orientation:
      "Não compartilhe ou repasse as imagens. Bloqueie o contato e registre as evidências. Busque ajuda especializada e considere reportar o caso às autoridades competentes.",
  },
  {
    id: "cyberbullying",
    name: "Cyberbullying",
    priority: "media",
    description:
      "Ataques repetidos, humilhações, xingamentos ou exclusão direcionados à criança em ambientes digitais.",
    examples: [
      "Xingamentos e apelidos depreciativos",
      "Humilhação pública em grupos ou redes",
      "Exclusão deliberada de grupos de conversa",
      "Ameaças veladas de ridicularização",
    ],
    orientation:
      "Converse com a criança sobre o que aconteceu, sem culpar. Reforce o valor da criança e evite revidar os ataques. Avalie o bloqueio do contato e o acompanhamento emocional.",
  },
  {
    id: "blackmail",
    name: "Chantagem",
    priority: "media",
    description:
      "Tentativas de pressionar a criança usando informações, imagens ou segredos para obter algo em troca.",
    examples: [
      "'Se você não fizer isso, eu conto para todos'",
      "Uso de imagens ou conversas como moeda de troca",
      "Pressão para continuar conversando 'em troca de silêncio'",
      "Ameaças de exclusão de grupos ou jogos",
    ],
    orientation:
      "Reassegure à criança que ela não tem culpa. Jamais negocie com quem chantageia. Preserve as evidências e busque orientação de um profissional ou das autoridades.",
  },
  {
    id: "threat",
    name: "Ameaça",
    priority: "media",
    description:
      "Mensagens que ameaçam a integridade física, emocional ou social da criança, de forma direta ou velada.",
    examples: [
      "Ameaças de violência física",
      "Ameaças de expor informações pessoais",
      "Intimidação para que a criança faça algo contra a vontade",
      "Ameaças dirigidas a amigos ou familiares",
    ],
    orientation:
      "Leve qualquer ameaça a sério. Bloqueie o contato, preserve os registros e busque ajuda imediatamente. Em caso de risco iminente, acione as autoridades.",
  },
  {
    id: "personal-info",
    name: "Compartilhamento de informação pessoal",
    priority: "baixa",
    description:
      "Solicitação ou compartilhamento de dados pessoais que podem identificar ou localizar a criança, como escola, endereço, idade ou rotina.",
    examples: [
      "Perguntas sobre escola, endereço ou telefone",
      "Compartilhamento de dados por parte da criança",
      "Perguntas sobre a rotina diária e horários",
      "Tentativas de descobrir onde a criança estuda ou mora",
    ],
    orientation:
      "Explique à criança quais informações são pessoais e não devem ser compartilhadas. Revise as configurações de privacidade dos aplicativos e reforce a conversa sobre o tema.",
  },
  {
    id: "isolation",
    name: "Tentativa de isolamento",
    priority: "baixa",
    description:
      "Linguagem que desencoraja a criança de conversar com seus responsáveis sobre a interação.",
    examples: [
      "'Não conte para seus pais'",
      "'Seus pais não vão entender'",
      "'Isso é um segredo nosso'",
      "Desencorajamento de buscar ajuda de adultos",
    ],
    orientation:
      "Cultive um ambiente de confiança onde a criança se sinta segura para compartilhar. Reforce que segredos que a incomodam devem ser contados a um adulto de confiança.",
  },
  {
    id: "sexual-content",
    name: "Conteúdo potencialmente sexual",
    priority: "baixa",
    description:
      "Presença de conversas, piadas ou conteúdo de conotação sexual inadequado para a faixa etária da criança.",
    examples: [
      "Comentários ou piadas de conotação sexual",
      "Compartilhamento de conteúdo sexualizado",
      "Perguntas sobre o corpo da criança",
      "Normalização de temas adultos na conversa",
    ],
    orientation:
      "Converse com a criança de forma adequada à idade. Explique o que é um contato inapropriado e reforce que ela pode e deve buscar ajuda sempre que se sentir desconfortável.",
  },
  {
    id: "emotional-distress",
    name: "Sinais de sofrimento emocional",
    priority: "baixa",
    description:
      "Indicadores de que a criança está vivenciando tristeza, ansiedade, medo ou angústia em suas interações digitais.",
    examples: [
      "Mensagens que expressam tristeza ou medo",
      "Retração abrupta ou mudança de comportamento",
      "Relatos de exclusão ou humilhação",
      "Evitação de conversas sobre o tema",
    ],
    orientation:
      "Aproxime-se com acolhimento e sem pressa. Valide os sentimentos da criança e procure entender o contexto. Se necessário, busque apoio psicológico especializado.",
  },
  {
    id: "self-harm",
    name: "Linguagem relacionada a automutilação ou suicídio",
    priority: "alta",
    description:
      "Menções a automutilação, pensamentos suicidas ou desesperança. Exige acolhimento imediato e cuidadoso.",
    examples: [
      "Menções a se machucar ou desaparecer",
      "Expressões de desesperança intensa",
      "Relatos de vontade de 'sumir' ou 'desistir'",
      "Banalização de temas de automutilação",
    ],
    orientation:
      "Leve a situação a sério e acolha imediatamente. Não minimize os sentimentos da criança. Busque ajuda profissional especializada com urgência e, em caso de risco imediato, acione os serviços de emergência (como o CVV no Brasil, pelo 188).",
  },
];

export const priorityConfig: Record<
  RiskCategory["priority"],
  { label: string; badgeVariant: "high" | "medium" | "low" }
> = {
  alta: { label: "Prioridade alta", badgeVariant: "high" },
  media: { label: "Prioridade média", badgeVariant: "medium" },
  baixa: { label: "Prioridade baixa", badgeVariant: "low" },
};
