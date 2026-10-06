import { UserSkinProfile, RoutineStep, SkinCheckIn, AIMessage, ConsistencyDay } from '../types';

export const INITIAL_USER_PROFILE: UserSkinProfile = {
  id: 'usr-noor-101',
  name: 'Elena Vance',
  email: 'elena@noor.app',
  skinType: 'Combination',
  concerns: ['Dryness', 'Texture', 'Dullness'],
  sensitivity: 'Sometimes sensitive',
  goals: ['Barrier repair', 'Deep hydration', 'Restore natural glow'],
  routinePreference: 'Balanced (4-5 steps)',
  fragranceFreePreferred: true,
  budgetPreference: 'Balanced luxury',
  qualitativeStatus: 'Improving',
  qualitativeStatusReason: 'Skin barrier is regaining lipid balance after consistent ceramide defense and reduced aggressive acid usage over the last 12 days.',
  onboardingCompleted: true,
  isLoggedIn: false,
  membershipTier: 'Privilege',
  createdAt: '2026-08-15'
};

export const INITIAL_ROUTINE_STEPS: RoutineStep[] = [
  {
    id: 'step-am-1',
    stepNumber: 1,
    timeOfDay: 'Morning',
    category: 'Cleanser',
    productId: 'prod-cleanse-1',
    productName: 'Gentle Amino Acid Hydrating Cleanser',
    brand: 'NOOR Core',
    usageTip: 'Rinse with tepid water; pat gently with clean muslin cloth.',
    whyChosen: 'Removes overnight transepidermal sebum while preserving delicate acid mantle.',
    isCompletedToday: true,
    frequency: 'Daily'
  },
  {
    id: 'step-am-2',
    stepNumber: 2,
    timeOfDay: 'Morning',
    category: 'Toner',
    productId: 'prod-toner-1',
    productName: 'Barrier Calming Milky Essence Toner',
    brand: 'NOOR Botanicals',
    usageTip: 'Press onto slightly damp skin. Pat until fully absorbed.',
    whyChosen: 'Delivers immediate water-phase hydration with calming rice water and panthenol.',
    isCompletedToday: true,
    frequency: 'Daily'
  },
  {
    id: 'step-am-3',
    stepNumber: 3,
    timeOfDay: 'Morning',
    category: 'Serum',
    productId: 'prod-vitc-1',
    productName: 'Stabilized Ascorbyl Glucoside 10% Glow Serum',
    brand: 'NOOR Luminescence',
    usageTip: '3 drops across forehead, cheeks, and neck before moisturizer.',
    whyChosen: 'Antioxidant defense against daytime free-radical and blue-light oxidative stress.',
    isCompletedToday: false,
    frequency: 'Daily'
  },
  {
    id: 'step-am-4',
    stepNumber: 4,
    timeOfDay: 'Morning',
    category: 'Moisturizer',
    productId: 'prod-moist-1',
    productName: 'Ceramide Lipid Matrix Barrier Balm',
    brand: 'NOOR Core',
    usageTip: 'A light veil warmed between fingers.',
    whyChosen: 'Emollient shield to prevent daytime moisture evaporation.',
    isCompletedToday: false,
    frequency: 'Daily'
  },
  {
    id: 'step-am-5',
    stepNumber: 5,
    timeOfDay: 'Morning',
    category: 'SPF',
    productId: 'prod-spf-1',
    productName: 'Weightless Sheer Mineral UV Fluid SPF 50+ PA++++',
    brand: 'NOOR Shield',
    usageTip: 'Two generous finger lengths. Reapply if outdoors during peak UV.',
    whyChosen: 'Essential cellular shield preventing collagen degradation and photo-hyperpigmentation.',
    isCompletedToday: false,
    frequency: 'Daily'
  },
  {
    id: 'step-pm-1',
    stepNumber: 1,
    timeOfDay: 'Evening',
    category: 'Cleanser',
    productId: 'prod-cleanse-1',
    productName: 'Gentle Amino Acid Hydrating Cleanser',
    brand: 'NOOR Core',
    usageTip: 'Massage for full 60 seconds to emulsify mineral sunscreen.',
    whyChosen: 'Dissolves daily pollution particles without tightening skin.',
    isCompletedToday: false,
    frequency: 'Daily'
  },
  {
    id: 'step-pm-2',
    stepNumber: 2,
    timeOfDay: 'Evening',
    category: 'Toner',
    productId: 'prod-toner-1',
    productName: 'Barrier Calming Milky Essence Toner',
    brand: 'NOOR Botanicals',
    usageTip: 'Double layer when skin feels parched from indoor HVAC air.',
    whyChosen: 'Prepares stratum corneum for active cellular absorption.',
    isCompletedToday: false,
    frequency: 'Daily'
  },
  {
    id: 'step-pm-3',
    stepNumber: 3,
    timeOfDay: 'Evening',
    category: 'Treatment',
    productId: 'prod-retinol-1',
    productName: 'Micro-Encapsulated Retinaldehyde 0.05% Night Fluid',
    brand: 'NOOR Renewal',
    usageTip: 'Wait until skin is completely dry before smoothing 1 pump.',
    whyChosen: 'Accelerates youthful cell renewal and refines skin texture while you sleep.',
    isCompletedToday: false,
    frequency: '2-3x per week'
  },
  {
    id: 'step-pm-4',
    stepNumber: 4,
    timeOfDay: 'Evening',
    category: 'Moisturizer',
    productId: 'prod-moist-1',
    productName: 'Ceramide Lipid Matrix Barrier Balm',
    brand: 'NOOR Core',
    usageTip: 'Generous layer over face and down the neck.',
    whyChosen: 'Replenishes lost intercellular lipids during peak skin repair circadian hours.',
    isCompletedToday: false,
    frequency: 'Daily'
  }
];

export const INITIAL_CHECKINS: SkinCheckIn[] = [
  {
    id: 'chk-1',
    date: '2026-10-04T20:30:00Z',
    hydrationLevel: 'Plump & dewy',
    barrierState: 'Resilient',
    clarityState: 'Clear & smooth',
    qualitativeState: 'Improving',
    qualitativeSummary: 'Cheeks feel supple; no tight feeling after cleansing.',
    notes: 'Switching to milky essence toner seems to have resolved the morning cheek flaking.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    photoNote: 'Cheeks look calm and even-toned under soft morning light.'
  },
  {
    id: 'chk-2',
    date: '2026-09-28T21:15:00Z',
    hydrationLevel: 'Balanced',
    barrierState: 'Calm',
    clarityState: 'Clear & smooth',
    qualitativeState: 'Stable',
    qualitativeSummary: 'Barrier stable. Tolerating retinaldehyde twice weekly with zero flaking.',
    notes: 'Used barrier balm directly after retinaldehyde. No tingling experienced.'
  },
  {
    id: 'chk-3',
    date: '2026-09-20T19:45:00Z',
    hydrationLevel: 'Slightly dry',
    barrierState: 'Sensitive',
    clarityState: 'Minor blemishes',
    qualitativeState: 'Needs attention',
    qualitativeSummary: 'Slight wind-burn and dehydration after travel.',
    notes: 'Paused retinaldehyde for 3 nights. Focused solely on hydrating essence + ceramide balm.'
  }
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Good day, Elena. I'm NOOR. I've reviewed your combination skin profile and your current shelf. Your skin barrier is showing strong stability this week. 

How does your skin feel today? You can ask me what to use tonight, check if two products can be paired, or adapt your steps if your skin feels dry or reactive.`,
    timestamp: '2026-10-06T08:00:00Z'
  }
];

export const INITIAL_CONSISTENCY: ConsistencyDay[] = [
  { date: '2026-09-30', morningCompleted: true, eveningCompleted: true },
  { date: '2026-10-01', morningCompleted: true, eveningCompleted: true },
  { date: '2026-10-02', morningCompleted: true, eveningCompleted: false },
  { date: '2026-10-03', morningCompleted: true, eveningCompleted: true },
  { date: '2026-10-04', morningCompleted: true, eveningCompleted: true },
  { date: '2026-10-05', morningCompleted: true, eveningCompleted: true },
  { date: '2026-10-06', morningCompleted: true, eveningCompleted: false }
];
