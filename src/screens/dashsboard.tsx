import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CardProps {
  title: string;
  percentage: number;
  barData: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  maxBarValue?: number;
}

const TechnologyCard: React.FC<CardProps> = ({ title, percentage, barData, maxBarValue = 100 }) => {
  // Gauge chart data
  const gaugeData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#0036C5', '#ECC217'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  // Gauge chart options
  const gaugeOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  };

  // Bar chart data
  const barChartData = {
    labels: barData.labels,
    datasets: [
      {
        data: barData.values,
        backgroundColor: barData.colors,
        borderWidth: 0,
        borderRadius: 2,
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        max: maxBarValue,
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-border flex flex-col">
      <h3 className="text-center text-sm font-medium mb-2">{title}</h3>
      
      {/* Gauge Chart */}
      <div className="relative h-32 flex justify-center">
        <div className="w-full h-full">
          <Doughnut data={gaugeData} options={gaugeOptions} />
        </div>
        <div className="absolute bottom-0 text-xl font-bold">
          {percentage.toFixed(2)}%
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="mt-4 h-64">
        <Bar data={barChartData} options={barOptions} />
      </div>
    </div>
  );
};

const Dashbaord: React.FC = () => {
  // Technology Readiness & Acceptance data
  const readinessData = {
    labels: ["Basic computer skill", "Basic Internet searching", "General computer or office productivity software use", "Use of collaborative platforms", "Use of communication apps", "Use of social media", "Content creation","Cybersecurity awareness","Programming, web, and app dev...","Digital design and data vi..."],
    values: [80, 60, 30, 10, 15, 5, 50,40,10,20],
    colors: ['#0036C5', '#ECC217']
  };

  // Technology Operations data
  const operationsData = {
    labels: ["OPTIMISM", "INNOVATIVENESS", "DISCOMFORT", "INSECURITY", ],
    values: [45, 60, 30, 20, 40],
    colors:  ['#0036C5', '#ECC217']
  };

  // Infrastructure data
  const infrastructureData = {
    labels: ["Human capacity", "Environment", "Connectivity"],
    values: [0.15, 0.3, 0.1, 0.2],
    colors: ["#1a4b91", "#f6c23e", "#1a4b91", "#1a4b91", "#1a4b91", "#a6bfed", "#a6bfed"]
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-[95%] h-[90%] flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className=" py-4 px-2 rounded-sm text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5] ">Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-4">
          <TechnologyCard 
            title="DIGITAL SKILLS ASSESSMENT" 
            percentage={53.44} 
            barData={readinessData} 
          />
          <TechnologyCard 
            title="LGU Office Employee's Technology Readiness Index" 
            percentage={75.58} 
            barData={operationsData} 
          />
          <TechnologyCard 
            title="IT Readiness Assessment" 
            percentage={55.04} 
            barData={infrastructureData} 
            maxBarValue={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashbaord;