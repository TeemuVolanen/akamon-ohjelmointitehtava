import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
//import faker from 'faker';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart({chartData}) {
    return <Bar data={chartData} />
};

export default BarChart;

/**
import { CategoryScale, Chart } from "chart.js";

Chart.register(CategoryScale);
 */