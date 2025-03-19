import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Data from './../../assets/data/eReadinessSurveyData.json';

interface LGUInfo {
  "LGU Name": string;
  Mayor: string;
  "Vice Mayor": string;
  Barangays: number;
  Province: string;
  descriptioon: string;
  Longitude: number;
  Latitude: number;
}

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-border">
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
          cx="80" cy="80" r="70"
          fill="none" stroke="#0036C5"
          strokeWidth="8" strokeLinecap="round"
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

// Add helper functions for score calculation
const calculateAverage = (values: number[]) => {
  const validValues = values.filter(val => val !== null && val !== undefined);
  return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};

const scaleToPercentage = (value: number) => {
  return ((value - 1) / 4) * 100;
};

const calculateLGUDetailedScores = (lguName: string, mayorOfficeData: any[]) => {
  const lguData = mayorOfficeData.find(data => data["LGU Name"] === lguName);
  
  if (!lguData) return null;

  // Calculate Digital Skills Assessment Score
  const digitalSkillsKeys = Array.from({ length: 10 }, (_, i) => `Question ${i + 1} DigitalSkillsAssessment`);
  const digitalSkillsScores = digitalSkillsKeys.map(key => ({
    question: key,
    score: scaleToPercentage(Number(lguData[key] || 0))
  }));
  const digitalSkillsAverage = calculateAverage(digitalSkillsScores.map(item => item.score));

  // Calculate Technology Readiness Index Score
  const categories = {
    'OPTIMISM': Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`),
    'INNOVATIVENESS': Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`),
    'DISCOMFORT': Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`),
    'INSECURITY': Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`)
  };

  const categoryScores = Object.entries(categories).map(([category, keys]) => {
    const scores = keys.map(key => ({
      question: key,
      score: scaleToPercentage(Number(lguData[key] || 0))
    }));
    return {
      category,
      scores,
      average: calculateAverage(scores.map(item => item.score))
    };
  });

  // Calculate TRI Score
  const optimismScore = categoryScores.find(item => item.category === "OPTIMISM")?.average || 0;
  const innovativenessScore = categoryScores.find(item => item.category === "INNOVATIVENESS")?.average || 0;
  const discomfortScore = categoryScores.find(item => item.category === "DISCOMFORT")?.average || 0;
  const insecurityScore = categoryScores.find(item => item.category === "INSECURITY")?.average || 0;
  
  const triScore = (optimismScore + innovativenessScore + (100 - discomfortScore) + (100 - insecurityScore)) / 4;

  // Calculate total score
  const totalScore = (digitalSkillsAverage + triScore) / 2;

  return {
    digitalSkills: {
      scores: digitalSkillsScores,
      average: digitalSkillsAverage
    },
    technologyReadiness: {
      categories: categoryScores,
      average: triScore
    },
    totalScore: Math.round(totalScore * 100) / 100
  };
};

// Update the assessment data structure
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
  }
];

function About() {
  const { lguName } = useParams();
  const location = useLocation();
  const [lguInfo, setLguInfo] = useState<LGUInfo | null>(null);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState('About');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [detailedScores, setDetailedScores] = useState<any>(null);

  useEffect(() => {
    if (location.state?.score) setScore(location.state.score);
    
    const selectedLgu = lguName || location.state?.lguName;
    if (selectedLgu && Data) {
      const info:any = Data.Info.find(item => 
        item["LGU Name"]?.toUpperCase() === selectedLgu.toUpperCase()
      );
      const info2:any = Data["Mayors Office"].find(item => 
        item["LGU Name"]?.toUpperCase() === selectedLgu.toUpperCase()
      );
      if (info) {
        setLguInfo({...info,...info2});

        console.log({...info,...info2});
        
        const scores = calculateLGUDetailedScores(selectedLgu, Data["Mayors Office"]);
        if (scores) {
          setDetailedScores(scores);
          setScore(scores.totalScore);
        }
      }
    }
  }, [lguName, location]);

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
              {expandedSections.includes(section.title) ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.includes(section.title) && (
            <ul className="p-4 bg-white space-y-2">
              {section.data.map((item, index) => {
                const score = section.title === "DIGITAL SKILLS ASSESSMENT" 
                  ? detailedScores.digitalSkills.scores[index].score
                  : detailedScores.technologyReadiness.categories[index]?.average;
                
                return (
                  <li 
                    key={index}
                    className="flex items-center justify-between text-gray-700 hover:text-[#0036C5] transition-colors p-2"
                  >
                    <span>{item} </span>
                    <span className="font-semibold">{Math.round(score)}%</span>
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
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-[95%] flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">
          {lguInfo.Province =="Misor"?"Misamis Oriental":""}, {lguInfo["LGU Name"]}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex relative  justify-between">
            <div className="w-[80%]">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <InfoCard label="Municipality" value={lguInfo["LGU Name"]} />
                  <InfoCard label="Mayor" value={lguInfo.Mayor} />
                  <InfoCard label="Vice Mayor" value={lguInfo["Vice Mayor"]} />
                 

                </div>
                <div className="space-y-4">
                <InfoCard label="Income Class" value={lguInfo["Income Class"]} />
                  {/* <InfoCard label="Population" value={} /> */}
                  <InfoCard label="Population" value={lguInfo["No. of Population"]} />
                  <InfoCard label="Barangays" value={lguInfo["No. of Barangays"]} />


                 
                </div>
                <div>
                <InfoCard label="Location" 
                    value={`${lguInfo.Latitude}° N, ${lguInfo.Longitude}° E`} 
                  />
                </div>
              </div>
            </div>
            <h1 className=' absolute right-0 bottom-0 font-black text-6xl text-[#a8b6cb]'>{lguInfo["LGU Name"]} </h1>
            <ScoreCircle score={Math.round(score)} />
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['About', 'Assessment', 'Attachments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-8 py-4 px-1 ${
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

        <div className="py-6 w-[30%]">
          {activeTab === 'About' && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full pr-6">
                <p className="mb-4">{lguInfo.descriptioon}</p>
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

export default About;