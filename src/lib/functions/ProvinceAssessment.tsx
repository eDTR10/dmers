import {
    getLGUData,
    CAMIGUIN_LGUS,
    MISOR_LGUS,
    calculateAverage,
    Data,
} from './Referenced';

// Types for detailed assessment data
export interface DetailedAssessmentData {
    digitalSkills: {
        overall: number;
        questions: { question: string; score: number }[];
        topPerforming: string;
        bottomPerforming: string;
    };
    technologyReadiness: {
        overall: number;
        dimensions: { dimension: string; score: number }[];
        highestDimension: { dimension: string; score: number };
        lowestDimension: { dimension: string; score: number };
    };
    itReadiness: {
        overall: number;
        categories: { category: string; score: number }[];
        topCategories: { category: string; score: number }[];
        bottomCategories: { category: string; score: number }[];
    };
    changeManagement: {
        overall: number;
        categories: { category: string; score: number }[];
        topCategories: { category: string; score: number }[];
        bottomCategories: { category: string; score: number }[];
    };
    lgusData: {
        lguName: string;
        overallScore: number;
        digitalSkills: number;
        techReadiness: number;
        itReadiness: number;
        changeManagement: number;
    }[];
}

// Add interface for maturity scores
export interface MaturityScoreData {
    digitalSkills: number;
    techReadiness: number;
    itReadiness: number;
    changeManagement: number;
    overallScore: number;
}

// Function to get province maturity scores (matching the calculation logic in Maturity.tsx)
export const getProvinceMaturityScores = (provinceName: 'Misor' | 'Camiguin'): MaturityScoreData => {
    const lguList = provinceName === 'Misor' ? MISOR_LGUS : CAMIGUIN_LGUS;

    // Define name variations mapping specifically for Misor LGUs
    const misorNameVariations: Record<string, string[]> = {
        "EL SALVADOR CITY": ["EL SALVADOR", "EL SALVADOR CITY"],
        "KINOGUITAN": ["KINOGUITAN", "KINUGUITAN"]
    };

    // Get all offices for this province with enhanced matching for Misor
    const allOffices = lguList.flatMap(lgu => {
        // If it's Misor and we have variations for this LGU name, use them for matching
        if (provinceName === 'Misor' && misorNameVariations[lgu]) {
            const variations = misorNameVariations[lgu];
            return [
                ...Data["Mayors Office"] || [],
                ...Data["IT Office"] || [],
                ...Data["HR Office"] || [],
                ...Data["Other Offices"] || []
            ].filter(office => variations.includes(office["LGU Name"]));
        } else {
            // Regular exact matching for other cases
            return [
                ...Data["Mayors Office"] || [],
                ...Data["IT Office"] || [],
                ...Data["HR Office"] || [],
                ...Data["Other Offices"] || []
            ].filter(office => office["LGU Name"] === lgu);
        }
    });

    console.log(`Found ${allOffices.length} total office records for ${provinceName}`);

    // DIGITAL SKILLS ASSESSMENT - Using the exact same code as Maturity.tsx
    const processDigitalSkillsData = () => {
        const skillsScores = Array.from({ length: 10 }, (_, questionIndex) => {
            const key = `Question ${questionIndex + 1} DigitalSkillsAssessment`;

            // Collect all responses for this question across all offices
            const responses = allOffices
                .map(office => Number(office[key] || 0))
                .filter(value => !isNaN(value));

            // Calculate score using the same method as Maturity.tsx
            const total = responses.reduce((sum, value) => sum + value, 0);
            const maxPossible = responses.length * 5;
            return responses.length > 0 ? (total / maxPossible) * 100 : 0;
        });

        // Calculate overall percentage exactly like Maturity.tsx
        return calculateAverage(skillsScores);
    };

    // TECHNOLOGY READINESS INDEX - Using the exact same code as Maturity.tsx
    const processTRIData = () => {
        // Helper function to calculate TRI scores exactly like Maturity.tsx
        const calculateTRIScore = (category: string, questionCount: number) => {
            // Get all responses for this category across all offices
            const responses = allOffices.flatMap(office => {
                return Array.from({ length: questionCount }, (_, i) => {
                    const key = `${category} ${i + 1}`;
                    return Number(office[key] || 0);
                });
            }).filter(value => !isNaN(value));

            // Calculate score exactly like Maturity.tsx
            const total = responses.reduce((sum, value) => sum + value, 0);
            const maxPossible = responses.length * 5;
            return responses.length > 0 ? (total / maxPossible) * 100 : 0;
        };

        // Calculate scores for each category
        const optimismScore = calculateTRIScore('Optimism', 10);
        const innovativenessScore = calculateTRIScore('Innovativeness', 7);
        const discomfortScore = calculateTRIScore('Discomfort', 10);
        const insecurityScore = calculateTRIScore('Insecurity', 9);

        // Calculate final TRI score exactly like Maturity.tsx
        return (
            optimismScore +
            innovativenessScore +
            discomfortScore +
            insecurityScore
        ) / 4;
    };

    // IT READINESS ASSESSMENT - Using the exact same code as Maturity.tsx
    const processITReadinessData = () => {
        // Define categories and their questions - exactly as in Maturity.tsx
        const categories = {
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

        const categoryScores = Object.entries(categories).map(([category, keys]) => {
            const validValues: number[] = [];

            keys.forEach(key => {
                allOffices.forEach(office => {
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

        return categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;
    };

    // ICT CHANGE MANAGEMENT - Using the exact same code as Maturity.tsx
    const processICTChangeData = () => {
        const categories = {
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

        const categoryScores = Object.entries(categories).map(([category, keys]) => {
            const validValues: number[] = [];

            keys.forEach(key => {
                allOffices.forEach(office => {
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

        return categoryScores.reduce((sum, cat) => sum + cat.score, 0) / categoryScores.length;
    };

    // Calculate all scores using the exact methods from Maturity.tsx
    const digitalSkillsPercentage = processDigitalSkillsData();
    const triPercentage = processTRIData();
    const itReadinessPercentage = processITReadinessData();
    const ictChangePercentage = processICTChangeData();

    // Calculate total score (average of all four categories) - exactly as in Maturity.tsx
    const totalScore = (
        digitalSkillsPercentage +
        triPercentage +
        itReadinessPercentage +
        ictChangePercentage
    ) / 4;

    // Also clean up MISOR_LGUS in Referenced.tsx to remove the duplicate "KINUGUITAN" entry
    // That will ensure consistent province-wide calculations

    return {
        digitalSkills: digitalSkillsPercentage,
        techReadiness: triPercentage,
        itReadiness: itReadinessPercentage,
        changeManagement: ictChangePercentage,
        overallScore: totalScore
    };
};

// Helper function to calculate percentage score from responses - exact copy from Maturity.tsx
const calculatePercentageScore = (responses: number[]) => {
    if (responses.length === 0) return 0;

    const totalResponses = responses.length;
    const totalPossibleScore = totalResponses * 5; // Maximum score of 5 per response
    const actualScore = responses.reduce((sum, value) => sum + value, 0);

    // Return percentage: (actualScore / totalPossibleScore) × 100
    return (actualScore / totalPossibleScore) * 100;
};

// Function to calculate detailed TRI dimensions
const calculateDetailedTRI = (offices: any[]) => {
    const triDimensions = {
        'Optimism': Array.from({ length: 10 }, (_, i) => `Optimism ${i + 1}`),
        'Innovativeness': Array.from({ length: 7 }, (_, i) => `Innovativeness ${i + 1}`),
        'Discomfort': Array.from({ length: 10 }, (_, i) => `Discomfort ${i + 1}`),
        'Insecurity': Array.from({ length: 9 }, (_, i) => `Insecurity ${i + 1}`)
    };

    const dimensionScores = Object.entries(triDimensions).map(([dimension, keys]) => {
        const responses = offices.flatMap(office => {
            return keys.map(key => Number(office[key] || 0)).filter(value => !isNaN(value));
        });

        const total = responses.reduce((sum, value) => sum + value, 0);
        const maxPossible = responses.length * 5;
        const score = (total / maxPossible) * 100;

        return {
            dimension,
            score: Math.round(score * 100) / 100
        };
    });

    const overall = calculateAverage(dimensionScores.map(dim => dim.score));
    const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);

    return {
        overall: Math.round(overall * 100) / 100,
        dimensions: dimensionScores,
        highestDimension: sorted[0],
        lowestDimension: sorted[sorted.length - 1]
    };
};

// Modified to use data from all offices instead of just IT offices
const calculateDetailedITReadiness = (allOffices: any[]) => {
    const itReadinessCategories = {
        "Basic IT Readiness": Array.from({ length: 4 }, (_, i) => `BASIC IT READINESS ${i + 1}`),
        "IT Governance": Array.from({ length: 3 }, (_, i) => `IT GOVERNANCE FRAMEWORK & POLICIES ${i + 1}`),
        "IT Strategy": Array.from({ length: 3 }, (_, i) => `IT STRATEGY AND ALIGNMENT ${i + 1}`),
        "IT Policies": Array.from({ length: 3 }, (_, i) => `IT POLICIES AND PROCEDURES ${i + 1}`),
        "Risk Management": Array.from({ length: 3 }, (_, i) => `RISK MANAGEMENT ${i + 1}`),
        "Performance Measurement": Array.from({ length: 3 }, (_, i) => `IT PERFORMANCE MEASUREMENT AND REPORTING ${i + 1}`),
        "IT Investment Management": Array.from({ length: 3 }, (_, i) => `IT INVESTMENT MANAGEMENT ${i + 1}`),
        "Vendor Management": Array.from({ length: 3 }, (_, i) => `VENDOR MANAGEMENT ${i + 1}`),
        "IT Security": Array.from({ length: 3 }, (_, i) => `IT SECURITY AND COMPLIANCE ${i + 1}`),
        "ICT Organization": Array.from({ length: 3 }, (_, i) => `ICT Organizational Structure and Skills ${i + 1}`),
        "Audit & Assurance": Array.from({ length: 3 }, (_, i) => `Audit and Assurance ${i + 1}`),
        "Network Infrastructure": Array.from({ length: 2 }, (_, i) => `Network Infrastructure ${i + 1}`),
        "Servers and Storage": Array.from({ length: 3 }, (_, i) => `Servers and Storage ${i + 1}`),
        "Virtualization": Array.from({ length: 3 }, (_, i) => `Virtualization ${i + 1}`),
        "Data Backup": Array.from({ length: 3 }, (_, i) => `Data Backup and Recovery ${i + 1}`),
        "Scalability": Array.from({ length: 3 }, (_, i) => `Scalability and Elasticity ${i + 1}`),
        "Security Measures": Array.from({ length: 4 }, (_, i) => `Security Measures ${i + 1}`),
        "Monitoring": Array.from({ length: 3 }, (_, i) => `Monitoring and Performance ${i + 1}`),
        "Compliance": Array.from({ length: 3 }, (_, i) => `Compliance and Governance ${i + 1}`),
        "Integration": Array.from({ length: 3 }, (_, i) => `Integration and Interoperability ${i + 1}`),
        "Disaster Recovery": Array.from({ length: 3 }, (_, i) => `Disaster Recovery and Business Continuity ${i + 1}`)
    };

    const categoryScores: { category: string; score: number }[] = [];

    Object.entries(itReadinessCategories).forEach(([category, keys]) => {
        const validValues: number[] = [];

        keys.forEach(key => {
            allOffices.forEach(office => {
                if (office && office[key] !== undefined && office[key] !== null) {
                    validValues.push(parseFloat(office[key]) || 0);
                }
            });
        });

        if (validValues.length > 0) {
            const score = calculatePercentageScore(validValues);
            categoryScores.push({
                category,
                score: Math.round(score * 100) / 100
            });
        }
    });

    // Calculate overall score
    const overall = categoryScores.length > 0
        ? calculateAverage(categoryScores.map(item => item.score))
        : 0;

    // Get top 3 and bottom 3 categories
    const sortedCategories = [...categoryScores].sort((a, b) => b.score - a.score);
    const topCount = Math.min(3, sortedCategories.length);
    const bottomCount = Math.min(3, sortedCategories.length);

    const topCategories = sortedCategories.slice(0, topCount);
    const bottomCategories = sortedCategories.slice(-bottomCount).reverse();

    return {
        overall: Math.round(overall * 100) / 100,
        categories: categoryScores,
        topCategories,
        bottomCategories
    };
};

// Modified to use data from all offices instead of just IT offices
const calculateDetailedChangeManagement = (allOffices: any[]) => {
    const changeManagementCategories = {
        "Change Readiness": Array.from({ length: 3 }, (_, i) => `CHANGE READINESS ${i + 1}`),
        "Change Leadership": Array.from({ length: 2 }, (_, i) => `CHANGE LEADERSHIP ${i + 1}`),
        "Change Communication": Array.from({ length: 3 }, (_, i) => `CHANGE COMMUNICATION ${i + 1}`),
        "Impact Assessment": Array.from({ length: 3 }, (_, i) => `CHANGE IMPACT ASSESSMENT ${i + 1}`),
        "Stakeholder Engagement": Array.from({ length: 3 }, (_, i) => `STAKEHOLDER ENGAGEMENT ${i + 1}`),
        "Planning & Execution": Array.from({ length: 3 }, (_, i) => `CHANGE PLANNING AND EXECUTION ${i + 1}`),
        "Training": Array.from({ length: 3 }, (_, i) => `TRAINING AND DEVELOPMENT ${i + 1}`),
        "Resistance Management": Array.from({ length: 3 }, (_, i) => `Resistance Management ${i + 1}`),
        "Evaluation": Array.from({ length: 3 }, (_, i) => `Evaluation and Continuous Improvement ${i + 1}`),
        "Sustainability": Array.from({ length: 3 }, (_, i) => `Sustainability and Embedding ${i + 1}`),
        "Financial Management": Array.from({ length: 5 }, (_, i) => `Costs or Financial ${i + 1}`)
    };

    const categoryScores: { category: string; score: number }[] = [];

    Object.entries(changeManagementCategories).forEach(([category, keys]) => {
        const validValues: number[] = [];

        keys.forEach(key => {
            allOffices.forEach(office => {
                if (office && office[key] !== undefined && office[key] !== null) {
                    validValues.push(parseFloat(office[key]) || 0);
                }
            });
        });

        if (validValues.length > 0) {
            const score = calculatePercentageScore(validValues);
            categoryScores.push({
                category,
                score: Math.round(score * 100) / 100
            });
        }
    });

    // Calculate overall score
    const overall = categoryScores.length > 0
        ? calculateAverage(categoryScores.map(item => item.score))
        : 0;

    // Get top 3 and bottom 3 categories
    const sortedCategories = [...categoryScores].sort((a, b) => b.score - a.score);
    const topCount = Math.min(3, sortedCategories.length);
    const bottomCount = Math.min(3, sortedCategories.length);

    const topCategories = sortedCategories.slice(0, topCount);
    const bottomCategories = sortedCategories.slice(-bottomCount).reverse();

    return {
        overall: Math.round(overall * 100) / 100,
        categories: categoryScores,
        topCategories,
        bottomCategories
    };
};

// Function to calculate detailed Digital Skills Assessment
const calculateDetailedDigitalSkills = (offices: any[]) => {
    const digitalSkillsQuestions = [
        "Basic computer skills (e.g., file management, software use)",
        "Email and online communication",
        "Internet research and information retrieval",
        "Basic data entry and management",
        "Using office productivity software",
        "Digital collaboration and file sharing",
        "Basic cybersecurity awareness",
        "Mobile device proficiency",
        "Social media literacy for government service",
        "Problem-solving with technology"
    ];

    const questionScores = digitalSkillsQuestions.map((question, index) => {
        const key = `Question ${index + 1} DigitalSkillsAssessment`;
        const responses = offices
            .map(office => Number(office[key] || 0))
            .filter(value => !isNaN(value));

        const total = responses.reduce((sum, value) => sum + value, 0);
        const maxPossible = responses.length * 5;
        const score = responses.length > 0 ? (total / maxPossible) * 100 : 0;

        return {
            question,
            score: Math.round(score * 100) / 100
        };
    });

    // Get overall score and identify top/bottom performing areas
    const overall = calculateAverage(questionScores.map(q => q.score));
    const sorted = [...questionScores].sort((a, b) => b.score - a.score);
    const topPerforming = sorted[0].question;
    const bottomPerforming = sorted[sorted.length - 1].question;

    return {
        overall: Math.round(overall * 100) / 100,
        questions: questionScores,
        topPerforming,
        bottomPerforming
    };
};

// Main function to get detailed province assessment data
export const getDetailedProvinceAssessment = (provinceName: 'Misor' | 'Camiguin'): DetailedAssessmentData => {
    const lguList = provinceName === 'Misor' ? MISOR_LGUS : CAMIGUIN_LGUS;

    // Define name variations mapping specifically for Misor LGUs
    const misorNameVariations: Record<string, string[]> = {
        "EL SALVADOR CITY": ["EL SALVADOR", "EL SALVADOR CITY"],
        "KINOGUITAN": ["KINOGUITAN", "KINUGUITAN"]
    };

    // Get all LGU data with scores
    const lgusData = lguList
        .map(lgu => {
            const data = getLGUData(lgu);
            return {
                lguName: lgu,
                overallScore: data?.score ?? 0,
                digitalSkills: data?.digitalSkills ?? 0,
                techReadiness: data?.techReadiness ?? 0,
                itReadiness: data?.itReadiness ?? 0,
                changeManagement: data?.changeManagement ?? 0
            };
        })
        .filter((data: any) => data.overallScore > 0);

    // Get all offices for this province with enhanced matching for Misor
    const allOffices = lguList.flatMap(lgu => {
        // If it's Misor and we have variations for this LGU name, use them for matching
        if (provinceName === 'Misor' && misorNameVariations[lgu]) {
            const variations = misorNameVariations[lgu];
            return [
                ...Data["Mayors Office"] || [],
                ...Data["IT Office"] || [],
                ...Data["HR Office"] || [],
                ...Data["Other Offices"] || []
            ].filter(office => variations.includes(office["LGU Name"]));
        } else {
            // Regular exact matching for other cases
            return [
                ...Data["Mayors Office"] || [],
                ...Data["IT Office"] || [],
                ...Data["HR Office"] || [],
                ...Data["Other Offices"] || []
            ].filter(office => office["LGU Name"] === lgu);
        }
    });

    // Calculate detailed metrics
    const digitalSkills = calculateDetailedDigitalSkills(allOffices);
    const technologyReadiness = calculateDetailedTRI(allOffices);

    // Use the new calculation methods that consider all offices
    const itReadiness = calculateDetailedITReadiness(allOffices);
    const changeManagement = calculateDetailedChangeManagement(allOffices);

    return {
        digitalSkills,
        technologyReadiness,
        itReadiness,
        changeManagement,
        lgusData
    };
};

// For quick access to both provinces' data
export const getRegionAssessmentData = () => {
    return {
        misor: getDetailedProvinceAssessment('Misor'),
        camiguin: getDetailedProvinceAssessment('Camiguin')
    };
};

// Function to calculate region-wide averages combining both provinces
export const getRegionWideAverages = () => {
    const misor = getDetailedProvinceAssessment('Misor');
    const camiguin = getDetailedProvinceAssessment('Camiguin');

    // Get LGU counts for weighted average calculations
    const misorLGUCount = misor.lgusData.length;
    const camiguinLGUCount = camiguin.lgusData.length;
    const totalLGUs = misorLGUCount + camiguinLGUCount;

    if (totalLGUs === 0) return null;

    // Calculate weighted average for digital skills questions
    const digitalSkillsQuestions = misor.digitalSkills.questions.map((q, i) => {
        const misorScore = q.score;
        const camiguinScore = camiguin.digitalSkills.questions[i].score;

        return {
            question: q.question,
            score: ((misorScore * misorLGUCount) + (camiguinScore * camiguinLGUCount)) / totalLGUs
        };
    });

    // Sort to find top and bottom performing areas region-wide
    const sortedDigitalSkills = [...digitalSkillsQuestions].sort((a, b) => b.score - a.score);

    // Calculate weighted averages for technology readiness dimensions
    const technologyReadinessDimensions = misor.technologyReadiness.dimensions.map((dim) => {
        const misorScore = dim.score;
        const camiguinDim = camiguin.technologyReadiness.dimensions.find(d => d.dimension === dim.dimension);
        const camiguinScore = camiguinDim ? camiguinDim.score : 0;

        return {
            dimension: dim.dimension,
            score: ((misorScore * misorLGUCount) + (camiguinScore * camiguinLGUCount)) / totalLGUs
        };
    });

    // Sort to find highest and lowest dimensions region-wide
    const sortedTRIDimensions = [...technologyReadinessDimensions].sort((a, b) => b.score - a.score);

    // Calculate weighted averages for IT readiness categories
    const itReadinessCategories = misor.itReadiness.categories.map((cat) => {
        const misorScore = cat.score;
        const camiguinCat = camiguin.itReadiness.categories.find(c => c.category === cat.category);
        const camiguinScore = camiguinCat ? camiguinCat.score : 0;

        return {
            category: cat.category,
            score: ((misorScore * misorLGUCount) + (camiguinScore * camiguinLGUCount)) / totalLGUs
        };
    });

    // Sort to find top and bottom IT readiness categories
    const sortedITCategories = [...itReadinessCategories].sort((a, b) => b.score - a.score);

    // Calculate weighted averages for change management categories
    const changeManagementCategories = misor.changeManagement.categories.map((cat) => {
        const misorScore = cat.score;
        const camiguinCat = camiguin.changeManagement.categories.find(c => c.category === cat.category);
        const camiguinScore = camiguinCat ? camiguinCat.score : 0;

        return {
            category: cat.category,
            score: ((misorScore * misorLGUCount) + (camiguinScore * camiguinLGUCount)) / totalLGUs
        };
    });

    // Sort to find top and bottom change management categories
    const sortedCMCategories = [...changeManagementCategories].sort((a, b) => b.score - a.score);

    // Calculate the overall scores for each main category
    const digitalSkillsOverall = calculateAverage(digitalSkillsQuestions.map(q => q.score));
    const technologyReadinessOverall = calculateAverage(technologyReadinessDimensions.map(d => d.score));
    const itReadinessOverall = calculateAverage(itReadinessCategories.map(c => c.score));
    const changeManagementOverall = calculateAverage(changeManagementCategories.map(c => c.score));

    // Calculate overall region-wide score
    const overallScore = [
        digitalSkillsOverall,
        technologyReadinessOverall,
        itReadinessOverall,
        changeManagementOverall
    ].reduce((sum, val) => sum + val, 0) / 4;

    return {
        overallScore: Math.round(overallScore * 100) / 100,
        categoriesOverall: {
            digitalSkills: Math.round(digitalSkillsOverall * 100) / 100,
            technologyReadiness: Math.round(technologyReadinessOverall * 100) / 100,
            itReadiness: Math.round(itReadinessOverall * 100) / 100,
            changeManagement: Math.round(changeManagementOverall * 100) / 100
        },
        digitalSkills: {
            overall: Math.round(digitalSkillsOverall * 100) / 100,
            questions: digitalSkillsQuestions,
            topPerforming: sortedDigitalSkills[0].question,
            bottomPerforming: sortedDigitalSkills[sortedDigitalSkills.length - 1].question
        },
        technologyReadiness: {
            overall: Math.round(technologyReadinessOverall * 100) / 100,
            dimensions: technologyReadinessDimensions,
            highestDimension: sortedTRIDimensions[0],
            lowestDimension: sortedTRIDimensions[sortedTRIDimensions.length - 1]
        },
        itReadiness: {
            overall: Math.round(itReadinessOverall * 100) / 100,
            categories: itReadinessCategories,
            topCategories: sortedITCategories.slice(0, 3),
            bottomCategories: sortedITCategories.slice(-3).reverse()
        },
        changeManagement: {
            overall: Math.round(changeManagementOverall * 100) / 100,
            categories: changeManagementCategories,
            topCategories: sortedCMCategories.slice(0, 3),
            bottomCategories: sortedCMCategories.slice(-3).reverse()
        },
        totalLGUs
    };
};