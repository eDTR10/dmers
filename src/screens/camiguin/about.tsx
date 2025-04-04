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

    let officeData: any;
    let Datas: any = Data
    if (["Mayor's Office", "HR Office", "IT Office"].includes(officeName)) {
      officeData = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
        (item: any) => item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
      );
    } else {
      // Find in Other Offices with matching Office Name
      officeData = Datas["Other Offices"].find(
        (item: any) =>
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
        data = labels.map((_: any, idx: any) => {
          const key = `Question ${idx + 1} DigitalSkillsAssessment`;
          const value = officeData[key] || 0;
          return (Number(value) / 5) * 100; // Convert to percentage
        });
        break;
      case 'TECHNOLOGY READINESS INDEX':
        labels = assData[1].data;
        data = labels.map((label: any) => {
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

  function getITSystemsAvailability(lguName: string, data: any) {
    // Find the IT Office data for the specified LGU
    const itOfficeData = data["IT Office"].find(
      (item: any) => item["LGU Name"]?.toUpperCase() === lguName.toUpperCase()
    );

    if (!itOfficeData) {
      return { error: "No IT Office data found for this LGU" };
    }

    // List of all offices to check for system availability
    const offices = [
      { prefix: 'a', name: 'Business Permits and Licensing Office (BPLO)' },
      { prefix: 'b', name: 'Information and Communications Technology (ICT) or Management Information System (MIS) Office' },
      { prefix: 'c', name: 'Engineering Office' },
      { prefix: 'd', name: 'Office of the Building Official (OBO)' },
      { prefix: 'e', name: 'Planning and Development Office' },
      { prefix: 'f', name: 'Sanitary / Health Office' },
      { prefix: 'g', name: 'Treasury Office' },
      { prefix: 'h', name: 'Zoning Office' },
      { prefix: 'i', name: 'Office of the General Services Officer' },
      { prefix: 'j', name: 'Bureau of Fire Protection (BFP)' },
      { prefix: 'k', name: 'Local Civil Registry Office' },
      { prefix: 'l', name: 'Assessor\'s Office' },
      { prefix: 'm', name: 'Administrator\'s Office' },
      { prefix: 'n', name: 'Human Resource and Management Office' },
      { prefix: 'o', name: 'Budget Office' },
      { prefix: 'p', name: 'Accountant\'s Office' },
      { prefix: 'q', name: 'Sangguniang Panlungsod' },
      { prefix: 'r', name: 'Tourism Office' },
      { prefix: 's', name: 'Population Office' },
      { prefix: 't', name: 'Library Office' },
      { prefix: 'u', name: 'Social Welfare and Development Office' },
      { prefix: 'v', name: 'Veterinarian\'s Office' },
      { prefix: 'w', name: 'Agriculturist\'s Office' },
      { prefix: 'x', name: 'Mayor\'s Office' }
    ];

    // Extract system availability data for each office
    const systemsData = offices.map(office => {
      const baseKey = `Availability of the system per office (if any) - ${office.prefix}. ${office.name}`;

      return {
        office: office.name,
        system: itOfficeData[`${baseKey} - System`] || "None",
        modeOfDeployment: itOfficeData[`${baseKey} - Mode of Deployment`] || "-",
        availability: itOfficeData[`${baseKey} - Availability`] || "-",
        integration: itOfficeData[`${baseKey} - Separate System or Integrated with other offices`] || "-",
        integrationDetails: itOfficeData[`${baseKey} - If Integrated with other offices, Provide roles (endorsing office, system administrator, others)`] || "-"
      };
    });

    return {
      lguName: lguName,
      systemsData: systemsData.filter(item => item.system && item.system !== "None" && item.system !== "none")
    };
  }

  /**
   * Component to render the IT systems availability table
   * @param lguName The name of the LGU
   * @param data The survey data
   */
  const ITSystemsTable = ({ lguName, data }: { lguName: string, data: any }) => {
    const systemsData = getITSystemsAvailability(lguName, data);

    if (systemsData.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{systemsData.error}</p>
        </div>
      );
    }

    if (!systemsData.systemsData || systemsData.systemsData.length === 0) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700">No systems data available for {systemsData.lguName}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">Office</th>
              <th className="px-4 py-2 text-left border-b">System</th>
              <th className="px-4 py-2 text-left border-b">Mode</th>
              <th className="px-4 py-2 text-left border-b">Availability</th>
              <th className="px-4 py-2 text-left border-b">Integration Type</th>
            </tr>
          </thead>
          <tbody>
            {systemsData.systemsData.map((system: any, index: number) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 border-b">{system.office}</td>
                <td className="px-4 py-2 border-b">{system.system}</td>
                <td className="px-4 py-2 border-b">{system.modeOfDeployment}</td>
                <td className="px-4 py-2 border-b">{system.availability}</td>
                <td className="px-4 py-2 border-b">
                  {system.integration}
                  {system.integration === "Integrated" && system.integrationDetails !== "-" && (
                    <div className="text-xs text-gray-600 mt-1">
                      <strong>Integrated with:</strong> {system.integrationDetails}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add this function below the getITSystemsAvailability function

  function getLGUWebsiteInfo(lguName: string, data: any) {
    // Find the IT Office data for the specified LGU
    const itOfficeData = data["IT Office"].find(
      (item: any) => item["LGU Name"]?.toUpperCase() === lguName.toUpperCase()
    );

    if (!itOfficeData) {
      return { error: "No IT Office data found for this LGU" };
    }

    // Extract website and IT infrastructure information
    return {
      hasWebsite: itOfficeData["Is there an LGU website?"] || "No data",
      isIntegrated: itOfficeData["If Yes, are the LGU's systems or online services integrated into the website?"] || "No",
      integratedServices: itOfficeData["If integrated into the website, please specify which online services or transactions were included."] || "None",
      usesCloud: itOfficeData["Does your office use cloud-based systems for data storage and processing?"] || "No data",
      downtimeFrequency: itOfficeData["How often does your office experience system downtime or technical issues?"] || "No data",
      hasITSupport: itOfficeData["Are there IT personnel available to provide immediate support for system issues?"] || "No data"
    };
  }

  /**
   * Component to render the LGU website and IT infrastructure information
   * @param lguName The name of the LGU
   * @param data The survey data
   */
  const ITInfrastructureInfo = ({ lguName, data }: { lguName: string, data: any }) => {
    const websiteInfo = getLGUWebsiteInfo(lguName, data);

    if (websiteInfo.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{websiteInfo.error}</p>
        </div>
      );
    }

    // Parse integrated services if it's a JSON string
    let integratedServices = [];
    try {
      if (typeof websiteInfo.integratedServices === 'string' && websiteInfo.integratedServices.startsWith('[')) {
        const parsed = JSON.parse(websiteInfo.integratedServices);
        integratedServices = parsed.map((service: any) => {
          const key = Object.keys(service)[0];
          return service[key];
        });
      }
    } catch (err) {
      integratedServices = [websiteInfo.integratedServices];
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b" colSpan={2}>IT Infrastructure & Website</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="px-4 py-2 border-b font-medium w-2/5">Is there an LGU website?</td>
              <td className="px-4 py-2 border-b">
                {websiteInfo.hasWebsite === "Yes" ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Available
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Not Available
                  </span>
                )}
              </td>
            </tr>

            {websiteInfo.hasWebsite === "Yes" && (
              <>
                <tr>
                  <td className="px-4 py-2 border-b font-medium">If Yes, are the LGU's systems or online services integrated into the website?</td>
                  <td className="px-4 py-2 border-b">
                    {websiteInfo.isIntegrated === "Yes" ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        No
                      </span>
                    )}
                  </td>
                </tr>

                {websiteInfo.isIntegrated === "Yes" && (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border-b font-medium">If integrated into the website, please specify which online services or transactions were included.</td>
                    <td className="px-4 py-2 border-b">
                      <ul className="list-disc pl-5">
                        {integratedServices.map((service: string, index: number) => (
                          <li key={index} className="text-sm">{service}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            )}

            <tr>
              <td className="px-4 py-2 border-b font-medium">Does your office use cloud-based systems for data storage and processing?</td>
              <td className="px-4 py-2 border-b">
                {websiteInfo.usesCloud === "Yes" ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Yes
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    No
                  </span>
                )}
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="px-4 py-2 border-b font-medium">How often does your office experience system downtime or technical issues?</td>
              <td className="px-4 py-2 border-b">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${websiteInfo.downtimeFrequency === "Never" ? "bg-green-100 text-green-800" :
                    websiteInfo.downtimeFrequency === "Rarely" ? "bg-blue-100 text-blue-800" :
                      websiteInfo.downtimeFrequency === "Monthly" ? "bg-yellow-100 text-yellow-800" :
                        websiteInfo.downtimeFrequency === "Weekly" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"}`}
                >
                  {websiteInfo.downtimeFrequency}
                </span>
              </td>
            </tr>

            <tr>
              <td className="px-4 py-2 border-b font-medium">Are there IT personnel available to provide immediate support for system issues?</td>
              <td className="px-4 py-2 border-b">
                {websiteInfo.hasITSupport === "Yes" ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Available
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Not Available
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
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
            {assData.map((section: any) => (
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
                  {assData.find((section: any) => section.title === selectedAssessment)?.data.map((item: any, index: any) => {
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
                    const scoreColor = score >= 80 ? 'bg-blue-50 border-blue-300' :
                      score >= 50 ? ' bg-yellow-100/40 border-yellow-200' :
                        score >= 30 ? 'bg-red-100 border-red-200' : 'bg-red-50 border-red-200';

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
                                      let Datas: any = Data
                                      if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
                                        const data = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
                                          (item: any) => item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
                                        );



                                        officeResponse = Number(data?.[`Question ${index + 1} DigitalSkillsAssessment`] || 0);
                                      } else {
                                        // Find in Other Offices with matching Office Name
                                        let data: any = Data["Other Offices"].find(
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
                                                  style={{ width: `${(officeResponse / 5) * 100}%` }}
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
                                    {assData[1].questions[item.split(' ')[0]].map((question: any, qIndex: any) => {
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
                                                        let Datas: any = Data

                                                        if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
                                                          const data = Datas[officeDataKey === "Mayor's Office" ? "Mayors Office" : officeDataKey].find(
                                                            (item: any) => item["LGU Name"]?.toUpperCase() === lguInfo["LGU Name"]?.toUpperCase()
                                                          );
                                                          officeResponse = Number(data?.[`${item.split(' ')[0]} ${qIndex + 1}`] || 0);
                                                        } else {
                                                          let data: any = Data["Other Offices"].find(
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
                                                                    style={{ width: `${(officeResponse / 5) * 100}%` }}
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
                                    {assData.find((section: any) => section.title === selectedAssessment)
                                      ?.questions[item.split(' (')[0]]
                                      .map((question: any, qIndex: any) => {
                                        let score = 0;
                                        const dataKey = selectedAssessment === 'IT READINESS ASSESSMENT'
                                          ? `${item.split(' (')[0].replace(/ /g, ' ')} ${qIndex + 1}`
                                          : `${item.split(' (')[0]} ${qIndex + 1}`;

                                        let itOfficeData: any = Data["IT Office"].find(
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
                                                {score}/5
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
      <div className="p-5 h-full relative  w-[95%] flex flex-col bg-card/25 border border-border border-b-0 rounded-lg   ">
        <h1 className="py-4 px-2 text-center font-bold text-xl mb-4 border text-[#0036C5] border-[#0036C5]">
          {`${lguInfo["LGU Name"]}, ${lguInfo.Province}`}

       
        </h1>

        <div className="bg-white h-full p-6 rounded-lg border border-border ">
          <div className="flex relative h-full justify-between md:items-end items-center md:flex-col">
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
            <div className=' w-[30%] md:w-full  h-full flex flex-col  items-center md:items-end '>
              <ScoreCircle score={Math.round(score)} />
              <h1 className=' absolute bottom-0 right-0 md:left-0  font-black text-6xl text-[#a8b6cb]'>{lguInfo["LGU Name"]} </h1>


            </div>
          </div>
        </div>

        <div className="border-b w-full border-gray-200">
          <nav className="flex">
            {['About', 'Assessment', 'Attachments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-4 md:mr-8 py-3 md:py-4 px-1 text-sm md:text-base ${activeTab === tab
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
            <div className="w-full md:flex-row grid grid-cols-6">
              <div className="col-span-4 pr-0 md:pr-6">
                <p className="mb-4 text-sm md:text-base">{lguInfo.descriptioon}</p>

                {/* Add IT Systems Table below description */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">IT Systems Available</h3>
                  <ITSystemsTable lguName={lguInfo["LGU Name"]} data={Data} />
                </div>

                {/* Add Website & IT Infrastructure Information */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Website & IT Infrastructure</h3>
                  <ITInfrastructureInfo lguName={lguInfo["LGU Name"]} data={Data} />
                </div>
              </div>
              <div className="col-span-2 flex justify-center items-start">
                <img
                  src={lguInfo["Logo"]}
                  alt={`${lguInfo["LGU Name"]} Logo`}
                  className="w-full max-w-[200px] mt-[10%] h-auto object-contain"
                />
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
  <div className=" flex flex-col items-center ">
    <div className="text-xl font-bold text-[#0036C5] mb-2">Score</div>
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#ecc216" strokeWidth="15" />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="#0036C5"
          strokeWidth="15"
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
  let Datas: any = Data
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
      const officeData = Datas[office]?.filter((data: any) =>
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
const assData: any = [
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
      "Optimism": [
        "Technology gives people more control over their daily lives.",
        "Products and services that use the newest technologies are much more convenient to use",
        "Like the idea of doing business via new technologies",
        "Prefer to use the most advanced technology available",
        "Like computer programs that allow me to tailor things to fit my own and the LGU's needs.",
        "Technology makes me more efficient in my work in the LGU",
        "I find new technologies to be mentally stimulating",
        "Technology gives more freedom of mobility",
        "Learning about technology can be as rewarding as the technology itself",
        "I feel confident that new technologies, such as e-gov, will greatly help the LGU and its operations"
      ],
      "Innovativeness": [
        "Other people come to me for advice on new technologies",
        "It seems my friends are learning more about the newest technologies than I am",
        "In general, I am among the first in my office to acquire and use new technology",
        "I can usually figure out new high-tech products and services without help from other.",
        "I can keep up with the latest technological developments in my areas of interest and work in the LGU Office",
        "I enjoy the challenge of figuring out high-tech gadgets",
        "I find that I have fewer problems that other people in making technology work for me"
      ],
      "Discomfort": [
        "Technical support lines are not helpful because they do not explain things in terms your understand",
        "Sometimes, I think that technology systems are not designed for use by ordinary people",
        "There is no such thing as a manual for a high-tech product or service that is written in the Filipino language",
        "When I get technical support from a provider of a high-tech product or service, I sometimes feel as if I am being taken advantage of by someone who knows more than I do",
        "If I buy a high-tech product or service, I prefer to have the basin model over one with a lot of extra features",
        "It is embarrassing when I have trouble with a high-tech gadget while people are watching",
        "There should be caution in replacing important people-tasks with technology because new technology can breakdown or get disconnected",
        "Many new technologies have health or safety risks that are not discovered until after people have used them",
        "New technology makes it too easy for government and companies to spy on people",
        "Technology always seems to fail at the worst possible time"
      ],
      "Insecurity": [
        "I do not consider it safe giving out a credit card number or payment details over a computer or new technology",
        "I do not consider it safe to do any kind of financial business online",
        "I worry that information I send over the internet will be seen by other people",
        "I do not feel confident doing business with a place that can only be reached online",
        "Any business transaction I do electronically should be confirmed later with something in writing",
        "Whenever something gets automated, I need to check carefully that the machine or computer is not making mistakes",
        "The human touch is very important when doing business with a company",
        "When I can a business, I prefer to talk to a person rather an automated call",
        "If I provide information to a computer or gadget over the internet, I can never be sure it really gets to right place"
      ]
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
      "BASIC IT READINESS": [
        "Internet connectivity is stable in speed, availability, and reliability.",
        "The electricity is stable and reliable in the location of the LGU.",
        "LGU users have the required hardware specifications and software in their machines to efficiently and effectively use the current system (IBPLS, eTRACS, etc)",
        "The IT department is manned by competent and qualified personnel to ensure proper on-site assistance when eLGU is live."
      ],
      "IT GOVERNANCE FRAMEWORK & POLICIES": [
        "There is a documented IT governance framework intentionally made for the LGU to describe and standardize its IT management actions and initiatives.",
        "Alignment of the framework based on existing, recognized conventions.",
        "Roles and responsibilities are clearly defined within the IT governance framework to guide IT personnel and the whole LGU on all IT-related deliverables which includes IT organizational structure and job specifications and descriptions."
      ],
      "IT STRATEGY AND ALIGNMENT": [
        "The LGU's IT strategy is aligned with its overall organizational goals and objectives.",
        "There is regular review and updating of IT strategy.",
        "Mechanisms are in place to ensure that the LGU's IT initiatives and projects are aligned with the strategic objectives of the agency."
      ],
      "IT POLICIES AND PROCEDURES": [
        "There are written comprehensive IT policies and procedures made for and by the LGU in key areas such as information security, data privacy, IT procurement, change management, and IT service management.",
        "The IT policies and procedures are regularly reviewed and updated to address newly employed technologies (such as the eLGU), emerging risks due to the employment of new systems, and the challenges that come with these.",
        "Adherence to the IT policies and procedures of the LGU is strictly monitored and enforced."
      ],
      "RISK MANAGEMENT": [
        "The LGU has a structured and documented IT risk management process.",
        "There are periodic risk assessments conducted to identify and assess IT risks.",
        "Appropriate controls and mitigation measures are implemented to address identified risks."
      ],
      "IT PERFORMANCE MEASUREMENT AND REPORTING": [
        "LGU mechanisms are in place to measure and monitor IT performance.",
        "Key performance indicators (KPIs) are established and regularly tracked to assess the effectiveness and efficiency of IT operations.",
        "A reporting mechanism exists to communicate IT performance to management or governing committee."
      ],
      "IT INVESTMENT MANAGEMENT": [
        "Formal processes for evaluating, prioritizing, and approving IT investments.",
        "IT investments are aligned with the agency's strategic objectives and supported by robust business cases.",
        "Is there a mechanism to monitor and evaluate the outcomes and benefits of IT investment."
      ],
      "VENDOR MANAGEMENT": [
        "Policies and procedures for selecting, contracting, and managing IT vendors are in place.",
        "Structured vendor evaluation and selection process.",
        "Mechanisms to monitor and assess the performance of IT vendors and ensure compliance with contractual obligations are in place."
      ],
      "IT SECURITY AND COMPLIANCE": [
        "There are documented information security policies and procedures that have been presented, discussed, and adhered to by the whole LGU.",
        "There is a robust IT security program that includes regular risk assessments, incident reports and response records, and regular security audits with findings presented to the LGU executive with recommendations and actions.",
        "The LGU follows relevant laws, regulations, and industry standards related to IT security and data privacy as outlined by the National Privacy Commission."
      ],
      "ICT Organizational Structure and Skills": [
        "There is a clear organizational structure for IT management within the LGU.",
        "IT roles and responsibilities are well-defined and understood.",
        "The LGU invests in developing and maintaining IT skills and competencies through training and professional development programs."
      ],
      "Audit and Assurance": [
        "There are mechanisms for internal or external audits to assess IT governance compliance.",
        "There is an established process to address audit findings and implement corrective actions.",
        "Audit recommendations are tracked and monitored to ensure timely resolution."
      ],
      "Network Infrastructure": [
        "Network routers and switches can handle the anticipated increased traffic load from the current system (IBPLS, eTRACS, etc)",
        "There are active network security measures which include firewalls and intrusion detection systems to protect the cloud environment."
      ],
      "Servers and Storage": [
        "There is sufficient server capacity to handle the anticipated workload",
        "There is adequate storage capacity to accommodate data storage requirements",
        "There are redundancy and fault-tolerant configurations to ensure high availability"
      ],
      "Virtualization": [
        "There is a hypervisor or virtualization platform to create and manage virtual machines.",
        "There is allocation of appropriate resources (CPU, memory, storage) to virtual machines.",
        "There are virtual machine management tools for provisioning, monitoring, and scaling resources."
      ],
      "Data Backup and Recovery": [
        "There are regular backup mechanisms to ensure data integrity and availability.",
        "There is an offsite storage or cloud-based backup solution for disaster recovery purposes.",
        "There are existing, documented, and tested data recovery procedures."
      ],
      "Scalability and Elasticity": [
        "There is scalable infrastructure that can accommodate growing resource demands",
        "There are auto-scaling capabilities to dynamically adjust resources based on workload fluctuations",
        "There are load balancing mechanisms to distribute traffic evenly across servers"
      ],
      "Security Measures": [
        "There are identity and access management controls to regulate user access and permissions.",
        "There are encryption mechanisms for data in transit and at rest.",
        "There are intrusion detection and prevention systems to safeguard against unauthorized access.",
        "There are security monitoring and logging tools to track and analyze system activity."
      ],
      "Monitoring and Performance": [
        "There are monitoring tools to track system performance, resource utilization, and application availability.",
        "There are alerting mechanisms to notify administrators of any performance or availability issues.",
        "There is capacity planning to ensure adequate resources are available to meet future demands."
      ],
      "Compliance and Governance": [
        "There is adherence to regulatory requirements and industry standards.",
        "There are data protection measures in line with applicable privacy laws.",
        "There is documentation of policies, procedures, and controls for auditing and compliance purposes."
      ],
      "Integration and Interoperability": [
        "There is compatibility with existing systems and applications.",
        "There is integration with other cloud services or on-premises infrastructure.",
        "There are APIs or integration frameworks for seamless data exchange between systems."
      ],
      "Disaster Recovery and Business Continuity": [
        "There is a comprehensive disaster recovery plan outlining procedures for system recovery and continuity of operations.",
        "There is regular testing and validation of the disaster recovery plan",
        "There are geographically redundant infrastructure or backup sites for critical services."
      ]
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
      "CHANGE READINESS": [
        "The systems currently used by the LGU (IBPLS, eTRACS, etc) are presented and discussed to users which include features, capabilities, and how this can help in the day-to-day delivery of public services.",
        "The current system they are using now (IBPLS, eTRACS, etc) is made to be in alignment with the LGU's public service delivery objectives, and user needs are ensured and discussed thoroughly by LGU leaders.",
        "Resources for training, infrastructure, and support related to the current system (IBPLS, eTRACS, etc) are planned and allocated before its rollout."
      ],
      "CHANGE LEADERSHIP": [
        "Leadership support and sponsorship of the current system (IBPLS, eTRACS, etc) were secured before it was rolled out.",
        "Change agents, system ambassadors, superusers, or local trainers who can facilitate and support users for the adoption of the currently used systems (IBPLS, eTRACS, etc) were identified beforehand to help with its roll-out."
      ],
      "CHANGE COMMUNICATION": [
        "The LGU had a functioning or tested communication strategy for informing users regarding the implementation of the currently used system (IBPLS, eTRACS, etc)",
        "Communication messages regarding the current system they are using (IBPLS, eTRACS) for specific user groups like department heads, LGU staff, and department front liners/clerks, were already tailored and readied for delivery.",
        "There are regular updates and opportunities for users to ask questions and provide feedback on the currently used system which includes the set up of communication channels to push these questions toward the developers and managers of the system."
      ],
      "CHANGE IMPACT ASSESSMENT": [
        "The potential impact of the currently used system (IBPLS, eTRACS) with regards to changes on LGU processes, workflows, and interface with the public was identified with developed courses of action to address possible negative reactions and resistance.",
        "There were developed plans and strategies to mitigate risks and challenges associated with the current system (IBPLS, eTRACS, etc)",
        "There were set reports that cover assessments and recommendations on the technical requirements, infrastructure changes, and/or upgrades on the current system."
      ],
      "STAKEHOLDER ENGAGEMENT": [
        "Stakeholders, including end-users, IT teams, and relevant departments are engaged throughout the system change process.",
        "Feedback and input from stakeholders are solicited to ensure their needs and concerns are addressed.",
        "Stakeholders in user acceptance testing and pilot programs are involved in validating the system solution."
      ],
      "CHANGE PLANNING AND EXECUTION": [
        "A detailed plan for implementing the system change (IBPLS, eTRACS, etc), including activities, milestones, and responsibilities was developed.",
        "Established change management methodologies or frameworks to guide the system change process were followed.",
        "There is continuous monitoring of progress which is adjusted as needed, with dependencies and risks managed at all times."
      ],
      "TRAINING AND DEVELOPMENT": [
        "Training needs were assessed to ensure users are equipped with the necessary skills to use the current system effectively.",
        "Training programs that cover system functionality, features, and workflows were developed and delivered.",
        "Ongoing support and resources to help users adapt to the system change were provided."
      ],
      "Resistance Management": [
        "Potential resistance to the system change, such as user reluctance or concerns was anticipated and addressed.",
        "The benefits of the system solution and addressing user fears or misconceptions were communicated.",
        "Mechanisms for users to express their concerns and provide feedback throughout the process were provided."
      ],
      "Evaluation and Continuous Improvement": [
        "Metrics and indicators to measure the success of the system change, such as user adoption rates or productivity improvements were established.",
        "Feedback from users and stakeholders to identify areas for improvement and iterate on the system solution was collected.",
        "Evaluation of the effectiveness of change management activities and adjusting strategies as needed are done continuously."
      ],
      "Sustainability and Embedding": [
        "The system change is ensured to become ingrained in the organization's processes and culture.",
        "Plans for ongoing maintenance, upgrades, and enhancements of the current system solution are developed.",
        "The adoption of the system solution to maximize its long-term benefits is monitored and reinforced."
      ],
      "Costs or Financial": [
        "Budget allocation for pre- implementation costs",
        "Budget allocation for implementation costs",
        "Budget for ongoing/continuing costs",
        "Funds are readily accessible and can be released at any time needed",
        "Identified funding sources to sustain computerization in the future"
      ]
    }
  }
];

// Add this helper function to calculate average rating across offices
const calculateAverageRating = (offices: string[], category: string, questionNum: number, lguInfo: any) => {
  let total = 0;
  let count = 0;

  offices.filter(o => o !== "All Offices").forEach(office => {
    let data: any = null;
    let Datas: any = Data

    if (["Mayor's Office", "HR Office", "IT Office"].includes(office)) {
      const officeKey = office === "Mayor's Office" ? "Mayors Office" : office;
      data = Datas[officeKey]?.find((item: any) =>
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