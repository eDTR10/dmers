import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import Data from './../../assets/data/eReadinessSurveyData.json';
import surveyData from './../../assets/data/eReadinessSurveyData.json';

import Dashboard from '@/components/chart/Maturity';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Helper functions
const calculateAverage = (values: number[]) => {
  const validValues = values.filter(val => val !== null && val !== undefined);
  return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};

const scaleToPercentage = (value: number) => {
  return ((value - 1) / 4) * 100;
};

const calculatePercentageScore = (responses: number[]) => {
  const validResponses = responses.filter(val => val !== null && val !== undefined);
  if (validResponses.length === 0) return 0;
  
  const totalPossibleScore = validResponses.length * 5;
  const actualScore = validResponses.reduce((sum, value) => sum + value, 0);
  return (actualScore / totalPossibleScore) * 100;
};

const calculateLGUScores = (lguData: any) => {
  // Digital Skills Assessment
  const digitalSkillsKeys = Array.from({ length: 10 }, (_, i) => `Question ${i + 1} DigitalSkillsAssessment`);
  const digitalSkillsAverage = calculatePercentageScore(digitalSkillsKeys.map(key => Number(lguData[key] || 0)));

  // Technology Readiness Index Score
  const triCategories = {
    'OPTIMISM': Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`),
    'INNOVATIVENESS': Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`),
    'DISCOMFORT': Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`),
    'INSECURITY': Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`)
  };

  const triScores = Object.entries(triCategories).map(([category, keys]) => ({
    category,
    score: calculatePercentageScore(keys.map(key => Number(lguData[key] || 0)))
  }));

  // IT Readiness Assessment
  const itReadinessCategories = {
    "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
    // ...existing IT Readiness categories...
  };

  const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => ({
    category,
    score: calculatePercentageScore(keys.map(key => Number(lguData[key] || 0)))
  }));

  // ICT Change Management
  const changeManagementCategories = {
    "CHANGE READINESS": Array.from({ length: 3 }, (_, i) => `CHANGE READINESS ${i + 1}`),
    // ...existing Change Management categories...
  };

  const changeManagementScores = Object.entries(changeManagementCategories).map(([category, keys]) => ({
    category,
    score: calculatePercentageScore(keys.map(key => Number(lguData[key] || 0)))
  }));

  // Calculate final scores
  const triScore = (
    triScores.find(item => item.category === "OPTIMISM")?.score || 0 +
    triScores.find(item => item.category === "INNOVATIVENESS")?.score || 0 +
    (100 - (triScores.find(item => item.category === "DISCOMFORT")?.score || 0)) +
    (100 - (triScores.find(item => item.category === "INSECURITY")?.score || 0))
  ) / 4;

  const itReadinessScore = itReadinessScores.reduce((sum, item) => sum + item.score, 0) / itReadinessScores.length;
  const changeManagementScore = changeManagementScores.reduce((sum, item) => sum + item.score, 0) / changeManagementScores.length;

  // Calculate total score
  const totalScore = (digitalSkillsAverage + triScore + itReadinessScore + changeManagementScore) / 4;

  return {
    name: lguData["LGU Name"],
    score: Math.round(totalScore * 100) / 100,
    digitalSkills: Math.round(digitalSkillsAverage * 100) / 100,
    techReadiness: Math.round(triScore * 100) / 100,
    itReadiness: Math.round(itReadinessScore * 100) / 100,
    changeManagement: Math.round(changeManagementScore * 100) / 100
  };
};

function MisamisOriental() {
  const navigate = useNavigate();
  const [lguData, setLguData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Primary colors
  const primaryColor = '#0036C5';
  const secondaryColor = '#ECC217';

  useEffect(() => {
    if (Data["Mayors Office"] && Data["IT Office"] && Data["HR Office"] && Data["Other Offices"]) {
      // Combine all office data
      const allOffices = [
        ...Data["Mayors Office"],
        ...Data["IT Office"],
        ...Data["HR Office"],
        ...Data["Other Offices"]
      ];

      // Group data by LGU name
      const groupedData = allOffices.reduce((acc, current) => {
        if (current.Province.toLowerCase() == "misor") {
          if (!acc[current["LGU Name"]]) {
            acc[current["LGU Name"]] = [];
          }
          acc[current["LGU Name"]].push(current);
        }
        return acc;
      }, {});

      // Process each LGU's data
      const processedLGUs = Object.entries(groupedData).map(([lguName, officeData]) => {
        const combinedData = (officeData as any[]).reduce((acc, curr) => {
          Object.keys(curr).forEach(key => {
            if (!acc[key] || (typeof curr[key] === 'number' && curr[key] > acc[key])) {
              acc[key] = curr[key];
            }
          });
          return acc;
        }, { "LGU Name": lguName });

        return calculateLGUScores(combinedData);
      });

      // Sort and add ranking
      const sortedLgus = processedLGUs
        .sort((a, b) => b.score - a.score)
        .map((lgu, index) => ({
          ...lgu,
          rank: index + 1
        }));

      setLguData(sortedLgus);

      // Update category data for line chart
      const categories = {
        labels: ['Digital Skills', 'Tech Readiness', 'IT Readiness', 'Change Management', 'Overall Score'],
        datasets: sortedLgus.map((lgu, index) => ({
          label: lgu.name,
          data: [
            lgu.digitalSkills,
            lgu.techReadiness,
            lgu.itReadiness,
            lgu.changeManagement,
            lgu.score
          ],
          borderColor: index % 2 === 0 ? '#0036C5' : '#ECC217',
          backgroundColor: `${index % 2 === 0 ? '#0036C5' : '#ECC217'}20`,
          tension: 0.1
        }))
      };
      
      setCategoryData(categories);
    }
  }, []);

  // Filter LGUs based on search term but keep original ranking
  const filteredLGUs = lguData.filter(lgu => 
    lgu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLGUs2 = lguData.filter(lgu => 
    lgu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modified pie chart data to use only two colors alternately
  const pieData = {
    labels: lguData.map(lgu => lgu.name),
    datasets: [
      {
        data: lguData.map(lgu => lgu.score),
        backgroundColor: lguData.map((_, index) => index % 2 === 0 ? '#0036C5' : '#ECC217'),
        borderWidth: 1,
      },
    ],
  };

  // Handle LGU click
  const handleLguClick = (lgu) => {
    navigate(`/misamis-oriental/${lgu.name}`, {
      state: {
        lguName: lgu.name,
        score: lgu.score
      }
    });
  };

  const filteredData = Object.keys(surveyData).reduce((acc, key) => {
    // Check if the current key contains an array
    if (Array.isArray(surveyData[key])) {
      acc[key] = surveyData[key].filter((item: any) => 
        item.Province === "Misor"  // Changed from "Camiguin" to "Misor"
      );
    } else {
      // If not an array, keep the original value
      acc[key] = surveyData[key];
    }
    return acc;
  }, {} as typeof surveyData);

  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-[95%] h-[90%] flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 rounded-sm text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">Misamis Oriental Province</h1>
        
        <div className="flex flex-row space-x-4">
          {/* Left side - Table */}
          <div className="w-[30%] border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white">
              {/* Search bar */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
              </div>
              
              {/* Modified table header to include ranking */}
              <div className="grid grid-cols-5 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div className="p-4 col-span-1 flex items-center">
                  Rank
                </div>
                <div className="p-4 col-span-2 flex items-center">
                  LGU Name 
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="p-4 col-span-2 flex items-center">
                  Score (%) 
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Modified table body with click handler */}
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {filteredLGUs.map((lgu:any) => (
                  <div 
                    key={lgu.name} 
                    className="cursor-pointer grid grid-cols-5 hover:bg-gray-50"
                    onClick={() => handleLguClick(lgu)}
                  >
                    <div className="p-4 col-span-1">{lgu.rank}</div>
                    <div className="p-4 col-span-2 truncate">{lgu.name}</div>
                    <div className="p-4 col-span-2">{lgu.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side - Charts */}
          <div className="w-[70%] space-y-4">
            {/* Pie Chart */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-medium mb-4">LGUs Assessment Scores</h2>
              <div className="h-[300px] flex justify-center">
                <Pie 
                  data={pieData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Line Chart */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-medium mb-4">LGUs Assessment Category Scores</h2>
              <div className="h-[300px]">
                {Object.keys(categoryData).length > 0 && (
                  <Line
                    data={categoryData}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 12
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': ' + context.raw + '%';
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <Dashboard
                    data={filteredData} 
                    title="Digital Skills Card Full Width" 
                    gridColsBase={1}/>
                    
          </div>
        </div>
      </div>
    </div>
  );
}

export default MisamisOriental;