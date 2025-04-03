import  { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
;
import Dashboard from '@/components/chart/Maturity';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import rawData from './../../assets/data/eReadinessSurveyData.json';
const Data: any = rawData;

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Helper functions
const calculateAverage = (values: number[]) => {
  const validValues = values.filter(val => val !== null && val !== undefined);
  return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};



// Helper function to calculate percentage score
const calculatePercentageScore = (responses: number[]) => {
  const validResponses = responses.filter(val => val !== null && val !== undefined);
  if (validResponses.length === 0) return 0;
  
  const totalPossibleScore = validResponses.length * 5; // Maximum score of 5 per response
  const actualScore = validResponses.reduce((sum, value) => sum + value, 0);
  return (actualScore / totalPossibleScore) * 100;
};

// Update the processLGUData function with the new calculation methods
const processLGUData = (officesData: any[]) => {
  // Find IT Office data for this LGU
  const lguName = officesData[0]["LGU Name"];
  const itOfficeData:any = Data["IT Office"].find((data:any) => data["LGU Name"] === lguName);

  // Digital Skills Assessment - Updated calculation
  const digitalSkillsKeys = Array.from({ length: 10 }, (_, i) => `Question ${i + 1} DigitalSkillsAssessment`);
  const digitalSkillsScores = digitalSkillsKeys.map(key => {
    const responses = officesData
      .map(office => Number(office[key] || 0))
      .filter(value => !isNaN(value));

    // Calculate score using total/maxPossible method
    const total = responses.reduce((sum, value) => sum + value, 0);
    const maxPossible = responses.length * 5;
    return (total / maxPossible) * 100;
  });

  const digitalSkillsAvg = calculateAverage(digitalSkillsScores);

  // Technology Readiness Index - Updated calculation
  const triCategories = {
    'Optimism': { count: 10 },
    'Innovativeness': { count: 7 },
    'Discomfort': { count: 10 },
    'Insecurity': { count: 9 }
  };

  const triScores = Object.entries(triCategories).map(([category, { count }]) => {
    const responses = officesData.flatMap(office => {
      return Array.from({ length: count }, (_, i) => {
        const key = `${category} ${i + 1}`;
        return Number(office[key] || 0);
      });
    }).filter(value => !isNaN(value));

    // Calculate score using total/maxPossible method
    const total = responses.reduce((sum, value) => sum + value, 0);
    const maxPossible = responses.length * 5;
    return {
      category: category.toUpperCase(),
      score: (total / maxPossible) * 100
    };
  });

  // Calculate final TRI score as average of all dimensions
  const techReadinessAvg = calculateAverage(triScores.map(cat => cat.score));

  // For IT Readiness and Change Management you might want to perform similar aggregations;
  // here we leave them as zero (or add your preferred calculation) since your issue was with
  // combining responses for Digital Skills and TRI.
  let itReadinessAvg = 0;
  if (itOfficeData) {
    const itReadinessCategories = {
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

    const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => ({
      category,
      score: calculatePercentageScore(keys.map(key => Number(itOfficeData[key] || 0)))
    }));

    const totalScore = itReadinessScores.reduce((sum, item) => sum + item.score, 0);
    itReadinessAvg = totalScore / Object.keys(itReadinessCategories).length;
  }

  // Calculate Change Management using only IT Office data
  let changeManagementAvg = 0;
  if (itOfficeData) {
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

    const changeManagementScores = Object.entries(changeManagementCategories).map(([category, keys]) => ({
      category,
      score: calculatePercentageScore(keys.map(key => Number(itOfficeData[key] || 0)))
    }));

    const totalScore = changeManagementScores.reduce((sum, item) => sum + item.score, 0);
    changeManagementAvg = totalScore / Object.keys(changeManagementCategories).length;
  }

  const totalScore = (digitalSkillsAvg + techReadinessAvg + itReadinessAvg + changeManagementAvg) / 4;

  return {
    digitalSkills: {
      percentage: digitalSkillsAvg,
      data: digitalSkillsScores,
      labels: Array.from({ length: 10 }, (_, i) => `Question ${i + 1}`)
    },
    techReadiness: {
      percentage: techReadinessAvg,
      data: triScores.map(cat => cat.score),
      labels: triScores.map(cat => cat.category)
    },
    itReadiness: { percentage: itReadinessAvg },
    changeManagement: { percentage: changeManagementAvg },
    totalScore
  };
};





function MisamisOriental() {


  const navigate = useNavigate();
  const [lguData, setLguData] = useState([]);
  const [categoryData, setCategoryData] = useState<{
      labels: string[];
      datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number }[];
    }>({
      labels: [],
      datasets: []
    });
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    if (
      Data["Mayors Office"] &&
      Data["IT Office"] &&
      Data["HR Office"] &&
      Data["Other Offices"]
    ) {
      // Combine all office data
      const allOffices = [
        ...Data["Mayors Office"],
        ...Data["IT Office"],
        ...Data["HR Office"],
        ...Data["Other Offices"]
      ];

      // Group data by LGU name (for Camiguin province)
      const groupedData = allOffices.reduce((acc, current) => {
        if (current.Province === "Misor") {
          const lguName = current["LGU Name"];
          if (!acc[lguName]) {
            acc[lguName] = [];
          }
          acc[lguName].push(current);
        }
        return acc;
      }, {} as Record<string, any[]>);

      // For each LGU, pass the array of responses directly to processLGUData
      const combinedLGUs = Object.entries(groupedData).map(([lguName, officeData]:any) => {
        const scores = processLGUData(officeData);
        return {
          name: lguName,
          score: Math.round(scores.totalScore * 100) / 100,
          digitalSkills: Math.round(scores.digitalSkills.percentage * 100) / 100,
          techReadiness: Math.round(scores.techReadiness.percentage * 100) / 100,
          itReadiness: Math.round(scores.itReadiness.percentage * 100) / 100,
          changeManagement: Math.round(scores.changeManagement.percentage * 100) / 100
        };
      });

      // Sort by score and add ranking
      const sortedLgus:any = [...combinedLGUs]
        .sort((a, b) => b.score - a.score)
        .map((lgu, index) => ({
          ...lgu,
          rank: index + 1
        }));

      setLguData(sortedLgus);

      // Update category data for line chart
      const categories = {
        labels: ['Digital Skills', 'Tech Readiness', 'IT Readiness', 'Change Management', 'Overall Score'],
        datasets: sortedLgus.map((lgu:any, index:any) => ({
          label: lgu.name,
          data: [
            lgu.digitalSkills,
            lgu.techReadiness,
            lgu.itReadiness,
            lgu.changeManagement,
            lgu.score
          ],
          borderColor: index % 2 === 0 ? '#0036C5' : '#ECC217',
          backgroundColor: index % 2 === 0 ? '#0036C520' : '#ECC21720',
          tension: 0.1
        }))
      };
      
      setCategoryData(categories);
    }
  }, []);

  // Filter LGUs based on search term but keep original ranking
  const filteredLGUs = lguData.filter((lgu:any) => 
    lgu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Modified pie chart data to use only two colors alternately
  const pieData = {
    labels: lguData.map((lgu:any) => lgu.name),
    datasets: [
      {
        data: lguData.map((lgu:any) => lgu.score),
        backgroundColor: lguData.map((_, index) => index % 2 === 0 ? '#0036C5' : '#ECC217'),
        borderWidth: 1,
      },
    ],
  };

  // Handle LGU click
  const handleLguClick = (lgu:any) => {
    navigate(`/misamis-oriental/${lgu.name}`, {
      state: {
        lguName: lgu.name,
        score: lgu.score
      }
    });
  };
;
  const filteredData:any = Object.keys(Data).reduce((acc:any, key:any) => {
    // Check if the current key contains an array
    if (Array.isArray(Data[key])) {
      acc[key] = Data[key].filter((item: any) => 
        item.Province === "Misor" 
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

            
          <Dashboard
        data={filteredData } 
        title="Digital Skills Card Full Width" 
        gridColsBase={1}
        
      />
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
      },
      // Enable the plugin specifically for this chart
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold',
          size: 10
        },
        formatter: (value) => {
          return `${Math.round(value)}%`;
        },
        align: 'center',
        anchor: 'center'
      }
    }
  }}
  plugins={[ChartDataLabels]} // Add plugin locally
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

          </div>
        </div>
      </div>
    </div>
  );
}

export default MisamisOriental;