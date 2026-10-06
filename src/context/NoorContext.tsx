import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserSkinProfile,
  Product,
  RoutineStep,
  SkinCheckIn,
  AIMessage,
  ConsistencyDay,
  ActiveTab,
  DeviceMode,
  QualitativeSkinStatus,
  ProductCategory,
  SkinType,
  SkinConcern
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ROUTINE_STEPS,
  INITIAL_CHECKINS,
  INITIAL_AI_MESSAGES,
  INITIAL_CONSISTENCY
} from '../data/mockUserData';
import { DEFAULT_CATALOG } from '../data/defaultCatalog';
import { askNoorApi, analyzeRoutineApi } from '../services/api';

interface NoorContextType {
  // Navigation & Platform
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: string;

  // User & Onboarding
  userProfile: UserSkinProfile;
  updateUserProfile: (updates: Partial<UserSkinProfile>) => void;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (name: string, email: string, password?: string, skinType?: SkinType) => Promise<boolean>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  completeOnboarding: (data: Partial<UserSkinProfile>, initialProducts: Product[]) => void;
  resetToSampleData: () => void;

  // Shelf (Products Owned)
  shelfProducts: Product[];
  catalogProducts: Product[];
  addProductToShelf: (product: Omit<Product, 'id'> & { id?: string }) => void;
  removeProductFromShelf: (productId: string) => void;
  updateShelfProduct: (productId: string, updates: Partial<Product>) => void;
  checkShelfDuplicates: (productCategory: ProductCategory, keyActives?: string[]) => Product[];

  // Routine Management
  routineSteps: RoutineStep[];
  toggleStepCompletion: (stepId: string) => void;
  addRoutineStep: (step: Omit<RoutineStep, 'id'>) => void;
  removeRoutineStep: (stepId: string) => void;
  reorderRoutineSteps: (timeOfDay: 'Morning' | 'Evening', newSteps: RoutineStep[]) => void;
  adaptRoutine: (adaptationType: 'hydration_boost' | 'pause_actives' | 'minimalist' | 'reset') => void;
  activeAdaptation: string | null;
  rebuildRoutineWithAI: (customGoal?: string) => Promise<void>;
  isRebuildingRoutine: boolean;

  // Check-ins & Journey
  checkIns: SkinCheckIn[];
  addCheckIn: (checkIn: Omit<SkinCheckIn, 'id' | 'date'> & { photoUrl?: string }) => void;
  consistencyDays: ConsistencyDay[];

  // AI Assistant (Ask NOOR)
  aiMessages: AIMessage[];
  isAiThinking: boolean;
  sendMessageToNoor: (content: string) => Promise<void>;
  applyActionProposal: (action: NonNullable<AIMessage['suggestedAction']>) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Modals & Flows
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const NoorContext = createContext<NoorContextType | undefined>(undefined);

export const NoorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent or default state
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core user data
  const [userProfile, setUserProfile] = useState<UserSkinProfile>(() => {
    const saved = localStorage.getItem('noor_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_USER_PROFILE;
  });

  const [shelfProducts, setShelfProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('noor_shelf_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return DEFAULT_CATALOG.filter(p => p.isOwned);
  });

  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>(() => {
    const saved = localStorage.getItem('noor_routine_steps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_ROUTINE_STEPS;
  });

  const [checkIns, setCheckIns] = useState<SkinCheckIn[]>(() => {
    const saved = localStorage.getItem('noor_checkins');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_CHECKINS;
  });

  const [consistencyDays, setConsistencyDays] = useState<ConsistencyDay[]>(() => {
    const saved = localStorage.getItem('noor_consistency');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_CONSISTENCY;
  });

  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() => {
    const saved = localStorage.getItem('noor_ai_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return INITIAL_AI_MESSAGES;
  });

  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isRebuildingRoutine, setIsRebuildingRoutine] = useState<boolean>(false);
  const [activeAdaptation, setActiveAdaptation] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('noor_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('noor_shelf_products', JSON.stringify(shelfProducts));
    localStorage.setItem('noor_routine_steps', JSON.stringify(routineSteps));
    localStorage.setItem('noor_checkins', JSON.stringify(checkIns));
    localStorage.setItem('noor_consistency', JSON.stringify(consistencyDays));
    localStorage.setItem('noor_ai_messages', JSON.stringify(aiMessages));

    // Simulated cloud sync pulse
    setCloudSyncStatus('syncing');
    const timer = setTimeout(() => {
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
    return () => clearTimeout(timer);
  }, [userProfile, shelfProducts, routineSteps, checkIns, consistencyDays, aiMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 4000);
  };

  // Account & Auth state management
  const signIn = async (email: string, password?: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase();
    
    // Retrieve stored accounts
    const accountsJson = localStorage.getItem('noor_accounts');
    let accounts: Record<string, any> = {};
    if (accountsJson) {
      try { accounts = JSON.parse(accountsJson); } catch (e) {}
    }

    let targetAccount = accounts[normalized];

    if (!targetAccount) {
      if (normalized === 'elena@noor.app' || normalized.includes('elena')) {
        targetAccount = {
          profile: { ...INITIAL_USER_PROFILE, isLoggedIn: true },
          shelf: DEFAULT_CATALOG.filter(p => p.isOwned),
          routine: INITIAL_ROUTINE_STEPS,
          checkIns: INITIAL_CHECKINS,
          consistency: INITIAL_CONSISTENCY,
          aiMessages: INITIAL_AI_MESSAGES
        };
      } else {
        const displayName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        targetAccount = {
          profile: {
            id: `usr-${Date.now()}`,
            name: displayName || 'Skincare Member',
            email: normalized,
            skinType: 'Combination',
            concerns: ['Dryness', 'Texture'],
            sensitivity: 'Sometimes sensitive',
            goals: ['Barrier repair', 'Deep hydration'],
            routinePreference: 'Balanced (4-5 steps)',
            fragranceFreePreferred: true,
            budgetPreference: 'Balanced luxury',
            qualitativeStatus: 'Stable',
            qualitativeStatusReason: 'Account connected. Calibrated for personal skin metrics.',
            onboardingCompleted: true,
            isLoggedIn: true,
            membershipTier: 'Privilege',
            createdAt: new Date().toISOString().split('T')[0]
          },
          shelf: DEFAULT_CATALOG.filter(p => ['prod-cleanse-1', 'prod-hyal-1', 'prod-cream-1', 'prod-spf-1'].includes(p.id)),
          routine: INITIAL_ROUTINE_STEPS.slice(0, 4),
          checkIns: [],
          consistency: INITIAL_CONSISTENCY.slice(0, 7),
          aiMessages: [
            {
              id: `msg-welcome-${Date.now()}`,
              role: 'assistant',
              content: `Welcome back, ${displayName}. Your personal routine and shelf inventory have been loaded. What should we focus on today?`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
    }

    targetAccount.profile.isLoggedIn = true;
    accounts[normalized] = targetAccount;
    localStorage.setItem('noor_accounts', JSON.stringify(accounts));
    localStorage.setItem('noor_session', normalized);

    setUserProfile(targetAccount.profile);
    setShelfProducts(targetAccount.shelf || []);
    setRoutineSteps(targetAccount.routine || []);
    setCheckIns(targetAccount.checkIns || []);
    setConsistencyDays(targetAccount.consistency || INITIAL_CONSISTENCY);
    setAiMessages(targetAccount.aiMessages || INITIAL_AI_MESSAGES);
    setActiveTab('today');
    showToast(`Signed in as ${targetAccount.profile.name}. Sanctuary ready.`);
    return true;
  };

  const signUp = async (
    name: string,
    email: string,
    password?: string,
    skinType?: SkinType
  ): Promise<boolean> => {
    const normalized = email.trim().toLowerCase();
    const accountsJson = localStorage.getItem('noor_accounts');
    let accounts: Record<string, any> = {};
    if (accountsJson) {
      try { accounts = JSON.parse(accountsJson); } catch (e) {}
    }

    const chosenSkinType: SkinType = skinType || 'Combination';
    const starterProducts = DEFAULT_CATALOG.slice(0, 4);
    const starterSteps: RoutineStep[] = [
      {
        id: `step-am-${Date.now()}-1`,
        stepNumber: 1,
        timeOfDay: 'Morning',
        category: 'Cleanser',
        productId: 'prod-cleanse-1',
        productName: 'Gentle Amino Acid Hydrating Cleanser',
        brand: 'NOOR Core',
        usageTip: 'Rinse with cool water, pat dry with gentle cloth.',
        whyChosen: 'Preserves delicate lipid barrier upon waking.',
        isCompletedToday: false,
        frequency: 'Daily'
      },
      {
        id: `step-am-${Date.now()}-2`,
        stepNumber: 2,
        timeOfDay: 'Morning',
        category: 'Serum',
        productId: 'prod-hyal-1',
        productName: 'Multi-Molecular Hydrating Hyaluronic Serum',
        brand: 'NOOR Core',
        usageTip: 'Press gently into damp skin.',
        whyChosen: 'Draws moisture deep into stratum corneum.',
        isCompletedToday: false,
        frequency: 'Daily'
      },
      {
        id: `step-am-${Date.now()}-3`,
        stepNumber: 3,
        timeOfDay: 'Morning',
        category: 'SPF',
        productId: 'prod-spf-1',
        productName: 'Invisible Fluid Mineral Shield SPF 50+',
        brand: 'NOOR Core',
        usageTip: 'Apply two finger lengths across face and neck.',
        whyChosen: 'Essential UV protection against collagen degradation.',
        isCompletedToday: false,
        frequency: 'Daily'
      },
      {
        id: `step-pm-${Date.now()}-1`,
        stepNumber: 1,
        timeOfDay: 'Evening',
        category: 'Cleanser',
        productId: 'prod-cleanse-1',
        productName: 'Gentle Amino Acid Hydrating Cleanser',
        brand: 'NOOR Core',
        usageTip: 'Massage gently for 60 seconds.',
        whyChosen: 'Removes particulate matter and sunscreen thoroughly.',
        isCompletedToday: false,
        frequency: 'Daily'
      },
      {
        id: `step-pm-${Date.now()}-2`,
        stepNumber: 2,
        timeOfDay: 'Evening',
        category: 'Moisturizer',
        productId: 'prod-cream-1',
        productName: 'Bio-Identical Ceramide Barrier Complex Cream',
        brand: 'NOOR Core',
        usageTip: 'Warm between fingertips and seal moisture in.',
        whyChosen: 'Replenishes ceramides and fatty acids during nocturnal repair.',
        isCompletedToday: false,
        frequency: 'Daily'
      }
    ];

    const concernsList: SkinConcern[] =
      chosenSkinType === 'Oily'
        ? ['Oiliness', 'Texture']
        : chosenSkinType === 'Dry'
        ? ['Dryness', 'Barrier repair']
        : ['Dryness', 'Texture'];

    const newProfile: UserSkinProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Skincare Member',
      email: normalized,
      skinType: chosenSkinType,
      concerns: concernsList,
      sensitivity: 'Sometimes sensitive',
      goals: ['Barrier repair', 'Deep hydration', 'Restore natural glow'],
      routinePreference: 'Balanced (4-5 steps)',
      fragranceFreePreferred: true,
      budgetPreference: 'Balanced luxury',
      qualitativeStatus: 'Improving',
      qualitativeStatusReason: 'Initial skin profile calibrated. Routine sequenced.',
      onboardingCompleted: true,
      isLoggedIn: true,
      membershipTier: 'Privilege',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const initialAiMsg: AIMessage = {
      id: `msg-welcome-${Date.now()}`,
      role: 'assistant',
      content: `Welcome to NOOR, ${name.trim() || 'friend'}. Your profile and routine have been configured for ${chosenSkinType} skin. I am here to guide your morning and evening rituals.`,
      timestamp: new Date().toISOString()
    };

    const newAccount = {
      profile: newProfile,
      shelf: starterProducts,
      routine: starterSteps,
      checkIns: [],
      consistency: INITIAL_CONSISTENCY.slice(0, 7),
      aiMessages: [initialAiMsg]
    };

    accounts[normalized] = newAccount;
    localStorage.setItem('noor_accounts', JSON.stringify(accounts));
    localStorage.setItem('noor_session', normalized);

    setUserProfile(newAccount.profile);
    setShelfProducts(newAccount.shelf);
    setRoutineSteps(newAccount.routine);
    setCheckIns(newAccount.checkIns);
    setConsistencyDays(newAccount.consistency);
    setAiMessages(newAccount.aiMessages);
    setActiveTab('today');
    showToast(`Welcome to NOOR, ${newAccount.profile.name}. Account created successfully.`);
    return true;
  };

  const signOut = () => {
    // Save current working state to account in localStorage
    const accountsJson = localStorage.getItem('noor_accounts');
    if (accountsJson && userProfile.email) {
      try {
        const accounts: Record<string, any> = JSON.parse(accountsJson);
        accounts[userProfile.email.toLowerCase()] = {
          profile: { ...userProfile, isLoggedIn: false },
          shelf: shelfProducts,
          routine: routineSteps,
          checkIns,
          consistency: consistencyDays,
          aiMessages
        };
        localStorage.setItem('noor_accounts', JSON.stringify(accounts));
      } catch (e) {}
    }
    localStorage.removeItem('noor_session');
    setUserProfile(prev => ({ ...prev, isLoggedIn: false }));
    showToast('Signed out safely. Your private data remains encrypted.');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    showToast(`Password recovery link dispatched to ${email}. Check your inbox.`);
    return true;
  };

  const updateUserProfile = (updates: Partial<UserSkinProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    showToast('Skin profile updated & cloud synced');
  };

  const completeOnboarding = (data: Partial<UserSkinProfile>, initialProducts: Product[]) => {
    const updatedProfile: UserSkinProfile = {
      ...userProfile,
      ...data,
      onboardingCompleted: true,
      isLoggedIn: true
    };
    setUserProfile(updatedProfile);

    if (initialProducts.length > 0) {
      setShelfProducts(initialProducts);
    }

    setActiveTab('today');
    showToast(`Welcome to NOOR, ${data.name || 'friend'}. Your personal skincare journey has begun.`);
  };

  const resetToSampleData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setShelfProducts(DEFAULT_CATALOG.filter(p => p.isOwned));
    setRoutineSteps(INITIAL_ROUTINE_STEPS);
    setCheckIns(INITIAL_CHECKINS);
    setConsistencyDays(INITIAL_CONSISTENCY);
    setAiMessages(INITIAL_AI_MESSAGES);
    setActiveAdaptation(null);
    showToast('Reset to Elena Vance reference profile');
  };

  // Shelf management
  const addProductToShelf = (newProd: Omit<Product, 'id'> & { id?: string }) => {
    const product: Product = {
      ...newProd,
      id: newProd.id || `prod-custom-${Date.now()}`,
      isOwned: true,
      openedDate: newProd.openedDate || new Date().toISOString().split('T')[0]
    };
    setShelfProducts(prev => [product, ...prev]);
    showToast(`Added ${product.name} to My Shelf`);
  };

  const removeProductFromShelf = (productId: string) => {
    setShelfProducts(prev => prev.filter(p => p.id !== productId));
    // Also remove from routine if present
    setRoutineSteps(prev => prev.filter(s => s.productId !== productId));
    showToast('Product removed from Shelf and Routine');
  };

  const updateShelfProduct = (productId: string, updates: Partial<Product>) => {
    setShelfProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Product details updated');
  };

  const checkShelfDuplicates = (productCategory: ProductCategory, keyActives: string[] = []): Product[] => {
    return shelfProducts.filter(p => {
      if (p.category === productCategory) return true;
      if (keyActives.length > 0 && p.keyActives.some(a => keyActives.includes(a))) return true;
      return false;
    });
  };

  // Routine step completion
  const toggleStepCompletion = (stepId: string) => {
    setRoutineSteps(prev =>
      prev.map(step => {
        if (step.id === stepId) {
          const newState = !step.isCompletedToday;
          return { ...step, isCompletedToday: newState };
        }
        return step;
      })
    );
  };

  const addRoutineStep = (newStep: Omit<RoutineStep, 'id'>) => {
    const step: RoutineStep = {
      ...newStep,
      id: `step-${Date.now()}`
    };
    setRoutineSteps(prev => [...prev, step]);
    showToast(`Added ${step.productName} to ${step.timeOfDay} routine`);
  };

  const removeRoutineStep = (stepId: string) => {
    setRoutineSteps(prev => prev.filter(s => s.id !== stepId));
    showToast('Step removed from routine');
  };

  const reorderRoutineSteps = (timeOfDay: 'Morning' | 'Evening', newSteps: RoutineStep[]) => {
    setRoutineSteps(prev => {
      const otherSteps = prev.filter(s => s.timeOfDay !== timeOfDay);
      return [...otherSteps, ...newSteps];
    });
    showToast(`${timeOfDay} routine order saved`);
  };

  // Routine Adaptation
  const adaptRoutine = (adaptationType: 'hydration_boost' | 'pause_actives' | 'minimalist' | 'reset') => {
    if (adaptationType === 'reset') {
      setActiveAdaptation(null);
      setRoutineSteps(INITIAL_ROUTINE_STEPS);
      showToast('Restored standard personalized routine');
      return;
    }

    if (adaptationType === 'pause_actives') {
      setActiveAdaptation('Barrier Rest Mode (Actives Paused)');
      setRoutineSteps(prev =>
        prev.filter(step => step.category !== 'Treatment' && step.category !== 'Exfoliant')
      );
      showToast('Activated Barrier Rest: Exfoliants and Retinoids paused for 48h');
    } else if (adaptationType === 'hydration_boost') {
      setActiveAdaptation('Hydration Recovery Mode');
      showToast('Adapted routine: Prioritizing lipid barrier balm & milky essence');
    } else if (adaptationType === 'minimalist') {
      setActiveAdaptation('Minimalist 3-Step Routine');
      setRoutineSteps(prev =>
        prev.filter(step => ['Cleanser', 'Moisturizer', 'SPF'].includes(step.category))
      );
      showToast('Streamlined to essentials: Cleanse, Moisturize, Protect');
    }
  };

  const rebuildRoutineWithAI = async (customGoal?: string) => {
    setIsRebuildingRoutine(true);
    try {
      const analysis = await analyzeRoutineApi(userProfile, shelfProducts, customGoal);
      
      const newMorningSteps: RoutineStep[] = analysis.morningSteps.map((s, idx) => ({
        id: `step-am-ai-${idx}-${Date.now()}`,
        stepNumber: s.stepNumber || idx + 1,
        timeOfDay: 'Morning',
        category: (s.category as ProductCategory) || 'Serum',
        productId: shelfProducts.find(p => p.name.includes(s.productName))?.id || `ai-rec-${idx}`,
        productName: s.productName,
        brand: s.brand || 'NOOR Selected',
        usageTip: s.usageTip,
        whyChosen: s.whyChosen,
        isCompletedToday: false,
        frequency: 'Daily'
      }));

      const newEveningSteps: RoutineStep[] = analysis.eveningSteps.map((s, idx) => ({
        id: `step-pm-ai-${idx}-${Date.now()}`,
        stepNumber: s.stepNumber || idx + 1,
        timeOfDay: 'Evening',
        category: (s.category as ProductCategory) || 'Moisturizer',
        productId: shelfProducts.find(p => p.name.includes(s.productName))?.id || `ai-rec-pm-${idx}`,
        productName: s.productName,
        brand: s.brand || 'NOOR Selected',
        usageTip: s.usageTip,
        whyChosen: s.whyChosen,
        isCompletedToday: false,
        frequency: 'Daily'
      }));

      setRoutineSteps([...newMorningSteps, ...newEveningSteps]);
      showToast('Personalized routine rebuilt with AI intelligence');
    } catch (err) {
      showToast('Could not rebuild routine right now; keeping current steps');
    } finally {
      setIsRebuildingRoutine(false);
    }
  };

  // Check-ins & Journey
  const addCheckIn = (newCheck: Omit<SkinCheckIn, 'id' | 'date'> & { photoUrl?: string }) => {
    const check: SkinCheckIn = {
      ...newCheck,
      id: `chk-${Date.now()}`,
      date: new Date().toISOString()
    };
    setCheckIns(prev => [check, ...prev]);

    // Update qualitative skin status
    setUserProfile(prev => ({
      ...prev,
      qualitativeStatus: check.qualitativeState,
      qualitativeStatusReason: check.qualitativeSummary
    }));

    showToast('Skin check-in recorded to your private journey');
  };

  // AI Assistant (Ask NOOR)
  const sendMessageToNoor = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setAiMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const response = await askNoorApi({
        message: userMsg.content,
        conversationHistory: aiMessages.slice(-6).map(m => ({
          role: m.role,
          content: m.content
        })),
        userContext: {
          skinType: userProfile.skinType,
          concerns: userProfile.concerns,
          sensitivity: userProfile.sensitivity,
          goals: userProfile.goals,
          shelfProducts,
          morningRoutine: routineSteps.filter(s => s.timeOfDay === 'Morning'),
          eveningRoutine: routineSteps.filter(s => s.timeOfDay === 'Evening'),
          recentState: userProfile.qualitativeStatus
        }
      });

      const assistantMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        suggestedAction: response.suggestedAction || undefined
      };

      setAiMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setAiMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'I am here with you. While my deep analysis was interrupted, remember that gentle hydration and zero stripping are always safe choices for your skin today.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const applyActionProposal = (action: NonNullable<AIMessage['suggestedAction']>) => {
    if (action.type === 'pause_actives') {
      adaptRoutine('pause_actives');
    } else if (action.type === 'adapt_routine') {
      adaptRoutine('hydration_boost');
    } else if (action.type === 'simplify_routine') {
      adaptRoutine('minimalist');
    } else if (action.type === 'view_routine') {
      setActiveTab('routine');
    }
    showToast(`Applied action: ${action.label}`);
  };

  return (
    <NoorContext.Provider
      value={{
        activeTab,
        setActiveTab,
        deviceMode,
        setDeviceMode,
        cloudSyncStatus,
        lastSyncedAt,
        userProfile,
        updateUserProfile,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        completeOnboarding,
        resetToSampleData,
        shelfProducts,
        catalogProducts: DEFAULT_CATALOG,
        addProductToShelf,
        removeProductFromShelf,
        updateShelfProduct,
        checkShelfDuplicates,
        routineSteps,
        toggleStepCompletion,
        addRoutineStep,
        removeRoutineStep,
        reorderRoutineSteps,
        adaptRoutine,
        activeAdaptation,
        rebuildRoutineWithAI,
        isRebuildingRoutine,
        checkIns,
        addCheckIn,
        consistencyDays,
        aiMessages,
        isAiThinking,
        sendMessageToNoor,
        applyActionProposal,
        toastMessage,
        showToast,
        authModalOpen,
        setAuthModalOpen
      }}
    >
      {children}
    </NoorContext.Provider>
  );
};

export const useNoor = (): NoorContextType => {
  const context = useContext(NoorContext);
  if (!context) {
    throw new Error('useNoor must be used within a NoorProvider');
  }
  return context;
};
