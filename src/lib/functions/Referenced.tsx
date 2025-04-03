import rawData from './../../assets/data/eReadinessSurveyData.json';
export const Data: any = rawData;

// Helper functions
export const calculateAverage = (values: number[]) => {
    const validValues = values.filter(val => val !== null && val !== undefined);
    return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};

export const calculatePercentageScore = (responses: number[]) => {
    const validResponses = responses.filter(val => val !== null && val !== undefined);
    if (validResponses.length === 0) return 0;

    const totalPossibleScore = validResponses.length * 5; // Maximum score of 5 per response
    const actualScore = validResponses.reduce((sum, value) => sum + value, 0);
    return (actualScore / totalPossibleScore) * 100;
};

// Get all offices for a specific LGU
export const getLGUOffices = (lguName: string) => {
    if (!lguName) return [];

    return [
        ...Data["Mayors Office"] || [],
        ...Data["IT Office"] || [],
        ...Data["HR Office"] || [],
        ...Data["Other Offices"] || []
    ].filter(office => office["LGU Name"] === lguName);
};

// Extracted Digital Skills Assessment calculation
export const calculateDigitalSkillsAssessment = (officesData: any[]) => {
    // Digital Skills Assessment calculation
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

    // Calculate the average score across all questions
    const digitalSkillsAvg = calculateAverage(digitalSkillsScores);

    return {
        percentage: digitalSkillsAvg,
        data: digitalSkillsScores,
        labels: Array.from({ length: 10 }, (_, i) => `Question ${i + 1}`)
    };
};

// Function to get digital skills average for a specific LGU
export const getLGUDigitalSkillsAverage = (lguName: string) => {
    if (!lguName) return 0;

    // Get all offices for this LGU
    const offices = getLGUOffices(lguName);

    // If we found offices for this LGU, calculate the digital skills average
    if (offices.length > 0) {
        const digitalSkillsResult = calculateDigitalSkillsAssessment(offices);
        return Math.round(digitalSkillsResult.percentage * 100) / 100;
    }

    return 0;
};

// Calculate Technology Readiness Index
export const calculateTechnologyReadinessIndex = (officesData: any[]) => {
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

        const total = responses.reduce((sum, value) => sum + value, 0);
        const maxPossible = responses.length * 5;
        return {
            category,
            score: (total / maxPossible) * 100
        };
    });

    const techReadinessAvg = calculateAverage(triScores.map(cat => cat.score));

    return {
        percentage: techReadinessAvg,
        data: triScores.map(cat => cat.score),
        labels: triScores.map(cat => cat.category)
    };
};

// Calculate IT Readiness Assessment
export const calculateITReadinessAssessment = (itOfficeData: any) => {
    if (!itOfficeData) return {
        percentage: 0,
        data: [],
        labels: []
    };

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
    const itReadinessAvg = totalScore / Object.keys(itReadinessCategories).length;

    return {
        percentage: itReadinessAvg,
        data: itReadinessScores.map(item => item.score),
        labels: itReadinessScores.map(item => item.category)
    };
};

// Calculate Change Management Assessment
export const calculateChangeManagementAssessment = (itOfficeData: any) => {
    if (!itOfficeData) return {
        percentage: 0,
        data: [],
        labels: []
    };

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
    const changeManagementAvg = totalScore / Object.keys(changeManagementCategories).length;

    return {
        percentage: changeManagementAvg,
        data: changeManagementScores.map(item => item.score),
        labels: changeManagementScores.map(item => item.category)
    };
};

// Function to get IT Readiness data for a specific LGU
export const getLGUITReadinessScore = (lguName: string) => {
    if (!lguName) return 0;

    // Find IT Office data for the LGU
    const itOfficeData = Data["IT Office"]?.find((data: any) => data["LGU Name"] === lguName);

    if (itOfficeData) {
        const itReadinessResult = calculateITReadinessAssessment(itOfficeData);
        return Math.round(itReadinessResult.percentage * 100) / 100;
    }

    return 0;
};

// Function to get Change Management data for a specific LGU
export const getLGUChangeManagementScore = (lguName: string) => {
    if (!lguName) return 0;

    // Find IT Office data for the LGU
    const itOfficeData = Data["IT Office"]?.find((data: any) => data["LGU Name"] === lguName);

    if (itOfficeData) {
        const changeManagementResult = calculateChangeManagementAssessment(itOfficeData);
        return Math.round(changeManagementResult.percentage * 100) / 100;
    }

    return 0;
};

// ----------------- NEW FUNCTIONS FROM MATURITY.TSX -----------------

// IT Readiness Assessment calculation (using all offices instead of just IT Office)
export const calculateITReadinessMaturity = (officesData: any[]) => {
    if (!officesData || officesData.length === 0) return {
        percentage: 0,
        data: [],
        labels: []
    };

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

    const categoryScores = Object.entries(itReadinessCategories).map(([category, keys]) => {
        const validValues: number[] = [];

        keys.forEach(key => {
            officesData.forEach((office: any) => {
                if (office && office[key] !== undefined && office[key] !== null) {
                    validValues.push(parseFloat(office[key]) || 0);
                }
            });
        });

        return {
            category,
            score: calculatePercentageScore(validValues)
        };
    });

    const overallPercentage = categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;

    return {
        percentage: overallPercentage,
        data: categoryScores.map(cat => cat.score),
        labels: categoryScores.map(cat => cat.category)
    };
};

// ICT Change Management calculation (using all offices instead of just IT Office)
export const calculateICTChangeManagementMaturity = (officesData: any[]) => {
    if (!officesData || officesData.length === 0) return {
        percentage: 0,
        data: [],
        labels: []
    };

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

    const categoryScores = Object.entries(changeManagementCategories).map(([category, keys]) => {
        const validValues: number[] = [];

        keys.forEach(key => {
            officesData.forEach((office: any) => {
                if (office && office[key] !== undefined && office[key] !== null) {
                    validValues.push(parseFloat(office[key]) || 0);
                }
            });
        });

        return {
            category,
            score: calculatePercentageScore(validValues)
        };
    });

    const overallPercentage = categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;

    return {
        percentage: overallPercentage,
        data: categoryScores.map(cat => cat.score),
        labels: categoryScores.map(cat => cat.category)
    };
};

// Function to get IT Readiness score for a LGU using Maturity approach
export const getLGUITReadinessScoreMaturity = (lguName: string) => {
    if (!lguName) return 0;

    // Get all offices for the LGU
    const lguOffices = getLGUOffices(lguName);

    if (lguOffices.length === 0) return 0;

    const itReadinessResult = calculateITReadinessMaturity(lguOffices);
    return Math.round(itReadinessResult.percentage * 100) / 100;
};

// Function to get ICT Change Management score for a LGU using Maturity approach
export const getLGUChangeManagementScoreMaturity = (lguName: string) => {
    if (!lguName) return 0;

    // Get all offices for the LGU
    const lguOffices = getLGUOffices(lguName);

    if (lguOffices.length === 0) return 0;

    const changeManagementResult = calculateICTChangeManagementMaturity(lguOffices);
    return Math.round(changeManagementResult.percentage * 100) / 100;
};

// Calculate and return comprehensive data for any LGU
export const getLGUData = (lguName: string) => {
    if (!lguName) return null;

    // Get all offices for the specified LGU
    const offices = getLGUOffices(lguName);

    if (offices.length === 0) {
        return {
            name: lguName,
            score: 0,
            digitalSkills: 0,
            techReadiness: 0,
            itReadiness: 0,
            changeManagement: 0
        };
    }

    // Find IT Office data for the LGU
    // const itOfficeData: any = Data["IT Office"]?.find((data: any) => data["LGU Name"] === lguName);

    // Calculate Digital Skills
    const digitalSkillsResult = calculateDigitalSkillsAssessment(offices);
    const digitalSkillsAvg = digitalSkillsResult.percentage;

    // Calculate Tech Readiness
    const techReadinessResult = calculateTechnologyReadinessIndex(offices);
    const techReadinessAvg = techReadinessResult.percentage;

    // Calculate IT Readiness and Change Management using Maturity approach (all offices)
    // This replaces the previous approach that only used IT Office data
    const itReadinessAvg = calculateITReadinessMaturity(offices).percentage;
    const changeManagementAvg = calculateICTChangeManagementMaturity(offices).percentage;

    const totalScore = (digitalSkillsAvg + techReadinessAvg + itReadinessAvg + changeManagementAvg) / 4;

    return {
        name: lguName,
        score: Math.round(totalScore * 100) / 100,
        digitalSkills: Math.round(digitalSkillsAvg * 100) / 100,
        techReadiness: Math.round(techReadinessAvg * 100) / 100,
        itReadiness: Math.round(itReadinessAvg * 100) / 100,
        changeManagement: Math.round(changeManagementAvg * 100) / 100
    };
};

// For backward compatibility - redirects to the more general function
export const getCatarmanData = () => {
    return getLGUData("CATARMAN");
};

export const CAMIGUIN_LGUS = ["CATARMAN", "SAGAY", "MAHINOG", "MAMBAJAO", "GUINSILIBAN"];
export const MISOR_LGUS = ["ALUBIJID", "BALINGASAG", "BALINGOAN", "BINUANGAN", "CLAVERIA",
    "EL SALVADOR CITY", "GINGOOG", "GITAGUM", "INITAO", "JASAAN", "KINOGUITAN", "LAGONGLONG",
    "LAGUINDINGAN", "LIBERTAD", "LUGAIT", "MAGSAYSAY", "MANTICAO", "MEDINA", "NAAWAN",
    "OPOL", "SALAY", "SUGBONGCOGON", "TAGOLOAN", "TALISAYAN", "VILLANUEVA"];

// Function to calculate average scores for all LGUs in a province
export const getProvinceAverageScores = (lguList: string[]) => {
    // Skip LGUs with no data
    const lgusWithData = lguList.map(lgu => getLGUData(lgu)).filter(data => data && data.score > 0);

    if (lgusWithData.length === 0) {
        return {
            score: 0,
            digitalSkills: 0,
            techReadiness: 0,
            itReadiness: 0,
            changeManagement: 0,
            lguCount: 0
        };
    }

    // Calculate averages across all categories
    const score = calculateAverage(lgusWithData.map((lgu): any => lgu?.score));
    const digitalSkills = calculateAverage(lgusWithData.map((lgu): any => lgu?.digitalSkills));
    const techReadiness = calculateAverage(lgusWithData.map((lgu): any => lgu?.techReadiness));
    const itReadiness = calculateAverage(lgusWithData.map((lgu): any => lgu?.itReadiness));
    const changeManagement = calculateAverage(lgusWithData.map((lgu): any => lgu?.changeManagement));

    return {
        score: Math.round(score * 100) / 100,
        digitalSkills: Math.round(digitalSkills * 100) / 100,
        techReadiness: Math.round(techReadiness * 100) / 100,
        itReadiness: Math.round(itReadiness * 100) / 100,
        changeManagement: Math.round(changeManagement * 100) / 100,
        lguCount: lgusWithData.length
    };
};

// Get average scores for all Camiguin LGUs
export const getCamiguinAverageScores = () => {
    return getProvinceAverageScores(CAMIGUIN_LGUS);
};

// Get average scores for all Misor LGUs
export const getMisorAverageScores = () => {
    return getProvinceAverageScores(MISOR_LGUS);
};