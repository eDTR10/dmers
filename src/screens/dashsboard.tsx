import Dashboard from '@/components/chart/Maturity'

import surveyData from './../assets/data/eReadinessSurveyData.json'
import {
  getCamiguinDigitalSkillsAverage,
  getMisorDigitalSkillsAverage,
  getCamiguinLGUList,
  getMisorLGUList,
  getProvinceTechnologyReadinessIndex,
  getProvinceICTChangeManagement,
  getProvinceITReadinessAssessment,
} from '@/lib/functions/PerProvince';
import {
  getLGUDigitalSkillsAverage,
  getProvinceDigitalSkillsQuestionAverages,
  getLGUDigitalSkillsQuestionAverages,
  getLGUTechnologyReadinessIndex,
  getLGUOptimismScore,
  getLGUInnovativenessScore,
  getLGUDiscomfortScore,
  getLGUICTChangeManagementScore,
  getLGUICTChangeManagementDetailedScores,
  getLGUITReadinessScore,
  getLGUITReadinessDetailedScores,
  getLGUDetailedTRI
} from '@/lib/functions/PerLGU';
import {
  getRegion10DigitalSkillsAverage,
  getRegion10DigitalSkillsQuestionAverages,
  getRegion10DetailedTRI,
  getRegion10ICTChangeManagementScore,
  getRegion10ICTChangeManagementDetailedScores,
  getRegion10ITReadinessScore,
  getRegion10ITReadinessDetailedScores
} from '@/lib/functions/Overall';

function dashsboard() {
  // Get LGU lists
  const camiguinLGUs = getCamiguinLGUList();
  const misorLGUs = getMisorLGUList();

  // Get Region 10 combined data (Misor + Camiguin)
  const region10DigitalSkillsAverage = getRegion10DigitalSkillsAverage();
  const region10DigitalSkillsDetails = getRegion10DigitalSkillsQuestionAverages();

  // Get Region 10 TRI data
  const region10DetailedTRI = getRegion10DetailedTRI();

  // Get Region 10 ICT Change Management data
  const region10ChangeManagementScore = getRegion10ICTChangeManagementScore();
  const region10ChangeManagementDetails = getRegion10ICTChangeManagementDetailedScores();

  // Example of getting a specific LGU's score (e.g., SAGAY)
  const sagayScore = getLGUDigitalSkillsAverage("SAGAY");

  // Get Technology Readiness Index for specific LGUs
  const sagayTRI = getLGUTechnologyReadinessIndex("SAGAY");
  const laguindanganTRI = getLGUTechnologyReadinessIndex("LAGUINDINGAN");

  // Get detailed TRI data for SAGAY (keeping for comparison)
  const sagayDetailedTRI = getLGUDetailedTRI("SAGAY");

  // Get Optimism scores for specific LGUs
  const sagayOptimism = getLGUOptimismScore("GUINSILIBAN");
  const laguindanganOptimism = getLGUOptimismScore("GUINSILIBAN");

  // Get Innovativeness scores for specific LGUs
  const sagayInnovativeness = getLGUInnovativenessScore("GUINSILIBAN");
  const laguindanganInnovativeness = getLGUInnovativenessScore("GUINSILIBAN");

  // Get Discomfort scores for specific LGUs (higher = better)
  const sagayDiscomfort = getLGUDiscomfortScore("GUINSILIBAN");
  const laguindanganDiscomfort = getLGUDiscomfortScore("GUINSILIBAN");

  //ICT Change Management scores for specific LGUs
  const sagayChangeManagement = getLGUICTChangeManagementScore("SAGAY");
  const laguindanganChangeManagement = getLGUICTChangeManagementScore("LAGUINDINGAN");

  // Add this to get IT Readiness data
  const sagayITReadiness = getLGUITReadinessScore("SAGAY");
  const sagayITReadinessDetails = getLGUITReadinessDetailedScores("SAGAY");

  const sagayChangeManagementDetails = getLGUICTChangeManagementDetailedScores("SAGAY");

  const region10ITReadinessScore = getRegion10ITReadinessScore();
  const region10ITReadinessDetails = getRegion10ITReadinessDetailedScores();


  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div className="p-5 w-full h-full flex flex-col bg-card/25 border border-border rounded-lg">
        <h1 className="py-4 px-2 mb-10 rounded-sm text-center font-bold text-xl border text-[#0036C5] border-[#0036C5]">
          Digital Maturity eReadiness Survey Score - Region 10
        </h1>

        {/* Region 10 Digital Skills Assessment */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Region 10 Digital Skills Assessment</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">Misamis Oriental & Camiguin</span>
                <span className="text-3xl font-bold text-blue-600">{region10DigitalSkillsAverage}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Regional Digital Skills Score represents the aggregated capability of government employees
                across Misor and Camiguin in various digital competency areas.
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${region10DigitalSkillsAverage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Basic Skills</span>
                <span>Intermediate</span>
                <span>Advanced Skills</span>
              </div>

              {/* Skills Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Skills Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(region10DigitalSkillsDetails).map(([skill, score], index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{skill}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${score}%`, opacity: 0.7 + (score / 300) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Region 10 Technology Readiness Index Detail with Dimension Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Region 10 Technology Readiness Index</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">Misamis Oriental & Camiguin</span>
                <span className="text-3xl font-bold text-indigo-600">{region10DetailedTRI.overallScore}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Technology Readiness Index measures employees' propensity to embrace and use new technologies
                across four dimensions: optimism, innovativeness, discomfort, and insecurity. This regional score
                represents the combined readiness of all LGUs in Region 10.
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${region10DetailedTRI.overallScore}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Low Readiness</span>
                <span>Medium</span>
                <span>High Readiness</span>
              </div>

              {/* Dimensions Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Dimensions Breakdown</h3>

              {/* Optimism - Positive dimension */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Optimism</span>
                  </div>
                  <span className="text-sm font-bold">{region10DetailedTRI.dimensions.optimism.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${region10DetailedTRI.dimensions.optimism.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Positive view of technology and belief in increased control, flexibility, and efficiency
                </p>
              </div>

              {/* Innovativeness - Positive dimension */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Innovativeness</span>
                  </div>
                  <span className="text-sm font-bold">{region10DetailedTRI.dimensions.innovativeness.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${region10DetailedTRI.dimensions.innovativeness.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tendency to be a technology pioneer and thought leader
                </p>
              </div>

              {/* Discomfort - Negative dimension (inverted for scoring) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Discomfort</span>
                  </div>
                  <span className="text-sm font-bold">{region10DetailedTRI.dimensions.discomfort.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${region10DetailedTRI.dimensions.discomfort.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Perceived lack of control over technology (higher score = less discomfort)
                </p>
              </div>

              {/* Insecurity - Negative dimension (inverted for scoring) */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Insecurity</span>
                  </div>
                  <span className="text-sm font-bold">{region10DetailedTRI.dimensions.insecurity.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-500 h-1.5 rounded-full"
                    style={{ width: `${region10DetailedTRI.dimensions.insecurity.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Distrust of technology and skepticism about its ability to work properly (higher score = less insecurity)
                </p>
              </div>

              {/* Show question details in an expandable section */}
              <div className="mt-4 border-t pt-3">
                <details>
                  <summary className="text-sm font-medium text-indigo-600 cursor-pointer">
                    View Question Details
                  </summary>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {/* Optimism Questions */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-green-600">Optimism Questions</h4>
                      {Object.entries(region10DetailedTRI.dimensions.optimism.questions).map(([question, score], idx) => (
                        <div key={`optimism-${idx}`} className="flex justify-between text-xs mb-0.5">
                          <span>{question}:</span>
                          <span className="font-medium">{score}/5</span>
                        </div>
                      ))}
                    </div>

                    {/* Innovativeness Questions */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-purple-600">Innovativeness Questions</h4>
                      {Object.entries(region10DetailedTRI.dimensions.innovativeness.questions).map(([question, score], idx) => (
                        <div key={`innovativeness-${idx}`} className="flex justify-between text-xs mb-0.5">
                          <span>{question}:</span>
                          <span className="font-medium">{score}/5</span>
                        </div>
                      ))}
                    </div>

                    {/* Discomfort Questions */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-amber-600">Discomfort Questions</h4>
                      <p className="text-xs text-gray-500 mb-1">(Lower raw scores are better)</p>
                      {Object.entries(region10DetailedTRI.dimensions.discomfort.questions).map(([question, score], idx) => (
                        <div key={`discomfort-${idx}`} className="flex justify-between text-xs mb-0.5">
                          <span>{question}:</span>
                          <span className="font-medium">{score}/5</span>
                        </div>
                      ))}
                    </div>

                    {/* Insecurity Questions */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-orange-600">Insecurity Questions</h4>
                      <p className="text-xs text-gray-500 mb-1">(Lower raw scores are better)</p>
                      {Object.entries(region10DetailedTRI.dimensions.insecurity.questions).map(([question, score], idx) => (
                        <div key={`insecurity-${idx}`} className="flex justify-between text-xs mb-0.5">
                          <span>{question}:</span>
                          <span className="font-medium">{score}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Region 10 ICT Change Management Detail with Category Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Region 10 ICT Change Management Assessment</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">Misamis Oriental & Camiguin</span>
                <span className="text-3xl font-bold text-cyan-600">{region10ChangeManagementScore}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Change Management Maturity Score represents the region's collective ability to effectively
                manage and implement change in IT systems and processes across local government units.
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-cyan-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${region10ChangeManagementScore}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Low Maturity</span>
                <span>Medium</span>
                <span>High Maturity</span>
              </div>

              {/* Category Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Category Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(region10ChangeManagementDetails).map(([category, score], index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-cyan-600 h-1.5 rounded-full"
                        style={{ width: `${score}%`, opacity: 0.7 + (score / 300) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show category details in an expandable section */}
              <div className="mt-4 border-t pt-3">
                <details>
                  <summary className="text-sm font-medium text-cyan-600 cursor-pointer">
                    View Category Details
                  </summary>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {/* Change Readiness */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">CHANGE READINESS</h4>
                      <p className="text-xs text-gray-500 mb-1">Assessment of organizational preparedness for ICT changes</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Assessment of staff readiness for technological change</li>
                        <li>Understanding of change rationale and benefits</li>
                        <li>Organizational history with technology adoption</li>
                      </ul>
                    </div>

                    {/* Change Leadership */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">CHANGE LEADERSHIP</h4>
                      <p className="text-xs text-gray-500 mb-1">Effectiveness of leadership support for ICT change initiatives</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Visible executive sponsorship of change initiatives</li>
                        <li>Leadership commitment to change management processes</li>
                      </ul>
                    </div>

                    {/* Change Communication */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">CHANGE COMMUNICATION</h4>
                      <p className="text-xs text-gray-500 mb-1">Quality and effectiveness of change-related communications</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Clear communication of change vision and roadmap</li>
                        <li>Two-way communication channels for feedback</li>
                        <li>Regular updates on implementation progress</li>
                      </ul>
                    </div>

                    {/* Change Impact Assessment */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">CHANGE IMPACT ASSESSMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Understanding of change impacts on stakeholders and processes</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Assessment of business process impacts</li>
                        <li>Identification of affected stakeholder groups</li>
                        <li>Documentation of current vs. future state</li>
                      </ul>
                    </div>

                    {/* Stakeholder Engagement */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">STAKEHOLDER ENGAGEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Effectiveness of stakeholder management and engagement</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Stakeholder analysis and prioritization</li>
                        <li>Engagement plans for key stakeholder groups</li>
                        <li>Involvement of end-users in change design</li>
                      </ul>
                    </div>

                    {/* Change Planning and Execution */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">CHANGE PLANNING AND EXECUTION</h4>
                      <p className="text-xs text-gray-500 mb-1">Quality of change management planning and implementation</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Comprehensive change management strategy</li>
                        <li>Integration with project management activities</li>
                        <li>Clear roles and responsibilities for change management</li>
                      </ul>
                    </div>

                    {/* Training and Development */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">TRAINING AND DEVELOPMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Effectiveness of skills transfer and capability development</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Training needs assessment</li>
                        <li>Development of appropriate training materials</li>
                        <li>Delivery of effective training programs</li>
                      </ul>
                    </div>

                    {/* Resistance Management */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">RESISTANCE MANAGEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Ability to identify and address resistance to change</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Proactive identification of resistance sources</li>
                        <li>Strategies to address resistance</li>
                        <li>Monitoring of adoption barriers</li>
                      </ul>
                    </div>

                    {/* Evaluation and Continuous Improvement */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">EVALUATION AND CONTINUOUS IMPROVEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Measurement of change effectiveness and continuous enhancement</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Established metrics for change success</li>
                        <li>Regular assessment of progress</li>
                        <li>Mechanism for implementing lessons learned</li>
                      </ul>
                    </div>

                    {/* Sustainability and Embedding */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">SUSTAINABILITY AND EMBEDDING</h4>
                      <p className="text-xs text-gray-500 mb-1">Ability to sustain changes and embed new ways of working</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Reinforcement mechanisms for desired behaviors</li>
                        <li>Integration of changes into performance management</li>
                        <li>Celebration of success and recognition</li>
                      </ul>
                    </div>

                    {/* Costs or Financial */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-cyan-600">COSTS OR FINANCIAL</h4>
                      <p className="text-xs text-gray-500 mb-1">Financial management and budget allocation for change initiatives</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Budgeting for change management activities</li>
                        <li>Cost tracking and financial management</li>
                        <li>Resource allocation for change initiatives</li>
                        <li>ROI measurement for change efforts</li>
                        <li>Financial sustainability planning</li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Region 10 IT Readiness Assessment with Category Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Region 10 IT Readiness Assessment</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">Misamis Oriental & Camiguin</span>
                <span className="text-3xl font-bold text-emerald-600">{region10ITReadinessScore}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                IT Readiness Score measures the region's overall preparedness in terms of IT infrastructure,
                governance, and capabilities to support digital transformation across local government units.
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-emerald-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${region10ITReadinessScore}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Low Readiness</span>
                <span>Medium</span>
                <span>High Readiness</span>
              </div>

              {/* Category Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Category Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(region10ITReadinessDetails).map(([category, score], index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${score}%`, opacity: 0.7 + (score / 300) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show category details in an expandable section */}
              <div className="mt-4 border-t pt-3">
                <details>
                  <summary className="text-sm font-medium text-emerald-600 cursor-pointer">
                    View Category Details
                  </summary>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {/* Basic IT Readiness */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">BASIC IT READINESS</h4>
                      <p className="text-xs text-gray-500 mb-1">Fundamental IT infrastructure and capabilities</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Presence of basic computing resources</li>
                        <li>Internet connectivity and reliability</li>
                        <li>Hardware and software standardization</li>
                        <li>IT operational processes</li>
                      </ul>
                    </div>

                    {/* IT Governance Framework & Policies */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT GOVERNANCE FRAMEWORK & POLICIES</h4>
                      <p className="text-xs text-gray-500 mb-1">Structured approach to IT management and decision-making</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Defined IT governance framework</li>
                        <li>IT steering committee structure</li>
                        <li>IT decision-making processes</li>
                      </ul>
                    </div>

                    {/* IT Strategy and Alignment */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT STRATEGY AND ALIGNMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Strategic planning and business alignment of IT</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Documented IT strategy</li>
                        <li>Alignment with organizational objectives</li>
                        <li>Strategic technology roadmap</li>
                      </ul>
                    </div>

                    {/* IT Policies and Procedures */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT POLICIES AND PROCEDURES</h4>
                      <p className="text-xs text-gray-500 mb-1">Documented IT operational guidelines and standards</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Comprehensive IT policies</li>
                        <li>Standard operating procedures</li>
                        <li>Policy enforcement and compliance</li>
                      </ul>
                    </div>

                    {/* Risk Management */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">RISK MANAGEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for identifying and managing IT risks</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Risk assessment methodology</li>
                        <li>Risk mitigation strategies</li>
                        <li>Regular risk reviews</li>
                      </ul>
                    </div>

                    {/* IT Performance Measurement and Reporting */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT PERFORMANCE MEASUREMENT AND REPORTING</h4>
                      <p className="text-xs text-gray-500 mb-1">Metrics and reporting on IT effectiveness</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Performance metrics and KPIs</li>
                        <li>Regular reporting mechanisms</li>
                        <li>Performance improvement processes</li>
                      </ul>
                    </div>

                    {/* IT Investment Management */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT INVESTMENT MANAGEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for managing and prioritizing IT investments</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Investment approval framework</li>
                        <li>Cost-benefit analysis practices</li>
                        <li>IT budget management</li>
                      </ul>
                    </div>

                    {/* Vendor Management */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">VENDOR MANAGEMENT</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for managing IT supplier relationships</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Vendor selection criteria</li>
                        <li>Contract management</li>
                        <li>Performance monitoring</li>
                      </ul>
                    </div>

                    {/* IT Security and Compliance */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">IT SECURITY AND COMPLIANCE</h4>
                      <p className="text-xs text-gray-500 mb-1">Frameworks for ensuring IT security and regulatory compliance</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Security policies and standards</li>
                        <li>Compliance monitoring</li>
                        <li>Security incident response</li>
                      </ul>
                    </div>

                    {/* ICT Organizational Structure and Skills */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">ICT ORGANIZATIONAL STRUCTURE AND SKILLS</h4>
                      <p className="text-xs text-gray-500 mb-1">IT team organization and capabilities</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>IT organizational design</li>
                        <li>Skill assessment and development</li>
                        <li>Role definitions and competencies</li>
                      </ul>
                    </div>

                    {/* Audit and Assurance */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">AUDIT AND ASSURANCE</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for verifying IT controls and compliance</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Regular IT audits</li>
                        <li>Audit findings management</li>
                        <li>Control improvement processes</li>
                      </ul>
                    </div>

                    {/* Network Infrastructure */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">NETWORK INFRASTRUCTURE</h4>
                      <p className="text-xs text-gray-500 mb-1">Network quality and management capabilities</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Network architecture design</li>
                        <li>Network management and monitoring</li>
                      </ul>
                    </div>

                    {/* Servers and Storage */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">SERVERS AND STORAGE</h4>
                      <p className="text-xs text-gray-500 mb-1">Server infrastructure and storage capabilities</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Server architecture and capacity</li>
                        <li>Storage solutions and management</li>
                        <li>Data management practices</li>
                      </ul>
                    </div>

                    {/* Virtualization */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">VIRTUALIZATION</h4>
                      <p className="text-xs text-gray-500 mb-1">Implementation and management of virtualization technologies</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Server virtualization</li>
                        <li>Desktop virtualization</li>
                        <li>Virtualization management</li>
                      </ul>
                    </div>

                    {/* Data Backup and Recovery */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">DATA BACKUP AND RECOVERY</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for data protection and recovery</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Backup strategy and execution</li>
                        <li>Recovery testing</li>
                        <li>Data retention policies</li>
                      </ul>
                    </div>

                    {/* Scalability and Elasticity */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">SCALABILITY AND ELASTICITY</h4>
                      <p className="text-xs text-gray-500 mb-1">Ability to scale IT resources based on demand</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Capacity planning</li>
                        <li>Elasticity of infrastructure</li>
                        <li>Growth management</li>
                      </ul>
                    </div>

                    {/* Security Measures */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">SECURITY MEASURES</h4>
                      <p className="text-xs text-gray-500 mb-1">Technical and procedural security controls</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Access control systems</li>
                        <li>Network security measures</li>
                        <li>Security awareness training</li>
                        <li>Threat protection</li>
                      </ul>
                    </div>

                    {/* Monitoring and Performance */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">MONITORING AND PERFORMANCE</h4>
                      <p className="text-xs text-gray-500 mb-1">Systems for IT performance monitoring and optimization</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Monitoring tools and systems</li>
                        <li>Performance analysis</li>
                        <li>Tuning and optimization</li>
                      </ul>
                    </div>

                    {/* Compliance and Governance */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">COMPLIANCE AND GOVERNANCE</h4>
                      <p className="text-xs text-gray-500 mb-1">Adherence to regulations and governance frameworks</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Regulatory compliance</li>
                        <li>IT governance implementation</li>
                        <li>Compliance reporting</li>
                      </ul>
                    </div>

                    {/* Integration and Interoperability */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">INTEGRATION AND INTEROPERABILITY</h4>
                      <p className="text-xs text-gray-500 mb-1">Ability to connect and integrate different systems</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Integration architecture</li>
                        <li>API management</li>
                        <li>Data exchange standards</li>
                      </ul>
                    </div>

                    {/* Disaster Recovery and Business Continuity */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold mb-1 text-emerald-600">DISASTER RECOVERY AND BUSINESS CONTINUITY</h4>
                      <p className="text-xs text-gray-500 mb-1">Processes for maintaining operations during disruptions</p>
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        <li>Disaster recovery planning</li>
                        <li>Business continuity processes</li>
                        <li>Recovery testing and simulation</li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>


        {/* SAGAY ICT Change Management Detail with Category Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">SAGAY ICT Change Management Assessment</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">SAGAY Municipality</span>
                <span className="text-3xl font-bold text-cyan-600">{sagayChangeManagement}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">Change Management Maturity Score represents the organization's ability to effectively manage and implement change in IT systems and processes.</p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-cyan-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${sagayChangeManagement}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Low Maturity</span>
                <span>Medium</span>
                <span>High Maturity</span>
              </div>

              {/* Category Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Category Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(sagayChangeManagementDetails).map(([category, score], index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-cyan-600 h-1.5 rounded-full"
                        style={{ width: `${score}%`, opacity: 0.7 + (score / 300) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SAGAY IT Readiness Detail with Category Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">SAGAY IT Readiness Assessment</h2>
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-800">SAGAY Municipality</span>
                <span className="text-3xl font-bold text-emerald-600">{sagayITReadiness}%</span>
              </div>

              <p className="text-sm text-gray-500 mb-3">IT Readiness Score represents the organization's preparedness in terms of IT infrastructure, governance, and capabilities to support digital services.</p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-emerald-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${sagayITReadiness}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                <span>Low Readiness</span>
                <span>Medium</span>
                <span>High Readiness</span>
              </div>

              {/* Category Breakdown */}
              <h3 className="font-semibold text-sm mb-2 mt-2 text-gray-700">Category Breakdown</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(sagayITReadinessDetails).map(([category, score], index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${score}%`, opacity: 0.7 + (score / 300) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Individual LGU Assessment */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Individual LGU Assessment</h2>

          {/* LGU Digital Skills */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Digital Skills Assessment</h3>
            <p className="mb-1">SAGAY Digital Skills Assessment: {sagayScore}%</p>
          </div>

          {/* LGU Technology Readiness Index */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Technology Readiness Index</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">SAGAY</p>
                <div className="flex justify-between">
                  <span>TRI Score:</span>
                  <span className="font-bold">{sagayTRI}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${sagayTRI}%` }}></div>
                </div>
              </div>

              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">LAGUINDINGAN</p>
                <div className="flex justify-between">
                  <span>TRI Score:</span>
                  <span className="font-bold">{laguindanganTRI}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${laguindanganTRI}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* LGU Optimism Scores */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Technology Optimism</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">SAGAY</p>
                <div className="flex justify-between">
                  <span>Optimism Score:</span>
                  <span className="font-bold">{sagayOptimism}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${sagayOptimism}%` }}></div>
                </div>
              </div>

              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">LAGUINDINGAN</p>
                <div className="flex justify-between">
                  <span>Optimism Score:</span>
                  <span className="font-bold">{laguindanganOptimism}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${laguindanganOptimism}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* LGU Innovativeness Scores */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Technology Innovativeness</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">SAGAY</p>
                <div className="flex justify-between">
                  <span>Innovativeness Score:</span>
                  <span className="font-bold">{sagayInnovativeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${sagayInnovativeness}%` }}></div>
                </div>
              </div>

              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">LAGUINDINGAN</p>
                <div className="flex justify-between">
                  <span>Innovativeness Score:</span>
                  <span className="font-bold">{laguindanganInnovativeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${laguindanganInnovativeness}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* LGU Discomfort Scores */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Technology Discomfort</h3>
            <p className="text-xs text-gray-500 mb-2">(Higher score means LESS discomfort with technology)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">SAGAY</p>
                <div className="flex justify-between">
                  <span>Discomfort Score:</span>
                  <span className="font-bold">{sagayDiscomfort}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${sagayDiscomfort}%` }}></div>
                </div>
              </div>

              <div className="border p-3 rounded-lg">
                <p className="font-medium mb-1">LAGUINDINGAN</p>
                <div className="flex justify-between">
                  <span>Discomfort Score:</span>
                  <span className="font-bold">{laguindanganDiscomfort}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${laguindanganDiscomfort}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LGU Lists */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camiguin LGUs */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Camiguin LGUs</h2>
            {camiguinLGUs.length > 0 ? (
              <ul className="list-disc pl-5">
                {camiguinLGUs.map((lgu, index) => (
                  <li key={index}>{lgu}</li>
                ))}
              </ul>
            ) : (
              <p>No LGUs found for Camiguin province</p>
            )}
          </div>

          {/* Misor LGUs */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Misamis Oriental LGUs</h2>
            {misorLGUs.length > 0 ? (
              <ul className="list-disc pl-5">
                {misorLGUs.map((lgu, index) => (
                  <li key={index}>{lgu}</li>
                ))}
              </ul>
            ) : (
              <p>No LGUs found for Misamis Oriental province</p>
            )}
          </div>
        </div>

        <Dashboard
          data={surveyData}
          gridColsBase={4}
        />
      </div>
    </div>
  )
}

export default dashsboard