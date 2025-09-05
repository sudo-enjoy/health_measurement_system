import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import ProgressBar from '../components/ProgressBar';
import { useAssessment } from '../contexts/AssessmentContext';
import { LowBackPainPhysical } from '../types/assessment';

export default function LowBackPainPhysicalPage() {
  const { state, dispatch } = useAssessment();
  const [physical, setPhysical] = useState<LowBackPainPhysical>({
    forwardBending: 'full',
    squatDepth: 'full',
    plankChallenge: 45,
    wallPostureHead: 'correct',
    wallPostureLumbar: 'natural'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingLowBackPain = state.data.lowBackPain || {};
    dispatch({ 
      type: 'UPDATE_DATA', 
      payload: { 
        lowBackPain: { 
          ...existingLowBackPain, 
          physical 
        } 
      } 
    });
    dispatch({ type: 'SET_STEP', payload: 'biopsychosocial' });
  };

  return (
    <Layout title="腰痛リスク評価 - 身体機能テスト" showBack>
      <ProgressBar current={state.assessmentType === 'both' ? 4 : 2} total={5} />
      
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">身体機能テスト</h2>
        <p className="text-gray-600 mb-6">各テストの結果を入力してください。</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="前屈テスト（床に指が届くかどうか）">
            <select
              value={physical.forwardBending}
              onChange={(e) => setPhysical({ ...physical, forwardBending: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full">床まで完全に届く</option>
              <option value="partial">部分的に届く</option>
              <option value="none">全く届かない</option>
            </select>
          </FormField>

          <FormField label="スクワット深度テスト">
            <select
              value={physical.squatDepth}
              onChange={(e) => setPhysical({ ...physical, squatDepth: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full">完全にしゃがめる</option>
              <option value="partial">部分的にしゃがめる</option>
              <option value="none">ほとんどしゃがめない</option>
            </select>
          </FormField>

          <FormField 
            label="プランクチャレンジ"
            description="プランク姿勢を維持できる時間（最大60秒）"
          >
            <input
              type="number"
              min="0"
              max="60"
              value={physical.plankChallenge}
              onChange={(e) => setPhysical({ ...physical, plankChallenge: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="45"
            />
            <span className="text-sm text-gray-500">秒</span>
          </FormField>

          <FormField label="壁姿勢チェック - 頭の位置">
            <select
              value={physical.wallPostureHead}
              onChange={(e) => setPhysical({ ...physical, wallPostureHead: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="correct">正常</option>
              <option value="forward">前方突出</option>
              <option value="chin-up">顎上がり</option>
            </select>
          </FormField>

          <FormField label="壁姿勢チェック - 腰椎カーブ">
            <select
              value={physical.wallPostureLumbar}
              onChange={(e) => setPhysical({ ...physical, wallPostureLumbar: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="natural">自然なカーブ</option>
              <option value="excessive">過度なカーブ</option>
              <option value="flat">平坦</option>
            </select>
          </FormField>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              質問票へ進む
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}