/**
 * DIANA — Tipos do domínio de análise de risco (ML).
 *
 * Esta camada descreve o CONTRATO entre o pipeline de análise e o restante da
 * aplicação. Os componentes React consomem somente `AnalysisResult` e nunca
 * determinam risco diretamente.
 */

export type MessageAuthor = "child" | "other";

export interface ConversationMessage {
  id: string;
  author: MessageAuthor;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  childId: string;
  childName: string;
  contactId: string;
  contactName: string;
  messages: ConversationMessage[];
  startedAt: string;
}

export type RiskLevel = "none" | "low" | "medium" | "high" | "critical";

export type RiskPriority = "low" | "medium" | "high";

export type RiskCategory =
  | "grooming"
  | "image_request"
  | "cyberbullying"
  | "blackmail"
  | "threat"
  | "personal_information"
  | "isolation"
  | "sexual_content"
  | "emotional_distress"
  | "self_harm";

export type SignalSeverity = "low" | "medium" | "high";

export interface DetectedSignal {
  id: string;
  type: string;
  confidence: number;
  messageIds: string[];
  title: string;
  description: string;
  severity: SignalSeverity;
}

export interface RiskPrediction {
  category: RiskCategory;
  probability: number;
  level: RiskLevel;
}

export interface RiskAssessment {
  level: RiskLevel;
  priority: RiskPriority;
  categories: RiskPrediction[];
  requiresGuardianAttention: boolean;
  rationale: string;
  /** Indicador técnico 0–100 (somente para o protótipo). */
  score: number;
}

export interface ContextualFactor {
  type: "content" | "sequence" | "frequency" | "escalation" | "combination";
  label: string;
  description: string;
  contribution: "low" | "medium" | "high";
}

export interface ExplanationResult {
  summary: string;
  topSignals: DetectedSignal[];
  contextualFactors: ContextualFactor[];
  recommendedActions: string[];
}

export interface ModelMetadata {
  modelName: string;
  version: string;
  environment: "mock" | "development" | "production";
}

export interface PiiFinding {
  messageId: string;
  type: string;
  snippet: string;
  pseudonymized: boolean;
}

export interface PrivacyReport {
  prepared: boolean;
  piiMinimized: boolean;
  pseudonymizedFields: string[];
  protected: boolean;
}

export type PipelineStage =
  | "received"
  | "preprocessing"
  | "feature_extraction"
  | "ml_analysis"
  | "context_analysis"
  | "risk_engine"
  | "explainability";

export interface AuditEntry {
  timestamp: string;
  stage: PipelineStage | "alert" | "notified";
  description: string;
}

export interface ConversationFeatures {
  secrecyRequests: number;
  imageRequests: number;
  personalInfoRequests: number;
  isolationAttempts: number;
  threats: number;
  insults: number;
  blackmailAttempts: number;
  sexualContentSignals: number;
  emotionalDistressSignals: number;
  selfHarmSignals: number;
  messageCount: number;
  suspiciousMessageCount: number;
  conversationEscalation: number;
}

export interface AnalysisResult {
  conversationId: string;
  assessment: RiskAssessment;
  signals: DetectedSignal[];
  explanation: ExplanationResult;
  features: ConversationFeatures;
  model: ModelMetadata;
  privacy: PrivacyReport;
  audit: AuditEntry[];
  processedAt: string;
}

export const riskCategoryLabels: Record<RiskCategory, string> = {
  grooming: "Possível grooming / aliciamento",
  image_request: "Solicitação de imagem íntima",
  cyberbullying: "Cyberbullying",
  blackmail: "Chantagem",
  threat: "Ameaça",
  personal_information: "Compartilhamento de informação pessoal",
  isolation: "Tentativa de isolamento",
  sexual_content: "Conteúdo potencialmente sexual",
  emotional_distress: "Sinais de sofrimento emocional",
  self_harm: "Linguagem relacionada a automutilação ou suicídio",
};

export const pipelineStageLabels: Record<PipelineStage, string> = {
  received: "Conversa recebida",
  preprocessing: "Pré-processamento",
  feature_extraction: "Extração de características",
  ml_analysis: "Análise ML",
  context_analysis: "Análise de contexto",
  risk_engine: "Risk Engine",
  explainability: "Explicabilidade",
};
