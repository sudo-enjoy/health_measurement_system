export interface UserInfo {
  gender: 'male' | 'female';
  ageGroup: '20s' | '30s' | '40s' | '50s' | '60s+';
  height: number;
}

export interface FallRiskQuestionnaire {
  fallHistory: boolean;
  balanceLoss: boolean;
  fearOfFalling: boolean;
  difficultyWalkingTalking: boolean;
  stumblingWhenTired: boolean;
  dangerousWorkplace: boolean;
}

export interface FallRiskPhysical {
  oneLegStanding: number;
  twoStepTest: number;
  fingerToFloor: number;
  deepSquat: 'full' | 'heels-lifted' | 'impossible';
  fourDirectionStep: '≤10s' | '10-15s' | '≥15s';
}

export interface LowBackPainPhysical {
  forwardBending: 'full' | 'partial' | 'none';
  squatDepth: 'full' | 'partial' | 'none';
  plankChallenge: number;
  wallPostureHead: 'forward' | 'chin-up' | 'correct';
  wallPostureLumbar: 'excessive' | 'flat' | 'natural';
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

export interface RiskResult {
  fallRisk?: 'low' | 'medium' | 'high';
  lowBackPainRisk?: 'low' | 'medium' | 'high';
  recommendations: string[];
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  description: string;
  instructions: string[];
  illustration: string;
}