import { useMemo, useRef, useEffect, useState } from 'react';
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
    showDataLabels = true
}: ProvinceRadarChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);

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

    // Update container dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
                // Set height based on width for responsive aspect ratio
                // Limit the height to a reasonable value
                const calculatedHeight = Math.min(500, Math.max(350, containerRef.current.clientWidth * 0.7));
                setContainerHeight(calculatedHeight);
            }
        };

        // Initial size calculation
        updateDimensions();

        // Add resize listener
        window.addEventListener('resize', updateDimensions);

        // Clean up
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Calculate responsive font sizes and margins
    const legendFontSize = containerWidth < 400 ? 9 : containerWidth < 600 ? 11 : 13;
    const arcLabelFontSize = containerWidth < 400 ? 11 : containerWidth < 600 ? 13 : 15;
    const centerTextSize = containerWidth < 400 ? 14 : containerWidth < 600 ? 16 : 18;
    const centerSubTextSize = containerWidth < 400 ? 12 : containerWidth < 600 ? 14 : 16;
    const titleFontSize = containerWidth < 400 ? 14 : containerWidth < 600 ? 16 : 18;

    // Calculate bottom margin based on container width and categories count
    const getBottomMargin = () => {
        if (containerWidth < 400) {
            return categories.length > 3 ? 120 : 100;
        } else if (containerWidth < 600) {
            return categories.length > 3 ? 100 : 80;
        } else {
            return categories.length > 3 ? 80 : 60;
        }
    };

    // Determine legend configuration based on container width
    const legendConfig = containerWidth < 500 ? {
        anchor: 'bottom',
        direction: 'column',
        translateY: getBottomMargin() - 10, // Position the column legend closer to the chart
        translateX: 0,
        itemWidth: Math.min(containerWidth - 40, 200),
        itemHeight: 18,
        itemsSpacing: 0, // Add spacing between items in column layout
    } : {
        anchor: 'bottom',
        direction: 'row',
        translateY: getBottomMargin() - 20,
        translateX: 0,
        itemsSpacing: 25, // Add spacing between items in row layout
        itemWidth: Math.min(110, (containerWidth - 40) / categories.length),
        itemHeight: 20
    };

    return (
        <div className="w-full flex justify-center">
            {/* Set a max-width container that's centered */}
            <div ref={containerRef} className="w-full max-w-[700px] flex flex-col items-center">
                <div className="text-center mb-4 font-medium" style={{ fontSize: titleFontSize }}>
                    Score Distribution for {provinceName}
                </div>
                <div style={{ height: containerHeight }} className="w-full mt-4">
                    <ResponsivePie
                        data={chartData}
                        margin={{
                            top: 20,
                            right: containerWidth < 500 ? 20 : 180,
                            bottom: getBottomMargin(),
                            left: containerWidth < 500 ? 20 : 180
                        }}
                        innerRadius={0.55}
                        padAngle={1.5}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        colors={{ datum: 'data.color' }}
                        // Enhanced link labels for better readability
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        // Optimize text label display
                        arcLabelsSkipAngle={containerWidth < 400 ? 20 : 10}
                        // arcLabelsTextColor="#fff"
                        arcLabel={showDataLabels ? d => `${d.value.toFixed(1)}%` : () => ''}
                        // enableArcLabels={false}
                        // arcLinkLabelsOffset={containerWidth < 500 ? -24 : 10}
                        enableArcLabels={containerWidth < 500 ? true : false}
                        arcLabelsTextColor="black"

                        enableArcLinkLabels={containerWidth < 500 ? false : true}

                        // Responsive text size for arc labels
                        theme={{
                            labels: {
                                text: {

                                }
                            }
                        }}
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
                                spacing: 20
                            }
                        ]}
                        // Improved legend configuration
                        legends={[
                            {
                                ...legendConfig,
                                justify: false,
                                itemTextColor: '#555',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: containerWidth < 400 ? 10 : 14,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000',
                                            symbolSize: containerWidth < 400 ? 12 : 16
                                        }
                                    }
                                ],
                                // Responsive text styling
                                ...(({
                                    itemTextProps: {
                                        fontSize: legendFontSize,
                                        textAnchor: 'start'
                                    }
                                } as any))
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
                                        y={centerY - centerTextSize / 2}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        style={{
                                            fontSize: `${centerSubTextSize}px`,
                                            fontWeight: 'bold',
                                            fill: '#666'
                                        }}
                                    >
                                        Average
                                    </text>
                                    <text
                                        x={centerX}
                                        y={centerY + centerTextSize / 2}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        style={{
                                            fontSize: `${centerTextSize}px`,
                                            fontWeight: 'bold',
                                            fill: '#333'
                                        }}
                                    >
                                        {averageScore.toFixed(1)}%
                                    </text>
                                </g>
                            )
                        ]}
                        // Improve tooltip readability
                        tooltip={({ datum }) => (
                            <div className="bg-white px-3 py-2 shadow-lg rounded-md border border-gray-200">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 mr-2 rounded-full"
                                        style={{ backgroundColor: datum.color }}
                                    />
                                    <span className="font-medium">{datum.label}</span>
                                </div>
                                <div className="mt-1 font-bold text-center">
                                    {datum.value.toFixed(2)}%
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};