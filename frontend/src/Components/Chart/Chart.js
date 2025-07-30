import React from 'react'
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

function Chart() {
    const { incomes, expenses } = useGlobalContext()

    // Collect unique dates from both incomes & expenses
    const allDates = Array.from(
        new Set([
            ...incomes.map(i => i.date),
            ...expenses.map(e => e.date)
        ])
    ).sort()

    const labels = allDates.map(date => dateFormat(date))

    // Create a helper to get amount by date (0 if not present)
    const getAmountByDate = (arr, date) => {
        const entry = arr.find(i => i.date === date)
        return entry ? entry.amount : 0
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: allDates.map(d => getAmountByDate(incomes, d)),
                borderColor: 'rgba(34,197,94,1)', // green-500
                backgroundColor: 'rgba(34,197,94,0.3)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            },
            {
                label: 'Expenses',
                data: allDates.map(d => getAmountByDate(expenses, d)),
                borderColor: 'rgba(239,68,68,1)', // red-500
                backgroundColor: 'rgba(239,68,68,0.3)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Income vs Expenses Trend' }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        scales: {
            y: { beginAtZero: true }
        }
    }

    return (
        <ChartStyled>
            <Line data={data} options={options} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart
