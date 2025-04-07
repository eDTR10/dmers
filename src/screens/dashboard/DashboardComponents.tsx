import {
    getCamiguinAverageScores,
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
    const [selectedProvince, _setSelectedProvince] = useState("Camiguin");
 
    const [regionData, setRegionData] = useState<any>(null);

    // List of provinces for selection


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


    // Get LGU count in the selected province
  

    // Get values for the selected province

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


                            <div className="flex flex-col lg:flex-row ">
                                {/* Charts Container */}
                                <div className="flex flex-col gap-4 w-full">

                                    {/* Region Radar Chart */}
                                    <div className="w-full mt-4 md:mt-0 flex justify-center">
                                        <div className="bg-white p-3 rounded w-full shadow-sm h-full">
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

          
        </div>
    );
};

export default DashboardComponents;