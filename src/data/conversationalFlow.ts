// client/src/data/conversationalFlow.ts
import { ConversationalFlow } from '@/types/conversationalOnboarding';
import { WELLNESS_PACKS, AVAILABLE_SPORTS, SPORT_LEVELS, EQUIPMENT_LEVELS, STRENGTH_OBJECTIVES, FITNESS_EXPERIENCE_LEVELS, DIETARY_PREFERENCES, NUTRITION_OBJECTIVES } from './onboardingData';

// Suppression des imports d'options externes

export const CONVERSATIONAL_ONBOARDING_FLOW: ConversationalFlow = {
  id: 'myfithero_onboarding_v4',
  name: 'MyFitHero - AI-Powered Wellness Journey',
  description: 'Personalized onboarding powered by AI',
  estimatedDuration: 15,
  modules: ['sport', 'strength', 'nutrition', 'sleep', 'hydration', 'wellness'],
  initialStep: 'welcome',
  // locale supprimé : la logique de langue est gérée via le paramètre data dans les steps/options
  steps: [
    // 🚀 STEP 1: WELCOME
    {
      id: 'welcome',
      type: 'info',
      title: 'Welcome to MyFitHero! 🎉',
      subtitle: 'Your AI-Powered Wellness Coach',
      description: 'I\'ll help you build your personalized program in just a few minutes.',
      illustration: '🏆',
      tips: [
        'Answer honestly for best results',
        'You can change your choices anytime',
        'Takes about 10-15 minutes'
      ],
      estimatedTime: 1,
      nextStep: 'get_name'
    },


    // 📝 STEP 2: GET NAME
    {
      id: 'get_name',
      type: 'question',
      title: 'Let\'s get acquainted!',
      question: 'What should I call you?',
      description: 'Your name helps us personalize your experience',
      illustration: '👋',
      inputType: 'text',
      validation: [
        { type: 'required', message: 'Please enter your name' },
        { type: 'min', value: 2, message: 'Name must be at least 2 characters' }
      ],
      nextStep: 'wellness_pack',
      estimatedTime: 1
    },


    // 📦 STEP 3: MODULE SELECTION (PACKS + CUSTOM)
    {
      id: 'module_selection',
      type: 'question',
      title: (data: any) => data?.locale === 'us' ? 'Choose your program' : 'Choisis ton programme',
      question: (data: any) => data?.locale === 'us' ? 'Select a wellness pack or customize your modules' : 'Sélectionne un pack bien-être ou personnalise tes modules',
      description: (data: any) => data?.locale === 'us'
        ? 'Our packs are designed by experts. You can also create your own combination.'
        : 'Nos packs sont conçus par des experts. Tu peux aussi créer ta propre combinaison.',
      illustration: '🧩',
      inputType: 'single-select',
      options: (data: any) => [
        ...WELLNESS_PACKS.map((pack: any) => ({
          id: pack.id,
          label: data?.locale === 'us' ? pack.name_us : pack.name_fr,
          value: pack.id,
          description: data?.locale === 'us' ? pack.description_us : pack.description_fr,
          icon: pack.icon,
          modules: pack.modules
        })),
        {
          id: 'custom',
          label: data?.locale === 'us' ? 'Custom selection' : 'Personnaliser',
          value: 'custom',
          description: data?.locale === 'us' ? 'Choose modules individually' : 'Choisis les modules un par un',
          icon: '⚙️',
          modules: []
        }
      ],
      validation: [
        { type: 'required', message: (data: any) => data?.locale === 'us' ? 'Please select a pack or custom' : 'Merci de choisir un pack ou Personnaliser' }
      ],
      nextStep: (response: any) => {
        if (response === 'custom') return 'custom_modules';
        return 'module_upsell';
      },
      estimatedTime: 2
    },

    // �️ STEP 3.1: CUSTOM MODULES
    {
      id: 'custom_modules',
      type: 'question',
      title: (data: any) => data?.locale === 'us' ? 'Customize your modules' : 'Personnalise tes modules',
      question: (data: any) => data?.locale === 'us' ? 'Which areas do you want to work on?' : 'Quels domaines veux-tu travailler ?',
      description: (data: any) => data?.locale === 'us'
        ? 'Select one or more modules to build your own program.'
        : 'Sélectionne un ou plusieurs modules pour créer ton programme.',
      illustration: '📋',
      inputType: 'multi-select',
      options: (data: any) => [
        { id: 'sport', label: data?.locale === 'us' ? 'Sport & Performance' : 'Sport & Performance', value: 'sport', description: data?.locale === 'us' ? 'Personalized training programs for your sport' : 'Programmes personnalisés pour ton sport', icon: '🏃‍♂️', color: '#3B82F6' },
        { id: 'strength', label: data?.locale === 'us' ? 'Strength Training' : 'Musculation', value: 'strength', description: data?.locale === 'us' ? 'Muscle building and physical development' : 'Développement musculaire et physique', icon: '💪', color: '#EF4444' },
        { id: 'nutrition', label: data?.locale === 'us' ? 'Nutrition' : 'Nutrition', value: 'nutrition', description: data?.locale === 'us' ? 'Optimized nutrition for your goals' : 'Nutrition optimisée pour tes objectifs', icon: '🥗', color: '#10B981' },
        { id: 'sleep', label: data?.locale === 'us' ? 'Sleep' : 'Sommeil', value: 'sleep', description: data?.locale === 'us' ? 'Recovery and rest optimization' : 'Optimisation du repos et de la récupération', icon: '😴', color: '#8B5CF6' },
        { id: 'hydration', label: data?.locale === 'us' ? 'Hydration' : 'Hydratation', value: 'hydration', description: data?.locale === 'us' ? 'Hydration tracking and optimization' : 'Suivi et optimisation de l’hydratation', icon: '💧', color: '#06B6D4' },
        { id: 'wellness', label: data?.locale === 'us' ? 'Global Wellness' : 'Bien-être global', value: 'wellness', description: data?.locale === 'us' ? 'Holistic approach to health and wellness' : 'Approche globale du bien-être', icon: '🧘‍♀️', color: '#F59E0B' }
      ],
      validation: [
        { type: 'required', message: (data: any) => data?.locale === 'us' ? 'Please select at least one module' : 'Veuillez sélectionner au moins un module' }
      ],
      nextStep: 'module_upsell',
      estimatedTime: 2
    },

    // 💰 STEP 4: INTELLIGENT UPSELL
    {
      id: 'module_upsell',
      type: 'question',
      title: (data: any) => {
        // Upsell dynamique selon la sélection
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('strength')) {
          return data?.locale === 'us' ? 'Add Strength for 25% more performance!' : 'Ajoutez la musculation pour +25% de performance !';
        }
        if (data.selectedModules?.includes('strength') && !data.selectedModules?.includes('nutrition')) {
          return data?.locale === 'us' ? 'Nutrition is 70% of your results!' : 'La nutrition représente 70% de vos résultats !';
        }
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('sleep')) {
          return data?.locale === 'us' ? 'Recovery is crucial for performance' : 'La récupération est cruciale pour la performance';
        }
        return data?.locale === 'us' ? 'Boost your results!' : 'Boostez vos résultats !';
      },
      question: (data: any) => {
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('strength')) {
          return data?.locale === 'us' ? 'Would you like to add Strength Training?' : 'Voulez-vous ajouter la musculation à votre programme ?';
        }
        if (data.selectedModules?.includes('strength') && !data.selectedModules?.includes('nutrition')) {
          return data?.locale === 'us' ? 'Would you like to add Nutrition?' : 'Voulez-vous ajouter la nutrition à votre programme ?';
        }
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('sleep')) {
          return data?.locale === 'us' ? 'Would you like to add Sleep Optimization?' : 'Voulez-vous ajouter l’optimisation du sommeil ?';
        }
        return data?.locale === 'us' ? 'Would you like to add another module?' : 'Voulez-vous ajouter un autre module ?';
      },
      inputType: 'single-select',
      options: (data: any) => {
        const upsellOptions = [];
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('strength')) {
          upsellOptions.push({ id: 'add_strength', label: data?.locale === 'us' ? 'Add Strength' : 'Ajouter Musculation', value: 'strength' });
        }
        if (data.selectedModules?.includes('strength') && !data.selectedModules?.includes('nutrition')) {
          upsellOptions.push({ id: 'add_nutrition', label: data?.locale === 'us' ? 'Add Nutrition' : 'Ajouter Nutrition', value: 'nutrition' });
        }
        if (data.selectedModules?.includes('sport') && !data.selectedModules?.includes('sleep')) {
          upsellOptions.push({ id: 'add_sleep', label: data?.locale === 'us' ? 'Add Sleep' : 'Ajouter Sommeil', value: 'sleep' });
        }
        if (upsellOptions.length === 0) {
          upsellOptions.push({ id: 'no_upsell', label: data?.locale === 'us' ? 'Continue' : 'Continuer', value: 'none' });
        }
        return upsellOptions;
      },
      validation: [
        { type: 'required', message: (data: any) => data?.locale === 'us' ? 'Please make a choice' : 'Merci de faire un choix' }
      ],
      nextStep: (response: any, data: any) => {
        if (response && response !== 'none') {
          // Ajouter le module upsell à la sélection
          data.selectedModules = [...(data.selectedModules || []), response];
        }
        return 'personal_info';
      },
      estimatedTime: 1
    },

    // 💰 STEP 4.5: UPSELL (US Market)
    {
      id: 'module_upsell',
      type: 'question',
      title: 'Unlock 3x Faster Results! 🚀',
      question: 'Our AI agents work together for maximum impact',
      description: 'Studies show combining modules increases success rate by 73%',
      illustration: '🎁',
      inputType: 'single-select',
      options: [
        {
          id: 'accept_trial',
          label: '✅ Yes! Activate my 15-day FREE trial',
          value: 'accept',
          description: '🔥 No credit card • Cancel anytime • $0 today',
          icon: '🎯'
        },
        {
          id: 'decline_trial',
          label: 'No thanks, continue with selected modules',
          value: 'decline',
          description: 'You can always upgrade later',
          icon: '➡️'
        }
      ],
      nextStep: 'personal_info',
      estimatedTime: 1
    },

    // 👤 STEP 5: PERSONAL INFO
    {
      id: 'personal_info',
      type: 'question',
      title: 'Tell me about yourself',
      question: 'Help me personalize your programs',
      description: 'Your information is secure and private',
      illustration: '📊',
      inputType: 'single-select',
      options: [
        { id: 'age', label: 'Age', value: 'age' },
        { id: 'gender', label: 'Gender', value: 'gender' },
        { id: 'lifestyle', label: 'Lifestyle', value: 'lifestyle' },
        { id: 'time', label: 'Available time', value: 'time' }
      ],
      nextStep: (_: any, data: any) => {
        if (data.selectedModules?.includes('sport')) {
          return 'sport_selection';
        } else if (data.selectedModules?.includes('strength')) {
          return 'strength_setup';
        } else if (data.selectedModules?.includes('nutrition')) {
          return 'nutrition_setup';
        } else if (data.selectedModules?.includes('sleep')) {
          return 'sleep_setup';
        } else if (data.selectedModules?.includes('hydration')) {
          return 'hydration_setup';
        } else {
          return 'wellness_setup';
        }
      },
      estimatedTime: 3
    },

    // 🏃‍♂️ SPORT MODULE
    {
      id: 'sport_selection',
      type: 'question',
      title: 'Your main sport',
      question: 'What sport do you primarily practice?',
      description: 'This helps me create sport-specific programs',
      illustration: '🏃‍♂️',
      inputType: 'single-select',
      condition: (data: any) => data.selectedModules?.includes('sport') || false,
      options: AVAILABLE_SPORTS.map((sport: any) => ({
        id: sport.id,
        label: sport.name,
        value: sport.id,
        icon: sport.emoji
      })),
      validation: [
        { type: 'required', message: 'Please select your sport' }
      ],
      nextStep: 'sport_position',
      estimatedTime: 2
    },

    {
      id: 'sport_position',
      type: 'question',
      title: 'Your position/specialty',
      question: 'What\'s your position or specialty?',
      description: 'For even more targeted programs',
      illustration: '🎯',
      inputType: 'single-select',
      condition: (data: any) => !!(data.selectedModules?.includes('sport') && data.sport !== 'other'),
      options: [], // Will be filled dynamically based on sport
      nextStep: 'sport_level',
      estimatedTime: 1
    },

    {
      id: 'sport_level',
      type: 'question',
      title: 'Your sport level',
      question: 'How would you describe your level?',
      description: 'Be honest, this determines your program intensity',
      illustration: '📊',
      inputType: 'single-select',
      condition: (data: any) => data.selectedModules?.includes('sport') || false,
      options: SPORT_LEVELS.map((level: any) => ({
        id: level.id,
        label: level.name,
        value: level.id,
        description: level.description
      })),
      validation: [
        { type: 'required', message: 'Please select your level' }
      ],
      nextStep: 'sport_equipment',
      estimatedTime: 1
    },

    {
      id: 'sport_equipment',
      type: 'question',
      title: 'Your equipment',
      question: 'What equipment do you have access to?',
      description: 'I\'ll adapt programs to your available equipment',
      illustration: '🏋️‍♂️',
      inputType: 'single-select',
      condition: (data) => data.selectedModules?.includes('sport') || false,
      options: EQUIPMENT_LEVELS.map((level: any) => ({
        id: level.id,
        label: level.name,
        value: level.id,
        description: level.description
      })),
      validation: [
        { type: 'required', message: 'Please select your equipment level' }
      ],
      nextStep: (_: any, data: any) => {
        if (data.selectedModules?.includes('strength')) {
          return 'strength_setup';
        } else if (data.selectedModules?.includes('nutrition')) {
          return 'nutrition_setup';
        } else if (data.selectedModules?.includes('sleep')) {
          return 'sleep_setup';
        } else if (data.selectedModules?.includes('hydration')) {
          return 'hydration_setup';
        } else {
          return 'final_questions';
        }
      },
      estimatedTime: 1
    },

    // 💪 STRENGTH MODULE
    {
      id: 'strength_setup',
      type: 'question',
      title: 'Strength training goal',
      question: 'What\'s your main strength objective?',
      description: 'This determines your training style',
      illustration: '💪',
      inputType: 'single-select',
      condition: (data: any) => data.selectedModules?.includes('strength') || false,
      options: STRENGTH_OBJECTIVES.map((obj: any) => ({
        id: obj.id,
        label: obj.name,
        value: obj.id,
        description: obj.description
      })),
      validation: [
        { type: 'required', message: 'Please select your objective' }
      ],
      nextStep: 'strength_experience',
      estimatedTime: 2
    },

    {
      id: 'strength_experience',
      type: 'question',
      title: 'Your experience',
      question: 'How long have you been strength training?',
      description: 'This helps adjust exercise complexity',
      illustration: '📈',
      inputType: 'single-select',
      condition: (data: any) => data.selectedModules?.includes('strength') || false,
      options: FITNESS_EXPERIENCE_LEVELS.map((level: any) => ({
        id: level.id,
        label: level.name,
        value: level.id,
        description: level.description
      })),
      validation: [
        { type: 'required', message: 'Please select your experience level' }
      ],
      nextStep: (_: any, data: any) => {
        if (data.selectedModules?.includes('nutrition')) {
          return 'nutrition_setup';
        } else if (data.selectedModules?.includes('sleep')) {
          return 'sleep_setup';
        } else if (data.selectedModules?.includes('hydration')) {
          return 'hydration_setup';
        } else {
          return 'final_questions';
        }
      },
      estimatedTime: 1
    },

    // 🥗 NUTRITION MODULE
    {
      id: 'nutrition_setup',
      type: 'question',
      title: 'Your dietary preferences',
      question: 'What type of diet suits you?',
      description: 'I\'ll personalize meal plans to your preferences',
      illustration: '🥗',
      inputType: 'single-select',
      condition: (data: any) => data.selectedModules?.includes('nutrition') || false,
      options: DIETARY_PREFERENCES.map((pref: any) => ({
        id: pref.id,
        label: pref.name,
        value: pref.id,
        description: pref.description
      })),
      validation: [
        { type: 'required', message: 'Please select your dietary preference' }
      ],
      nextStep: 'nutrition_objective',
      estimatedTime: 2
    },

    {
      id: 'nutrition_objective',
      type: 'question',
      title: 'Nutrition goal',
      question: 'What do you want to achieve with nutrition?',
      description: 'This determines your caloric and macro approach',
      illustration: '🎯',
      inputType: 'single-select',
      condition: (data) => data.selectedModules?.includes('nutrition') || false,
      options: NUTRITION_OBJECTIVES.map((obj: any) => ({
        id: obj.id,
        label: obj.name,
        value: obj.id,
        description: obj.description
      })),
      validation: [
        { type: 'required', message: 'Please select your nutrition goal' }
      ],
      nextStep: (_: any, data: any) => {
        if (data.selectedModules?.includes('sleep')) {
          return 'sleep_setup';
        } else if (data.selectedModules?.includes('hydration')) {
          return 'hydration_setup';
        } else {
          return 'final_questions';
        }
      },
      estimatedTime: 1
    },

    // 😴 SLEEP MODULE
    {
      id: 'sleep_setup',
      type: 'question',
      title: 'Your sleep habits',
      question: 'How many hours do you sleep on average?',
      description: 'Sleep is crucial for recovery and performance',
      illustration: '😴',
      inputType: 'slider',
      condition: (data: any) => data.selectedModules?.includes('sleep') || false,
      validation: [
        { type: 'required', message: 'Please indicate your sleep duration' },
        { type: 'min', value: 4, message: 'Minimum: 4 hours' },
        { type: 'max', value: 12, message: 'Maximum: 12 hours' }
      ],
      nextStep: 'sleep_difficulties',
      estimatedTime: 1
    },

    {
      id: 'sleep_difficulties',
      type: 'question',
      title: 'Sleep quality',
      question: 'Do you have trouble sleeping?',
      description: 'I can provide tips to improve your sleep',
      illustration: '🌙',
      inputType: 'toggle',
      condition: (data) => data.selectedModules?.includes('sleep') || false,
      nextStep: (_: any, data: any) => {
        if (data.selectedModules?.includes('hydration')) {
          return 'hydration_setup';
        } else {
          return 'final_questions';
        }
      },
      estimatedTime: 1
    },

    // 💧 HYDRATION MODULE
    {
      id: 'hydration_setup',
      type: 'question',
      title: 'Your hydration',
      question: 'What\'s your daily hydration goal?',
      description: 'Good hydration improves performance and recovery',
      illustration: '💧',
      inputType: 'slider',
      condition: (data: any) => data.selectedModules?.includes('hydration') || false,
      validation: [
        { type: 'required', message: 'Please set your hydration goal' },
        { type: 'min', value: 1, message: 'Minimum: 1 liter per day' },
        { type: 'max', value: 5, message: 'Maximum: 5 liters per day' }
      ],
      nextStep: 'hydration_reminders',
      estimatedTime: 1
    },

    {
      id: 'hydration_reminders',
      type: 'question',
      title: 'Hydration reminders',
      question: 'Would you like smart hydration reminders?',
      description: 'I can send notifications based on your activity',
      illustration: '🔔',
      inputType: 'toggle',
      condition: (data) => data.selectedModules?.includes('hydration') || false,
      nextStep: 'final_questions',
      estimatedTime: 1
    },

    // 📝 FINAL QUESTIONS
    {
      id: 'final_questions',
      type: 'question',
      title: 'Last questions',
      question: 'Share your main motivation',
      description: 'What drives you most in this journey?',
      illustration: '🔥',
      inputType: 'text',
      validation: [
        { type: 'required', message: 'Please share your motivation' }
      ],
      nextStep: 'privacy_consent',
      estimatedTime: 2
    },

    // 🔒 CONSENT
    {
      id: 'privacy_consent',
      type: 'question',
      title: 'Privacy & Terms',
      question: 'Accept our terms of service?',
      description: 'Your data is secure and never sold',
      illustration: '🔒',
      inputType: 'toggle',
      validation: [
        { type: 'required', message: 'You must accept the terms to continue' }
      ],
      nextStep: 'summary',
      estimatedTime: 1
    },

    // 📋 FINAL SUMMARY
    {
      id: 'summary',
      type: 'summary',
      title: 'Your profile is ready! 🎉',
      description: 'Here\'s your configuration summary',
      illustration: '✨',
      nextStep: 'completion',
      estimatedTime: 2
    },

    // ✅ COMPLETION
    {
      id: 'completion',
      type: 'confirmation',
      title: 'Welcome to MyFitHero!',
      description: 'Your personalized journey awaits',
      illustration: '🚀',
      estimatedTime: 1
    }
  ]
};

// Utility function for module colors
function getModuleColor(moduleId: string): string {
  const colors: Record<string, string> = {
    sport: '#3B82F6',
    strength: '#EF4444',
    nutrition: '#10B981',
    sleep: '#8B5CF6',
    hydration: '#06B6D4',
    wellness: '#F59E0B'
  };
  return colors[moduleId] || '#6B7280';
}

// Function to get next steps based on selected modules
export function getNextStepForModules(selectedModules: string[], currentModule?: string): string {
  const moduleOrder = ['sport', 'strength', 'nutrition', 'sleep', 'hydration', 'wellness'];
  
  if (!currentModule) {
    // Find first selected module
    for (const module of moduleOrder) {
      if (selectedModules.includes(module)) {
        return `${module}_setup`;
      }
    }
    return 'final_questions';
  }
  
  // Find next selected module
  const currentIndex = moduleOrder.indexOf(currentModule);
  for (let i = currentIndex + 1; i < moduleOrder.length; i++) {
    if (selectedModules.includes(moduleOrder[i])) {
      return `${moduleOrder[i]}_setup`;
    }
  }
  
  return 'final_questions';
}

// Function to calculate estimated time based on selected modules
export function calculateEstimatedTime(selectedModules: string[]): number {
  const baseTime = 5; // Minutes for base steps
  const moduleTime: Record<string, number> = {
    sport: 4,
    strength: 2,
    nutrition: 3,
    sleep: 2,
    hydration: 2,
    wellness: 2
  };
  
  let totalTime = baseTime;
  selectedModules.forEach(module => {
    totalTime += moduleTime[module] || 0;
  });
  
  return totalTime;
}
