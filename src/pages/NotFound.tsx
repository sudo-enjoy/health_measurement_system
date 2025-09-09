import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout title="ページが見つかりません">
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ページが見つかりません
            </h1>
            <p className="text-gray-600">
              お探しのページは存在しないか、移動された可能性があります。
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>前のページに戻る</span>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
