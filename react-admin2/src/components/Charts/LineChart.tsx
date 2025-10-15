import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

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
    data: any;
    title?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: '#e5e7eb',
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;