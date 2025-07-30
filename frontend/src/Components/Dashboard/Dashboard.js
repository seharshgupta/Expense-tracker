import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import moment from 'moment';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState({});

    // Fetch income and expenses data on component mount
    useEffect(() => {
        getIncomes();
        getExpenses();
    }, [getIncomes, getExpenses]);

    // Calculate recent transactions and monthly stats
    useEffect(() => {
        const allTransactions = [
            ...incomes.map(income => ({ ...income, type: 'income' })),
            ...expenses.map(expense => ({ ...expense, type: 'expense' }))
        ];

        // Get 5 most recent transactions
        const recent = allTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        setRecentTransactions(recent);

        // Calculate monthly statistics
        const currentMonth = moment().format('YYYY-MM');
        const monthlyIncome = incomes
            .filter(income => moment(income.date).format('YYYY-MM') === currentMonth)
            .reduce((sum, income) => sum + income.amount, 0);
        const monthlyExpenses = expenses
            .filter(expense => moment(expense.date).format('YYYY-MM') === currentMonth)
            .reduce((sum, expense) => sum + expense.amount, 0);

        setMonthlyStats({
            income: monthlyIncome,
            expenses: monthlyExpenses,
            balance: monthlyIncome - monthlyExpenses
        });
    }, [incomes, expenses]);

    // Calculate spending insights
    const getSpendingInsights = () => {
        if (expenses.length === 0) return null;

        const categories = {};
        expenses.forEach(expense => {
            const category = expense.category || 'General';
            categories[category] = (categories[category] || 0) + expense.amount;
        });

        const topCategory = Object.entries(categories)
            .sort(([,a], [,b]) => b - a)[0];

        const avgExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
        const highestExpense = Math.max(...expenses.map(exp => exp.amount));

        return {
            topCategory: topCategory[0],
            topCategoryAmount: topCategory[1],
            avgExpense,
            highestExpense
        };
    };

    const insights = getSpendingInsights();

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>Financial Dashboard</h1>
                
                {/* Main Stats Cards */}
                <div className="main-stats">
                    <div className="stat-card total-income">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3>Total Income</h3>
                            <p className="amount">Rs. {totalIncome().toLocaleString()}</p>
                            <span className="period">All Time</span>
                        </div>
                    </div>
                    <div className="stat-card total-expense">
                        <div className="stat-icon">💸</div>
                        <div className="stat-content">
                            <h3>Total Expenses</h3>
                            <p className="amount">Rs. {totalExpenses().toLocaleString()}</p>
                            <span className="period">All Time</span>
                        </div>
                    </div>
                    <div className="stat-card total-balance">
                        <div className="stat-icon">⚖️</div>
                        <div className="stat-content">
                            <h3>Net Balance</h3>
                            <p className={`amount ${totalBalance() >= 0 ? 'positive' : 'negative'}`}>
                                Rs. {totalBalance().toLocaleString()}
                            </p>
                            <span className="period">All Time</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Overview */}
                <div className="monthly-overview">
                    <h2>This Month's Overview</h2>
                    <div className="monthly-stats">
                        <div className="monthly-card">
                            <h4>Monthly Income</h4>
                            <p>Rs. {monthlyStats.income?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="monthly-card">
                            <h4>Monthly Expenses</h4>
                            <p>Rs. {monthlyStats.expenses?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="monthly-card">
                            <h4>Monthly Balance</h4>
                            <p className={monthlyStats.balance >= 0 ? 'positive' : 'negative'}>
                                Rs. {monthlyStats.balance?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart and Insights Section */}
                <div className="chart-insights-section">
                    <div className="chart-container">
                        <h2>Spending Trends</h2>
                        <Chart />
                    </div>
                    
                    <div className="insights-container">
                        <h2>Quick Insights</h2>
                        {insights ? (
                            <div className="insights-grid">
                                <div className="insight-card">
                                    <h4>Top Spending Category</h4>
                                    <p className="insight-value">{insights.topCategory}</p>
                                    <span className="insight-detail">Rs. {insights.topCategoryAmount.toLocaleString()}</span>
                                </div>
                                <div className="insight-card">
                                    <h4>Average Expense</h4>
                                    <p className="insight-value">Rs. {insights.avgExpense.toFixed(0)}</p>
                                    <span className="insight-detail">Per transaction</span>
                                </div>
                                <div className="insight-card">
                                    <h4>Highest Expense</h4>
                                    <p className="insight-value">Rs. {insights.highestExpense.toLocaleString()}</p>
                                    <span className="insight-detail">Single transaction</span>
                                </div>
                                <div className="insight-card">
                                    <h4>Total Transactions</h4>
                                    <p className="insight-value">{incomes.length + expenses.length}</p>
                                    <span className="insight-detail">Income: {incomes.length} | Expenses: {expenses.length}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="no-insights">
                                <p>Add some transactions to see insights!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="recent-transactions">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((transaction) => (
                                <div key={transaction._id} className="recent-item">
                                    <div className="transaction-info">
                                        <h4>{transaction.title}</h4>
                                        <p className="date">{moment(transaction.date).format('MMM DD, YYYY')}</p>
                                    </div>
                                    <div className="transaction-amount">
                                        <span className={`amount ${transaction.type}`}>
                                            {transaction.type === 'expense' ? '-' : '+'}Rs. {transaction.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-recent">
                                <p>No recent transactions</p>
                            </div>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .main-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;

        .stat-card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: transform 0.2s ease;

            &:hover {
                transform: translateY(-5px);
            }

            .stat-icon {
                font-size: 3rem;
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
            }

            .stat-content {
                h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                    color: #666;
                }

                .amount {
                    margin: 0 0 0.25rem 0;
                    font-size: 2.2rem;
                    font-weight: 700;
                }

                .period {
                    font-size: 0.9rem;
                    color: #999;
                }

                .positive {
                    color: var(--color-green);
                }

                .negative {
                    color: #ff6b6b;
                }
            }

            &.total-income .amount {
                color: var(--color-green);
            }

            &.total-expense .amount {
                color: #ff6b6b;
            }
        }
    }

    .monthly-overview {
        margin-bottom: 3rem;

        h2 {
            margin-bottom: 1.5rem;
            color: #333;
        }

        .monthly-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;

            .monthly-card {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 15px;
                padding: 1.5rem;
                text-align: center;

                h4 {
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    color: #666;
                }

                p {
                    margin: 0;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #333;

                    &.positive {
                        color: var(--color-green);
                    }

                    &.negative {
                        color: #ff6b6b;
                    }
                }
            }
        }
    }

    .chart-insights-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;

        .chart-container {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 2rem;

            h2 {
                margin-bottom: 1.5rem;
                color: #333;
            }
        }

        .insights-container {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 2rem;

            h2 {
                margin-bottom: 1.5rem;
                color: #333;
            }

            .insights-grid {
                display: grid;
                gap: 1rem;

                .insight-card {
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    padding: 1rem;

                    h4 {
                        margin: 0 0 0.5rem 0;
                        font-size: 0.9rem;
                        color: #666;
                    }

                    .insight-value {
                        margin: 0 0 0.25rem 0;
                        font-size: 1.3rem;
                        font-weight: 700;
                        color: #333;
                    }

                    .insight-detail {
                        font-size: 0.8rem;
                        color: #999;
                    }
                }
            }

            .no-insights {
                text-align: center;
                padding: 2rem;
                color: #666;
            }
        }
    }

    .recent-activity {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 2rem;

        h2 {
            margin-bottom: 1.5rem;
            color: #333;
        }

        .recent-transactions {
            .recent-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                margin-bottom: 1rem;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
                transition: transform 0.2s ease;

                &:hover {
                    transform: translateX(5px);
                }

                .transaction-info {
                    h4 {
                        margin: 0 0 0.25rem 0;
                        font-size: 1.1rem;
                        color: #333;
                    }

                    .date {
                        margin: 0;
                        font-size: 0.9rem;
                        color: #666;
                    }
                }

                .transaction-amount {
                    .amount {
                        font-size: 1.2rem;
                        font-weight: 700;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.9);

                        &.income {
                            color: var(--color-green);
                        }

                        &.expense {
                            color: #ff6b6b;
                        }
                    }
                }
            }

            .no-recent {
                text-align: center;
                padding: 2rem;
                color: #666;
            }
        }
    }

    @media (max-width: 768px) {
        .chart-insights-section {
            grid-template-columns: 1fr;
        }

        .main-stats .stat-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .recent-item {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
`;

export default Dashboard;
