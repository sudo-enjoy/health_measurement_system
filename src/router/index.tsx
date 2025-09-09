import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AssessmentProvider } from '../contexts/AssessmentContext';
import Home from '../pages/Home';
import UserInfo from '../pages/UserInfo';
import FallRiskQuestionnaire from '../pages/FallRiskQuestionnaire';
import FallRiskPhysical from '../pages/FallRiskPhysical';
import LowBackPainPhysical from '../pages/LowBackPainPhysical';
import BiopsychosocialFactors from '../pages/BiopsychosocialFactors';
import Results from '../pages/Results';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/user-info',
    element: <UserInfo />,
  },
  {
    path: '/fall-risk/questionnaire',
    element: <FallRiskQuestionnaire />,
  },
  {
    path: '/fall-risk/physical',
    element: <FallRiskPhysical />,
  },
  {
    path: '/low-back-pain/physical',
    element: <LowBackPainPhysical />,
  },
  {
    path: '/low-back-pain/biopsychosocial',
    element: <BiopsychosocialFactors />,
  },
  {
    path: '/results',
    element: <Results />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return (
    <AssessmentProvider>
      <RouterProvider router={router} />
    </AssessmentProvider>
  );
}
