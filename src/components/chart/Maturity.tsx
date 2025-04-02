import React, { useEffect, useState } from 'react';
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
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
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
  colSpan?: 1 | 2 | 3 | 4;
}

// Define types for data processing
interface CategoryData {
  labels: string[];
  values: number[];
  percentage: number;
}

interface OfficeData {
  [key: string]: any;
}

interface SurveyData {
  [key: string]: OfficeData[];
}

interface CardConfig {
  title: string;
  colSpan?: 1 | 2 | 3 | 4;
}

interface DashboardProps {
  data: SurveyData;
  title?: string;
  chartColors?: string[];
  cardLayouts?: {
    digitalSkills?: CardConfig;
    tri?: CardConfig;
    ictChange?: CardConfig;
    itReadiness?: CardConfig;
  };
  gridColsBase?: number;
}

// For Digital Skills Assessment:


const TechnologyCard: React.FC<CardProps> = ({ title, percentage, barData, maxBarValue = 100, colSpan = 1 }) => {
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

  // Update gauge options with larger size
  const gaugeOptions = {
    cutout: '65%',
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

  // Calculate dynamic height based on number of items
  const barHeight = Math.max(barData.labels.length * 25, 100); // 25px per item, minimum 100px

  // Updated bar options
  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
      x: {
        max: maxBarValue,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 8
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 8
          },
          callback: function(_value: any, index: number) {
            const labels = barData.labels;
            const label = labels[index];
            return label.length > 20 ? label.substr(0, 20) + '...' : label;
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems: any) => {
            return barData.labels[tooltipItems[0].dataIndex];
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Determine the column span class
  const colSpanClass = `col-span-1 md:col-span-${colSpan}`;

  return (
    <div className={`bg-white ${colSpanClass} p-2 rounded-lg border border-border flex flex-col`}>
      <h3 className="text-center text-xs font-medium mb-2">{title}</h3>
      
      {/* Larger Gauge Chart */}
      <div className="relative h-24 flex justify-center mb-2">
        <div className="w-full h-full">
          <Doughnut data={gaugeData} options={gaugeOptions} />
        </div>
        <div className="absolute bottom-2 text-base font-bold">
          {percentage.toFixed(2)}%
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="mt-2" style={{ height: `${barHeight}px` }}>
        <Bar data={barChartData} options={barOptions} />
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  chartColors = ['#0036C5', '#ECC217'],
  cardLayouts = {
    digitalSkills: { title: "DIGITAL SKILLS ASSESSMENT", colSpan: 1 },
    tri: { title: "LGU Office Employee's Technology Readiness Index", colSpan: 1 },
    ictChange: { title: "ICT Change Management", colSpan: 1 },
    itReadiness: { title: "IT Readiness Assessment", colSpan: 1 }
  },
  gridColsBase
}:any) => {
  
  // Define state for processed data
  const [digitalSkillsData, setDigitalSkillsData] = useState<CategoryData>({
    labels: [],
    values: [],
    percentage: 0
  });
  
  const [triData, setTRIData] = useState<CategoryData>({
    labels: [],
    values: [],
    percentage: 0
  });
  
  const [ictData, setICTData] = useState<CategoryData>({
    labels: [],
    values: [],
    percentage: 0
  });
  
  const [itReadinessData, setITReadinessData] = useState<CategoryData>({
    labels: [],
    values: [],
    percentage: 0
  });

  // Process data on component mount
  useEffect(() => {
    processDigitalSkillsData();
    processTRIData();
    processITReadinessData();
    processICTChangeData();
  }, [data]);

  // Get all offices data from the JSON
  const getAllOfficesData = () => {
    const allowedOffices = ["Mayors Office", "Other Offices", "HR Office", "IT Office"];
    const allOffices: any = [];
    
    // Iterate through allowed offices only
    Object.keys(data).forEach(officeKey => {
      if (allowedOffices.includes(officeKey) && data[officeKey] && Array.isArray(data[officeKey])) {
        allOffices.push(...data[officeKey]);
      }
    });
  
    let changeReadinessSum = 0;
    let changeReadinessCount = 0;
  
    allOffices.forEach((office: any) => {
      if (office["OFFICE SELECTION"] === "MIS\/IT" ) {
        // Convert values to numbers and sum only if they're valid numbers
        const values = [
          Number(office["BASIC IT READINESS 1"]) || 0,
          Number(office["BASIC IT READINESS 2"]) || 0,
          Number(office["BASIC IT READINESS 3"]) || 0,
          Number(office["BASIC IT READINESS 4"]) || 0




        ];
        
        values.forEach(value => {
          if (value > 0) {
            changeReadinessSum += value;
            changeReadinessCount++;
          }
        });
      }
    });
  
    // Calculate average with 2 decimal places
    const changeReadinessAverage = changeReadinessCount > 0 
      ? Number((changeReadinessSum / changeReadinessCount).toFixed(2)) 
      : 0;
  
    console.log('Change Readiness Sum:', changeReadinessSum);
    console.log('Change Readiness Count:', changeReadinessCount);
    console.log('Change Readiness Score:',  (changeReadinessSum/(changeReadinessCount*5)) *100 );
  
    return allOffices;
  };

  const calculateAverage = (values: number[]) => {
    const validValues = values.filter(val => val !== null && val !== undefined);
    return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
  };

  // Helper function to calculate percentage score
  const calculatePercentageScore = (responses: number[]) => {
    if (responses.length === 0) return 0;
    
    const totalResponses = responses.length;
    const totalPossibleScore = totalResponses * 5; // Maximum score of 5 per response
    const actualScore = responses.reduce((sum, value) => sum + value, 0);
    
    // Return percentage: (actualScore / totalPossibleScore) × 100
    return (actualScore / totalPossibleScore) * 100;
  };

  // Process Digital Skills Assessment data
  const processDigitalSkillsData = () => {
    const digitalSkillsLabels = [
      "Basic computer skill",
      "Basic Internet searching",
      "General computer or office productivity software use",
      "Use of collaborative platforms",
      "Use of communication apps",
      "Use of social media", 
      "Content creation",
      "Cybersecurity awareness",
      "Programming, web, and app dev...",
      "Digital design and data vi..."
    ];

    const allOfficesData = getAllOfficesData();
    
    if (allOfficesData.length === 0) {
      console.error("No office data found");
      return;
    }

    // Get all responses for each Digital Skills question
    const skillsScores = Array.from({ length: 10 }, (_, questionIndex) => {
      const key = `Question ${questionIndex + 1} DigitalSkillsAssessment`;

      // Collect all responses for this question across all offices
      const responses = allOfficesData
        .map((office:any) => Number(office[key] || 0))
        .filter((value:any) => !isNaN(value));

      // Calculate score using the same method as About.tsx
      const total = responses.reduce((sum:any, value:any) => sum + value, 0);
      const maxPossible = responses.length * 5;
      const score = (total / maxPossible) * 100;

      return score;
    });

    // Calculate overall percentage
    const overallPercentage = calculateAverage(skillsScores);

    setDigitalSkillsData({
      labels: digitalSkillsLabels,
      values: skillsScores,
      percentage: overallPercentage
    });
  };

  // Process Technology Readiness Index data
  const processTRIData = () => {
    const allOfficesData = getAllOfficesData();
    
    if (allOfficesData.length === 0) {
      console.error("No office data found");
      return;
    }

    // Helper function to calculate TRI scores
    const calculateTRIScore = (category: string, questionCount: number) => {
      // Get all responses for this category across all offices
      const responses = allOfficesData.flatMap((office:any) => {
        return Array.from({ length: questionCount }, (_, i) => {
          const key = `${category} ${i + 1}`;
          return Number(office[key] || 0);
        });
      }).filter((value:any )=> !isNaN(value));

      // Calculate score like About.tsx implementation
      const total = responses.reduce((sum:any, value:any) => sum + value, 0);
      const maxPossible = responses.length * 5;
      return (total / maxPossible) * 100;
    };

    // Calculate scores for each category
    const optimismScore = calculateTRIScore('Optimism', 10);
    const innovativenessScore = calculateTRIScore('Innovativeness', 7);
    const discomfortScore = calculateTRIScore('Discomfort', 10);
    const insecurityScore = calculateTRIScore('Insecurity', 9);

    // Calculate final TRI score
    const triScore = (
      optimismScore + 
      innovativenessScore + 
      discomfortScore + 
      insecurityScore
    ) / 4;

    setTRIData({
      labels: ['OPTIMISM', 'INNOVATIVENESS', 'DISCOMFORT', 'INSECURITY'],
      values: [optimismScore, innovativenessScore, discomfortScore, insecurityScore],
      percentage: triScore
    });
  };

  // Process IT Readiness data
  const processITReadinessData = () => {
    const allOfficesData = getAllOfficesData();
    
    if (allOfficesData.length === 0) {
      console.error("No office data found");
      return;
    }
  
    // Define categories and their questions
    const categories = {
      "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
      "IT GOVERNANCE": Array.from({ length: 3 }, (_, i) => `IT GOVERNANCE FRAMEWORK & POLICIES ${i + 1}`),
      "IT STRATEGY": Array.from({ length: 3 }, (_, i) => `IT STRATEGY AND ALIGNMENT ${i + 1}`),
      "IT POLICIES": Array.from({ length: 3 }, (_, i) => `IT POLICIES AND PROCEDURES ${i + 1}`),
      "RISK MANAGEMENT": Array.from({ length: 3 }, (_, i) => `RISK MANAGEMENT ${i + 1}`),
      "PERFORMANCE MEASUREMENT": Array.from({ length: 3 }, (_, i) => `IT PERFORMANCE MEASUREMENT AND REPORTING ${i + 1}`),
      "IT INVESTMENT MANAGEMENT": Array.from({ length: 3 }, (_, i) => `IT INVESTMENT MANAGEMENT ${i + 1}`),
      "VENDOR MANAGEMENT": Array.from({ length: 3 }, (_, i) => `VENDOR MANAGEMENT ${i + 1}`),
      "IT SECURITY": Array.from({ length: 3 }, (_, i) => `IT SECURITY AND COMPLIANCE ${i + 1}`),
      "ICT ORGANIZATION": Array.from({ length: 3 }, (_, i) => `ICT Organizational Structure and Skills ${i + 1}`),
      "AUDIT & ASSURANCE": Array.from({ length: 3 }, (_, i) => `Audit and Assurance ${i + 1}`),
      "NETWORK": Array.from({ length: 2 }, (_, i) => `Network Infrastructure ${i + 1}`),
      "STORAGE": Array.from({ length: 3 }, (_, i) => `Servers and Storage ${i + 1}`),
      "VIRTUALIZATION": Array.from({ length: 3 }, (_, i) => `Virtualization ${i + 1}`),
      "BACKUP": Array.from({ length: 3 }, (_, i) => `Data Backup and Recovery ${i + 1}`),
      "SCALABILITY & ELASTICITY": Array.from({ length: 3 }, (_, i) => `Scalability and Elasticity ${i + 1}`),

      "SECURITY MEASURES": Array.from({ length: 4 }, (_, i) => `Security Measures ${i + 1}`),
      "MONITORING": Array.from({ length: 3 }, (_, i) => `Monitoring and Performance ${i + 1}`),
      "COMPLIANCE": Array.from({ length: 3 }, (_, i) => `Compliance and Governance ${i + 1}`),
      "INTEGRATION": Array.from({ length: 3 }, (_, i) => `Integration and Interoperability ${i + 1}`),
      "DISASTER RECOVERY": Array.from({ length: 3 }, (_, i) => `Disaster Recovery and Business Continuity ${i + 1}`)
    };
  
    const categoryScores = Object.entries(categories).map(([category, keys]) => {
      const validValues: number[] = [];
      
      keys.forEach(key => {
        allOfficesData.forEach((office:any) => {
          if (office && office[key] !== undefined && office[key] !== null) {
            validValues.push(parseFloat(office[key]) || 0);
          }
        });
      });
      
      return {
        category,
        score: calculatePercentageScore(validValues)
      };
    });
  
    const overallPercentage = categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;
  
    setITReadinessData({
      labels: categoryScores.map(cat => cat.category),
      values: categoryScores.map(cat => cat.score),
      percentage: overallPercentage
    });
  };
  
  // Process ICT Change Management data
  const processICTChangeData = () => {
    const allOfficesData = getAllOfficesData();
    
    if (allOfficesData.length === 0) {
      console.error("No office data found");
      return;
    }
  
    const categories = {
      "CHANGE READINESS": Array.from({ length: 3 }, (_, i) => `CHANGE READINESS ${i + 1}`),
      "CHANGE LEADERSHIP": Array.from({ length: 2 }, (_, i) => `CHANGE LEADERSHIP ${i + 1}`),
      "CHANGE COMMUNICATION": Array.from({ length: 3 }, (_, i) => `CHANGE COMMUNICATION ${i + 1}`),
      "IMPACT ASSESSMENT": Array.from({ length: 3 }, (_, i) => `CHANGE IMPACT ASSESSMENT ${i + 1}`),
      "STAKEHOLDER ENGAGEMENT": Array.from({ length: 3 }, (_, i) => `STAKEHOLDER ENGAGEMENT ${i + 1}`),
      "PLANNING & EXECUTION": Array.from({ length: 3 }, (_, i) => `CHANGE PLANNING AND EXECUTION ${i + 1}`),
      "TRAINING": Array.from({ length: 3 }, (_, i) => `TRAINING AND DEVELOPMENT ${i + 1}`),
      "RESISTANCE MANAGEMENT": Array.from({ length: 3 }, (_, i) => `Resistance Management ${i + 1}`),
      "EVALUATION": Array.from({ length: 3 }, (_, i) => `Evaluation and Continuous Improvement ${i + 1}`),
      "SUSTAINABILITY": Array.from({ length: 3 }, (_, i) => `Sustainability and Embedding ${i + 1}`),
      "FINANCIAL": Array.from({ length: 5 }, (_, i) => `Costs or Financial ${i + 1}`)
    };
  
    const categoryScores = Object.entries(categories).map(([category, keys]) => {
      const validValues: number[] = [];
      
      keys.forEach(key => {
        allOfficesData.forEach((office:any) => {
          if (office && office[key] !== undefined && office[key] !== null) {
            validValues.push(parseFloat(office[key]) || 0);
          }
        });
      });
      
      return {
        category,
        score: calculatePercentageScore(validValues)
      };
    });
  
    const overallPercentage = categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;
  
    setICTData({
      labels: categoryScores.map(cat => cat.category),
      values: categoryScores.map(cat => cat.score),
      percentage: overallPercentage
    });
  };

  // Alternate colors for bar charts
  const getAlternatingColors = (count: number) => {
    return Array(count).fill(0).map((_, index) => 
      index % 2 === 0 ? chartColors[0] : chartColors[1]
    );
  };

  return (
  
     
        <div className={`grid grid-cols-${gridColsBase} md:grid-cols-1  gap-4`}>
          <TechnologyCard 
            title={cardLayouts.digitalSkills?.title || "DIGITAL SKILLS ASSESSMENT"}
            percentage={digitalSkillsData.percentage} 
            barData={{
              labels: digitalSkillsData.labels,
              values: digitalSkillsData.values,
              colors: getAlternatingColors(digitalSkillsData.labels.length)
            }}
            colSpan={cardLayouts.digitalSkills?.colSpan || 1}
          />

          <TechnologyCard 
            title={cardLayouts.tri?.title || "LGU Office Employee's Technology Readiness Index"}
            percentage={triData.percentage} 
            barData={{
              labels: triData.labels,
              values: triData.values,
              colors: getAlternatingColors(triData.labels.length)
            }} 
            colSpan={cardLayouts.tri?.colSpan || 1}
          />
          
          <TechnologyCard 
            title={cardLayouts.ictChange?.title || "ICT Change Management"}
            percentage={ictData.percentage} 
            barData={{
              labels: ictData.labels,
              values: ictData.values,
              colors: getAlternatingColors(ictData.labels.length)
            }} 
            colSpan={cardLayouts.ictChange?.colSpan || 1}
          />

          <TechnologyCard 
            title={cardLayouts.itReadiness?.title || "IT Readiness Assessment"}
            percentage={itReadinessData.percentage} 
            barData={{
              labels: itReadinessData.labels,
              values: itReadinessData.values,
              colors: getAlternatingColors(itReadinessData.labels.length)
            }} 
            maxBarValue={100}
            colSpan={cardLayouts.itReadiness?.colSpan || 1}
          />
        </div>
     
 
  );
};

export default Dashboard;