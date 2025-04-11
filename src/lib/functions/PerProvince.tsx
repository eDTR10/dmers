import Data from "@/assets/data/eReadinessSurveyData.json";

// Define type for survey data structure
interface SurveyData {
    [key: string]: any[]; // Each section is an array of entries
}


export const getCamiguinDigitalSkillsAverage = (): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // All sections to check for Digital Skills Assessment questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];
    
    // Calculate total sum of all available Digital Skills Assessment questions
    let sum = 0;
    let count = 0;

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for Camiguin province
                if (entry["Province"] === "Camiguin") {
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Question ${i} DigitalSkillsAssessment`;
                        if (entry[questionKey] !== undefined) {
                            sum += Number(entry[questionKey]);
                            count++;
                        }
                    }
                }
            });
        }
    });

    // Calculate average, convert to percentage (assuming 5 is 100%), and round to 2 decimal places
    if (count > 0) {
        //Add all , get length * 5, (total / length * 5) * 100
        const average = sum / count;
        const percentage = (average / 5) * 100;
        return Number(percentage.toFixed(2));
    } else {
        return 0;
    }
};


export const getMisorDigitalSkillsAverage = (): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // All sections to check for Digital Skills Assessment questions
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];
    
    // Calculate total sum of all available Digital Skills Assessment questions
    let sum = 0;
    let count = 0;

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for Misor province
                if (entry["Province"] === "Misor") {
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `Question ${i} DigitalSkillsAssessment`;
                        if (entry[questionKey] !== undefined) {
                            sum += Number(entry[questionKey]);
                            count++;
                        }
                    }
                }
            });
        }
    });

    // Calculate average, convert to percentage (assuming 5 is 100%), and round to 2 decimal places
    if (count > 0) {
        const average = sum / count;
        const percentage = (average / 5) * 100;
        return Number(percentage.toFixed(2));
    } else {
        return 0;
    }
};


export const getProvinceTechnologyReadinessIndex = (province: string): number => {
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
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for the specified province
                if (entry["Province"] === province) {
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


export const getProvinceICTChangeManagement = (province: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // We only need to look at the IT Office section
    const section = "IT Office";
    
    // Total sum and count for all change management fields
    let sum = 0;
    let count = 0;

    // Process the IT Office section
    if (typedData[section]) {
        // Process each entry in the section, filtering by province
        typedData[section].forEach((entry: any) => {
            // Only process entries for the specified province
            if (entry["Province"] === province) {
                // Change Readiness fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `CHANGE READINESS ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Change Leadership fields
                for (let i = 1; i <= 2; i++) {
                    const questionKey = `CHANGE LEADERSHIP ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Change Communication fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `CHANGE COMMUNICATION ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Change Impact Assessment fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `CHANGE IMPACT ASSESSMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Stakeholder Engagement fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `STAKEHOLDER ENGAGEMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Change Planning and Execution fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `CHANGE PLANNING AND EXECUTION ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Training and Development fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `TRAINING AND DEVELOPMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Resistance Management fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Resistance Management ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Evaluation and Continuous Improvement fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Evaluation and Continuous Improvement ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Sustainability and Embedding fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Sustainability and Embedding ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Costs or Financial fields
                for (let i = 1; i <= 5; i++) {
                    const questionKey = `Costs or Financial ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
            }
        });
    }

    // Calculate average, convert to percentage (assuming 5 is 100%), and round to 2 decimal places
    if (count > 0) {
        const average = sum / count;
        const percentage = (average / 5) * 100;
        return Number(percentage.toFixed(2));
    } else {
        return 0;
    }
};

export const getProvinceITReadinessAssessment = (province: string): number => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // We only need to look at the IT Office section for IT Readiness Assessment
    const section = "IT Office";
    
    // Total sum and count for all IT Readiness Assessment fields
    let sum = 0;
    let count = 0;

    // Process the IT Office section
    if (typedData[section]) {
        // Process each entry in the section, filtering by province
        typedData[section].forEach((entry: any) => {
            // Only process entries for the specified province
            if (entry["Province"] === province) {
                // Basic IT Readiness fields
                for (let i = 1; i <= 4; i++) {
                    const questionKey = `BASIC IT READINESS ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Governance Framework & Policies fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT GOVERNANCE FRAMEWORK & POLICIES ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Strategy and Alignment fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT STRATEGY AND ALIGNMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Policies and Procedures fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT POLICIES AND PROCEDURES ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Risk Management fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `RISK MANAGEMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Performance Measurement and Reporting fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT PERFORMANCE MEASUREMENT AND REPORTING ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Investment Management fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT INVESTMENT MANAGEMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Vendor Management fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `VENDOR MANAGEMENT ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // IT Security and Compliance fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `IT SECURITY AND COMPLIANCE ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // ICT Organizational Structure and Skills fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `ICT Organizational Structure and Skills ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Audit and Assurance fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Audit and Assurance ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Network Infrastructure fields
                for (let i = 1; i <= 2; i++) {
                    const questionKey = `Network Infrastructure ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Servers and Storage fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Servers and Storage ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Virtualization fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Virtualization ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Data Backup and Recovery fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Data Backup and Recovery ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Scalability and Elasticity fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Scalability and Elasticity ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Security Measures fields
                for (let i = 1; i <= 4; i++) {
                    const questionKey = `Security Measures ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Monitoring and Performance fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Monitoring and Performance ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Compliance and Governance fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Compliance and Governance ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Integration and Interoperability fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Integration and Interoperability ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
                
                // Disaster Recovery and Business Continuity fields
                for (let i = 1; i <= 3; i++) {
                    const questionKey = `Disaster Recovery and Business Continuity ${i}`;
                    if (entry[questionKey] !== undefined) {
                        sum += Number(entry[questionKey]);
                        count++;
                    }
                }
            }
        });
    }

    // Calculate average, convert to percentage (assuming 5 is 100%), and round to 2 decimal places
    if (count > 0) {
        const average = sum / count;
        const percentage = (average / 5) * 100;
        return Number(percentage.toFixed(2));
    } else {
        return 0;
    }
};

export const getCamiguinLGUList = (): string[] => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // All sections to check
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];
    
    // Set to store unique LGU names (using Set to avoid duplicates)
    const lguSet = new Set<string>();

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for Camiguin province
                if (entry["Province"] === "Camiguin" && entry["LGU Name"]) {
                    lguSet.add(entry["LGU Name"]);
                }
            });
        }
    });

    // Convert Set to array and return
    return Array.from(lguSet);
};

export const getMisorLGUList = (): string[] => {
    // Cast the data to our type
    const typedData = Data as SurveyData;
    
    // All sections to check
    const sections = ["Other Offices", "HR Office", "Mayors Office", "IT Office"];
    
    // Set to store unique LGU names (using Set to avoid duplicates)
    const lguSet = new Set<string>();

    // Process each section
    sections.forEach((section) => {
        if (typedData[section]) {
            // Process each entry in the section, filtering by province
            typedData[section].forEach((entry: any) => {
                // Only process entries for Misor province
                if (entry["Province"] === "Misor" && entry["LGU Name"]) {
                    lguSet.add(entry["LGU Name"]);
                }
            });
        }
    });

    // Convert Set to array and return
    return Array.from(lguSet);
};