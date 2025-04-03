import Dashboard from '@/components/chart/Maturity'

import surveyData from './../assets/data/eReadinessSurveyData.json'


function dashsboard() {
  // Get LGU lists
  // const camiguinLGUs = getCamiguinLGUList();
  // const misorLGUs = getMisorLGUList();

  // // Get Region 10 combined data (Misor + Camiguin)
  // const region10DigitalSkillsAverage = getRegion10DigitalSkillsAverage();
  // const region10DigitalSkillsDetails = getRegion10DigitalSkillsQuestionAverages();

  // // Get Region 10 TRI data
  // const region10DetailedTRI = getRegion10DetailedTRI();

  // // Get Region 10 ICT Change Management data
  // const region10ChangeManagementScore = getRegion10ICTChangeManagementScore();
  // const region10ChangeManagementDetails = getRegion10ICTChangeManagementDetailedScores();

  // // Example of getting a specific LGU's score (e.g., SAGAY)
  // const sagayScore = getLGUDigitalSkillsAverage("SAGAY");

  // // Get Technology Readiness Index for specific LGUs
  // const sagayTRI = getLGUTechnologyReadinessIndex("SAGAY");
  // const laguindanganTRI = getLGUTechnologyReadinessIndex("LAGUINDINGAN");

  // // Get detailed TRI data for SAGAY (keeping for comparison)
  // const sagayDetailedTRI = getLGUDetailedTRI("SAGAY");

  // // Get Optimism scores for specific LGUs
  // const sagayOptimism = getLGUOptimismScore("GUINSILIBAN");
  // const laguindanganOptimism = getLGUOptimismScore("GUINSILIBAN");

  // // Get Innovativeness scores for specific LGUs
  // const sagayInnovativeness = getLGUInnovativenessScore("GUINSILIBAN");
  // const laguindanganInnovativeness = getLGUInnovativenessScore("GUINSILIBAN");

  // // Get Discomfort scores for specific LGUs (higher = better)
  // const sagayDiscomfort = getLGUDiscomfortScore("GUINSILIBAN");
  // const laguindanganDiscomfort = getLGUDiscomfortScore("GUINSILIBAN");

  // //ICT Change Management scores for specific LGUs
  // const sagayChangeManagement = getLGUICTChangeManagementScore("SAGAY");
  // const laguindanganChangeManagement = getLGUICTChangeManagementScore("LAGUINDINGAN");

  // // Add this to get IT Readiness data
  // const sagayITReadiness = getLGUITReadinessScore("SAGAY");
  // const sagayITReadinessDetails = getLGUITReadinessDetailedScores("SAGAY");

  // const sagayChangeManagementDetails = getLGUICTChangeManagementDetailedScores("SAGAY");

  // const region10ITReadinessScore = getRegion10ITReadinessScore();
  // const region10ITReadinessDetails = getRegion10ITReadinessDetailedScores();


  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-full h-full flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 mb-10 rounded-sm text-center font-bold text-xl border text-[#0036C5] border-[#0036C5]">
          Digital Maturity eReadiness Survey Score - Region 10
        </h1>

       

        <Dashboard
          data={surveyData}
          gridColsBase={4}
        />
      </div>
    </div>
  )
}

export default dashsboard