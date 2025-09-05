import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import ProgressBar from '../components/ProgressBar';
import { useAssessment } from '../contexts/AssessmentContext';
import { BiopsychosocialFactors } from '../types/assessment';

export default function BiopsychosocialFactorsPage() {
  const { state, dispatch } = useAssessment();
  const [factors, setFactors] = useState<BiopsychosocialFactors>({
    biological: {
      pastBackPain: false,
      exerciseHabit: true,
      goodSleep: true,
      noFatigue: true,
      stableWeight: true,
      noSmoking: true,
      normalWorkHours: true,
      noHeavyLifting: true,
      variablePosture: true,
      noTwistingBending: true
    },
    psychological: {
      lowStress: true,
      goodRelationships: true,
      jobSatisfaction: true,
      manageableWorkload: true,
      goodMentalHealth: true
    },
    social: {
      familySupport: true,
      workAutonomy: true,
      adequateWorkspace: true,
      variedTasks: true,
      safeEnvironment: true
    }
  });

  const biologicalQuestions = [
    { key: 'pastBackPain', text: '過去に腰痛の経験はありませんか？' },
    { key: 'exerciseHabit', text: '定期的な運動習慣がありますか？' },
    { key: 'goodSleep', text: '良質な睡眠を取れていますか？' },
    { key: 'noFatigue', text: '疲労感は少ないですか？' },
    { key: 'stableWeight', text: '体重は安定していますか？' },
    { key: 'noSmoking', text: '喫煙していませんか？' },
    { key: 'normalWorkHours', text: '労働時間は適正ですか？' },
    { key: 'noHeavyLifting', text: '重い物の持ち上げ作業は少ないですか？' },
    { key: 'variablePosture', text: '姿勢の変化は多いですか？' },
    { key: 'noTwistingBending', text: 'ひねり・前屈動作は少ないですか？' }
  ];

  const psychologicalQuestions = [
    { key: 'lowStress', text: 'ストレスは少ないですか？' },
    { key: 'goodRelationships', text: '人間関係は良好ですか？' },
    { key: 'jobSatisfaction', text: '仕事に満足していますか？' },
    { key: 'manageableWorkload', text: '業務量は適切ですか？' },
    { key: 'goodMentalHealth', text: '精神的な健康状態は良好ですか？' }
  ];

  const socialQuestions = [
    { key: 'familySupport', text: '家族のサポートはありますか？' },
    { key: 'workAutonomy', text: '仕事の裁量権はありますか？' },
    { key: 'adequateWorkspace', text: '作業スペースは十分ですか？' },
    { key: 'variedTasks', text: '作業内容に変化はありますか？' },
    { key: 'safeEnvironment', text: '安全な作業環境ですか？' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingLowBackPain = state.data.lowBackPain || {};
    const updatedData = { 
      lowBackPain: { 
        ...existingLowBackPain, 
        biopsychosocial: factors 
      } 
    };
    
    dispatch({ type: 'UPDATE_DATA', payload: updatedData });

    // Calculate results
    const { calculateRisk } = require('../utils/riskCalculation');
    const results = calculateRisk({ ...state.data, ...updatedData });
    dispatch({ type: 'SET_RESULTS', payload: results });
  };

  const handleFactorChange = (
    category: 'biological' | 'psychological' | 'social',
    key: string,
    value: boolean
  ) => {
    setFactors({
      ...factors,
      [category]: {
        ...factors[category],
        [key]: value
      }
    });
  };

  return (
    <Layout title="腰痛リスク評価 - バイオサイコソーシャル評価" showBack>
      <ProgressBar current={5} total={5} />
      
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">バイオサイコソーシャル評価</h2>
        <p className="text-gray-600 mb-6">生物学的・心理学的・社会的要因について質問にお答えください。</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Biological Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">生物学的要因</h3>
            <div className="space-y-4">
              {biologicalQuestions.map((question, index) => (
                <FormField key={question.key} label={`${index + 1}. ${question.text}`}>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.biological[question.key as keyof typeof factors.biological] === true}
                        onChange={() => handleFactorChange('biological', question.key, true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>はい</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.biological[question.key as keyof typeof factors.biological] === false}
                        onChange={() => handleFactorChange('biological', question.key, false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>いいえ</span>
                    </label>
                  </div>
                </FormField>
              ))}
            </div>
          </div>

          {/* Psychological Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">心理学的要因</h3>
            <div className="space-y-4">
              {psychologicalQuestions.map((question, index) => (
                <FormField key={question.key} label={`${index + 1}. ${question.text}`}>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.psychological[question.key as keyof typeof factors.psychological] === true}
                        onChange={() => handleFactorChange('psychological', question.key, true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>はい</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.psychological[question.key as keyof typeof factors.psychological] === false}
                        onChange={() => handleFactorChange('psychological', question.key, false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>いいえ</span>
                    </label>
                  </div>
                </FormField>
              ))}
            </div>
          </div>

          {/* Social Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">社会的要因</h3>
            <div className="space-y-4">
              {socialQuestions.map((question, index) => (
                <FormField key={question.key} label={`${index + 1}. ${question.text}`}>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.social[question.key as keyof typeof factors.social] === true}
                        onChange={() => handleFactorChange('social', question.key, true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>はい</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={factors.social[question.key as keyof typeof factors.social] === false}
                        onChange={() => handleFactorChange('social', question.key, false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>いいえ</span>
                    </label>
                  </div>
                </FormField>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              結果を表示
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}