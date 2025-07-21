import React from 'react';
import { AVAILABLE_SPORTS } from '@/data/onboardingData';
import type { OnboardingData } from '@/types/onboarding';

interface PersonalizedWidgetProps {
  onboardingData: OnboardingData;
}

function getPersonalizedTips(onboardingData: OnboardingData) {
  const tips: string[] = [];
  if (!onboardingData.sport) return tips;
  const sport = AVAILABLE_SPORTS.find(s => s.id === onboardingData.sport);
  if (!sport) return tips;

  // Hydratation
  if (sport.environment === 'outdoor') {
    tips.push('💧 Hydratation : +20% recommandée (sport outdoor)');
  }
  // Sommeil
  if (sport.contactLevel === 'high') {
    tips.push('😴 Sommeil : +1h de sommeil recommandée (sport à contact élevé)');
  }
  // Fréquence d’entraînement (exemple simple)
  if (sport.category === 'team') {
    tips.push('📅 Fréquence : 3-5 séances/semaine recommandées pour les sports collectifs');
  } else if (sport.category === 'individual') {
    tips.push('📅 Fréquence : 2-4 séances/semaine recommandées pour les sports individuels');
  }
  return tips;
}

const PersonalizedWidget: React.FC<PersonalizedWidgetProps> = ({ onboardingData }) => {
  const tips = getPersonalizedTips(onboardingData);
  if (tips.length === 0) return null;
  return (
    <div className="personalized-widget" style={{
      background: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 20,
      margin: '24px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 600, fontSize: '1.1rem' }}>Conseils personnalisés</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {tips.map((tip, i) => (
          <li key={i} style={{ marginBottom: 8 }}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalizedWidget;
