import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import Data from './../../assets/data/eReadinessSurveyData.json';
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

// Helper function to calculate percentage score
const calculatePercentageScore = (responses: number[]) => {
  const validResponses = responses.filter(val => val !== null && val !== undefined);
  if (validResponses.length === 0) return 0;
  
  const totalResponses = validResponses.length;
  const totalPossibleScore = totalResponses * 5; // Maximum score of 5 per response
  const actualScore = validResponses.reduce((sum, value) => sum + value, 0);
  return (actualScore / totalPossibleScore) * 100;
};

// Function to process data for a specific LGU
const processLGUData = (lguData: any) => {
  // Digital Skills Assessment
  const digitalSkillsKeys = Array.from({ length: 10 }, (_, i) => `Question ${i + 1} DigitalSkillsAssessment`);
  const digitalSkillsScores = digitalSkillsKeys.map(key => Number(lguData[key] || 0));
  const digitalSkillsAverage = calculatePercentageScore(digitalSkillsScores);

  // Technology Readiness Index
  const triCategories = {
    'OPTIMISM': Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`),
    'INNOVATIVENESS': Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`),
    'DISCOMFORT': Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`),
    'INSECURITY': Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`)
  };

  const triScores = Object.entries(triCategories).map(([category, keys]) => {
    const scores = keys.map(key => Number(lguData[key] || 0));
    return { category, score: calculatePercentageScore(scores) };
  });

  // IT Readiness Assessment
  const itReadinessCategories = {
    "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
    "IT GOVERNANCE": Array.from({ length: 3 }, (_, i) => `IT GOVERNANCE FRAMEWORK & POLICIES ${i + 1}`),
    "IT STRATEGY": Array.from({ length: 3 }, (_, i) => `IT STRATEGY AND ALIGNMENT ${i + 1}`),
    "IT POLICIES": Array.from({ length: 3 }, (_, i) => `IT POLICIES AND PROCEDURES ${i + 1}`),
    "RISK MANAGEMENT": Array.from({ length: 3 }, (_, i) => `RISK MANAGEMENT ${i + 1}`),
    "PERFORMANCE MEASUREMENT": Array.from({ length: 3 }, (_, i) => `IT PERFORMANCE MEASUREMENT AND REPORTING ${i + 1}`),
    "VENDOR MANAGEMENT": Array.from({ length: 3 }, (_, i) => `VENDOR MANAGEMENT ${i + 1}`),
    "IT SECURITY": Array.from({ length: 3 }, (_, i) => `IT SECURITY AND COMPLIANCE ${i + 1}`),
    "ICT ORGANIZATION": Array.from({ length: 3 }, (_, i) => `ICT Organizational Structure and Skills ${i + 1}`),
    "AUDIT & ASSURANCE": Array.from({ length: 3 }, (_, i) => `Audit and Assurance ${i + 1}`),
    "NETWORK": Array.from({ length: 2 }, (_, i) => `Network Infrastructure ${i + 1}`),
    "STORAGE": Array.from({ length: 3 }, (_, i) => `Servers and Storage ${i + 1}`),
    "VIRTUALIZATION": Array.from({ length: 3 }, (_, i) => `Virtualization ${i + 1}`),
    "BACKUP": Array.from({ length: 3 }, (_, i) => `Data Backup and Recovery ${i + 1}`),
    "SECURITY MEASURES": Array.from({ length: 4 }, (_, i) => `Security Measures ${i + 1}`),
    "MONITORING": Array.from({ length: 3 }, (_, i) => `Monitoring and Performance ${i + 1}`),
    "COMPLIANCE": Array.from({ length: 3 }, (_, i) => `Compliance and Governance ${i + 1}`),
    "INTEGRATION": Array.from({ length: 3 }, (_, i) => `Integration and Interoperability ${i + 1}`),
    "DISASTER RECOVERY": Array.from({ length: 3 }, (_, i) => `Disaster Recovery and Business Continuity ${i + 1}`)
  };

  const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => {
    const scores = keys.map(key => Number(lguData[key] || 0));
    return { category, score: calculatePercentageScore(scores) };
  });

  // ICT Change Management
  const changeManagementCategories = {
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

  const changeManagementScores = Object.entries(changeManagementCategories).map(([category, keys]) => {
    const scores = keys.map(key => Number(lguData[key] || 0));
    return { category, score: calculatePercentageScore(scores) };
  });

  // Calculate final scores
  const triScore = (
    triScores.find(item => item.category === "OPTIMISM")?.score || 0 +
    triScores.find(item => item.category === "INNOVATIVENESS")?.score || 0 +
    triScores.find(item => item.category === "DISCOMFORT")?.score || 0 +
    triScores.find(item => item.category === "INSECURITY")?.score || 0
  ) / 4;

  const itReadinessScore = itReadinessScores.reduce((sum, item) => sum + item.score, 0) / itReadinessScores.length;
  const changeManagementScore = changeManagementScores.reduce((sum, item) => sum + item.score, 0) / changeManagementScores.length;

  return {
    digitalSkills: {
      percentage: digitalSkillsAverage,
      data: digitalSkillsScores,
      labels: digitalSkillsKeys.map((_, i) => `Question ${i + 1}`)
    },
    techReadiness: {
      percentage: triScore,
      data: triScores.map(item => item.score),
      labels: triScores.map(item => item.category)
    },
    itReadiness: {
      percentage: itReadinessScore,
      data: itReadinessScores.map(item => item.score),
      labels: itReadinessScores.map(item => item.category)
    },
    changeManagement: {
      percentage: changeManagementScore,
      data: changeManagementScores.map(item => item.score),
      labels: changeManagementScores.map(item => item.category)
    },
    totalScore: (digitalSkillsAverage + triScore + itReadinessScore + changeManagementScore) / 4
  };
};

const calculateLGUScores = (mayorOfficeData: any[]) => {
  return mayorOfficeData.filter(data => data.Province === "Camiguin").map(lgu => {
    // Calculate Digital Skills Assessment Score
    const digitalSkillsKeys = Array.from({ length: 10 }, (_, i) => `Question ${i + 1} DigitalSkillsAssessment`);
    const digitalSkillsScores = digitalSkillsKeys.map(key => Number(lgu[key] || 0));
    const digitalSkillsAverage = calculatePercentageScore(digitalSkillsScores);

    // Calculate Technology Readiness Index Score
    const triCategories = {
      'OPTIMISM': Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`),
      'INNOVATIVENESS': Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`),
      'DISCOMFORT': Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`),
      'INSECURITY': Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`)
    };

    const triScores = Object.entries(triCategories).map(([category, keys]) => {
      const scores = keys.map(key => Number(lgu[key] || 0));
      return { category, score: calculatePercentageScore(scores) };
    });

    // Calculate IT Readiness Assessment Score
    const itReadinessCategories = {
      "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
      "IT GOVERNANCE": Array.from({ length: 3 }, (_, i) => `IT GOVERNANCE FRAMEWORK & POLICIES ${i + 1}`),
      "IT STRATEGY": Array.from({ length: 3 }, (_, i) => `IT STRATEGY AND ALIGNMENT ${i + 1}`),
      "IT POLICIES": Array.from({ length: 3 }, (_, i) => `IT POLICIES AND PROCEDURES ${i + 1}`),
      "RISK MANAGEMENT": Array.from({ length: 3 }, (_, i) => `RISK MANAGEMENT ${i + 1}`),
      "PERFORMANCE MEASUREMENT": Array.from({ length: 3 }, (_, i) => `IT PERFORMANCE MEASUREMENT AND REPORTING ${i + 1}`),
      "VENDOR MANAGEMENT": Array.from({ length: 3 }, (_, i) => `VENDOR MANAGEMENT ${i + 1}`),
      "IT SECURITY": Array.from({ length: 3 }, (_, i) => `IT SECURITY AND COMPLIANCE ${i + 1}`),
      "ICT ORGANIZATION": Array.from({ length: 3 }, (_, i) => `ICT Organizational Structure and Skills ${i + 1}`),
      "AUDIT & ASSURANCE": Array.from({ length: 3 }, (_, i) => `Audit and Assurance ${i + 1}`),
      "NETWORK": Array.from({ length: 2 }, (_, i) => `Network Infrastructure ${i + 1}`),
      "STORAGE": Array.from({ length: 3 }, (_, i) => `Servers and Storage ${i + 1}`),
      "VIRTUALIZATION": Array.from({ length: 3 }, (_, i) => `Virtualization ${i + 1}`),
      "BACKUP": Array.from({ length: 3 }, (_, i) => `Data Backup and Recovery ${i + 1}`),
      "SECURITY MEASURES": Array.from({ length: 4 }, (_, i) => `Security Measures ${i + 1}`),
      "MONITORING": Array.from({ length: 3 }, (_, i) => `Monitoring and Performance ${i + 1}`),
      "COMPLIANCE": Array.from({ length: 3 }, (_, i) => `Compliance and Governance ${i + 1}`),
      "INTEGRATION": Array.from({ length: 3 }, (_, i) => `Integration and Interoperability ${i + 1}`),
      "DISASTER RECOVERY": Array.from({ length: 3 }, (_, i) => `Disaster Recovery and Business Continuity ${i + 1}`)
    };

    const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => {
      const scores = keys.map(key => Number(lgu[key] || 0));
      return { category, score: calculatePercentageScore(scores) };
    });

    // Calculate ICT Change Management Score
    const changeManagementCategories = {
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

    const changeManagementScores = Object.entries(changeManagementCategories).map(([category, keys]) => {
      const scores = keys.map(key => Number(lgu[key] || 0));
      return { category, score: calculatePercentageScore(scores) };
    });

    // Calculate final scores
    const triScore = (
      triScores.find(item => item.category === "OPTIMISM")?.score || 0 +
      triScores.find(item => item.category === "INNOVATIVENESS")?.score || 0 +
      (100 - (triScores.find(item => item.category === "DISCOMFORT")?.score || 0)) +
      (100 - (triScores.find(item => item.category === "INSECURITY")?.score || 0))
    ) / 4;

    const itReadinessScore = itReadinessScores.reduce((sum, item) => sum + item.score, 0) / itReadinessScores.length;
    const changeManagementScore = changeManagementScores.reduce((sum, item) => sum + item.score, 0) / changeManagementScores.length;

    // Calculate total score (average of all assessments)
    const totalScore = (digitalSkillsAverage + triScore + itReadinessScore + changeManagementScore) / 4;

    return {
      name: lgu["LGU Name"],
      score: Math.round(totalScore * 100) / 100,
      digitalSkills: Math.round(digitalSkillsAverage * 100) / 100,
      techReadiness: Math.round(triScore * 100) / 100,
      itReadiness: Math.round(itReadinessScore * 100) / 100,
      changeManagement: Math.round(changeManagementScore * 100) / 100
    };
  });
};

function Camiguin() {
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

      // Group data by LGU name to prevent duplicates and combine scores
      const groupedData = allOffices.reduce((acc, current) => {
        if (current.Province === "Camiguin") {
          if (!acc[current["LGU Name"]]) {
            acc[current["LGU Name"]] = [];
          }
          acc[current["LGU Name"]].push(current);
        }
        return acc;
      }, {});

      // Process each LGU's combined data
      const combinedLGUs = Object.entries(groupedData).map(([lguName, officeData]) => {
        // Combine all office data for this LGU
        const combinedData = officeData.reduce((acc, curr) => {
          Object.keys(curr).forEach(key => {
            if (!acc[key] || (typeof curr[key] === 'number' && curr[key] > acc[key])) {
              acc[key] = curr[key];
            }
          });
          return acc;
        }, {});

        // Calculate scores using the combined data
        const scores = calculateLGUScores([combinedData])[0];
        return scores;
      });

      // Sort by score and add ranking
      const sortedLgus = [...combinedLGUs]
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
    navigate(`/camiguin/${lgu.name}`, {
      state: {
        lguName: lgu.name,
        score: lgu.score
      }
    });
  };

  const filteredData = Object.keys(Data).reduce((acc, key) => {
    // Check if the current key contains an array
    if (Array.isArray(Data[key])) {
      acc[key] = Data[key].filter((item: any) => 
        item.Province === "Camiguin"
      );
    } else {
      // If not an array, keep the original value
      acc[key] = Data[key];
    }
    return acc;
  }, {} as typeof Data);

  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-[95%] h-[90%] flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 rounded-sm text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">Camiguin Province</h1>
        
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
        data={filteredData } 
        title="Digital Skills Card Full Width" 
        gridColsBase={1}
        
      />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Camiguin;