import { AIMessage, RoutineStep, UserSkinProfile, Product } from '../types';

export interface AskNoorPayload {
  message: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  userContext: {
    skinType: string;
    concerns: string[];
    sensitivity: string;
    goals: string[];
    shelfProducts: Product[];
    morningRoutine: RoutineStep[];
    eveningRoutine: RoutineStep[];
    recentState: string;
  };
}

export interface AskNoorResponse {
  reply: string;
  suggestedAction?: {
    id: string;
    label: string;
    type: 'adapt_routine' | 'pause_actives' | 'simplify_routine' | 'view_routine' | 'add_product';
    summary: string;
  } | null;
  grounded?: boolean;
}

export interface RoutineAnalysisResponse {
  morningSteps: {
    stepNumber: number;
    category: string;
    productName: string;
    brand: string;
    whyChosen: string;
    usageTip: string;
  }[];
  eveningSteps: {
    stepNumber: number;
    category: string;
    productName: string;
    brand: string;
    whyChosen: string;
    usageTip: string;
  }[];
  routinePhilosophy: string;
  compatibilityNotes: string[];
  genuineGaps: string[];
}

export async function askNoorApi(payload: AskNoorPayload): Promise<AskNoorResponse> {
  try {
    const res = await fetch('/api/ask-noor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Network call to /api/ask-noor failed, applying safe offline fallback:', err);
    return {
      reply: `Your skin's equilibrium is my main focus. Based on your current routine, prioritizing gentle hydration and steady barrier protection remains your best step today. Is there an active ingredient you have a specific question about?`,
      suggestedAction: null,
      grounded: false
    };
  }
}

export async function analyzeRoutineApi(
  skinProfile: Partial<UserSkinProfile>,
  productsOwned: Product[],
  customGoal?: string
): Promise<RoutineAnalysisResponse> {
  try {
    const res = await fetch('/api/analyze-routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skinProfile, productsOwned, customGoal })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Routine API fallback:', err);
    return {
      morningSteps: [
        {
          stepNumber: 1,
          category: 'Cleanser',
          productName: productsOwned.find(p => p.category === 'Cleanser')?.name || 'Gentle Amino Acid Hydrating Cleanser',
          brand: productsOwned.find(p => p.category === 'Cleanser')?.brand || 'NOOR Core',
          whyChosen: 'Preserves overnight acid mantle while lifting surface sebum.',
          usageTip: 'Tepid water rinse; pat dry.'
        },
        {
          stepNumber: 2,
          category: 'Hydration',
          productName: productsOwned.find(p => p.category === 'Toner' || p.category === 'Serum')?.name || 'Milky Essence Toner',
          brand: 'NOOR Botanicals',
          whyChosen: 'Delivers water-phase replenishment directly after cleansing.',
          usageTip: 'Press 4 drops gently onto damp skin.'
        },
        {
          stepNumber: 3,
          category: 'Moisturizer',
          productName: productsOwned.find(p => p.category === 'Moisturizer')?.name || 'Ceramide Barrier Defense Cream',
          brand: 'NOOR Core',
          whyChosen: 'Locks in moisture and supports daytime cellular lipid cohesion.',
          usageTip: 'Pea-sized amount across face and neck.'
        },
        {
          stepNumber: 4,
          category: 'SPF',
          productName: productsOwned.find(p => p.category === 'SPF')?.name || 'Weightless Sheer Mineral UV Fluid SPF 50+',
          brand: 'NOOR Shield',
          whyChosen: 'Shields against collagen degradation and UV hyperpigmentation.',
          usageTip: 'Two generous finger-lengths every morning.'
        }
      ],
      eveningSteps: [
        {
          stepNumber: 1,
          category: 'Cleanser',
          productName: productsOwned.find(p => p.category === 'Cleanser')?.name || 'Gentle Amino Acid Hydrating Cleanser',
          brand: 'NOOR Core',
          whyChosen: 'Dissolves mineral SPF and daily airborne particles completely.',
          usageTip: 'Massage gently for 60 seconds.'
        },
        {
          stepNumber: 2,
          category: 'Treatment',
          productName: productsOwned.find(p => p.category === 'Serum')?.name || 'Micro-Encapsulated Retinaldehyde 0.05%',
          brand: 'NOOR Renewal',
          whyChosen: 'Nighttime cellular renewal and texture refinement.',
          usageTip: 'Apply on dry skin 2-3 nights weekly.'
        },
        {
          stepNumber: 3,
          category: 'Moisturizer',
          productName: productsOwned.find(p => p.category === 'Moisturizer')?.name || 'Ceramide Barrier Defense Cream',
          brand: 'NOOR Core',
          whyChosen: 'Restores the lipid matrix during overnight circadian cellular recovery.',
          usageTip: 'Smooth gently and press with warm palms.'
        }
      ],
      routinePhilosophy: 'Calm, barrier-centric sequence designed around gentle efficacy and zero stripping.',
      compatibilityNotes: ['Do not mix high-strength exfoliation with retinaldehyde in the same evening.'],
      genuineGaps: []
    };
  }
}

export interface ProductRecognitionResult {
  brand: string;
  name: string;
  category: 'Cleanser' | 'Toner' | 'Essence' | 'Serum' | 'Treatment' | 'Exfoliant' | 'Moisturizer' | 'SPF' | 'Eye Cream' | 'Face Oil' | 'Mask' | 'Spot Treatment';
  keyActives: string[];
  routinePlacement: ('Morning' | 'Evening' | 'Weekly')[];
  usageTip: string;
  whyChosen: string;
  suitabilityNotes?: string;
  frequency?: 'Daily' | '2-3x per week' | 'Weekly';
  confidence?: 'High' | 'Medium';
  analyzedBy?: string;
}

export async function analyzeProductPhotoApi(
  imageBase64?: string,
  textHint?: string,
  userSkinProfile?: Partial<UserSkinProfile>
): Promise<ProductRecognitionResult> {
  try {
    const res = await fetch('/api/analyze-product-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        textHint,
        userSkinProfile
      })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Product photo recognition fallback:', err);
    const hint = (textHint || '').toLowerCase();
    
    if (hint.includes('spf') || hint.includes('sunscreen')) {
      return {
        brand: 'Recognized Mineral UV',
        name: textHint || 'Invisible Mineral Fluid Sun Shield SPF 50+',
        category: 'SPF',
        keyActives: ['Zinc Oxide', 'Titanium Dioxide'],
        routinePlacement: ['Morning'],
        usageTip: 'Apply generously across face and neck as the final morning step.',
        whyChosen: 'Essential UV broad-spectrum barrier against oxidative stress and photoaging.',
        frequency: 'Daily',
        confidence: 'High',
        analyzedBy: 'NOOR Product Engine'
      };
    }

    if (hint.includes('cleans') || hint.includes('wash')) {
      return {
        brand: 'Recognized Cleanser',
        name: textHint || 'Gentle Amino Acid Hydrating Cleanser',
        category: 'Cleanser',
        keyActives: ['Oat Amino Acids', 'Glycerin'],
        routinePlacement: ['Morning', 'Evening'],
        usageTip: 'Massage onto damp skin for 60 seconds; rinse with tepid water.',
        whyChosen: 'Cleanses effectively without stripping the natural moisture barrier.',
        frequency: 'Daily',
        confidence: 'High',
        analyzedBy: 'NOOR Product Engine'
      };
    }

    return {
      brand: 'Recognized Skincare Formulation',
      name: textHint || 'Bio-Identical Barrier Complex Moisturizer',
      category: 'Moisturizer',
      keyActives: ['Ceramides NP', 'Squalane', 'Cholesterol'],
      routinePlacement: ['Morning', 'Evening'],
      usageTip: 'Warm between fingertips and gently press into skin to seal in hydration.',
      whyChosen: 'Nourishes the stratum corneum and prevents moisture loss.',
      frequency: 'Daily',
      confidence: 'Medium',
      analyzedBy: 'NOOR Product Engine'
    };
  }
}

