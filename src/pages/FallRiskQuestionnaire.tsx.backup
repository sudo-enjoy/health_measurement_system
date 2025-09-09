import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import ProgressBar from '../components/ProgressBar';
import { useAssessment } from '../contexts/AssessmentContext';
import { FallRiskQuestionnaire } from '../types/assessment';

export default function FallRiskQuestionnairePage() {
  const { state, dispatch } = useAssessment();
  const [questionnaire, setQuestionnaire] = useState<FallRiskQuestionnaire>({
    fallHistory: false,
    balanceLoss: false,
    fearOfFalling: false,
    difficultyWalkingTalking: false,
    stumblingWhenTired: false,
    dangerousWorkplace: false
  });

  const questions = [
    { key: 'fallHistory', text: '過去1年間に転倒したことがありますか？' },
    { key: 'balanceLoss', text: 'バランスを崩してヒヤリとした経験がありますか？' },
    { key: 'fearOfFalling', text: '転倒への不安を感じることがありますか？' },
    { key: 'difficultyWalkingTalking', text: '歩きながら話すことが困難ですか？' },
    { key: 'stumblingWhenTired', text: '疲労時につまずきやすくなりますか？' },
    { key: 'dangerousWorkplace', text: '職場の床や階段が危険だと感じますか？' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingFallRisk = state.data.fallRisk || {};
    dispatch({ 
      type: 'UPDATE_DATA', 
      payload: { 
        fallRisk: { 
          ...existingFallRisk, 
          questionnaire 
        } 
      } 
    });
    dispatch({ type: 'SET_STEP', payload: 'fallPhysical' });
  };

  const handleQuestionChange = (key: keyof FallRiskQuestionnaire, value: boolean) => {
    setQuestionnaire({ ...questionnaire, [key]: value });
  };

  return (
    <Layout title="転倒リスク評価 - 質問票" showBack>
      <ProgressBar current={2} total={5} />
      
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">自己評価質問票</h2>
        <p className="text-gray-600 mb-6">以下の質問にお答えください。</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <FormField key={question.key} label={`${index + 1}. ${question.text}`}>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={questionnaire[question.key as keyof FallRiskQuestionnaire] === true}
                    onChange={() => handleQuestionChange(question.key as keyof FallRiskQuestionnaire, true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>はい</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={questionnaire[question.key as keyof FallRiskQuestionnaire] === false}
                    onChange={() => handleQuestionChange(question.key as keyof FallRiskQuestionnaire, false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>いいえ</span>
                </label>
              </div>
            </FormField>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              身体機能テストへ
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}