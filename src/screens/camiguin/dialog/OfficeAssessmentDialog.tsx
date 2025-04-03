import React, { useMemo } from 'react';

interface OfficeAssessmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item?: {
        sectionTitle: string;
        itemTitle: string;
        score: number;
        index: number;
    };
    detailedScores?: any;
    lguAssessmentData?: any;
    officeBreakdown?: {
        offices: string[];
        officeEntries: Record<string, any[]>;
    };
}

const OfficeAssessmentDialog: React.FC<OfficeAssessmentDialogProps> = ({
    isOpen,
    onClose,
    item,
    officeBreakdown
}) => {
    if (!isOpen || !item) return null;

    const allOffices = officeBreakdown?.officeEntries?.["All Offices"] || [];

    // Get unique province and LGU name
    const province = allOffices.length > 0 ? allOffices[0].Province || 'Unknown' : 'Unknown';
    const lguName = allOffices.length > 0 ? allOffices[0]["LGU Name"] || 'Unknown' : 'Unknown';

    // Group offices by type with detailed breakdown of "Other Offices"
    const officeGroups = useMemo(() => {
        // First, categorize into main groups
        const mainGroups: Record<string, any[]> = {
            "Mayor's Office": [],
            "IT Office": [],
            "HR Office": []
        };

        // Other offices will be grouped by their actual office name
        const otherOffices: Record<string, any[]> = {};

        allOffices.forEach(office => {
            // Use "Office Name" property instead of "Office"
            const officeType = office["Office Name"] || "Unknown";

            // Check for main categories first
            if (officeType?.toLowerCase().includes("mayor")) {
                mainGroups["Mayor's Office"].push(office);
            } else if (officeType?.toLowerCase().includes("it") ||
                officeType?.toLowerCase().includes("information technology") ||
                officeType?.toLowerCase().includes("computer")) {
                mainGroups["IT Office"].push(office);
            } else if (officeType?.toLowerCase().includes("hr") ||
                officeType?.toLowerCase().includes("human resource") ||
                officeType?.toLowerCase().includes("personnel")) {
                mainGroups["HR Office"].push(office);
            } else {
                // Group by actual office name for "Other Offices"
                if (!otherOffices[officeType]) {
                    otherOffices[officeType] = [];
                }
                otherOffices[officeType].push(office);
            }
        });

        // Combine main groups and other offices
        return { ...mainGroups, ...otherOffices };
    }, [allOffices]);

    // Calculate score per office type for the selected assessment
    const calculateOfficeTypeScore = (offices: any[]) => {
        if (!offices.length) return 0;

        let totalScore = 0;
        let count = 0;

        offices.forEach((office: { [x: string]: any; }) => {
            let score = 0;

            // Get score based on assessment type
            if (item.sectionTitle === "DIGITAL SKILLS ASSESSMENT") {
                const key = `Question ${item.index + 1} DigitalSkillsAssessment`;
                score = office[key] ? ((Number(office[key]) - 1) / 5) * 100 : 0;
            } else if (item.sectionTitle === "TECHNOLOGY READINESS INDEX") {
                const categories = ["OPTIMISM", "INNOVATIVENESS", "DISCOMFORT", "INSECURITY"];
                const category = categories[item.index];

                if (category === "OPTIMISM") {
                    const keys = Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`);
                    const values = keys.map(key => office[key] || 0);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    score = ((avg - 1) / 5) * 100;
                } else if (category === "INNOVATIVENESS") {
                    const keys = Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`);
                    const values = keys.map(key => office[key] || 0);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    score = ((avg - 1) / 5) * 100;
                } else if (category === "DISCOMFORT") {
                    const keys = Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`);
                    const values = keys.map(key => office[key] || 0);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    score = ((avg - 1) / 5) * 100;
                } else if (category === "INSECURITY") {
                    const keys = Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`);
                    const values = keys.map(key => office[key] || 0);
                    const avg = values.reduce((a, b) => a + b, 0) / values.length;
                    score = ((avg - 1) / 5) * 100;
                }
            }

            if (score > 0) {
                totalScore += score;
                count++;
            }
        });

        return count > 0 ? totalScore / count : 0;
    };

    // Get scores for all office types
    const officeScores = useMemo(() => {
        const scores: Record<string, number> = {};

        Object.entries(officeGroups).forEach(([officeType, offices]) => {
            scores[officeType] = calculateOfficeTypeScore(offices);
        });

        return scores;
    }, [officeGroups, item?.sectionTitle, item?.index]);

    // Separate main offices and other offices for display
    const mainOffices = ["Mayor's Office", "IT Office", "HR Office"];
    const otherOfficeEntries = Object.entries(officeGroups).filter(
        ([officeType]) => !mainOffices.includes(officeType)
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#0036C5]">{item.itemTitle}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Province</div>
                            <div className="font-medium">{province}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">LGU Name</div>
                            <div className="font-medium">{lguName}</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Section</div>
                        <div className="font-medium">{item.sectionTitle}</div>
                    </div>

                    <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">Overall Score</div>
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#0036C5] text-white font-bold text-xl mr-4">
                                {item.score?.toFixed(2)}%
                            </div>
                            <div>
                                {item.score >= 80 && <span className="text-green-600 font-medium">Excellent</span>}
                                {item.score >= 60 && item.score < 80 && <span className="text-blue-600 font-medium">Good</span>}
                                {item.score >= 40 && item.score < 60 && <span className="text-yellow-600 font-medium">Average</span>}
                                {item.score < 40 && <span className="text-red-600 font-medium">Needs Improvement</span>}
                            </div>
                        </div>
                    </div>

                    {/* Main offices breakdown section */}
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold text-lg mb-3">Main Offices</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">Office Type</th>
                                        <th className="px-4 py-2 border">No. of Responses</th>
                                        <th className="px-4 py-2 border">Score (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mainOffices.map((officeType, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                            <td className="px-4 py-2 border">{officeType}</td>
                                            <td className="px-4 py-2 border text-center">
                                                {officeGroups[officeType]?.length || 0}
                                            </td>
                                            <td className="px-4 py-2 border text-center">
                                                {(officeGroups[officeType]?.length || 0) > 0
                                                    ? officeScores[officeType]?.toFixed(2) + '%'
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Other offices breakdown section */}
                    {otherOfficeEntries.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-3">Other Offices</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Office Name</th>
                                            <th className="px-4 py-2 border">No. of Responses</th>
                                            <th className="px-4 py-2 border">Score (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {otherOfficeEntries.map(([officeType, offices], idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                                <td className="px-4 py-2 border">{officeType}</td>
                                                <td className="px-4 py-2 border text-center">{offices.length}</td>
                                                <td className="px-4 py-2 border text-center">
                                                    {offices.length > 0
                                                        ? officeScores[officeType]?.toFixed(2) + '%'
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficeAssessmentDialog;