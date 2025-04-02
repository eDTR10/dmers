import Data from "@/assets/data/eReadinessSurveyData.json";

interface SurveyData {
    [key: string]: any[]; // Each section is an array of entries
}

//Getting the Digital Skills Assessment averages for Region 10 (Misor and Camiguin)
export const getRegion10DigitalSkillsQuestionAverages = (provinces: string[] = ["Misor", "Camiguin"]): Record<string, number> => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // All sections to check for Digital Skills Assessment questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Question labels/descriptions
    const questionLabels = [
        "Basic computer skill",
        "Basic Internet searching",
        "General computer or office productivity software use",
        "Use of collaborative platforms",
        "Use of communication apps",
        "Use of social media",
        "Content creation",
        "Cybersecurity awareness",
        "Programming, web, and app development",
        "Digital design and data visualization"
    ];

    // Initialize sums and counts for each question
    const sums = Array(10).fill(0);
    const counts = Array(10).fill(0);

    console.log(`Calculating digital skills averages for provinces: ${provinces.join(", ")}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by provinces
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified provinces
                const entryProvince = entry["Province"] || "";

                if (provinces.includes(entryProvince)) {
                    console.log(`Found entry from province: ${entryProvince} in ${section}`);

                    // Process each question individually
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Question ${i} DigitalSkillsAssessment`;
                        if (entry[questionKey] !== undefined) {
                            sums[i - 1] += Number(entry[questionKey]);
                            counts[i - 1]++;
                        }
                    }
                }
            });
        }
    });

    // Calculate percentages for each question
    const result: Record<string, number> = {};

    for (let i = 0; i < 10; i++) {
        if (counts[i] > 0) {
            const average = sums[i] / counts[i];
            const percentage = (average / 5) * 100;
            result[questionLabels[i]] = Number(percentage.toFixed(2));
        } else {
            result[questionLabels[i]] = 0;
        }
    }

    return result;
};
//TANAN NI SIYA
export const getRegion10DigitalSkillsAverage = (): number => {
    const questionAverages = getRegion10DigitalSkillsQuestionAverages();
    const values = Object.values(questionAverages);

    if (values.length === 0) {
        return 0;
    }

    const sum = values.reduce((total, value) => total + value, 0);
    return Number((sum / values.length).toFixed(2));
};

//Getting the Technology Readiness Index (TRI) for Region 10 (Misor and Camiguin)
export const getProvinceDetailedTRI = (provinces: string[] = ["Misor", "Camiguin"]): {
    overallScore: number;
    dimensions: {
        optimism: {
            score: number;
            questions: Record<string, number>;
        };
        innovativeness: {
            score: number;
            questions: Record<string, number>;
        };
        discomfort: {
            score: number;
            questions: Record<string, number>;
        };
        insecurity: {
            score: number;
            questions: Record<string, number>;
        };
    }
} => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // All sections to check for TRI questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Dimension metadata
    const dimensions = {
        optimism: {
            questionCount: 10,
            isPositive: true, // Higher is better
            sum: 0,
            count: 0,
            questions: {} as Record<string, number>
        },
        innovativeness: {
            questionCount: 7,
            isPositive: true, // Higher is better
            sum: 0,
            count: 0,
            questions: {} as Record<string, number>
        },
        discomfort: {
            questionCount: 10,
            isPositive: false, // Lower is better (will be reversed for scoring)
            sum: 0,
            count: 0,
            questions: {} as Record<string, number>
        },
        insecurity: {
            questionCount: 9,
            isPositive: false, // Lower is better (will be reversed for scoring)
            sum: 0,
            count: 0,
            questions: {} as Record<string, number>
        }
    };

    // For calculating question-level averages
    const questionSums: Record<string, Record<string, number>> = {
        optimism: {},
        innovativeness: {},
        discomfort: {},
        insecurity: {}
    };

    const questionCounts: Record<string, Record<string, number>> = {
        optimism: {},
        innovativeness: {},
        discomfort: {},
        insecurity: {}
    };

    // Track processed entries to avoid duplicates
    const processedEntries = new Set();

    console.log(`Processing detailed TRI for Provinces: ${provinces.join(', ')}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by Province
            typedData[section]?.forEach((entry: any, index: number) => {
                // Create a unique ID for this entry
                const entryId = `${section}-${index}`;
                if (processedEntries.has(entryId)) {
                    return; // Skip already processed entries
                }

                // Check for Province matches - handle multiple provinces
                const entryProvince = entry["Province"] || "";

                // Check if entry belongs to any of the requested provinces
                if (provinces.some(p => p.toUpperCase() === entryProvince.toString().toUpperCase())) {
                    processedEntries.add(entryId);
                    console.log(`Found entry for ${entryProvince} in ${section}[${index}]`);

                    // Process each dimension
                    Object.keys(dimensions).forEach(dimKey => {
                        const dimension = dimensions[dimKey as keyof typeof dimensions];
                        const capitalized = dimKey.charAt(0).toUpperCase() + dimKey.slice(1);

                        // Process each question for this dimension
                        for (let i = 1; i <= dimension.questionCount; i++) {
                            const questionKey = `${capitalized} ${i}`;

                            if (entry[questionKey] !== undefined && entry[questionKey] !== null) {
                                const rawScore = Number(entry[questionKey]);

                                if (!isNaN(rawScore) && rawScore >= 1 && rawScore <= 5) {
                                    // For question-level tracking
                                    if (!questionSums[dimKey][questionKey]) {
                                        questionSums[dimKey][questionKey] = 0;
                                        questionCounts[dimKey][questionKey] = 0;
                                    }
                                    questionSums[dimKey][questionKey] += rawScore;
                                    questionCounts[dimKey][questionKey]++;

                                    // For scoring purposes, invert negative dimensions so higher always means better
                                    const scoreToAdd = dimension.isPositive ? rawScore : (6 - rawScore);
                                    dimension.sum += scoreToAdd;
                                    dimension.count++;
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    // Calculate dimension scores and overall TRI
    const result = {
        overallScore: 0,
        dimensions: {
            optimism: {
                score: 0,
                questions: {} as Record<string, number>
            },
            innovativeness: {
                score: 0,
                questions: {} as Record<string, number>
            },
            discomfort: {
                score: 0,
                questions: {} as Record<string, number>
            },
            insecurity: {
                score: 0,
                questions: {} as Record<string, number>
            }
        }
    };

    // Calculate average score for each question across all responses
    Object.keys(questionSums).forEach(dimKey => {
        Object.keys(questionSums[dimKey]).forEach(questionKey => {
            const sum = questionSums[dimKey][questionKey];
            const count = questionCounts[dimKey][questionKey];

            if (count > 0) {
                result.dimensions[dimKey as keyof typeof result.dimensions].questions[questionKey] =
                    Number((sum / count).toFixed(2));
            }
        });
    });

    let totalScore = 0;
    let dimensionsWithData = 0;

    // Calculate each dimension percentage score
    Object.keys(dimensions).forEach(dimKey => {
        const dim = dimensions[dimKey as keyof typeof dimensions];
        const resultDim = result.dimensions[dimKey as keyof typeof result.dimensions];

        if (dim.count > 0) {
            const average = dim.sum / dim.count;
            const percentage = (average / 5) * 100;
            resultDim.score = Number(percentage.toFixed(2));

            totalScore += percentage;
            dimensionsWithData++;

            console.log(`${dimKey}: ${percentage.toFixed(2)}% (${dim.sum}/${dim.count * 5})`);
        } else {
            resultDim.score = 0;
            console.log(`${dimKey}: No data found`);
        }
    });

    // Calculate overall TRI score
    if (dimensionsWithData > 0) {
        result.overallScore = Number((totalScore / dimensionsWithData).toFixed(2));
    }

    console.log(`Overall TRI Score for ${provinces.join(', ')}: ${result.overallScore}%`);

    return result;
};


export const getRegion10DetailedTRI = (): {
    overallScore: number;
    dimensions: {
        optimism: {
            score: number;
            questions: Record<string, number>;
        };
        innovativeness: {
            score: number;
            questions: Record<string, number>;
        };
        discomfort: {
            score: number;
            questions: Record<string, number>;
        };
        insecurity: {
            score: number;
            questions: Record<string, number>;
        };
    }
} => {
    // Simply use the default parameters of getProvinceDetailedTRI which includes all Region 10 provinces
    return getProvinceDetailedTRI();
};


//Getting the ICT Change Management Index (ICT-CMI) for Region 10 (Misor and Camiguin)
export const getProvinceICTChangeManagementScore = (provinces: string[] = ["Misor", "Camiguin"]): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Sections to check for Change Management questions
    const sections = ["IT Office"];

    // Define the Change Management categories and their respective questions
    const categories = {
        "CHANGE READINESS": ["CHANGE READINESS 1", "CHANGE READINESS 2", "CHANGE READINESS 3"],
        "CHANGE LEADERSHIP": ["CHANGE LEADERSHIP 1", "CHANGE LEADERSHIP 2"],
        "CHANGE COMMUNICATION": ["CHANGE COMMUNICATION 1", "CHANGE COMMUNICATION 2", "CHANGE COMMUNICATION 3"],
        "CHANGE IMPACT ASSESSMENT": ["CHANGE IMPACT ASSESSMENT 1", "CHANGE IMPACT ASSESSMENT 2", "CHANGE IMPACT ASSESSMENT 3"],
        "STAKEHOLDER ENGAGEMENT": ["STAKEHOLDER ENGAGEMENT 1", "STAKEHOLDER ENGAGEMENT 2", "STAKEHOLDER ENGAGEMENT 3"],
        "CHANGE PLANNING AND EXECUTION": ["CHANGE PLANNING AND EXECUTION 1", "CHANGE PLANNING AND EXECUTION 2", "CHANGE PLANNING AND EXECUTION 3"],
        "TRAINING AND DEVELOPMENT": ["TRAINING AND DEVELOPMENT 1", "TRAINING AND DEVELOPMENT 2", "TRAINING AND DEVELOPMENT 3"],
        "RESISTANCE MANAGEMENT": ["Resistance Management 1", "Resistance Management 2", "Resistance Management 3"],
        "EVALUATION AND CONTINUOUS IMPROVEMENT": ["Evaluation and Continuous Improvement 1", "Evaluation and Continuous Improvement 2", "Evaluation and Continuous Improvement 3"],
        "SUSTAINABILITY AND EMBEDDING": ["Sustainability and Embedding 1", "Sustainability and Embedding 2", "Sustainability and Embedding 3"],
        // Note: This might have 4 or 5 questions depending on the data
        "COSTS OR FINANCIAL": ["Costs or Financial 1", "Costs or Financial 2", "Costs or Financial 3", "Costs or Financial 4", "Costs or Financial 5"]
    };

    // Track individual question scores
    let totalSum = 0;
    let totalQuestions = 0;

    // Track details for logging
    const categoryScores: Record<string, { sum: number; count: number }> = {};
    Object.keys(categories).forEach(cat => {
        categoryScores[cat] = { sum: 0, count: 0 };
    });

    const entriesFound: string[] = []; // Track where we found entries

    console.log(`Processing ICT Change Management scores for Provinces: ${provinces.join(', ')}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by province
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for Province matches
                const entryProvince = entry["Province"] || "";

                // Check if entry belongs to any of the requested provinces
                if (provinces.some(p => p.toUpperCase() === entryProvince.toString().toUpperCase())) {
                    entriesFound.push(`${section}[${index}]`);
                    console.log(`  Found entry from ${entryProvince} in ${section}[${index}]`);

                    // Process each category and its questions
                    Object.entries(categories).forEach(([category, questionKeys]) => {
                        questionKeys.forEach(questionKey => {
                            // Skip this question if it doesn't exist in the data
                            // (such as "Costs or Financial 5" if there are only 4 questions)
                            if (category === "COSTS OR FINANCIAL" &&
                                questionKey === "Costs or Financial 5" &&
                                !Object.keys(entry).some(k =>
                                    k.toLowerCase().includes("costs or financial 5") ||
                                    k.toLowerCase().includes("costs_or_financial_5"))) {
                                console.log(`    Skipping "${questionKey}" as it appears not to exist in this data`);
                                return;
                            }

                            let found = false;

                            // Generate possible key variations
                            const keyVariations = [
                                questionKey,                                  // Original: "CHANGE READINESS 1"
                                questionKey.toLowerCase(),                    // Lowercase: "change readiness 1"
                                questionKey.replace(/ /g, '_'),              // With underscores: "CHANGE_READINESS_1"
                                questionKey.replace(/ /g, '_').toLowerCase(), // Lowercase with underscores
                                category + " " + questionKey.split(' ').pop() // Simplified format: "CHANGE READINESS 1"
                            ];

                            // Try all key variations
                            for (const keyVar of keyVariations) {
                                if (found) break;

                                if (entry[keyVar] !== undefined && entry[keyVar] !== null) {
                                    const score = Number(entry[keyVar]);
                                    if (!isNaN(score) && score >= 1 && score <= 5) {
                                        // Add to overall sum
                                        totalSum += score;
                                        totalQuestions++;

                                        // Track for category details
                                        categoryScores[category].sum += score;
                                        categoryScores[category].count++;

                                        found = true;
                                        console.log(`    Found ${keyVar}: ${score}`);
                                    }
                                }
                            }

                            // If still not found, try generic case-insensitive matching
                            if (!found) {
                                const keys = Object.keys(entry);
                                const questionNumber = questionKey.split(' ').pop();
                                const categoryPrefix = category.toLowerCase().replace(/ /g, '');

                                for (const key of keys) {
                                    const keyLower = key.toLowerCase().replace(/ /g, '');
                                    if (keyLower.includes(categoryPrefix) && keyLower.includes(questionNumber || "")) {
                                        const score = Number(entry[key]);
                                        if (!isNaN(score) && score >= 1 && score <= 5) {
                                            // Add to overall sum
                                            totalSum += score;
                                            totalQuestions++;

                                            // Track for category details
                                            categoryScores[category].sum += score;
                                            categoryScores[category].count++;

                                            console.log(`    Found ${key} (fuzzy matching for ${questionKey}): ${score}`);
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!found) {
                                console.log(`    Could not find data for ${questionKey}`);
                            }
                        });
                    });
                }
            });
        }
    });

    // Log category-level scores for information
    console.log("=== ICT Change Management Category Breakdown ===");
    Object.entries(categoryScores).forEach(([category, { sum, count }]) => {
        if (count > 0) {
            const categoryAvg = sum / count;
            const percentage = (categoryAvg / 5) * 100;
            console.log(`  ${category}: ${percentage.toFixed(2)}% (${sum}/${count * 5})`);
        } else {
            console.log(`  ${category}: No data found`);
        }
    });

    // Calculate the overall Change Management percentage 
    // based on all individual question scores - direct sum of all scores
    if (totalQuestions > 0) {
        const overallAvg = totalSum / totalQuestions;
        const percentage = (overallAvg / 5) * 100;
        console.log(`=== ICT Change Management Score Summary ===`);
        console.log(`Entries found in: ${entriesFound.join(', ')}`);
        console.log(`Total questions answered: ${totalQuestions}`);
        console.log(`Total score sum: ${totalSum}`);
        console.log(`Overall average: ${overallAvg.toFixed(2)} out of 5`);
        console.log(`Overall percentage: ${percentage.toFixed(2)}%`);
        return Number(percentage.toFixed(2));
    } else {
        console.log("No Change Management values found, returning 0");
        return 0;
    }
};

// Also update the detailed scores function for consistency
export const getProvinceICTChangeManagementDetailedScores = (provinces: string[] = ["Misor", "Camiguin"]): Record<string, number> => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Sections to check for Change Management questions
    const sections = ["IT Office"];

    // Define the Change Management categories and their question keys with exact naming
    const categories = {
        "CHANGE READINESS": ["CHANGE READINESS 1", "CHANGE READINESS 2", "CHANGE READINESS 3"],
        "CHANGE LEADERSHIP": ["CHANGE LEADERSHIP 1", "CHANGE LEADERSHIP 2"],
        "CHANGE COMMUNICATION": ["CHANGE COMMUNICATION 1", "CHANGE COMMUNICATION 2", "CHANGE COMMUNICATION 3"],
        "CHANGE IMPACT ASSESSMENT": ["CHANGE IMPACT ASSESSMENT 1", "CHANGE IMPACT ASSESSMENT 2", "CHANGE IMPACT ASSESSMENT 3"],
        "STAKEHOLDER ENGAGEMENT": ["STAKEHOLDER ENGAGEMENT 1", "STAKEHOLDER ENGAGEMENT 2", "STAKEHOLDER ENGAGEMENT 3"],
        "CHANGE PLANNING AND EXECUTION": ["CHANGE PLANNING AND EXECUTION 1", "CHANGE PLANNING AND EXECUTION 2", "CHANGE PLANNING AND EXECUTION 3"],
        "TRAINING AND DEVELOPMENT": ["TRAINING AND DEVELOPMENT 1", "TRAINING AND DEVELOPMENT 2", "TRAINING AND DEVELOPMENT 3"],
        "RESISTANCE MANAGEMENT": ["Resistance Management 1", "Resistance Management 2", "Resistance Management 3"],
        "EVALUATION AND CONTINUOUS IMPROVEMENT": ["Evaluation and Continuous Improvement 1", "Evaluation and Continuous Improvement 2", "Evaluation and Continuous Improvement 3"],
        "SUSTAINABILITY AND EMBEDDING": ["Sustainability and Embedding 1", "Sustainability and Embedding 2", "Sustainability and Embedding 3"],
        "COSTS OR FINANCIAL": ["Costs or Financial 1", "Costs or Financial 2", "Costs or Financial 3", "Costs or Financial 4", "Costs or Financial 5"]
    };

    // Track scores for each category
    const categoryScores: Record<string, { sum: number; count: number }> = {};
    Object.keys(categories).forEach(cat => {
        categoryScores[cat] = { sum: 0, count: 0 };
    });

    console.log(`Processing ICT Change Management detailed scores for Provinces: ${provinces.join(', ')}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for Province matches
                const entryProvince = entry["Province"] || "";

                // Check if entry belongs to any of the requested provinces
                if (provinces.some(p => p.toUpperCase() === entryProvince.toString().toUpperCase())) {
                    console.log(`Found entry from ${entryProvince} in ${section}[${index}]`);

                    // Process each category and its questions
                    Object.entries(categories).forEach(([category, questionKeys]) => {
                        questionKeys.forEach(questionKey => {
                            // Skip this question if it doesn't exist in the data
                            // (such as "Costs or Financial 5" if there are only 4 questions)
                            if (category === "COSTS OR FINANCIAL" &&
                                questionKey === "Costs or Financial 5" &&
                                !Object.keys(entry).some(k =>
                                    k.toLowerCase().includes("costs or financial 5") ||
                                    k.toLowerCase().includes("costs_or_financial_5"))) {
                                console.log(`    Skipping "${questionKey}" as it appears not to exist in this data`);
                                return;
                            }

                            let found = false;

                            // Generate possible key variations
                            const keyVariations = [
                                questionKey,                                  // Original: "CHANGE READINESS 1"
                                questionKey.toLowerCase(),                    // Lowercase: "change readiness 1"
                                questionKey.replace(/ /g, '_'),              // With underscores: "CHANGE_READINESS_1"
                                questionKey.replace(/ /g, '_').toLowerCase(), // Lowercase with underscores
                                category + " " + questionKey.split(' ').pop() // Simplified format: "CHANGE READINESS 1"
                            ];

                            // Try all key variations
                            for (const keyVar of keyVariations) {
                                if (found) break;

                                if (entry[keyVar] !== undefined && entry[keyVar] !== null) {
                                    const score = Number(entry[keyVar]);
                                    if (!isNaN(score) && score >= 1 && score <= 5) {
                                        categoryScores[category].sum += score;
                                        categoryScores[category].count++;
                                        found = true;
                                        console.log(`  Found ${keyVar}: ${score}`);
                                    }
                                }
                            }

                            // If still not found, try generic case-insensitive matching
                            if (!found) {
                                const keys = Object.keys(entry);
                                const questionNumber = questionKey.split(' ').pop();
                                const categoryPrefix = category.toLowerCase().replace(/ /g, '');

                                for (const key of keys) {
                                    const keyLower = key.toLowerCase().replace(/ /g, '');
                                    if (keyLower.includes(categoryPrefix) && keyLower.includes(questionNumber || "")) {
                                        const score = Number(entry[key]);
                                        if (!isNaN(score) && score >= 1 && score <= 5) {
                                            categoryScores[category].sum += score;
                                            categoryScores[category].count++;
                                            console.log(`  Found ${key} (fuzzy matching for ${questionKey}): ${score}`);
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!found) {
                                console.log(`  Could not find data for ${questionKey}`);
                            }
                        });
                    });
                }
            });
        }
    });

    // Calculate percentage for each category
    const result: Record<string, number> = {};

    console.log("=== ICT Change Management Category Scores ===");
    Object.entries(categoryScores).forEach(([category, { sum, count }]) => {
        if (count > 0) {
            const average = sum / count;
            const percentage = (average / 5) * 100;
            result[category] = Number(percentage.toFixed(2));
            console.log(`  ${category}: ${percentage.toFixed(2)}% (${sum}/${count * 5})`);
        } else {
            result[category] = 0;
            console.log(`  ${category}: No data found`);
        }
    });

    return result;
};

export const getRegion10ICTChangeManagementScore = (): number => {
    // Simply use the default parameters of getProvinceICTChangeManagementScore 
    // which includes all Region 10 provinces
    return getProvinceICTChangeManagementScore();
};


export const getRegion10ICTChangeManagementDetailedScores = (): Record<string, number> => {
    // Simply use the default parameters of getProvinceICTChangeManagementDetailedScores 
    // which includes all Region 10 provinces
    return getProvinceICTChangeManagementDetailedScores();
};


//Getting the IT Readiness Score for Region 10 (Misor and Camiguin)

export const getProvinceITReadinessScore = (provinces: string[] = ["Misor", "Camiguin"]): number => {
    // Get detailed scores for the provinces
    const detailedScores = getProvinceITReadinessDetailedScores(provinces);

    // Calculate overall average
    const scores = Object.values(detailedScores);
    if (scores.length === 0) {
        return 0;
    }

    const sum = scores.reduce((total, score) => total + score, 0);
    const average = sum / scores.length;

    console.log(`=== IT Readiness Overall Score for ${provinces.join(', ')} ===`);
    console.log(`Overall percentage: ${average.toFixed(2)}%`);

    return Number(average.toFixed(2));
};


export const getProvinceITReadinessDetailedScores = (provinces: string[] = ["Misor", "Camiguin"]): Record<string, number> => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Sections to check for IT Readiness questions
    const sections = ["IT Office"];

    // Define the IT Readiness categories and their question keys with exact naming
    const categories = {
        "BASIC IT READINESS": ["BASIC IT READINESS 1", "BASIC IT READINESS 2", "BASIC IT READINESS 3", "BASIC IT READINESS 4"],
        "IT GOVERNANCE FRAMEWORK & POLICIES": ["IT GOVERNANCE FRAMEWORK & POLICIES 1", "IT GOVERNANCE FRAMEWORK & POLICIES 2", "IT GOVERNANCE FRAMEWORK & POLICIES 3"],
        "IT STRATEGY AND ALIGNMENT": ["IT STRATEGY AND ALIGNMENT 1", "IT STRATEGY AND ALIGNMENT 2", "IT STRATEGY AND ALIGNMENT 3"],
        "IT POLICIES AND PROCEDURES": ["IT POLICIES AND PROCEDURES 1", "IT POLICIES AND PROCEDURES 2", "IT POLICIES AND PROCEDURES 3"],
        "RISK MANAGEMENT": ["RISK MANAGEMENT 1", "RISK MANAGEMENT 2", "RISK MANAGEMENT 3"],
        "IT PERFORMANCE MEASUREMENT AND REPORTING": ["IT PERFORMANCE MEASUREMENT AND REPORTING 1", "IT PERFORMANCE MEASUREMENT AND REPORTING 2", "IT PERFORMANCE MEASUREMENT AND REPORTING 3"],
        "IT INVESTMENT MANAGEMENT": ["IT INVESTMENT MANAGEMENT 1", "IT INVESTMENT MANAGEMENT 2", "IT INVESTMENT MANAGEMENT 3"],
        "VENDOR MANAGEMENT": ["VENDOR MANAGEMENT 1", "VENDOR MANAGEMENT 2", "VENDOR MANAGEMENT 3"],
        "IT SECURITY AND COMPLIANCE": ["IT SECURITY AND COMPLIANCE 1", "IT SECURITY AND COMPLIANCE 2", "IT SECURITY AND COMPLIANCE 3"],
        "ICT ORGANIZATIONAL STRUCTURE AND SKILLS": ["ICT Organizational Structure and Skills 1", "ICT Organizational Structure and Skills 2", "ICT Organizational Structure and Skills 3"],
        "AUDIT AND ASSURANCE": ["Audit and Assurance 1", "Audit and Assurance 2", "Audit and Assurance 3"],
        "NETWORK INFRASTRUCTURE": ["Network Infrastructure 1", "Network Infrastructure 2"],
        "SERVERS AND STORAGE": ["Servers and Storage 1", "Servers and Storage 2", "Servers and Storage 3"],
        "VIRTUALIZATION": ["Virtualization 1", "Virtualization 2", "Virtualization 3"],
        "DATA BACKUP AND RECOVERY": ["Data Backup and Recovery 1", "Data Backup and Recovery 2", "Data Backup and Recovery 3"],
        "SCALABILITY AND ELASTICITY": ["Scalability and Elasticity 1", "Scalability and Elasticity 2", "Scalability and Elasticity 3"],
        "SECURITY MEASURES": ["Security Measures 1", "Security Measures 2", "Security Measures 3", "Security Measures 4"],
        "MONITORING AND PERFORMANCE": ["Monitoring and Performance 1", "Monitoring and Performance 2", "Monitoring and Performance 3"],
        "COMPLIANCE AND GOVERNANCE": ["Compliance and Governance 1", "Compliance and Governance 2", "Compliance and Governance 3"],
        "INTEGRATION AND INTEROPERABILITY": ["Integration and Interoperability 1", "Integration and Interoperability 2", "Integration and Interoperability 3"],
        "DISASTER RECOVERY AND BUSINESS CONTINUITY": ["Disaster Recovery and Business Continuity 1", "Disaster Recovery and Business Continuity 2", "Disaster Recovery and Business Continuity 3"]
    };

    // Track scores for each category
    const categoryScores: Record<string, { sum: number; count: number }> = {};
    Object.keys(categories).forEach(cat => {
        categoryScores[cat] = { sum: 0, count: 0 };
    });

    console.log(`Processing IT Readiness detailed scores for Provinces: ${provinces.join(', ')}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for Province matches
                const entryProvince = entry["Province"] || "";

                // Check if entry belongs to any of the requested provinces
                if (provinces.some(p => p.toUpperCase() === entryProvince.toString().toUpperCase())) {
                    console.log(`Found entry from ${entryProvince} in ${section}[${index}]`);

                    // Process each category and its questions
                    Object.entries(categories).forEach(([category, questionKeys]) => {
                        questionKeys.forEach(questionKey => {
                            let found = false;

                            // Try exact key match first
                            if (entry[questionKey] !== undefined && entry[questionKey] !== null) {
                                const score = Number(entry[questionKey]);
                                if (!isNaN(score) && score >= 1 && score <= 5) {
                                    categoryScores[category].sum += score;
                                    categoryScores[category].count++;
                                    found = true;
                                    console.log(`  Found ${questionKey}: ${score}`);
                                }
                            }

                            // If not found, try case-insensitive matching
                            if (!found) {
                                const keys = Object.keys(entry);
                                for (const key of keys) {
                                    if (key.toUpperCase() === questionKey.toUpperCase()) {
                                        const score = Number(entry[key]);
                                        if (!isNaN(score) && score >= 1 && score <= 5) {
                                            categoryScores[category].sum += score;
                                            categoryScores[category].count++;
                                            console.log(`  Found ${key} (matching ${questionKey}): ${score}`);
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            });
        }
    });

    // Calculate percentage for each category
    const result: Record<string, number> = {};

    console.log("=== IT Readiness Category Scores ===");
    Object.entries(categoryScores).forEach(([category, { sum, count }]) => {
        if (count > 0) {
            const average = sum / count;
            const percentage = (average / 5) * 100;
            result[category] = Number(percentage.toFixed(2));
            console.log(`  ${category}: ${percentage.toFixed(2)}% (${sum}/${count * 5})`);
        } else {
            result[category] = 0;
            console.log(`  ${category}: No data found`);
        }
    });

    return result;
};


export const getRegion10ITReadinessScore = (): number => {
    // Simply use the default parameters of getProvinceITReadinessScore 
    // which includes all Region 10 provinces
    return getProvinceITReadinessScore();
};


export const getRegion10ITReadinessDetailedScores = (): Record<string, number> => {
    // Simply use the default parameters of getProvinceITReadinessDetailedScores 
    // which includes all Region 10 provinces
    return getProvinceITReadinessDetailedScores();
};