import { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

interface ProvinceRadarChartProps {
    categories: string[];
    values: number[];
    provinceName: string;
    color: string;
    showDataLabels?: boolean;
}

export const ProvinceRadarChart = ({
    categories,
    values,
    provinceName,
    color,
    showDataLabels = true  // Add this prop with default value
}: ProvinceRadarChartProps) => {
    // Function to get different colors for each category based on the main color
    const getColorForCategory = (category: string, baseColor: string) => {
        const colorMap: Record<string, string> = {
            'Digital Skills': '#0036C5',         // blue
            'Technology Readiness': '#ECC217',   // yellow
            'ICT Change Management': '#0036C5',  // blue
            'IT Readiness': '#ECC217',           // yellow
            'Digital Infrastructure': '#0036C5'   // blue
        };

        return colorMap[category] || baseColor;
    };

    // Transform data to nivo pie chart format
    const chartData = useMemo(() => {
        return categories.map((category, index) => ({
            id: category,
            label: category,
            value: values[index],
            color: getColorForCategory(category, color)
        }));
    }, [categories, values, color]);

    const totalScore = values.reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / values.length;

    return (
        <div style={{ height: 220 }}>
            <div className="text-center mb-2 text-gray-500 text-sm">
                Score Distribution for {provinceName}
            </div>
            <ResponsivePie
                data={chartData}
                margin={{ top: 10, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.5}
                padAngle={0.5}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                colors={{ datum: 'data.color' }} // Use this to ensure colors from chartData are used
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                // Control display of arc labels based on showDataLabels prop
                arcLabel={showDataLabels ? d => `${d.value.toFixed(2)}%` : () => ''}
                enableArcLabels={showDataLabels}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 40,
                        itemsSpacing: 100, // Reduced spacing to fit all items
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 12,
                        symbolShape: 'circle',
                    }
                ]}
                // Add the average score in the center of the pie
                layers={[
                    'arcLabels',
                    'arcLinkLabels',
                    'arcs',
                    'legends',
                    ({ centerX, centerY }) => (
                        <g>
                            <text
                                x={centerX}
                                y={centerY - 10}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    fill: '#666'
                                }}
                            >
                                Average
                            </text>
                            <text
                                x={centerX}
                                y={centerY + 10}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    fill: '#333'
                                }}
                            >
                                {averageScore.toFixed(2)}%
                            </text>
                        </g>
                    )
                ]}
            />
        </div>
    );
};