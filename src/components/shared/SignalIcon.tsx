import {
  Lock,
  Camera,
  UserX,
  Swords,
  Repeat2,
  HeartCrack,
  IdCard,
  ShieldAlert,
  CircleHelp,
  TrendingUp,
  ClipboardList,
  Scale,
  EyeOff,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

const signalIcons: Record<string, LucideIcon> = {
  // Sinais dos dados de demonstração
  lock: Lock,
  camera: Camera,
  isolation: UserX,
  aggression: Swords,
  repetition: Repeat2,
  emotional: HeartCrack,
  "personal-data": IdCard,
  sensitive: ShieldAlert,
  unknown: CircleHelp,
  approach: TrendingUp,
  // Sinais produzidos pelo Mock ML Analyzer
  secrecy_request: Lock,
  image_request: Camera,
  isolation_attempt: UserX,
  personal_information_request: IdCard,
  personal_information_shared: ClipboardList,
  threat: ShieldAlert,
  insult: Swords,
  blackmail: Scale,
  sexual_language: EyeOff,
  emotional_distress: HeartCrack,
  self_harm: HeartPulse,
};

interface SignalIconProps {
  icon: string;
  className?: string;
}

export function SignalIcon({ icon, className }: SignalIconProps) {
  const Icon = signalIcons[icon] ?? ShieldAlert;
  return <Icon className={className} />;
}
