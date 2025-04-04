import {
    getCamiguinAverageScores,
    getMisorAverageScores,
    // getLGUITReadinessScoreMaturity,  // Add the Maturity version
    // getLGUChangeManagementScoreMaturity  // Add the Maturity version
} from '@/lib/functions/Referenced';
// import { getDetailedProvinceAssessment, getRegionAssessmentData } from '@/lib/functions/ProvinceAssessment';
import { ProvinceRadarChart } from './chart-components/ProvinceRadarChartProps';
import { useState, useEffect } from 'react';
import { RegionalComparisonChart } from './chart-components/LineChart';
import { getRegionWideAverages } from '@/lib/functions/ProvinceAssessment';
import Chart from 'chart.js/auto';
import { getProvinceMaturityScores } from '@/lib/functions/ProvinceAssessment';

// Generic province data function that accepts an array of province names
const getProvinceData = (provinces: string[]) => {
    const results: Record<string, {
        digitalSkills: number;
        technologyReadiness: number;
        changeManagement: number;
        itReadiness: number;
        overallScore: number;
    }> = {};

    provinces.forEach(province => {
        const provinceData = getProvinceMaturityScores(province as 'Misor' | 'Camiguin');

        results[province] = {
            digitalSkills: provinceData.digitalSkills,
            technologyReadiness: provinceData.techReadiness,
            changeManagement: provinceData.changeManagement,
            itReadiness: provinceData.itReadiness,
            overallScore: provinceData.overallScore
        };
    });

    return results;
};



const DashboardComponents = () => {
    const [provinceData, setProvinceData] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    // Change selected LGU to selected province
    const [selectedProvince, setSelectedProvince] = useState("Camiguin");
    const [detailedData] = useState<any>(null);
    const [showDetailedView] = useState(true);
    const [regionData, setRegionData] = useState<any>(null);

    // List of provinces for selection
    const provinces = ["Camiguin", "Misor"];

    // Assessment categories for the chart
    const assessmentCategories = [
        'Digital Skills',
        'Technology Readiness',
        'ICT Change Management',
        'IT Readiness',
        // 'Digital Infrastructure'
    ];

    const misorValues = !isLoading ? [
        provinceData.Misor?.digitalSkills || 0,
        provinceData.Misor?.technologyReadiness || 0,
        provinceData.Misor?.changeManagement || 0,
        provinceData.Misor?.itReadiness || 0,
        // provinceData.Misor?.digitalInfrastructure || 0
    ] : [0, 0, 0, 0];

    const camiguinValues = !isLoading ? [
        provinceData.Camiguin?.digitalSkills || 0,
        provinceData.Camiguin?.technologyReadiness || 0,
        provinceData.Camiguin?.changeManagement || 0,
        provinceData.Camiguin?.itReadiness || 0,
        // provinceData.Camiguin?.digitalInfrastructure || 0
    ] : [0, 0, 0, 0];

    // Get data for the selected province
    const selectedProvinceData = !isLoading ?
        provinceData[selectedProvince === "Misor" ? "Misor" : "Camiguin"] : null;

    // Calculate the overall scores (average of all categories)
    const misorOverallScore = misorValues.reduce((sum, val) => sum + val, 0) / misorValues.length;
    const camiguinOverallScore = camiguinValues.reduce((sum, val) => sum + val, 0) / camiguinValues.length;
    // const toggleDetailedView = () => {
    //     setShowDetailedView(!showDetailedView);
    // };

    // Get detailed data for the selected province
    const selectedDetailedData = detailedData &&
        (selectedProvince === "Misor" ? detailedData.misor : detailedData.camiguin);
    // Get LGU count in the selected province
    const lguCount = selectedProvince === "Camiguin" ?
        getCamiguinAverageScores().lguCount :
        getMisorAverageScores().lguCount;

    // Get values for the selected province
    const selectedValues = selectedProvince === "Misor" ? misorValues : camiguinValues;
    const selectedOverallScore = selectedProvince === "Misor" ? misorOverallScore : camiguinOverallScore;

    // Fetch data on component mount
    useEffect(() => {
        // Get data for both provinces
        const region = getRegionWideAverages();
        setRegionData(region);
        const data = getProvinceData(["Misor", "Camiguin"]);
        setProvinceData(data);
        setIsLoading(false);
    }, []);

    // Add this useEffect after your existing useEffect that fetches data

    // Regional comparison chart initialization
    useEffect(() => {
        if (isLoading || !regionData) return;

        const ctx = document.getElementById('regionalComparisonChart') as HTMLCanvasElement;
        if (!ctx) return;

        // Cleanup any existing chart
        let chartInstance: any = Chart.getChart(ctx);
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create category labels
        const categoryLabels = ['Digital Skills', 'Tech Readiness', 'Change Mgmt', 'IT Readiness'];

        // Create data arrays
        const regionValues = [
            regionData.categoriesOverall.digitalSkills,
            regionData.categoriesOverall.technologyReadiness,
            regionData.categoriesOverall.changeManagement,
            regionData.categoriesOverall.itReadiness
        ];

        // Create the chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [
                    {
                        label: 'Region 10 Overall',
                        data: regionValues,
                        backgroundColor: 'rgba(109, 40, 217, 0.7)', // purple
                        borderColor: 'rgba(109, 40, 217, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Misamis Oriental',
                        data: misorValues,
                        backgroundColor: 'rgba(37, 99, 235, 0.7)', // blue
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Camiguin',
                        data: camiguinValues,
                        backgroundColor: 'rgba(234, 179, 8, 0.7)', // yellow
                        borderColor: 'rgba(234, 179, 8, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Region vs Provinces Comparison',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2) + '%';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Assessment Categories'
                        }
                    }
                }
            }
        });

    }, [isLoading, regionData, misorValues, camiguinValues]);

    // Extract values for charts once data is loaded

    console.log(getCamiguinAverageScores())
    return (
        <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-6">Region 10 Digital Maturity Dashboard</h2>
            {!isLoading && regionData && (
                <div className="bg-white rounded-lg border border-border p-4 mb-8">
                    <h3 className="text-lg font-medium mb-4">Region 10 Combined Average</h3>

                    {selectedProvinceData && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">


                            <div className="flex flex-col lg:flex-row">
                                {/* Charts Container */}
                                <div className="flex flex-col md:flex-row gap-4 lg:w-3/5">

                                    {/* Region Radar Chart */}
                                    <div className="md:w-full lg:w-1/2 mt-4 md:mt-0">
                                        <div className="bg-white p-3 rounded shadow-sm h-full">
                                            <ProvinceRadarChart
                                                categories={assessmentCategories}
                                                values={[
                                                    regionData.categoriesOverall.digitalSkills,
                                                    regionData.categoriesOverall.technologyReadiness,
                                                    regionData.categoriesOverall.changeManagement,
                                                    regionData.categoriesOverall.itReadiness
                                                ]}
                                                provinceName="Region 10 Overall"
                                                color="#6D28D9"
                                                showDataLabels={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Metric Cards
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4 lg:mt-0 lg:ml-4 lg:w-2/5">
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Overall Score</div>
                                        <div className="text-xl font-bold text-blue-600">{selectedOverallScore.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Digital Skills</div>
                                        <div className="text-xl font-bold text-green-600">{selectedProvinceData.digitalSkills.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Tech Readiness</div>
                                        <div className="text-xl font-bold text-yellow-600">{selectedProvinceData.technologyReadiness.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">IT Readiness</div>
                                        <div className="text-xl font-bold text-purple-600">{selectedProvinceData.itReadiness.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <div className="text-sm text-gray-500">Change Management</div>
                                        <div className="text-xl font-bold text-red-600">{selectedProvinceData.changeManagement.toFixed(2)}%</div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 mb-8">
                        <RegionalComparisonChart
                            title="Province Comparison: Digital Maturity Scores"
                            categories={assessmentCategories}
                            misorValues={misorValues}
                            camiguinValues={camiguinValues}
                            height={400}
                            colSpan={4}
                        />
                    </div>

                    {/* Detailed Scores Table */}
                    <div className="bg-white rounded-lg border border-border p-4 mb-8">
                        <h3 className="text-lg font-medium mb-4">Detailed Assessment Scores</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Misamis Oriental</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camiguin</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assessmentCategories.map((category, index) => {
                                        const misorScore = misorValues[index];
                                        const camiguinScore = camiguinValues[index];
                                        const diff = misorScore - camiguinScore;
                                        const diffColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";

                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{misorScore.toFixed(2)}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camiguinScore.toFixed(2)}%</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${diffColor}`}>
                                                    {diff > 0 ? "+" : ""}{diff.toFixed(2)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Overall Average</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{misorOverallScore.toFixed(2)}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-500">{camiguinOverallScore.toFixed(2)}%</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${misorOverallScore > camiguinOverallScore ? 'text-green-600' : 'text-red-600'}`}>
                                            {misorOverallScore > camiguinOverallScore ? "+" : ""}{(misorOverallScore - camiguinOverallScore).toFixed(2)}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Regional Average Card */}
                    {/* <div className="mb-4 bg-gradient-to-r from-blue-50 to-yellow-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-medium text-gray-700">Overall Regional Digital Maturity:</span>
                            <span className="text-2xl font-bold text-[#0036C5]">{regionData.overallScore.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div className="bg-[#0036C5] h-2.5 rounded-full" style={{ width: `${regionData.overallScore}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Combined average of {regionData.totalLGUs} LGUs across Misamis Oriental and Camiguin
                        </p>
                    </div> */}

                    {/* Regional Assessment Categories Chart */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-medium mb-3">Regional Assessment Category Scores</h4>
                            <div className="space-y-3">
                                {assessmentCategories.map((category, index) => {
                                    let categoryScore;
                                    switch (index) {
                                        case 0:
                                            categoryScore = regionData.categoriesOverall.digitalSkills;
                                            break;
                                        case 1:
                                            categoryScore = regionData.categoriesOverall.technologyReadiness;
                                            break;
                                        case 2:
                                            categoryScore = regionData.categoriesOverall.changeManagement;
                                            break;
                                        case 3:
                                            categoryScore = regionData.categoriesOverall.itReadiness;
                                            break;
                                        default:
                                            categoryScore = 0;
                                    }

                                    return (
                                        <div key={index} className="flex flex-col">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{category}</span>
                                                <span className="font-medium">{categoryScore.toFixed(2)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${index === 0 ? 'bg-[#0036C5]' :
                                                        index === 1 ? 'bg-[#ECC217]' :
                                                            index === 2 ? 'bg-[#0036C5]' :
                                                                'bg-[#ECC217]'
                                                        }`}
                                                    style={{ width: `${categoryScore}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                       
                    </div> */}
                    {/* <div className="bg-white p-3 rounded shadow-sm">
                            <canvas id="regionalComparisonChart" height="250"></canvas>
                        </div> */}
                </div>
            )}

            {/* Overall Score Summary Cards */}
            {/* // Update the featured province section for better responsiveness */}
            {/* <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">
                    Featured Province: {selectedProvince === "Misor" ? "Misamis Oriental" : selectedProvince}
                    <span className="text-sm text-gray-500 ml-2">({lguCount} LGUs with data)</span>
                </h3>

                <div className="flex flex-col lg:flex-row">

                    <div className="w-full lg:w-2/5 mt-4 lg:mt-0">
                        <div className="bg-white p-3 rounded shadow-sm h-full">
                            <ProvinceRadarChart
                                categories={assessmentCategories}
                                values={selectedValues}
                                provinceName={selectedProvince === "Misor" ? "Misamis Oriental" : selectedProvince}
                                color={selectedProvince === "Misor" ? "#2563EB" : "#EAB308"}
                                showDataLabels={false}
                            />
                        </div>
                    </div>

                  
                    <div className="w-full lg:w-3/5 mt-4 lg:mt-0 lg:ml-4 overflow-x-auto">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 min-w-[500px]">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Overall Score</div>
                                <div className="text-xl font-bold text-blue-600">{selectedOverallScore.toFixed(2)}%</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Digital Skills</div>
                                <div className="text-xl font-bold text-green-600">{selectedProvinceData?.digitalSkills?.toFixed(2)}%</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Tech Readiness</div>
                                <div className="text-xl font-bold text-yellow-600">{selectedProvinceData?.technologyReadiness?.toFixed(2)}%</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">IT Readiness</div>
                                <div className="text-xl font-bold text-purple-600">{selectedProvinceData?.itReadiness?.toFixed(2)}%</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Change Management</div>
                                <div className="text-xl font-bold text-red-600">{selectedProvinceData?.changeManagement?.toFixed(2)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Toggle button for detailed view */}
            <div className="mb-4 flex justify-between items-center">
                <div>
                    {/* Province Selection Dropdown */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Province to Feature:
                    </label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {provinces.map(province => (
                            <option key={province} value={province}>{province === "Misor" ? "Misamis Oriental" : province}</option>
                        ))}
                    </select>
                </div>
                {/* <button
                    onClick={toggleDetailedView}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
                >
                    {showDetailedView ? "Show Summary View" : "Show Detailed Assessment"}
                </button> */}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading data...</p>
                </div>
            ) : (
                <>
                    {/* Show either the summary view or detailed view based on state */}
                    {showDetailedView ? (
                        // Original summary view
                        <>
                            {/* ...existing code for summary view... */}
                            {/* Display selected province data */}
                            {selectedProvinceData && (
                                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium mb-2">
                                        Featured Province: {selectedProvince === "Misor" ? "Misamis Oriental" : selectedProvince}
                                        <span className="text-sm text-gray-500 ml-2">({lguCount} LGUs with data)</span>
                                    </h3>

                                    <div className="flex flex-col md:flex-row">
                                        {/* Radar Chart */}
                                        <div className="md:w-2/5 mt-4 md:mt-0">
                                            <div className="bg-white p-3 rounded shadow-sm h-full">
                                                <ProvinceRadarChart
                                                    categories={assessmentCategories}
                                                    values={selectedValues}
                                                    provinceName={selectedProvince === "Misor" ? "Misamis Oriental" : selectedProvince}
                                                    color={selectedProvince === "Misor" ? "#2563EB" : "#EAB308"}
                                                    showDataLabels={false} // Add this to hide the data labels on this chart
                                                />
                                            </div>
                                        </div>

                                        {/* Metric Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 md:mb-0 md:w-3/5">
                                            <div className="bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500">Overall Score</div>
                                                <div className="text-xl font-bold text-blue-600">{selectedOverallScore.toFixed(2)}%</div>
                                            </div>
                                            <div className="bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500">Digital Skills</div>
                                                <div className="text-xl font-bold text-green-600">{selectedProvinceData.digitalSkills.toFixed(2)}%</div>
                                            </div>
                                            <div className="bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500">Tech Readiness</div>
                                                <div className="text-xl font-bold text-yellow-600">{selectedProvinceData.technologyReadiness.toFixed(2)}%</div>
                                            </div>
                                            <div className="bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500">IT Readiness</div>
                                                <div className="text-xl font-bold text-purple-600">{selectedProvinceData.itReadiness.toFixed(2)}%</div>
                                            </div>
                                            <div className="bg-white p-3 rounded shadow-sm">
                                                <div className="text-sm text-gray-500">Change Management</div>
                                                <div className="text-xl font-bold text-red-600">{selectedProvinceData.changeManagement.toFixed(2)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* Line Chart */}





                            {/* <div className="mt-6 border-t pt-6">
                                <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <span className="font-medium">Digital Skills Assessment:</span> {misorValues[0] > camiguinValues[0] ? 'Misamis Oriental' : 'Camiguin'} demonstrates {Math.abs(misorValues[0] - camiguinValues[0]).toFixed(2)}% {misorValues[0] > camiguinValues[0] ? 'higher' : 'better'} digital competency scores.
                                        This suggests that {misorValues[0] > camiguinValues[0] ? 'Misamis Oriental' : 'Camiguin'} LGUs have more effectively developed their workforce's digital literacy and technical capabilities.
                                    </li>
                                    <li>
                                        <span className="font-medium">Technology Readiness:</span> With a score of {(camiguinValues[1] > misorValues[1] ? camiguinValues[1] : misorValues[1]).toFixed(2)}%,
                                        {camiguinValues[1] > misorValues[1] ? ' Camiguin' : ' Misamis Oriental'} exhibits greater openness to new technologies.
                                        This indicates stronger potential for successful technology adoption and implementation in future digital initiatives.
                                    </li>
                                    <li>
                                        <span className="font-medium">ICT Change Management:</span> {misorValues[2] > camiguinValues[2] ? 'Misamis Oriental' : 'Camiguin'} leads with {Math.abs(misorValues[2] - camiguinValues[2]).toFixed(2)}% higher change management maturity,
                                        reflecting stronger frameworks for planning and implementing technological changes with minimal disruption to operations.
                                    </li>
                                    <li>
                                        <span className="font-medium">IT Readiness:</span> With a score of {(misorValues[3] > camiguinValues[3] ? misorValues[3] : camiguinValues[3]).toFixed(2)}%,
                                        {misorValues[3] > camiguinValues[3] ? ' Misamis Oriental' : ' Camiguin'} demonstrates better IT infrastructure and governance readiness.
                                        This indicates {misorValues[3] > camiguinValues[3] ? 'Misor' : 'Camiguin'} may be better positioned for technical implementations.
                                    </li>
                                    <li>
                                        <span className="font-medium">Overall Assessment:</span> {misorOverallScore > camiguinOverallScore ? 'Misamis Oriental' : 'Camiguin'} has achieved a {Math.abs(misorOverallScore - camiguinOverallScore).toFixed(2)}%
                                        higher overall digital maturity score, suggesting {misorOverallScore > camiguinOverallScore ? 'Misor' : 'Camiguin'} LGUs collectively demonstrate more advanced digital transformation progress.
                                    </li>
                                    <li>
                                        <span className="font-medium">Recommendation:</span> Both provinces would benefit from targeted interventions in their lowest-scoring areas:
                                        {misorValues.indexOf(Math.min(...misorValues)) === 0 ? ' Digital Skills' :
                                            misorValues.indexOf(Math.min(...misorValues)) === 1 ? ' Technology Readiness' :
                                                misorValues.indexOf(Math.min(...misorValues)) === 2 ? ' ICT Change Management' : ' IT Readiness'} for Misamis Oriental and
                                        {camiguinValues.indexOf(Math.min(...camiguinValues)) === 0 ? ' Digital Skills' :
                                            camiguinValues.indexOf(Math.min(...camiguinValues)) === 1 ? ' Technology Readiness' :
                                                camiguinValues.indexOf(Math.min(...camiguinValues)) === 2 ? ' ICT Change Management' : ' IT Readiness'} for Camiguin.
                                    </li>
                                </ul>
                            </div> */}
                        </>
                    ) : (
                        // Detailed Assessment View
                        selectedDetailedData && (
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold">
                                    Detailed Assessment for {selectedProvince === "Misor" ? "Misamis Oriental" : selectedProvince}
                                </h3>

                                {/* Digital Skills Assessment */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-lg font-medium mb-4 text-green-700">Digital Skills Assessment</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Overall Score: <span className="font-bold text-green-600">{selectedDetailedData.digitalSkills.overall.toFixed(2)}%</span></p>
                                            <p className="text-sm text-gray-600 mb-2">Top Performing Area: <span className="font-medium">{selectedDetailedData.digitalSkills.topPerforming}</span></p>
                                            <p className="text-sm text-gray-600 mb-2">Area Needing Improvement: <span className="font-medium">{selectedDetailedData.digitalSkills.bottomPerforming}</span></p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">Question Scores</h5>
                                            <div className="overflow-y-auto max-h-40">
                                                {selectedDetailedData.digitalSkills.questions.map((q: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                        <span className="truncate mr-4" title={q.question}>{q.question}</span>
                                                        <span className="font-medium">{q.score.toFixed(2)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technology Readiness Index */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-lg font-medium mb-4 text-yellow-700">Technology Readiness Index</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Overall Score: <span className="font-bold text-yellow-600">{selectedDetailedData.technologyReadiness.overall.toFixed(2)}%</span></p>
                                            <p className="text-sm text-gray-600 mb-2">Strongest Dimension: <span className="font-medium">{selectedDetailedData.technologyReadiness.highestDimension.dimension} ({selectedDetailedData.technologyReadiness.highestDimension.score.toFixed(2)}%)</span></p>
                                            <p className="text-sm text-gray-600 mb-2">Challenging Dimension: <span className="font-medium">{selectedDetailedData.technologyReadiness.lowestDimension.dimension} ({selectedDetailedData.technologyReadiness.lowestDimension.score.toFixed(2)}%)</span></p>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">TRI Dimensions</h5>
                                            {selectedDetailedData.technologyReadiness.dimensions.map((dim: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                    <span>{dim.dimension}</span>
                                                    <span className="font-medium">{dim.score.toFixed(2)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* IT Readiness Assessment */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-lg font-medium mb-4 text-purple-700">IT Readiness Assessment</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Overall Score: <span className="font-bold text-purple-600">{selectedDetailedData.itReadiness.overall.toFixed(2)}%</span></p>
                                            <h5 className="text-sm font-medium mt-4 mb-2">Top Performing Categories</h5>
                                            {selectedDetailedData.itReadiness.topCategories.map((cat: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                    <span>{cat.category}</span>
                                                    <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                </div>
                                            ))}
                                            <h5 className="text-sm font-medium mt-4 mb-2">Areas for Improvement</h5>
                                            {selectedDetailedData.itReadiness.bottomCategories.map((cat: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                    <span>{cat.category}</span>
                                                    <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">All Categories</h5>
                                            <div className="overflow-y-auto max-h-60">
                                                {selectedDetailedData.itReadiness.categories.map((cat: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                        <span>{cat.category}</span>
                                                        <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Management Assessment */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-lg font-medium mb-4 text-red-700">ICT Change Management</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Overall Score: <span className="font-bold text-red-600">{selectedDetailedData.changeManagement.overall.toFixed(2)}%</span></p>
                                            <h5 className="text-sm font-medium mt-4 mb-2">Top Performing Categories</h5>
                                            {selectedDetailedData.changeManagement.topCategories.map((cat: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                    <span>{cat.category}</span>
                                                    <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                </div>
                                            ))}
                                            <h5 className="text-sm font-medium mt-4 mb-2">Areas for Improvement</h5>
                                            {selectedDetailedData.changeManagement.bottomCategories.map((cat: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                    <span>{cat.category}</span>
                                                    <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-medium mb-2">All Categories</h5>
                                            <div className="overflow-y-auto max-h-60">
                                                {selectedDetailedData.changeManagement.categories.map((cat: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center text-sm mb-1">
                                                        <span>{cat.category}</span>
                                                        <span className="font-medium">{cat.score.toFixed(2)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* LGUs Performance Table */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h4 className="text-lg font-medium mb-4">LGU Performance Breakdown</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LGU</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Digital Skills</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Readiness</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IT Readiness</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Mgmt</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedDetailedData.lgusData
                                                    .sort((a: any, b: any) => b.overallScore - a.overallScore)
                                                    .map((lgu: any, i: number) => (
                                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{lgu.lguName}</td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{lgu.overallScore.toFixed(2)}%</td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{lgu.digitalSkills.toFixed(2)}%</td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{lgu.techReadiness.toFixed(2)}%</td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{lgu.itReadiness.toFixed(2)}%</td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{lgu.changeManagement.toFixed(2)}%</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardComponents;