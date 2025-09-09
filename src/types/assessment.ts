export interface UserInfo {
  gender: 'male' | 'female';
  ageGroup: '20s' | '30s' | '40s' | '50s' | '60s+';
  height: number;
}

// New comprehensive fall risk questionnaire with 9 questions in 5 groups
export interface FallRiskQuestionnaire {
  // Group 1: 歩行能力・筋力 (Walking ability/Muscle strength)
  crowdWalking: number;          // 1-5: 人混みの中を歩く自信
  physicalConfidence: number;    // 1-5: 身体的な自信
  
  // Group 2: 敏捷性 (Agility)
  quickReaction: number;         // 1-5: 素早い反応
  stepRecovery: number;          // 1-5: ステップの回復
  
  // Group 3: 動的バランス (Dynamic balance)
  sockWearing: number;           // 1-5: 靴下を履く能力
  heelToToe: number;            // 1-5: 踵からつま先歩き
  
  // Group 4: 静的バランス(閉眼) (Static balance - eyes closed)
  closedEyeConfidence: number;   // 1-5: 閉眼での自信
  
  // Group 5: 静的バランス(開眼) (Static balance - eyes open)
  trainStanding: number;         // 1-5: 電車での立ち姿勢
  openEyeConfidence: number;     // 1-5: 開眼での自信
}

// Updated physical tests with 5 official MHLW tests
export interface FallRiskPhysical {
  twoStepTest: number;           // cm: 2ステップテスト
  seatedSteppingTest: number;    // steps in 20 seconds: 座位ステッピングテスト
  functionalReach: number;       // cm: ファンクショナルリーチ
  closedEyeStand: number;        // seconds: 閉眼片足立ち
  openEyeStand: number;          // seconds: 開眼片足立ち
}

export interface LowBackPainPhysical {
  standingForwardBend: string;     // "OK" | "点線まで" | "かたい": 立位体前屈
  hipFlexion: string;             // "OK" | "点線まで" | "かたい": 腰沈み込みテスト
  plankChallenge: number;         // seconds: プランクチャレンジ
  wallPostureHead: string;        // 壁姿勢チェック（あたま）
  wallPostureWaist: string;       // 壁姿勢チェック（こし）
}

export interface BiopsychosocialFactors {
  biological: {
    pastBackPain: boolean;
    exerciseHabit: boolean;
    goodSleep: boolean;
    noFatigue: boolean;
    stableWeight: boolean;
    noSmoking: boolean;
    normalWorkHours: boolean;
    noHeavyLifting: boolean;
    variablePosture: boolean;
    noTwistingBending: boolean;
  };
  psychological: {
    lowStress: boolean;
    goodRelationships: boolean;
    jobSatisfaction: boolean;
    manageableWorkload: boolean;
    goodMentalHealth: boolean;
  };
  social: {
    familySupport: boolean;
    workAutonomy: boolean;
    adequateWorkspace: boolean;
    variedTasks: boolean;
    safeEnvironment: boolean;
  };
}

export interface AssessmentData {
  userInfo: UserInfo;
  fallRisk?: {
    questionnaire: FallRiskQuestionnaire;
    physical: FallRiskPhysical;
  };
  lowBackPain?: {
    physical: LowBackPainPhysical;
    biopsychosocial: BiopsychosocialFactors;
  };
}

// New scoring system for fall risk assessment
export interface FallRiskScores {
  physical: {
    walkingAbility: number;      // 1-5
    agility: number;            // 1-5
    dynamicBalance: number;     // 1-5
    staticBalanceClosed: number; // 1-5
    staticBalanceOpen: number;   // 1-5
  };
  selfAssessment: {
    walkingAbility: number;      // 1-5
    agility: number;            // 1-5
    dynamicBalance: number;     // 1-5
    staticBalanceClosed: number; // 1-5
    staticBalanceOpen: number;   // 1-5
  };
}

export interface RiskResult {
  fallRiskPercentage?: number;
  fallRiskComment?: string;
  lowBackPainRiskPercentage?: number;
  lowBackPainRiskComment?: string;
  fallRisk?: 'low' | 'medium' | 'high';
  lowBackPainRisk?: 'low' | 'medium' | 'high';
  fallRiskScores?: FallRiskScores;
  recommendations: string[];
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  description: string;
  instructions: string[];
  illustration: string;
}

// GPT Analysis result interface
export interface GPTAnalysisResult {
  summary: string;
  detailedAnalysis: string;
  personalizedRecommendations: string[];
  riskFactors: string[];
  improvementAreas: string[];
}
