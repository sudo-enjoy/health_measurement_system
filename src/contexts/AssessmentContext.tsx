import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AssessmentData, RiskResult } from "../types/assessment";
import { GPTAnalysisResult } from "../utils/gptAnalysis";

interface AssessmentState {
  currentStep: string;
  assessmentType: "fall" | "lowback" | "both" | null;
  data: Partial<AssessmentData>;
  results: RiskResult | null;
  gptAnalysis: GPTAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

type AssessmentAction =
  | { type: "SET_ASSESSMENT_TYPE"; payload: "fall" | "lowback" | "both" }
  | { type: "SET_STEP"; payload: string }
  | { type: "UPDATE_DATA"; payload: Partial<AssessmentData> }
  | { type: "SET_RESULTS"; payload: RiskResult }
  | { type: "SET_GPT_ANALYSIS"; payload: GPTAnalysisResult }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

const initialState: AssessmentState = {
  currentStep: "home",
  assessmentType: null,
  data: {},
  results: null,
  gptAnalysis: null,
  isLoading: false,
  error: null,
};

const AssessmentContext = createContext<{
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
} | null>(null);

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case "SET_ASSESSMENT_TYPE":
      return { ...state, assessmentType: action.payload, currentStep: "userInfo" };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.payload } };
    case "SET_RESULTS":
      return { ...state, results: action.payload, currentStep: "results" };
    case "SET_GPT_ANALYSIS":
      return { ...state, gptAnalysis: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
