import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Data from './../../assets/data/eReadinessSurveyData.json';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function About() {
  const { lguName } = useParams();
  const location = useLocation();
  const [lguInfo, setLguInfo] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState('About');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [detailedScores, setDetailedScores] = useState<any>(null);
  const [digitalScore, setDigitalScore] = useState<any>({});
  const [selectedAssessment, setSelectedAssessment] = useState('DIGITAL SKILLS ASSESSMENT');
  const [officesWithData, setOfficesWithData] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("All Offices");

  // Update the useEffect to use the new scores
  useEffect(() => {
    if (location.state?.score) setScore(location.state.score);

    const selectedLgu = lguName || location.state?.lguName;
    if (selectedLgu && Data) {
      const info: any = Data.Info.find(item =>
        item["LGU Name"]?.toUpperCase() === selectedLgu.toUpperCase()
      );
      const info2: any = Data["Mayors Office"].find(item =>
        item["LGU Name"]?.toUpperCase() === selectedLgu.toUpperCase()
      );

      if (info) {
        setLguInfo({ ...info, ...info2 });

        // Calculate scores across all offices
        const scores = calculateLGUDetailedScores(selectedLgu, ["Mayors Office", "Other Offices", "HR Office", "IT Office"]);

        if (scores) {
          setDetailedScores(scores);
          // Use the new total score calculation
          setScore(scores.totalScore);

          setDigitalScore(scores.componentScores);

          console.log('Component Scores:', scores.componentScores.digitalSkills);
        }
        
        // Get all offices that have data for this LGU
        const availableOffices = ["Mayor's Office", "HR Office", "IT Office"];
        
        // Add other offices dynamically
        const otherOfficesData = Data["Other Offices"].filter(
          item => item["LGU Name"]?.toUpperCase() === selectedLgu.toUpperCase()
        );
        
        const uniqueOtherOffices = [...new Set(otherOfficesData.map(item => item["Office Name"]))];
        
        setOfficesWithData(["All Offices", ...availableOffices, ...uniqueOtherOffices]);
      }
    }
  }, [lguName, location]);

  function Percentage(data: any) {
    switch (data) {
      case "DIGITAL SKILLS ASSESSMENT":
        return digitalScore.digitalSkills;
      case "TECHNOLOGY READINESS INDEX":
        return digitalScore.techReadiness;
      case "IT READINESS ASSESSMENT":
        return digitalScore.itReadiness;
      case "ICT CHANGE MANAGEMENT":
        return digitalScore.changeManagement;

      default:
        break;
    }
  }

  if (!lguInfo) {
    return (
      <div className="min-h-full w-full flex items-center justify-center">
        <div className="p-5 w-[95%] flex flex-col bg-card/25 border border-border rounded-lg">
          <h1 className="py-4 px-2 text-center font-bold text-xl border text-[#0036C5] border-[#0036C5]">
            LGU Information Not Found
          </h1>
        </div>
      </div>
    );
  }

  // Get data specific to the selected office
  const getOfficeData = (officeName: string) => {
    if (officeName === "All Offices") {
      return getChartData();
    }
    
    // Map our friendly office names to data keys
    const officeDataKey = officeName === "Mayor's Office" ? "Mayors Office" : officeName;
    
    let officeData;
    let Datas:any=  Data
    if (["Mayor's Office", "HR Office", "IT Office"].includes(officeName)) {
      officeData = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
        (item:any) => item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
      );
    } else {
      // Find in Other Offices with matching Office Name
      officeData = Datas["Other Offices"].find(
        (item:any) => 
          item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase() && 
          item["Office Name"] === officeName
      );
    }
    
    if (!officeData) return getChartData(); // Fallback
    
    // Process data based on assessment type
    let labels = [];
    let data = [];
    
    switch (selectedAssessment) {
      case 'DIGITAL SKILLS ASSESSMENT':
        labels = assData[0].data;
        data = labels.map((_:any, idx:any) => {
          const key = `Question ${idx + 1} DigitalSkillsAssessment`;
          const value = officeData[key] || 0;
          return (Number(value) / 5) * 100; // Convert to percentage
        });
        break;
      case 'TECHNOLOGY READINESS INDEX':
        labels = assData[1].data;
        data = labels.map((label:any) => {
          const category = label.split(' ')[0]; // Extract category name
          const questionCount = parseInt(label.match(/\((\d+) questions\)/)?.[1] || "0");
          
          // Calculate score for this category from this office
          let total = 0;
          for (let i = 1; i <= questionCount; i++) {
            const key = `${category} ${i}`;
            total += Number(officeData[key] || 0);
          }
          
          return (total / (questionCount * 5)) * 100; // Convert to percentage
        });
        break;
      // IT Readiness and Change Management handled by IT Office only
      default:
        return getChartData();
    }
    
    return {
      labels,
      datasets: [
        {
          label: `${selectedAssessment} - ${officeName}`,
          data,
          borderColor: '#0036C5',
          backgroundColor: 'rgba(0, 54, 197, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const getChartData = () => {
    let labels = [];
    let data = [];

    switch (selectedAssessment) {
      case 'DIGITAL SKILLS ASSESSMENT':
        labels = assData[0].data;
        data = detailedScores.digitalSkills.scores.map((s: any) => s.score);
        break;
      case 'TECHNOLOGY READINESS INDEX':
        labels = assData[1].data;
        data = detailedScores.technologyReadiness.categories.map((c: any) => c.average);
        break;
      case 'IT READINESS ASSESSMENT':
        labels = assData[2].data;
        data = detailedScores.itReadiness.categories.map((c: any) => c.score);
        break;
      case 'ICT CHANGE MANAGEMENT':
        labels = assData[3].data;
        data = detailedScores.changeManagement.categories.map((c: any) => c.score);
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: selectedAssessment,
          data,
          borderColor: '#0036C5',
          backgroundColor: 'rgba(0, 54, 197, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const renderAssessmentContent = () => {
    if (!detailedScores) return null;

    const chartData = selectedOffice === "All Offices" ? getChartData() : getOfficeData(selectedOffice);
    
    // Determine if office selection should be enabled for current assessment


    return (
      <div className="space-y-4  w-full">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="font-medium">Select Assessment:</label>
          <select
            value={selectedAssessment}
            onChange={(e) => {
              setSelectedAssessment(e.target.value);
              // Reset to All Offices when changing assessment type
              setSelectedOffice("All Offices");
            }}
            className="border rounded-md p-2"
          >
            {assData.map((section:any) => (
              <option key={section.title} value={section.title}>
                {section.title}
              </option>
            ))}
          </select>
          
      
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Detailed Scores - Left side */}         
          {/* Chart - Right side */}
          <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-5 order-1 md:order-2">
            <div className=" col-span-1">
              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedAssessment} Score</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOffice === "All Offices" ? "Average across all offices" : `For ${selectedOffice}`}
                  </p>
                </div>
                <div className="relative w-24 h-24 ">
                  <svg className="w-full h-full md:hidden transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#eee" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={
                        Percentage(selectedAssessment) >= 80 ? '#10B981' :
                        Percentage(selectedAssessment) >= 60 ? '#0036C5' :
                        Percentage(selectedAssessment) >= 40 ? '#FBBF24' : '#EF4444'
                      }
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(Percentage(selectedAssessment) / 100) * 251.2} 251.2`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" style={{ 
                      color: 
                        Percentage(selectedAssessment) >= 80 ? '#10B981' :
                        Percentage(selectedAssessment) >= 60 ? '#0036C5' :
                        Percentage(selectedAssessment) >= 40 ? '#FBBF24' : '#EF4444'
                    }}>
                      {Percentage(selectedAssessment)?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full  order-2 md:order-1">
            <h3 className="text-xl font-semibold mt-10 mb-4">Detailed Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4  overflow-y-auto pr-2">
              {assData.find((section:any) => section.title === selectedAssessment)?.data.map((item:any, index:any) => {
                let score = 0;
                let responses = [];
                
                switch (selectedAssessment) {
                  case "DIGITAL SKILLS ASSESSMENT":
                    score = detailedScores.digitalSkills.scores[index]?.score;
                    responses = detailedScores.digitalSkills.scores[index]?.responses || [];
                    break;
                  case "TECHNOLOGY READINESS INDEX":
                    score = detailedScores.technologyReadiness.categories[index]?.average;
                    break;
                  case "IT READINESS ASSESSMENT":
                    score = detailedScores.itReadiness?.categories[index]?.score;
                    break;
                  case "ICT CHANGE MANAGEMENT":
                    score = detailedScores.changeManagement?.categories[index]?.score;
                    break;
                }

                // Determine color based on score
                const scoreColor = score >= 80 ? 'bg-green-100 border-green-300' :
                                 score >= 50 ? 'bg-blue-50 border-blue-200' :
                                 score >= 30 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

                return (
                  <div 
                    key={index} 
                    
                    className={`p-4 rounded-lg border ${scoreColor} hover:shadow-md cursor-pointer transition-all duration-200`}
                  >
                    <div className="text-sm text-gray-600 font-medium">{item}</div>
                    <div className="text-lg font-semibold text-[#0036C5]">{score?.toFixed(2)}%</div>
                    
                    {/* Show per-office responses for Digital Skills if available */}
                    {selectedAssessment === 'DIGITAL SKILLS ASSESSMENT' && responses?.length > 0 && (
                      <div className="mt-2">
                        <button 

                        onClick={() => {
                      // Toggle detailed view for this item
                      setExpandedSections(prev => 
                        prev.includes(`${selectedAssessment}-${index}`) 
                          ? prev.filter(id => id !== `${selectedAssessment}-${index}`)
                          : [...prev, `${selectedAssessment}-${index}`]
                      );
                    }}
                          
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {expandedSections.includes(`${selectedAssessment}-${index}`) ? 'Hide Details' : 'View Office Responses'}
                        </button>
                        
                        {expandedSections.includes(`${selectedAssessment}-${index}`) && (
                          <div className="mt-2 text-xs bg-white p-2 rounded border">
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <th className="text-left py-1">Office</th>
                                  <th className="text-right py-1">Rating (1-5)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {officesWithData.filter(o => o !== "All Offices").map((office, i) => {
                                  // Map our friendly office names to data keys
                                  const officeDataKey = office === "Mayor's Office" ? "Mayors Office" : office;
                                  
                                  // Get response for this office
                                  let officeResponse = 0;
                                  let Datas:any=  Data
                                  if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
                                    const data = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
                                      (item:any)=> item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
                                    );


                                    
                                    officeResponse = Number(data?.[`Question ${index + 1} DigitalSkillsAssessment`] || 0);
                                  } else {
                                    // Find in Other Offices with matching Office Name
                                    let data:any = Data["Other Offices"].find(
                                      item => 
                                        item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase() && 
                                        item["Office Name"] === office
                                    );
                                    officeResponse = Number(data?.[`Question ${index + 1} DigitalSkillsAssessment`] || 0);
                                  }
                                  
                                  return (
                                    <tr key={i} className="border-t">
                                      <td className="py-1">{office}</td>
                                      <td className="text-right py-1">
                                        <div className="flex items-center justify-end">
                                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                            <div 
                                              className="bg-blue-600 h-2 rounded-full" 
                                              style={{ width: `${(officeResponse/5)*100}%` }}
                                            ></div>
                                          </div>
                                          {officeResponse}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedAssessment === 'TECHNOLOGY READINESS INDEX' && (
  <div className="mt-2">
    <button 
      onClick={() => {
        setExpandedSections(prev => 
          prev.includes(`${selectedAssessment}-${index}`) 
            ? prev.filter(id => id !== `${selectedAssessment}-${index}`)
            : [...prev, `${selectedAssessment}-${index}`]
        );
      }}
      className="text-xs text-blue-600 hover:underline"
    >
      {expandedSections.includes(`${selectedAssessment}-${index}`) ? 'Hide Questions' : 'View Questions'}
    </button>
    
    {expandedSections.includes(`${selectedAssessment}-${index}`) && (
      <div className="mt-2 text-xs bg-white p-2 rounded border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-1">Question</th>
              <th className="text-right py-1">Average Score</th>
            </tr>
          </thead>
          <tbody>
            {assData[1].questions[item.split(' ')[0]].map((question:any, qIndex:any) => {
              const avgRating = calculateAverageRating(officesWithData, item.split(' ')[0], qIndex + 1, lguInfo);
              const percentage = (avgRating / 5) * 100;
              
              return (
                <>
                  <tr key={qIndex} className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setExpandedSections(prev => 
                        prev.includes(`${selectedAssessment}-${index}-${qIndex}`) 
                          ? prev.filter(id => id !== `${selectedAssessment}-${index}-${qIndex}`)
                          : [...prev, `${selectedAssessment}-${index}-${qIndex}`]
                      );
                    }}
                  >
                    <td className="py-1">{question}</td>
                    <td className="text-right py-1">
                      <div className="flex items-center justify-end">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        {percentage.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                  {expandedSections.includes(`${selectedAssessment}-${index}-${qIndex}`) && (
                    <tr>
                      <td colSpan={2}>
                        <div className="pl-4 py-2 bg-gray-50">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left py-1">Office</th>
                                <th className="text-right py-1">Rating (0-5)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {officesWithData.filter(o => o !== "All Offices").map((office, i) => {
                                const officeDataKey = office === "Mayor's Office" ? "Mayors Office" : office;
                                let officeResponse = 0;
                                let Datas:any=  Data
                                
                                if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
                                  const data = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
                                    (item:any) => item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
                                  );
                                  officeResponse = Number(data?.[`${item.split(' ')[0]} ${qIndex + 1}`] || 0);
                                } else {
                                  let data:any = Data["Other Offices"].find(
                                    item => 
                                      item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase() && 
                                      item["Office Name"] === office
                                  );
                                  officeResponse = Number(data?.[`${item.split(' ')[0]} ${qIndex + 1}`] || 0);
                                }
                                
                                return (
                                  <tr key={i} className="border-t">
                                    <td className="py-1">{office}</td>
                                    <td className="text-right py-1">
                                      <div className="flex items-center justify-end">
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${(officeResponse/5)*100}%` }}
                                          ></div>
                                        </div>
                                        {officeResponse}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
                    {(selectedAssessment === 'IT READINESS ASSESSMENT' || selectedAssessment === 'ICT CHANGE MANAGEMENT') && (
                      <div className="mt-2">
                        <button 
                          onClick={() => {
                            setExpandedSections(prev => 
                              prev.includes(`${selectedAssessment}-${index}`) 
                                ? prev.filter(id => id !== `${selectedAssessment}-${index}`)
                                : [...prev, `${selectedAssessment}-${index}`]
                            );
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {expandedSections.includes(`${selectedAssessment}-${index}`) ? 'Hide Questions' : 'View Questions'}
                        </button>
                        
                        {expandedSections.includes(`${selectedAssessment}-${index}`) && (
                          <div className="mt-2 text-xs bg-white p-2 rounded border">
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <th className="text-left py-1">Question</th>
                                  <th className="text-right py-1">Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                {assData.find((section:any) => section.title === selectedAssessment)
                                  ?.questions[item.split(' (')[0]]
                                  .map((question:any, qIndex:any) => {
                                    let score = 0;
                                    const dataKey = selectedAssessment === 'IT READINESS ASSESSMENT' 
                                      ? `${item.split(' (')[0].replace(/ /g, ' ')} ${qIndex + 1}`
                                      : `${item.split(' (')[0]} ${qIndex + 1}`;
                                    
                                    let itOfficeData:any = Data["IT Office"].find(
                                      data => data["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
                                    );
                                    
                                    score = Number(itOfficeData?.[dataKey] || 0);
                                    const percentage = (score / 5) * 100;
                                    
                                    return (
                                      <tr key={qIndex} className="border-t">
                                        <td className="py-1">{question}</td>
                                        <td className="text-right py-1">
                                          <div className="flex items-center justify-end">
                                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                              <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${percentage}%` }}
                                              ></div>
                                            </div>
                                            {percentage.toFixed(1)}%
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
            </div>
            <div className="bg-white p-6 col-span-1 rounded-lg shadow">
              <div className="h-[500px]">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Score (%)'
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: true,
                        text: `${selectedAssessment} Breakdown${selectedOffice !== "All Offices" ? ` - ${selectedOffice}` : ''}`
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Interactive Score Display */}
            
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full w-full py-10 flex items-center justify-center">
      <div className="p-5 h-full  w-[95%] flex flex-col bg-card/25 border border-border border-b-0 rounded-lg">
        <h1 className="py-4 px-2 text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">
          {`${lguInfo["LGU Name"]}, ${lguInfo.Province}`}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex relative justify-between md:items-end items-center md:flex-col">
            <div className="w-[80%] md:w-full ">
              <div className="grid grid-cols-3 gap-6">
                <InfoCard span="2" label="Municipality" value={lguInfo["LGU Name"]} />
                <InfoCard label="Income Class" value={lguInfo["Income Class"]} />
                <InfoCard label="Mayor" value={lguInfo.Mayor} />
                <InfoCard label="Vice Mayor" value={lguInfo["Vice Mayor"]} />
                <InfoCard label="Population" value={lguInfo["No. of Population"]} />
                <InfoCard label="Barangays" value={lguInfo["No. of Barangays"]} />
                <div>
                  <InfoCard
                    label="Location"
                    value={`${lguInfo.Latitude}° N, ${lguInfo.Longitude}° E`}
                  />
                </div>
              </div>
            </div>
            <h1 className=' absolute right-0 bottom-0 md:left-0 font-black text-6xl text-[#a8b6cb]'>{lguInfo["LGU Name"]} </h1>
            <ScoreCircle score={Math.round(score)} />
          </div>
        </div>

        <div className="border-b w-full border-gray-200">
          <nav className="flex">
            {['About', 'Assessment', 'Attachments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-4 md:mr-8 py-3 md:py-4 px-1 text-sm md:text-base ${
                  activeTab === tab
                    ? 'border-b-2 border-red-500 text-red-500 font-medium'
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-4 md:py-6 w-full md:w-full">
          {activeTab === 'About' && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full  pr-0 md:pr-6">
                <p className="mb-4 text-sm md:text-base">{lguInfo.descriptioon}</p>
              </div>
            </div>
          )}
          {activeTab === 'Assessment' && renderAssessmentContent()}
          {activeTab === 'Attachments' && (
            <h3 className="text-xl font-semibold mb-4">Attachments</h3>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ label, value, span }: any) => (
  <div className={`bg-gray-50 p-4 rounded-lg border border-border col-span-${span ? span : 1}`}>
    <div className="text-sm text-gray-700 mb-1">{label}</div>
    <div className="font-bold text-lg">{value}</div>
  </div>
);

const ScoreCircle = ({ score }: { score: number }) => (
  <div className="w-1/2 flex flex-col items-center justify-center">
    <div className="text-xl font-bold text-[#0036C5] mb-2">Score</div>
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#ecc216" strokeWidth="8" />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="#0036C5"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 439.6} 439.6`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-bold" style={{ color: score >= 50 ? '#0036c6' : '#ecc216' }}>
          {score}%
        </span>
      </div>
    </div>
  </div>
);

const calculatePercentageScore = (responses: number[]) => {
  // Sum all values
  const total = responses.reduce((sum, value) => sum + Number(value || 0), 0);

  // Calculate maximum possible score (length * 5)
  const maxPossible = responses.length * 5;

  // Calculate percentage
  return (total / maxPossible) * 100;
};

const calculateAverage = (values: number[]) => {
  const validValues = values.filter(val => val !== null && val !== undefined);
  return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};

// Update the Digital Skills calculation inside calculateLGUDetailedScores
const calculateLGUDetailedScores = (lguName: string, offices: string[]) => {
  // Get IT Office data specifically for IT Readiness and Change Management
 

  // Get data from all offices including Other Offices
  let officesData: any[] = [];
  let Datas:any=  Data
  // Add data from main offices (Mayor's, HR, IT)
  offices.forEach(office => {
    if (office === "Other Offices") {
      const otherOfficesData = Data[office]?.filter(data => 
        data["LGU Name"]?.toUpperCase() === lguName?.toUpperCase()
      );
      if (otherOfficesData) {
        officesData.push(...otherOfficesData);
      }
    } else {
      const officeData = Datas[office]?.filter((data:any) => 
        data["LGU Name"]?.toUpperCase() === lguName?.toUpperCase()
      );
      if (officeData) {
        officesData.push(...officeData);
      }
    }
  });

  console.log('Offices Data:', officesData);
  if (!officesData.length) return null;

  // Calculate Digital Skills scores
  const digitalSkillsScores = Array.from({ length: 10 }, (_, questionIndex) => {
    const key = `Question ${questionIndex + 1} DigitalSkillsAssessment`;
    const responses = officesData.map(data => Number(data[key] || 0));
    const total = responses.reduce((sum, value) => sum + value, 0);
    const maxPossible = responses.length * 5;
    const score = (total / maxPossible) * 100;

    return {
      question: key,
      responses,
      score
    };
  });

  // Calculate Technology Readiness scores
  const calculateTRIScore = (category: string, questionCount: number) => {
    const responses = officesData.flatMap(data => 
      Array.from({ length: questionCount }, (_, i) => Number(data[`${category} ${i + 1}`] || 0))
    );
    const total = responses.reduce((sum, value) => sum + value, 0);
    const maxPossible = responses.length * 5;
    return (total / maxPossible) * 100;
  };

  const optimismScore = calculateTRIScore('Optimism', 10);
  const innovativenessScore = calculateTRIScore('Innovativeness', 7);
  const discomfortScore = calculateTRIScore('Discomfort', 10);
  const insecurityScore = calculateTRIScore('Insecurity', 9);

  const triCategories = [
    { category: 'Optimism', average: optimismScore },
    { category: 'Innovativeness', average: innovativenessScore },
    { category: 'Discomfort', average: discomfortScore },
    { category: 'Insecurity', average: insecurityScore }
  ];

  // Get IT Office data specifically for IT Readiness and Change Management
  const itOfficeDataSpecific: any = Data["IT Office"].find(data => data["LGU Name"] === lguName);

  // Calculate IT Readiness scores using only IT Office data
  const itReadinessCategories = {
    "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
    "IT GOVERNANCE FRAMEWORK & POLICIES": Array.from({ length: 3 }, (_, i) => `IT GOVERNANCE FRAMEWORK & POLICIES ${i + 1}`),
    "IT STRATEGY AND ALIGNMENT": Array.from({ length: 3 }, (_, i) => `IT STRATEGY AND ALIGNMENT ${i + 1}`),
    "IT POLICIES AND PROCEDURES": Array.from({ length: 3 }, (_, i) => `IT POLICIES AND PROCEDURES ${i + 1}`),
    "RISK MANAGEMENT": Array.from({ length: 3 }, (_, i) => `RISK MANAGEMENT ${i + 1}`),
    "IT PERFORMANCE MEASUREMENT AND REPORTING": Array.from({ length: 3 }, (_, i) => `IT PERFORMANCE MEASUREMENT AND REPORTING ${i + 1}`),
    "IT INVESTMENT MANAGEMENT": Array.from({ length: 3 }, (_, i) => `IT INVESTMENT MANAGEMENT ${i + 1}`),
    "VENDOR MANAGEMENT": Array.from({ length: 3 }, (_, i) => `VENDOR MANAGEMENT ${i + 1}`),
    "IT SECURITY AND COMPLIANCE": Array.from({ length: 3 }, (_, i) => `IT SECURITY AND COMPLIANCE ${i + 1}`),
    "ICT Organizational Structure and Skills": Array.from({ length: 3 }, (_, i) => `ICT Organizational Structure and Skills ${i + 1}`),
    "Audit and Assurance": Array.from({ length: 3 }, (_, i) => `Audit and Assurance ${i + 1}`),
    "Network Infrastructure": Array.from({ length: 2 }, (_, i) => `Network Infrastructure ${i + 1}`),
    "Servers and Storage": Array.from({ length: 3 }, (_, i) => `Servers and Storage ${i + 1}`),
    "Virtualization": Array.from({ length: 3 }, (_, i) => `Virtualization ${i + 1}`),
    "Data Backup and Recovery": Array.from({ length: 3 }, (_, i) => `Data Backup and Recovery ${i + 1}`),
    "Scalability and Elasticity": Array.from({ length: 3 }, (_, i) => `Scalability and Elasticity ${i + 1}`),

    "Security Measures": Array.from({ length: 4 }, (_, i) => `Security Measures ${i + 1}`),
    "Monitoring and Performance": Array.from({ length: 3 }, (_, i) => `Monitoring and Performance ${i + 1}`),
    "Compliance and Governance": Array.from({ length: 3 }, (_, i) => `Compliance and Governance ${i + 1}`),
    "Integration and Interoperability": Array.from({ length: 3 }, (_, i) => `Integration and Interoperability ${i + 1}`),
    "Disaster Recovery and Business Continuity": Array.from({ length: 3 }, (_, i) => `Disaster Recovery and Business Continuity ${i + 1}`)
  };

  const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => {
    const scores = keys.map(key => Number(itOfficeDataSpecific?.[key] || 0));
    const categoryScore = calculatePercentageScore(scores);

    return {
      category,
      score: categoryScore
    };
  });

  let itReadinessScores2 = 0;
  itReadinessScores.map((item: any) => itReadinessScores2 += item.score);

  console.log('IT Readiness Scores:', itReadinessScores);

  itReadinessScores2 = itReadinessScores2 / 21;
  console.log('IT Readiness Scores:', itReadinessScores2);

  // Calculate Change Management scores using only IT Office data
  const changeManagementCategories = {
    "CHANGE READINESS": Array.from({ length: 3 }, (_, i) => `CHANGE READINESS ${i + 1}`),
    "CHANGE LEADERSHIP": Array.from({ length: 2 }, (_, i) => `CHANGE LEADERSHIP ${i + 1}`),
    "CHANGE COMMUNICATION": Array.from({ length: 3 }, (_, i) => `CHANGE COMMUNICATION ${i + 1}`),
    "CHANGE IMPACT ASSESSMENT": Array.from({ length: 3 }, (_, i) => `CHANGE IMPACT ASSESSMENT ${i + 1}`),
    "STAKEHOLDER ENGAGEMENT": Array.from({ length: 3 }, (_, i) => `STAKEHOLDER ENGAGEMENT ${i + 1}`),
    "CHANGE PLANNING AND EXECUTION": Array.from({ length: 3 }, (_, i) => `CHANGE PLANNING AND EXECUTION ${i + 1}`),
    "TRAINING AND DEVELOPMENT": Array.from({ length: 3 }, (_, i) => `TRAINING AND DEVELOPMENT ${i + 1}`),
    "Resistance Management": Array.from({ length: 3 }, (_, i) => `Resistance Management ${i + 1}`),
    "Evaluation and Continuous Improvement": Array.from({ length: 3 }, (_, i) => `Evaluation and Continuous Improvement ${i + 1}`),
    "Sustainability and Embedding": Array.from({ length: 3 }, (_, i) => `Sustainability and Embedding ${i + 1}`),
    "Costs or Financial": Array.from({ length: 5 }, (_, i) => `Costs or Financial ${i + 1}`)
  };

  const changeManagementScores = Object.entries(changeManagementCategories).map(([category, keys]) => ({
    category,
    score: calculatePercentageScore(keys.map(key => Number(itOfficeDataSpecific?.[key] || 0)))
  }));

  // Calculate averages
  const categoryAverages = triCategories.map((cat: any) => ({
    ...cat,
    average: cat.average
  }));

  console.log("categoryAverages :", categoryAverages);

  // Calculate IT Readiness and Change Management averages
  const itReadinessAverage = calculateAverage(itReadinessScores.map(cat => cat.score));
  const changeManagementAverage = calculateAverage(changeManagementScores.map(cat => cat.score));

  // Calculate total score using all four components
  const totalScore = (calculateAverage(digitalSkillsScores.map(item => item.score)) + (optimismScore + innovativenessScore + discomfortScore + insecurityScore) / 4 + itReadinessAverage + changeManagementAverage) / 4;

  return {
    digitalSkills: {
      scores: digitalSkillsScores,
      average: calculateAverage(digitalSkillsScores.map(item => item.score))
    },
    technologyReadiness: {
      categories: triCategories,
      average: (optimismScore + innovativenessScore + discomfortScore + insecurityScore) / 4
    },
    itReadiness: {
      categories: itReadinessScores,
      average: itReadinessAverage
    },
    changeManagement: {
      categories: changeManagementScores,
      average: changeManagementAverage
    },
    totalScore: Math.round(totalScore * 100) / 100,
    componentScores: {
      digitalSkills: Math.round(calculateAverage(digitalSkillsScores.map(item => item.score)) * 100) / 100,
      techReadiness: Math.round((optimismScore + innovativenessScore + discomfortScore + insecurityScore) / 4 * 100) / 100,
      itReadiness: Math.round(itReadinessAverage * 100) / 100,
      changeManagement: Math.round(changeManagementAverage * 100) / 100
    }
  };
};

// Update the assessment data structure to include IT Readiness and Change Management
const assData:any = [
  {
    title: "DIGITAL SKILLS ASSESSMENT",
    data: [
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
    ]
  },
  {
    title: "TECHNOLOGY READINESS INDEX",
    data: [
      "Optimism (10 questions)",
      "Innovativeness (7 questions)",
      "Discomfort (10 questions)",
      "Insecurity (9 questions)"
    ],
    questions: {
      "Optimism": Array.from({ length: 10 }, (_, i) => `Q${i + 1}`),
      "Innovativeness": Array.from({ length: 7 }, (_, i) => `Q${i + 1}`),
      "Discomfort": Array.from({ length: 10 }, (_, i) => `Q${i + 1}`),
      "Insecurity": Array.from({ length: 9 }, (_, i) => `Q${i + 1}`)
    }
  },
  {
    title: "IT READINESS ASSESSMENT",
    data: [
      "BASIC IT READINESS (4 questions)",
      "IT GOVERNANCE FRAMEWORK & POLICIES (3 questions)",
      "IT STRATEGY AND ALIGNMENT (3 questions)",
      "IT POLICIES AND PROCEDURES (3 questions)",
      "RISK MANAGEMENT (3 questions)",
      "IT PERFORMANCE MEASUREMENT AND REPORTING (3 questions)",
      "IT INVESTMENT MANAGEMENT (3 questions)",
      "VENDOR MANAGEMENT (3 questions)",
      "IT SECURITY AND COMPLIANCE (3 questions)",
      "ICT Organizational Structure and Skills (3 questions)",
      "Audit and Assurance (3 questions)",
      "Network Infrastructure (2 questions)",
      "Servers and Storage (3 questions)",
      "Virtualization (3 questions)",
      "Data Backup and Recovery (3 questions)",
      "Scalability and Elasticity (3 questions)",
      "Security Measures (4 questions)",
      "Monitoring and Performance (3 questions)",
      "Compliance and Governance (3 questions)",
      "Integration and Interoperability (3 questions)",
      "Disaster Recovery and Business Continuity (3 questions)"
    ],
    questions: {
      "BASIC IT READINESS": Array.from({ length: 4 }, (_, i) => `Q${i + 1}`),
      "IT GOVERNANCE FRAMEWORK & POLICIES": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "IT STRATEGY AND ALIGNMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "IT POLICIES AND PROCEDURES": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "RISK MANAGEMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "IT PERFORMANCE MEASUREMENT AND REPORTING": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "IT INVESTMENT MANAGEMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "VENDOR MANAGEMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "IT SECURITY AND COMPLIANCE": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "ICT Organizational Structure and Skills": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Audit and Assurance": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Network Infrastructure": Array.from({ length: 2 }, (_, i) => `Q${i + 1}`),
      "Servers and Storage": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Virtualization": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Data Backup and Recovery": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Scalability and Elasticity": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Security Measures": Array.from({ length: 4 }, (_, i) => `Q${i + 1}`),
      "Monitoring and Performance": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Compliance and Governance": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Integration and Interoperability": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Disaster Recovery and Business Continuity": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`)
    }
  },
  {
    title: "ICT CHANGE MANAGEMENT",
    data: [
      "CHANGE READINESS (3 questions)",
      "CHANGE LEADERSHIP (2 questions)",
      "CHANGE COMMUNICATION (3 questions)",
      "CHANGE IMPACT ASSESSMENT (3 questions)",
      "STAKEHOLDER ENGAGEMENT (3 questions)",
      "CHANGE PLANNING AND EXECUTION (3 questions)",
      "TRAINING AND DEVELOPMENT (3 questions)",
      "Resistance Management (3 questions)",
      "Evaluation and Continuous Improvement (3 questions)",
      "Sustainability and Embedding (3 questions)",
      "Costs or Financial (5 questions)"
    ],
    questions: {
      "CHANGE READINESS": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "CHANGE LEADERSHIP": Array.from({ length: 2 }, (_, i) => `Q${i + 1}`),
      "CHANGE COMMUNICATION": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "CHANGE IMPACT ASSESSMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "STAKEHOLDER ENGAGEMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "CHANGE PLANNING AND EXECUTION": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "TRAINING AND DEVELOPMENT": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Resistance Management": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Evaluation and Continuous Improvement": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Sustainability and Embedding": Array.from({ length: 3 }, (_, i) => `Q${i + 1}`),
      "Costs or Financial": Array.from({ length: 5 }, (_, i) => `Q${i + 1}`)
    }
  }
];

// Add this helper function to calculate average rating across offices
const calculateAverageRating = (offices: string[], category: string, questionNum: number, lguInfo: any) => {
  let total = 0;
  let count = 0;
  
  offices.filter(o => o !== "All Offices").forEach(office => {
    let data: any = null;
    let Datas:any=  Data
    
    if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
      const officeKey = office === "Mayor's Office" ? "Mayors Office" : office;
      data = Datas[officeKey]?.find((item:any) => 
        item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
      );
    } else {
      data = Data["Other Offices"]?.find(item => 
        item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase() && 
        item["Office Name"]?.trim() === office.trim()
      );
    }

    if (data) {
      const response = Number(data[`${category} ${questionNum}`] || 0);
      if (response > 0) {
        total += response;
        count++;
      }
    }
  });
  
  return count > 0 ? total / count : 0;
};

export default About;