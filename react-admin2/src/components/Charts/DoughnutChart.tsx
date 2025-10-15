import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: any;
    title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
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
        cutout: '70%',
    };

    return (
        <div className="w-full h-full">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;