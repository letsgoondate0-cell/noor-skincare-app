export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Unsure';

export type SkinConcern =
  | 'Acne'
  | 'Dryness'
  | 'Oiliness'
  | 'Dark spots'
  | 'Redness'
  | 'Texture'
  | 'Sensitivity'
  | 'Dullness'
  | 'Fine lines'
  | 'Uneven tone'
  | 'Barrier repair';

export type SensitivityLevel = 'Not sensitive' | 'Sometimes sensitive' | 'Very sensitive' | 'Unsure';

export type SkincareGoal =
  | 'Barrier repair'
  | 'Deep hydration'
  | 'Calm redness'
  | 'Fade hyperpigmentation'
  | 'Clear blemishes'
  | 'Gentle healthy aging'
  | 'Smooth skin texture'
  | 'Restore natural glow';

export type ProductCategory =
  | 'Cleanser'
  | 'Toner'
  | 'Essence'
  | 'Serum'
  | 'Treatment'
  | 'Exfoliant'
  | 'Moisturizer'
  | 'SPF'
  | 'Eye Cream'
  | 'Face Oil'
  | 'Mask'
  | 'Spot Treatment';

export type RoutineTime = 'Morning' | 'Evening' | 'Weekly';

export type QualitativeSkinStatus = 'Improving' | 'Stable' | 'Needs attention' | 'Recently changed';

export type UserReaction = 'Loving it' | 'Neutral' | 'Caused breakout' | 'Caused redness/dryness' | 'Untested';

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  keyActives: string[];
  allIngredients?: string[];
  usageInstructions: string;
  texture?: string;
  targetConcerns: SkinConcern[];
  isFragranceFree: boolean;
  imageUrl?: string;
  routinePlacement: ('Morning' | 'Evening' | 'Weekly')[];
  incompatibilities?: string[]; // e.g., ["Retinoids", "AHA/BHA"]
  openedDate?: string;
  expirationMonths?: number;
  userReaction?: UserReaction;
  userNotes?: string;
  isOwned?: boolean;
}

export interface RoutineStep {
  id: string;
  stepNumber: number;
  timeOfDay: RoutineTime;
  category: ProductCategory;
  productId: string;
  productName: string;
  brand: string;
  usageTip: string;
  whyChosen: string;
  isCompletedToday: boolean;
  frequency?: 'Daily' | '2-3x per week' | 'Weekly';
  isOptional?: boolean;
}

export interface SkinCheckIn {
  id: string;
  date: string; // ISO date
  hydrationLevel: 'Parched' | 'Slightly dry' | 'Balanced' | 'Plump & dewy';
  barrierState: 'Stinging / Irritated' | 'Sensitive' | 'Calm' | 'Resilient';
  clarityState: 'Active breakouts' | 'Minor blemishes' | 'Clear & smooth';
  qualitativeState: QualitativeSkinStatus;
  qualitativeSummary: string;
  photoUrl?: string; // Private skin photo
  photoNote?: string;
  productsUsed?: string[];
  notes?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    id: string;
    label: string;
    type: 'adapt_routine' | 'pause_actives' | 'simplify_routine' | 'view_routine' | 'add_product';
    summary: string;
  };
}

export interface UserSkinProfile {
  id: string;
  name: string;
  email: string;
  skinType: SkinType;
  concerns: SkinConcern[];
  sensitivity: SensitivityLevel;
  goals: SkincareGoal[];
  routinePreference: 'Minimalist (2-3 steps)' | 'Balanced (4-5 steps)' | 'Comprehensive';
  fragranceFreePreferred: boolean;
  budgetPreference: 'Essential & accessible' | 'Balanced luxury' | 'No preference';
  qualitativeStatus: QualitativeSkinStatus;
  qualitativeStatusReason: string;
  onboardingCompleted: boolean;
  isLoggedIn: boolean;
  membershipTier: 'Free' | 'Privilege';
  createdAt: string;
}

export interface ConsistencyDay {
  date: string; // YYYY-MM-DD
  morningCompleted: boolean;
  eveningCompleted: boolean;
  notes?: string;
}

export type ActiveTab = 'today' | 'routine' | 'shelf' | 'ai' | 'journey' | 'profile';

export type DeviceMode = 'responsive' | 'mobile-iphone' | 'mobile-android';
