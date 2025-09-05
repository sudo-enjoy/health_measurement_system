import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import ProgressBar from '../components/ProgressBar';
import { useAssessment } from '../contexts/AssessmentContext';
import { UserInfo } from '../types/assessment';

export default function UserInfoPage() {
  const { state, dispatch } = useAssessment();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    gender: 'male',
    ageGroup: '30s',
    height: 1.7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_DATA', payload: { userInfo } });
    
    // Navigate to next step based on assessment type
    if (state.assessmentType === 'fall') {
      dispatch({ type: 'SET_STEP', payload: 'fallQuestionnaire' });
    } else if (state.assessmentType === 'lowback') {
      dispatch({ type: 'SET_STEP', payload: 'lowbackPhysical' });
    } else {
      dispatch({ type: 'SET_STEP', payload: 'fallQuestionnaire' });
    }
  };

  return (
    <Layout 
      title="基本情報入力" 
      showBack 
      onBack={() => dispatch({ type: 'SET_STEP', payload: 'home' })}
    >
      <ProgressBar current={1} total={5} />
      
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">基本情報を入力してください</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="性別" required>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="male"
                  checked={userInfo.gender === 'male'}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value as 'male' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span>男性</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="female"
                  checked={userInfo.gender === 'female'}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value as 'female' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span>女性</span>
              </label>
            </div>
          </FormField>

          <FormField label="年齢層" required>
            <select
              value={userInfo.ageGroup}
              onChange={(e) => setUserInfo({ ...userInfo, ageGroup: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="20s">20代以下</option>
              <option value="30s">30代</option>
              <option value="40s">40代</option>
              <option value="50s">50代</option>
              <option value="60s+">60代以上</option>
            </select>
          </FormField>

          <FormField 
            label="身長" 
            required 
            description="メートル単位で入力してください（例: 1.70）"
          >
            <input
              type="number"
              step="0.01"
              min="1.0"
              max="2.5"
              value={userInfo.height}
              onChange={(e) => setUserInfo({ ...userInfo, height: parseFloat(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1.70"
            />
          </FormField>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              次へ進む
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}