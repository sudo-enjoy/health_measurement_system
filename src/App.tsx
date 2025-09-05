import React from 'react';
import { AssessmentProvider, useAssessment } from './contexts/AssessmentContext';
import Home from './pages/Home';
import UserInfo from './pages/UserInfo';
import FallRiskQuestionnaire from './pages/FallRiskQuestionnaire';
import FallRiskPhysical from './pages/FallRiskPhysical';
import LowBackPainPhysical from './pages/LowBackPainPhysical';
import BiopsychosocialFactors from './pages/BiopsychosocialFactors';
import Results from './pages/Results';

function AppContent() {
  const { state } = useAssessment();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'home':
        return <Home />;
      case 'userInfo':
        return <UserInfo />;
      case 'fallQuestionnaire':
        return <FallRiskQuestionnaire />;
      case 'fallPhysical':
        return <FallRiskPhysical />;
      case 'lowbackPhysical':
        return <LowBackPainPhysical />;
      case 'biopsychosocial':
        return <BiopsychosocialFactors />;
      case 'results':
        return <Results />;
      default:
        return <Home />;
    }
  };

  return renderCurrentStep();
}

function App() {
  return (
    <AssessmentProvider>
      <AppContent />
    </AssessmentProvider>
  );
}

export default App;