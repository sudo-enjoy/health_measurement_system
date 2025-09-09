import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FallRiskScores } from '../types/assessment';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  scores: FallRiskScores;
  className?: string;
}

export default function RadarChart({ scores, className = '' }: RadarChartProps) {
  const data = {
    labels: [
      '歩行能力・筋力',
      '敏捷性',
      '動的バランス',
      '静的バランス(閉眼)',
      '静的バランス(開眼)'
    ],
    datasets: [
      {
        label: '実際の測定結果',
        data: [
          scores.physical.walkingAbility,
          scores.physical.agility,
          scores.physical.dynamicBalance,
          scores.physical.staticBalanceClosed,
          scores.physical.staticBalanceOpen,
        ],
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(0, 0, 0)',
        pointBorderColor: 'rgb(0, 0, 0)',
        pointRadius: 4,
      },
      {
        label: '自己評価',
        data: [
          scores.selfAssessment.walkingAbility,
          scores.selfAssessment.agility,
          scores.selfAssessment.dynamicBalance,
          scores.selfAssessment.staticBalanceClosed,
          scores.selfAssessment.staticBalanceOpen,
        ],
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(220, 38, 38)',
        pointBorderColor: 'rgb(220, 38, 38)',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            return `${label}: ${value}点`;
          }
        }
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        stepSize: 1,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="h-96">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
