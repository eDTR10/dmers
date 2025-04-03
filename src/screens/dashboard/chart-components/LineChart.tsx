import React, { useRef, useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartProps {
    title: string;
    data: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
        }>;
    };
    height?: number;
    colSpan?: 1 | 2 | 3 | 4;
    showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    title,
    data,
    height = 300,
    colSpan = 2,
    showLegend = true
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState<number>(0);

    // Update chart dimensions on resize
    useEffect(() => {
        const updateWidth = () => {
            if (chartRef.current) {
                setChartWidth(chartRef.current.offsetWidth);
            }
        };

        updateWidth(); // Initial measurement

        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Responsive font sizes based on container width
    const getFontSize = () => {
        if (chartWidth < 300) return 8;
        if (chartWidth < 500) return 9;
        return 10;
    };

    const fontSize = getFontSize();

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: chartWidth < 500 ? 'bottom' as const : 'top' as const,
                display: showLegend,
                labels: {
                    font: {
                        size: fontSize
                    },
                    boxWidth: chartWidth < 400 ? 8 : 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    },
                    font: {
                        size: fontSize
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: fontSize
                    },
                    maxRotation: chartWidth < 400 ? 45 : 0,
                    minRotation: chartWidth < 400 ? 45 : 0
                },
                grid: {
                    display: false
                }
            }
        }
    };

    // Determine the column span class
    const colSpanClass = `col-span-1 md:col-span-${colSpan}`;

    return (
        <div ref={chartRef} className={`bg-white ${colSpanClass} p-4 rounded-lg border border-border flex flex-col`}>
            <h3 className="text-center text-sm font-medium mb-4">{title}</h3>
            <div style={{ height: `${height}px` }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

// RegionalComparisonChart component specifically for MisOr and Camiguin comparison
interface RegionalComparisonProps {
    title?: string;
    categories: string[];
    misorValues: number[];
    camiguinValues: number[];
    height?: number;
    colSpan?: 1 | 2 | 3 | 4;
}

export const RegionalComparisonChart: React.FC<RegionalComparisonProps> = ({
    title = "Region 10 Province Comparison",
    categories,
    misorValues,
    camiguinValues,
    height = 300,
    colSpan = 2
}) => {
    // Format data for the line chart
    const chartData = {
        labels: categories,
        datasets: [
            {
                label: 'Misamis Oriental',
                data: misorValues,
                borderColor: '#0036C5',
                backgroundColor: 'rgba(0, 54, 197, 0.5)',
                borderWidth: 2,
                tension: 0.3, // Add some curve to the line
                pointRadius: 4,
                pointBackgroundColor: '#0036C5',
            },
            {
                label: 'Camiguin',
                data: camiguinValues,
                borderColor: '#ECC217',
                backgroundColor: 'rgba(236, 194, 23, 0.5)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#ECC217',
            }
        ]
    };

    return <LineChart title={title} data={chartData} height={height} colSpan={colSpan} />;
};

export default LineChart;