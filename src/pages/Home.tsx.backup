import React from 'react';
import { Heart, Users, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAssessment } from '../contexts/AssessmentContext';

export default function Home() {
  const { dispatch } = useAssessment();

  const assessmentOptions = [
    {
      id: 'fall',
      title: '転倒リスク評価',
      description: 'バランス能力と転倒リスクを総合的に評価します',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'lowback',
      title: '腰痛リスク評価',
      description: '体幹機能と腰痛リスクを多角的に評価します',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'both',
      title: '両方の評価',
      description: '転倒リスクと腰痛リスクを総合的に評価します',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const handleSelectAssessment = (type: 'fall' | 'lowback' | 'both') => {
    dispatch({ type: 'SET_ASSESSMENT_TYPE', payload: type });
  };

  return (
    <Layout title="健康リスク評価システム">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          評価タイプを選択してください
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          労働者の健康リスクを科学的に評価し、個別化された予防プログラムを提供します
        </p>
      </div>

      <div className="grid gap-6 md:gap-8">
        {assessmentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${option.bgColor}`}>
                  <Icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>
                  <Button 
                    onClick={() => handleSelectAssessment(option.id as 'fall' | 'lowback' | 'both')}
                    className="w-full md:w-auto"
                  >
                    評価を開始
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            評価について
          </h3>
          <p className="text-blue-800">
            各評価は約10-15分程度で完了し、個別化された結果とエクササイズ推奨をPDFでダウンロードできます。
          </p>
        </Card>
      </div>
    </Layout>
  );
}