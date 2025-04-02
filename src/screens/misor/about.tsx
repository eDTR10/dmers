import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Data from './../../assets/data/eReadinessSurveyData.json';


function About() {
  const { lguName } = useParams();
  const location = useLocation();
  const [lguInfo, setLguInfo] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState('About');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [detailedScores, setDetailedScores] = useState<any>(null);
  const [digitalScore,setDigitalScore] = useState<any>({});

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

          setDigitalScore(scores.componentScores)
          

          console.log('Component Scores:', scores.componentScores.digitalSkills);
        }
      }
    }
  }, [lguName, location]);

  function Percentage(data:any){
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

  console.log();

  // Update the renderAssessmentContent function to handle the new sections
  const renderAssessmentContent = () => (
    <div className="space-y-4">
      {detailedScores && assData.map((section) => (
        <div key={section.title} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => {
              setExpandedSections(prev =>
                prev.includes(section.title)
                  ? prev.filter(title => title !== section.title)
                  : [...prev, section.title]
              );
            }}
            className="w-full p-4 flex justify-between items-center bg-[#0036C5] text-white hover:bg-[#002799] transition-colors"
          >
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <span className="text-2xl">
              { Percentage(section.title)}% &nbsp; &nbsp;
              {expandedSections.includes(section.title) ? '−' : '+'}
            </span>
          </button>

          {expandedSections.includes(section.title) && (
            <ul className="p-4 bg-white space-y-2">
              {section.data.map((item, index) => {
                let score;
                switch (section.title) {
                  case "DIGITAL SKILLS ASSESSMENT":
                    score = detailedScores.digitalSkills.scores[index]?.score;
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
                  default:
                    score = 0;
                }

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between text-gray-700 hover:text-[#0036C5] transition-colors p-2"
                  >
                    <span>{item}</span>
                    <span className="font-semibold">{score?.toFixed(2)}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-full w-full py-10 flex items-center justify-center">
      <div className="p-5 h-full  w-[95%] flex flex-col bg-card/25 border border-border border-b-0 rounded-lg">
        <h1 className="py-4 px-2 text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">
          {`${lguInfo["LGU Name"]}, ${lguInfo.Province}`}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex relative  justify-between md:items-end items-center md:flex-col">
            <div className="w-[80%] md:w-full ">
              <div className="grid grid-cols-3  gap-6">
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

        <div className="border-b w-[50%] border-gray-200">
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

        <div className="py-4 md:py-6 w-[50%] md:w-full">
          {activeTab === 'About' && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[70%] pr-0 md:pr-6">
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

// Update the calculation function
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
  const itOfficeData: any = Data["IT Office"].find(data => data["LGU Name"] === lguName);

  // Get data from all offices for other assessments
  let Datas: any = Data;
  let officesData: any = offices.map((office: any) =>
    Datas[office].filter((data: any) => data["LGU Name"] === lguName)
  );

  officesData = Object.values(officesData).flat();

  console.log('Offices Data:', officesData);
  if (!officesData.length) return null;

  // Get all responses for each Digital Skills question
  const digitalSkillsScores = Array.from({ length: 10 }, (_, questionIndex) => {
    const key = `Question ${questionIndex + 1} DigitalSkillsAssessment`;

    // Collect all responses for this question across all offices
    const responses = officesData.map((data:any) => Number(data[key] || 0));

    // Calculate score using the new method
    const total = responses.reduce((sum:any, value:any) => sum + value, 0);
    const maxPossible = responses.length * 5;
    const score = (total / maxPossible) * 100;

    return {
      question: key,
      responses, // Store raw responses for reference
      score: score
    };
  });

  const digitalSkillsAverage = calculateAverage(
    digitalSkillsScores.map(item => item.score)
  );

  // Helper function to calculate TRI scores
  const calculateTRIScore = (category: string, questionCount: number) => {
    // Get all responses for this category across all offices
    const responses = officesData.flatMap((data:any) => {
      return Array.from({ length: questionCount }, (_, i) => {
        const key = `${category} ${i + 1}`;
        return Number(data[key] || 0);
      });
    });

    // Calculate score like Python implementation
    const total = responses.reduce((sum:any, value:any) => sum + value, 0);
    console.log(category);
    console.log('Responses:', responses);
    console.log('Total:', total);
    const maxPossible = responses.length * 5;
    return (total / maxPossible) * 100;
  };

  // Calculate scores for each TRI category
  const optimismScore = calculateTRIScore('Optimism', 10);
  const innovativenessScore = calculateTRIScore('Innovativeness', 7);
  const discomfortScore = calculateTRIScore('Discomfort', 10);
  const insecurityScore = calculateTRIScore('Insecurity', 9);

  // Create categories array for display
  const triCategories = [
    { category: 'OPTIMISM', average: optimismScore },
    { category: 'INNOVATIVENESS', average: innovativenessScore },
    { category: 'DISCOMFORT', average: discomfortScore },
    { category: 'INSECURITY', average: insecurityScore }
  ];

  // Calculate final TRI score
  const triScore = (
    optimismScore + 
    innovativenessScore + 
    discomfortScore + 
    insecurityScore
  ) / 4;

  // Calculate IT Readiness scores using only IT Office data
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

  const itReadinessScores = Object.entries(itReadinessCategories).map(([category, keys]) => {
    const scores = keys.map(key => Number(itOfficeData?.[key] || 0));
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
    score: calculatePercentageScore(keys.map(key => Number(itOfficeData?.[key] || 0)))
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
  const totalScore = (digitalSkillsAverage + triScore + itReadinessAverage + changeManagementAverage) / 4;

  return {
    digitalSkills: {
      scores: digitalSkillsScores,
      average: digitalSkillsAverage
    },
    technologyReadiness: {
      categories: categoryAverages,
      average: triScore
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
      digitalSkills: Math.round(digitalSkillsAverage * 100) / 100,
      techReadiness: Math.round(triScore * 100) / 100,
      itReadiness: Math.round(itReadinessAverage * 100) / 100,
      changeManagement: Math.round(changeManagementAverage * 100) / 100
    }
  };
};

// Update the assessment data structure to include IT Readiness and Change Management
const assData = [
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
      "OPTIMISM (10 questions)",
      "INNOVATIVENESS (7 questions)",
      "DISCOMFORT (10 questions)",
      "INSECURITY (9 questions)"
    ]
  },
  {
    title: "IT READINESS ASSESSMENT",
    data: [
      "BASIC IT READINESS",
      "IT GOVERNANCE FRAMEWORK & POLICIES",
      "IT STRATEGY AND ALIGNMENT",
      "IT POLICIES AND PROCEDURES",
      "RISK MANAGEMENT",
      "IT PERFORMANCE MEASUREMENT AND REPORTING",
      "IT INVESTMENT MANAGEMENT",
      "VENDOR MANAGEMENT",
      "IT SECURITY AND COMPLIANCE",
      "ICT ORGANIZATIONAL STRUCTURE AND SKILLS",
      "AUDIT AND ASSURANCE",
      "NETWORK INFRASTRUCTURE",
      "SERVERS AND STORAGE",
      "VIRTUALIZATION",
      "DATA BACKUP AND RECOVERY",
      "SCALABILITY AND ELASTICITY",
      "SECURITY MEASURES",
      "MONITORING AND PERFORMANCE",
      "COMPLIANCE AND GOVERNANCE",
      "INTEGRATION AND INTEROPERABILITY",
      "DISASTER RECOVERY AND BUSINESS CONTINUITY"
    ]
  },
  {
    title: "ICT CHANGE MANAGEMENT",
    data: [
      "CHANGE READINESS",
      "CHANGE LEADERSHIP",
      "CHANGE COMMUNICATION",
      "CHANGE IMPACT ASSESSMENT",
      "STAKEHOLDER ENGAGEMENT",
      "CHANGE PLANNING AND EXECUTION",
      "TRAINING AND DEVELOPMENT",
      "RESISTANCE MANAGEMENT",
      "EVALUATION AND CONTINUOUS IMPROVEMENT",
      "SUSTAINABILITY AND EMBEDDING",
      "COSTS OR FINANCIAL"
    ]
  }
];



export default About;