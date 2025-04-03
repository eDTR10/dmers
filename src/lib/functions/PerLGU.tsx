import Data from "@/assets/data/eReadinessSurveyData.json";


interface SurveyData {
    [key: string]: any[]; // Each section is an array of entries
}

export const getLGUDigitalSkillsAverage = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Use only the sections that have valid data for all LGUs
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Question labels for reference
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

    console.log(`Calculating Digital Skills for LGU: ${lguName}`);

    // First collect all scores by question number
    const questionScores: number[][] = Array(10).fill(0).map(() => []);

    // Process each section to collect scores
    sections.forEach(section => {
        if (typedData[section]) {
            typedData[section].forEach(entry => {
                // Check for both field variations
                const entryLGU = entry["LGU Name"] || entry["LGU"] || "";

                // Compare case-insensitive
                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    console.log(`Found entry in ${section} for ${lguName}`);

                    // Get scores for each question
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Question ${i} DigitalSkillsAssessment`;
                        if (entry[questionKey] !== undefined && entry[questionKey] !== null) {
                            const score = Number(entry[questionKey]);
                            if (!isNaN(score) && score >= 1 && score <= 5) {
                                questionScores[i - 1].push(score);
                                console.log(`  ${questionKey}: ${score}`);
                            }
                        }
                    }
                }
            });
        }
    });

    // Calculate percentage for each question - exactly like about.tsx
    const percentages = questionScores.map((scores, i) => {
        if (scores.length === 0) return 0;

        const total = scores.reduce((sum, score) => sum + score, 0);
        const maxPossible = scores.length * 5;
        const percentage = (total / maxPossible) * 100;

        console.log(`${questionLabels[i]}: ${percentage.toFixed(2)}% (${total}/${maxPossible})`);
        return percentage;
    });

    // Only include questions that have data
    const validPercentages = percentages.filter(p => p > 0);

    if (validPercentages.length === 0) {
        console.log(`No data found for ${lguName}`);
        return 0;
    }

    // Calculate overall average (simple mean of all percentages)
    const sum = validPercentages.reduce((total, p) => total + p, 0);
    const average = sum / validPercentages.length;

    console.log(`${lguName} Digital Skills Average: ${average.toFixed(2)}%`);
    return Number(average.toFixed(2));
};

export const getProvinceDigitalSkillsQuestionAverages = (province: string): Record<string, number> => {
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

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified province
                if (entry["Province"] === province) {
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

export const getLGUDigitalSkillsQuestionAverages = (lguName: string): Record<string, number> => {
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

    // Process each section
    lguName == "CATARMAN" ? sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by LGU name
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified LGU
                if (entry["LGU Name"] === lguName) {
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
    }) : sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by LGU name
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified LGU
                if (entry["LGU"] === lguName) {
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
    }
    );

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

// Getting the LGU Technology Readiness Index (TRI) score (average of all TRI questions)
export const getLGUTechnologyReadinessIndex = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // All sections to check for TRI questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Track totals for each dimension
    let optimismSum = 0;
    let optimismCount = 0;

    let innovativenessSum = 0;
    let innovativenessCount = 0;

    let discomfortSum = 0;
    let discomfortCount = 0;

    let insecuritySum = 0;
    let insecurityCount = 0;

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by LGU name
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified LGU
                if (entry["LGU Name"] === lguName) {
                    // Process Optimism questions (1-10)
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Optimism ${i}`;
                        if (entry[questionKey] !== undefined) {
                            optimismSum += Number(entry[questionKey]);
                            optimismCount++;
                        }
                    }

                    // Process Innovativeness questions (1-7)
                    for (let i = 1; i <= 7; i++) {
                        const questionKey = `Innovativeness ${i}`;
                        if (entry[questionKey] !== undefined) {
                            innovativenessSum += Number(entry[questionKey]);
                            innovativenessCount++;
                        }
                    }

                    // Process Discomfort questions (1-10)
                    // Note: For negative dimensions, we reverse the score (6 - score)
                    // so that higher values = better (less discomfort)
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Discomfort ${i}`;
                        if (entry[questionKey] !== undefined) {
                            discomfortSum += (6 - Number(entry[questionKey]));
                            discomfortCount++;
                        }
                    }

                    // Process Insecurity questions (1-9)
                    // Note: For negative dimensions, we reverse the score (6 - score)
                    // so that higher values = better (less insecurity)
                    for (let i = 1; i <= 9; i++) {
                        const questionKey = `Insecurity ${i}`;
                        if (entry[questionKey] !== undefined) {
                            insecuritySum += (6 - Number(entry[questionKey]));
                            insecurityCount++;
                        }
                    }
                }
            });
        }
    });

    // Calculate averages for each dimension
    const optimismAvg = optimismCount > 0 ? optimismSum / optimismCount : 0;
    const innovativenessAvg = innovativenessCount > 0 ? innovativenessSum / innovativenessCount : 0;
    const discomfortAvg = discomfortCount > 0 ? discomfortSum / discomfortCount : 0;
    const insecurityAvg = insecurityCount > 0 ? insecuritySum / insecurityCount : 0;

    // Calculate overall TRI score (average of all four dimensions)
    const dimensionCount = (optimismCount > 0 ? 1 : 0) +
        (innovativenessCount > 0 ? 1 : 0) +
        (discomfortCount > 0 ? 1 : 0) +
        (insecurityCount > 0 ? 1 : 0);

    if (dimensionCount > 0) {
        const triAverage = (optimismAvg + innovativenessAvg + discomfortAvg + insecurityAvg) / dimensionCount;
        const percentage = (triAverage / 5) * 100;
        return Number(percentage.toFixed(2));
    } else {
        return 0;
    }
};

//Getting the LGU Optimism Score (average of all Optimism questions)
export const getLGUOptimismScore = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Expand sections to check for Optimism questions - add any other sections where data might be
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Track totals for Optimism questions
    let optimismSum = 0;
    let optimismCount = 0;
    const allScores: number[] = []; // Store all scores for debugging
    const entriesFound: string[] = []; // Track where we found entries

    // Keep track of processed entries to prevent duplicates
    const processedEntries = new Set();

    console.log(`Processing optimism scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Create a unique ID for this entry to avoid duplicate processing
                const entryId = `${section}-${index}`;
                if (processedEntries.has(entryId)) {
                    console.log(`  Skipping already processed entry: ${entryId}`);
                    return; // Skip this entry as it's already been processed
                }

                // Check for LGU name matches - try different possible formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                // Use exact case-insensitive matching instead of flexible substring matching
                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    processedEntries.add(entryId);
                    entriesFound.push(`${section}[${index}]`);
                    console.log(`  Found entry for ${lguName} in ${section}[${index}]: ${entryLGU}`);

                    // Look for all possible Optimism fields with expanded patterns
                    // Standard naming format
                    for (let i = 0; i <= 10; i++) {
                        // Try different naming patterns
                        const patterns = [
                            `Optimism ${i}`,
                            `Optimism${i}`,
                            `optimism ${i}`,
                            `optimism${i}`,
                            `OPTIMISM ${i}`,
                            `OPTIMISM${i}`,
                            `Q${i} Optimism`,
                            `Optimism Question ${i}`
                        ];

                        let foundScore = false;
                        for (const questionKey of patterns) {
                            if (entry[questionKey] !== undefined && entry[questionKey] !== null && !foundScore) {
                                const score = Number(entry[questionKey]);
                                if (!isNaN(score) && score >= 1 && score <= 5) {
                                    optimismSum += score;
                                    optimismCount++;
                                    allScores.push(score);
                                    console.log(`    Found ${questionKey}: ${score}`);
                                    foundScore = true; // Mark as found to avoid duplicates
                                }
                            }
                        }
                    }

                    // Also scan all fields for any containing 'optimism'
                    const keys = Object.keys(entry);
                    keys.forEach(key => {
                        // Skip keys we've already processed with the standard patterns
                        if (!key.match(/^Optimism\s?\d+$/) && key.toLowerCase().includes('optimism')) {
                            const score = Number(entry[key]);
                            if (!isNaN(score) && score >= 1 && score <= 5) {
                                optimismSum += score;
                                optimismCount++;
                                allScores.push(score);
                                console.log(`    Found ${key}: ${score}`);
                            }
                        }
                    });
                }
            });
        }
    });

    // Log summary statistics
    console.log("=== Optimism Score Summary ===");
    console.log(`Entries found in: ${entriesFound.join(', ')}`);
    console.log(`Length: ${optimismCount} values found`);
    console.log(`Total raw sum: ${optimismSum}`);
    console.log(`Max possible score: ${optimismCount * 5}`);

    // Calculate the Optimism average and convert to percentage
    if (optimismCount > 0) {
        const optimismAvg = optimismSum / optimismCount;
        const percentage = (optimismAvg / 5) * 100;
        console.log(`Raw average: ${optimismAvg} out of 5`);
        console.log(`Percentage: ${percentage.toFixed(2)}%`);

        return Number(percentage.toFixed(2));
    } else {
        console.log("No values found, returning 0");
        return 0;
    }
};

//Getting the LGU Innovativeness Score (average of all Innovativeness questions)
export const getLGUInnovativenessScore = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Expand sections to check for Innovativeness questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Track totals for Innovativeness questions
    let innovativenessSum = 0;
    let innovativenessCount = 0;
    const allScores: number[] = []; // Store all scores for debugging
    const entriesFound: string[] = []; // Track where we found entries

    // Keep track of processed entries to prevent duplicates
    const processedEntries = new Set();

    console.log(`Processing innovativeness scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Create a unique ID for this entry to avoid duplicate processing
                const entryId = `${section}-${index}`;
                if (processedEntries.has(entryId)) {
                    console.log(`  Skipping already processed entry: ${entryId}`);
                    return; // Skip this entry as it's already been processed
                }

                // Check for LGU name matches - try different possible formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                // Use exact case-insensitive matching
                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    processedEntries.add(entryId);
                    entriesFound.push(`${section}[${index}]`);
                    console.log(`  Found entry for ${lguName} in ${section}[${index}]: ${entryLGU}`);

                    // Look for all possible Innovativeness fields with expanded patterns
                    // Note: Innovativeness has 7 questions (not 10 like Optimism)
                    for (let i = 1; i <= 7; i++) {
                        // Try different naming patterns
                        const patterns = [
                            `Innovativeness ${i}`,
                            `Innovativeness${i}`,
                            `innovativeness ${i}`,
                            `innovativeness${i}`,
                            `INNOVATIVENESS ${i}`,
                            `INNOVATIVENESS${i}`,
                            `Q${i} Innovativeness`,
                            `Innovativeness Question ${i}`
                        ];

                        let foundScore = false;
                        for (const questionKey of patterns) {
                            if (entry[questionKey] !== undefined && entry[questionKey] !== null && !foundScore) {
                                const score = Number(entry[questionKey]);
                                if (!isNaN(score) && score >= 1 && score <= 5) {
                                    innovativenessSum += score;
                                    innovativenessCount++;
                                    allScores.push(score);
                                    console.log(`    Found ${questionKey}: ${score}`);
                                    foundScore = true; // Mark as found to avoid duplicates
                                }
                            }
                        }
                    }

                    // Also scan all fields for any containing 'innovativeness'
                    const keys = Object.keys(entry);
                    keys.forEach(key => {
                        // Skip keys we've already processed with the standard patterns
                        if (!key.match(/^Innovativeness\s?\d+$/) && key.toLowerCase().includes('innovativeness')) {
                            const score = Number(entry[key]);
                            if (!isNaN(score) && score >= 1 && score <= 5) {
                                innovativenessSum += score;
                                innovativenessCount++;
                                allScores.push(score);
                                console.log(`    Found ${key}: ${score}`);
                            }
                        }
                    });
                }
            });
        }
    });

    // Log summary statistics
    console.log("=== Innovativeness Score Summary ===");
    console.log(`Entries found in: ${entriesFound.join(', ')}`);
    console.log(`Length: ${innovativenessCount} values found`);
    console.log(`Total raw sum: ${innovativenessSum}`);
    console.log(`Max possible score: ${innovativenessCount * 5}`);

    // Calculate the Innovativeness average and convert to percentage
    if (innovativenessCount > 0) {
        const innovativenessAvg = innovativenessSum / innovativenessCount;
        const percentage = (innovativenessAvg / 5) * 100;
        console.log(`Raw average: ${innovativenessAvg} out of 5`);
        console.log(`Percentage: ${percentage.toFixed(2)}%`);

        return Number(percentage.toFixed(2));
    } else {
        console.log("No values found, returning 0");
        return 0;
    }
};

//Getting the LGU Discomfort Score (average of all Discomfort questions)
export const getLGUDiscomfortScore = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Expand sections to check for Discomfort questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];

    // Track totals for Discomfort questions
    let discomfortSum = 0;
    let discomfortCount = 0;
    const allScores: number[] = []; // Store all scores for debugging
    const entriesFound: string[] = []; // Track where we found entries

    // Keep track of processed entries to prevent duplicates
    const processedEntries = new Set();

    console.log(`Processing discomfort scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Create a unique ID for this entry to avoid duplicate processing
                const entryId = `${section}-${index}`;
                if (processedEntries.has(entryId)) {
                    console.log(`  Skipping already processed entry: ${entryId}`);
                    return; // Skip this entry as it's already been processed
                }

                // Check for LGU name matches - try different possible formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                // Use exact case-insensitive matching
                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    processedEntries.add(entryId);
                    entriesFound.push(`${section}[${index}]`);
                    console.log(`  Found entry for ${lguName} in ${section}[${index}]: ${entryLGU}`);

                    // Look for all possible Discomfort fields with expanded patterns
                    // Note: Discomfort has 10 questions (Discomfort 1-10)
                    for (let i = 1; i <= 10; i++) {
                        // Try different naming patterns
                        const patterns = [
                            `Discomfort ${i}`,
                            `Discomfort${i}`,
                            `discomfort ${i}`,
                            `discomfort${i}`,
                            `DISCOMFORT ${i}`,
                            `DISCOMFORT${i}`,
                            `Q${i} Discomfort`,
                            `Discomfort Question ${i}`
                        ];

                        let foundScore = false;
                        for (const questionKey of patterns) {
                            if (entry[questionKey] !== undefined && entry[questionKey] !== null && !foundScore) {
                                const score = Number(entry[questionKey]);
                                if (!isNaN(score) && score >= 1 && score <= 5) {
                                    // No score reversal - use raw score directly
                                    discomfortSum += score;
                                    discomfortCount++;
                                    allScores.push(score);
                                    console.log(`    Found ${questionKey}: ${score}`);
                                    foundScore = true; // Mark as found to avoid duplicates
                                }
                            }
                        }
                    }

                    // Also scan all fields for any containing 'discomfort'
                    const keys = Object.keys(entry);
                    keys.forEach(key => {
                        // Skip keys we've already processed with the standard patterns
                        if (!key.match(/^Discomfort\s?\d+$/) && key.toLowerCase().includes('discomfort')) {
                            const score = Number(entry[key]);
                            if (!isNaN(score) && score >= 1 && score <= 5) {
                                // No reversal - use raw score
                                discomfortSum += score;
                                discomfortCount++;
                                allScores.push(score);
                                console.log(`    Found ${key}: ${score}`);
                            }
                        }
                    });
                }
            });
        }
    });

    // Log summary statistics
    console.log("=== Discomfort Score Summary ===");
    console.log(`Entries found in: ${entriesFound.join(', ')}`);
    console.log(`Length: ${discomfortCount} values found`);
    console.log(`Total raw sum: ${discomfortSum}`);
    console.log(`Max possible score: ${discomfortCount * 5}`);

    // Calculate the Discomfort average and convert to percentage
    if (discomfortCount > 0) {
        const discomfortAvg = discomfortSum / discomfortCount;
        const percentage = (discomfortAvg / 5) * 100;
        console.log(`Raw average: ${discomfortAvg} out of 5`);
        console.log(`Percentage: ${percentage.toFixed(2)}%`);

        return Number(percentage.toFixed(2));
    } else {
        console.log("No values found, returning 0");
        return 0;
    }
};

//Getting the TRI score (average of all TRI questions) for a specific LGU
export const getLGUDetailedTRI = (lguName: string): {
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

    // Track processed entries
    const processedEntries = new Set();

    console.log(`Processing detailed TRI for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Create a unique ID for this entry
                const entryId = `${section}-${index}`;
                if (processedEntries.has(entryId)) {
                    return; // Skip already processed entries
                }

                // Check for LGU name matches
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    processedEntries.add(entryId);
                    console.log(`Found entry for ${lguName} in ${section}[${index}]`);

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
                                    // For negative dimensions (discomfort, insecurity), we'll store the raw value
                                    // but calculate the inverted score for the dimension average
                                    dimension.questions[questionKey] = rawScore;

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
                questions: dimensions.optimism.questions
            },
            innovativeness: {
                score: 0,
                questions: dimensions.innovativeness.questions
            },
            discomfort: {
                score: 0,
                questions: dimensions.discomfort.questions
            },
            insecurity: {
                score: 0,
                questions: dimensions.insecurity.questions
            }
        }
    };

    let totalScore = 0;
    let dimensionsWithData = 0;

    // Calculate each dimension percentage score
    Object.keys(dimensions).forEach(dimKey => {
        const dim = dimensions[dimKey as keyof typeof dimensions];
        const resultDim = result.dimensions[dimKey as keyof typeof result["dimensions"]];

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

    console.log(`Overall TRI Score: ${result.overallScore}%`);

    return result;
};


//Getting the ICT Change Management Assessment per LGU (TOTAL Average for All Question)
export const getLGUICTChangeManagementScore = (lguName: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;

    // Expand sections to check for Change Management questions - typically only in IT Office
    const sections = ["IT Office"];

    // Define the Change Management categories and their respective question counts
    const categories = {
        "CHANGE READINESS": 3,
        "CHANGE LEADERSHIP": 2,
        "CHANGE COMMUNICATION": 3,
        "CHANGE IMPACT ASSESSMENT": 3,
        "STAKEHOLDER ENGAGEMENT": 3,
        "CHANGE PLANNING AND EXECUTION": 3,
        "TRAINING AND DEVELOPMENT": 3,
        "RESISTANCE MANAGEMENT": 3,
        "EVALUATION AND CONTINUOUS IMPROVEMENT": 3,
        "SUSTAINABILITY AND EMBEDDING": 3,
        "COSTS OR FINANCIAL": 5
    };

    // Track totals for each category
    const categoryScores: Record<string, { sum: number; count: number }> = {};
    Object.keys(categories).forEach(cat => {
        categoryScores[cat] = { sum: 0, count: 0 };
    });

    const entriesFound: string[] = []; // Track where we found entries

    console.log(`Processing ICT Change Management scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            console.log(`Checking section: ${section} (${typedData[section]?.length || 0} entries)`);

            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for LGU name matches - try different possible formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                // Use exact case-insensitive matching
                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    entriesFound.push(`${section}[${index}]`);
                    console.log(`  Found entry for ${lguName} in ${section}[${index}]: ${entryLGU}`);

                    // Process each category
                    Object.entries(categories).forEach(([category, questionCount]) => {
                        // Process each question in the category
                        for (let i = 1; i <= questionCount; i++) {
                            const questionKey = `${category} ${i}`;

                            if (entry[questionKey] !== undefined && entry[questionKey] !== null) {
                                const score = Number(entry[questionKey]);
                                if (!isNaN(score) && score >= 1 && score <= 5) {
                                    categoryScores[category].sum += score;
                                    categoryScores[category].count++;
                                    console.log(`    Found ${questionKey}: ${score}`);
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    // Calculate category averages and overall score
    let totalSum = 0;
    let totalCount = 0;

    Object.entries(categoryScores).forEach(([category, { sum, count }]) => {
        if (count > 0) {
            const categoryAvg = sum / count;
            const percentage = (categoryAvg / 5) * 100;
            console.log(`  ${category}: ${percentage.toFixed(2)}% (${sum}/${count * 5})`);
            totalSum += sum;
            totalCount += count;
        } else {
            console.log(`  ${category}: No data found`);
        }
    });

    // Calculate the overall Change Management percentage
    if (totalCount > 0) {
        const overallAvg = totalSum / totalCount;
        const percentage = (overallAvg / 5) * 100;
        console.log(`=== ICT Change Management Score Summary ===`);
        console.log(`Entries found in: ${entriesFound.join(', ')}`);
        console.log(`Overall average: ${overallAvg.toFixed(2)} out of 5`);
        console.log(`Overall percentage: ${percentage.toFixed(2)}%`);
        return Number(percentage.toFixed(2));
    } else {
        console.log("No Change Management values found, returning 0");
        return 0;
    }
};


//Getting the ICT Change Management Assessment per LGU
export const getLGUICTChangeManagementDetailedScores = (lguName: string): Record<string, number> => {
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

    console.log(`Processing ICT Change Management detailed scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for matching LGU - try different name formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    console.log(`Found entry for ${lguName} in ${section}[${index}]`);

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


//Getting the IT Readiness Assessment overall score per LGU
export const getLGUITReadinessScore = (lguName: string): number => {
    // Cast the data to our type
    // const typedData = Data as SurveyData;

    // // Sections to check for IT Readiness questions
    // const sections = ["IT Office"];

    // Get detailed scores
    const detailedScores = getLGUITReadinessDetailedScores(lguName);

    // Calculate overall average
    const scores = Object.values(detailedScores);
    if (scores.length === 0) {
        return 0;
    }

    const sum = scores.reduce((total, score) => total + score, 0);
    const average = sum / scores.length;

    console.log(`=== IT Readiness Overall Score ===`);
    console.log(`Overall percentage: ${average.toFixed(2)}%`);

    return Number(average.toFixed(2));
};

//Getting the IT Readiness Assessment per LGU with detailed breakdown by category
export const getLGUITReadinessDetailedScores = (lguName: string): Record<string, number> => {
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

    console.log(`Processing IT Readiness detailed scores for LGU: ${lguName}`);

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by LGU name
            typedData[section]?.forEach((entry: any, index: number) => {
                // Check for matching LGU - try different name formats
                const entryLGU = entry["LGU Name"] || entry["LGU"] || entry["Municipality"] || "";

                if (entryLGU.toString().toUpperCase() === lguName.toUpperCase()) {
                    console.log(`Found entry for ${lguName} in ${section}[${index}]`);

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

