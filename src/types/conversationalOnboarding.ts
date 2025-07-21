// client/src/types/conversationalOnboarding.ts

export interface ConversationalStep {
  id: string;
  type: 'question' | 'info' | 'confirmation' | 'summary';
  title: string | ((data: any) => string);
  subtitle?: string | ((data: any) => string);
  question?: string | ((data: any) => string);
  description?: string | ((data: any) => string);
  options?: ConversationalOption[] | ((data: any) => ConversationalOption[]);
  inputType?: 'text' | 'number' | 'slider' | 'toggle' | 'multi-select' | 'single-select' | 'group';
  fields?: Array<{
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'toggle';
    options?: Array<{ id: string; label: string; value: any }>;
    validation?: ValidationRule[];
  }>;
  validation?: ValidationRule[];
  nextStep?: string | ((response: any, data: OnboardingData) => string);
  condition?: (data: OnboardingData) => boolean;
  aiPrompt?: string | ((data: any) => string); // Pour les réponses contextuelles de l'IA
  illustration?: string | ((data: any) => string); // Emoji ou icône
  tips?: string[] | ((data: any) => string[]);
  estimatedTime?: number; // En minutes
}


export interface ConversationalOption {
  id: string;
  label: string | ((data: any) => string);
  value: any;
  description?: string | ((data: any) => string);
  icon?: string | ((data: any) => string);
  color?: string;
  nextStep?: string;
  triggers?: string[]; // Actions ou modules à activer
  disabled?: boolean;
  tooltip?: string | ((data: any) => string);
}


export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string | ((data: any) => string);
  validator?: (value: any) => boolean;
}

export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  estimatedTimeLeft: number;
  skipCount: number;
  moduleSpecificSteps: Record<string, string[]>;
}

export interface OnboardingData {
  // Progression et métadonnées
  progress: OnboardingProgress;
  startedAt: Date;
  lastUpdated: Date;
  
  // Étape 1: Présentation et objectif principal
  firstName?: string;
  mainObjective?: string;
  selectedModules?: string[];
  
  // Étape 2: Informations personnelles de base
  age?: number;
  gender?: 'male' | 'female';
  lifestyle?: 'student' | 'office_worker' | 'physical_job' | 'retired';
  availableTimePerDay?: number;
  
  // Module Sport (conditionnel)
  sport?: string;
  sportPosition?: string;
  sportLevel?: 'recreational' | 'amateur_competitive' | 'semi_professional' | 'professional';
  seasonPeriod?: 'off_season' | 'pre_season' | 'in_season' | 'recovery';
  trainingFrequency?: number;
  equipmentLevel?: 'no_equipment' | 'minimal_equipment' | 'some_equipment' | 'full_gym';
  
  // Module Musculation (conditionnel)
  addStrengthTraining?: boolean;
  strengthObjective?: 'strength' | 'power' | 'hypertrophy' | 'injury_prevention' | 'endurance';
  strengthExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Module Nutrition (conditionnel)
  dietaryPreference?: string;
  foodAllergies?: string[];
  nutritionObjective?: 'muscle_gain' | 'weight_loss' | 'maintenance' | 'performance';
  dietaryRestrictions?: string[];
  cookingSkill?: 'beginner' | 'intermediate' | 'advanced';
  mealPrepTime?: number;
  
  // Module Sommeil (conditionnel)
  averageSleepHours?: number;
  sleepDifficulties?: boolean;
  sleepSchedule?: 'early_bird' | 'night_owl' | 'flexible';
  sleepEnvironment?: string[];
  
  // Module Hydratation (conditionnel)
  hydrationGoal?: number;
  hydrationReminders?: boolean;
  hydrationContext?: string[];
  
  // Module Bien-être (conditionnel)
  stressLevel?: number;
  mentalHealthFocus?: string[];
  recoveryPreferences?: string[];
  
  // Finalisation
  motivation?: string;
  specificGoals?: string[];
  challenges?: string[];
  privacyConsent?: boolean;
  marketingConsent?: boolean;
  
  // Données calculées/dérivées
  recommendedPrograms?: string[];
  personalizedTips?: string[];
  estimatedResults?: {
    timeframe: string;
    expectations: string[];
  };
}

export interface ConversationalFlow {
  id: string;
  name: string;
  description: string;
  steps: ConversationalStep[];
  initialStep: string;
  estimatedDuration: number;
  modules: string[];
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  nextAction?: string;
  confidence: number;
  context?: Record<string, any>;
}
