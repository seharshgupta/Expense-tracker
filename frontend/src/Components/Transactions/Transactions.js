import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import moment from 'moment';

function Transactions() {
    const { incomes, expenses, getIncomes, getExpenses } = useGlobalContext();
    const [filter, setFilter] = useState('all'); // all, income, expense
    const [sortBy, setSortBy] = useState('date'); // date, amount, title
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, [getIncomes, getExpenses]);

    // Combine and format all transactions
    const allTransactions = [
        ...incomes.map(income => ({
            ...income,
            type: 'income',
            date: income.date,
            category: 'Income'
        })),
        ...expenses.map(expense => ({
            ...expense,
            type: 'expense',
            date: expense.date,
            category: expense.category || 'General'
        }))
    ];

    // Filter transactions
    const filteredTransactions = allTransactions.filter(transaction => {
        const matchesFilter = filter === 'all' || transaction.type === filter;
        const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Sort transactions
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
            case 'date':
                comparison = new Date(b.date) - new Date(a.date);
                break;
            case 'amount':
                comparison = b.amount - a.amount;
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            default:
                comparison = 0;
        }
        
        return sortOrder === 'desc' ? comparison : -comparison;
    });

    // Calculate statistics
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    // Group transactions by month
    const transactionsByMonth = sortedTransactions.reduce((groups, transaction) => {
        const month = moment(transaction.date).format('MMMM YYYY');
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(transaction);
        return groups;
    }, {});

    return (
        <TransactionsStyled>
            <InnerLayout>
                <h1>Transaction History</h1>
                
                {/* Statistics Cards */}
                <div className="stats-cards">
                    <div className="stat-card income">
                        <h3>Total Income</h3>
                        <p>₹ {totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="stat-card expense">
                        <h3>Total Expenses</h3>
                        <p>₹ {totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="stat-card balance">
                        <h3>Net Balance</h3>
                        <p className={netBalance >= 0 ? 'positive' : 'negative'}>
                            ₹ {netBalance.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters">
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Transactions</option>
                            <option value="income">Income Only</option>
                            <option value="expense">Expenses Only</option>
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="title">Sort by Title</option>
                        </select>
                        <button 
                            className="sort-order-btn"
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        >
                            {sortOrder === 'desc' ? '↓' : '↑'}
                        </button>
                    </div>
                </div>

                {/* Transaction Count */}
                <div className="transaction-count">
                    <p>Showing {sortedTransactions.length} of {allTransactions.length} transactions</p>
                </div>

                {/* Transactions List */}
                <div className="transactions-container">
                    {Object.keys(transactionsByMonth).length > 0 ? (
                        Object.entries(transactionsByMonth).map(([month, transactions]) => (
                            <div key={month} className="month-group">
                                <h3 className="month-header">{month}</h3>
                                <div className="month-total">
                                                            <span>Income: ₹ {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span>
                        <span>Expenses: ₹ {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span>
                                </div>
                                {transactions.map((transaction) => (
                                    <div key={transaction._id} className="transaction-item">
                                        <div className="transaction-info">
                                            <div className="transaction-main">
                                                <h4>{transaction.title}</h4>
                                                <p className="category">{transaction.category}</p>
                                                <p className="date">{moment(transaction.date).format('MMM DD, YYYY')}</p>
                                            </div>
                                            <div className="transaction-amount">
                                                <span className={`amount ${transaction.type}`}>
                                                    {transaction.type === 'expense' ? '-' : '+'}₹ {transaction.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        {transaction.description && (
                                            <p className="description">{transaction.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="no-transactions">
                            <p>No transactions found.</p>
                        </div>
                    )}
                </div>
            </InnerLayout>
        </TransactionsStyled>
    );
}

const TransactionsStyled = styled.div`
    .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;

        .stat-card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 1.5rem;
            text-align: center;

            h3 {
                font-size: 1rem;
                margin-bottom: 0.5rem;
                color: #666;
            }

            p {
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0;
            }

            &.income p {
                color: var(--color-green);
            }

            &.expense p {
                color: #ff6b6b;
            }

            &.balance p.positive {
                color: var(--color-green);
            }

            &.balance p.negative {
                color: #ff6b6b;
            }
        }
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
        flex-wrap: wrap;

        .search-box {
            flex: 1;
            min-width: 250px;

            input {
                width: 100%;
                padding: 0.8rem 1rem;
                border: 2px solid #FFFFFF;
                border-radius: 10px;
                background: #FCF6F9;
                font-size: 1rem;
                outline: none;

                &:focus {
                    border-color: var(--color-green);
                }
            }
        }

        .filters {
            display: flex;
            gap: 0.5rem;
            align-items: center;

            select {
                padding: 0.8rem;
                border: 2px solid #FFFFFF;
                border-radius: 10px;
                background: #FCF6F9;
                font-size: 0.9rem;
                outline: none;
                cursor: pointer;

                &:focus {
                    border-color: var(--color-green);
                }
            }

            .sort-order-btn {
                padding: 0.8rem 1rem;
                border: 2px solid #FFFFFF;
                border-radius: 10px;
                background: #FCF6F9;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    background: var(--color-green);
                    color: white;
                }
            }
        }
    }

    .transaction-count {
        margin-bottom: 1rem;
        color: #666;
        font-size: 0.9rem;
    }

    .transactions-container {
        .month-group {
            margin-bottom: 2rem;

            .month-header {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: #333;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 0.5rem;
            }

            .month-total {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: #666;
                background: #f8f9fa;
                padding: 0.5rem 1rem;
                border-radius: 10px;

                span:first-child {
                    color: var(--color-green);
                }

                span:last-child {
                    color: #ff6b6b;
                }
            }
        }

        .transaction-item {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: transform 0.2s ease;

            &:hover {
                transform: translateY(-2px);
            }

            .transaction-info {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;

                .transaction-main {
                    h4 {
                        margin: 0 0 0.5rem 0;
                        font-size: 1.2rem;
                        color: #333;
                    }

                    .category {
                        margin: 0 0 0.25rem 0;
                        font-size: 0.9rem;
                        color: #666;
                        font-weight: 500;
                    }

                    .date {
                        margin: 0;
                        font-size: 0.8rem;
                        color: #999;
                    }
                }

                .transaction-amount {
                    .amount {
                        font-size: 1.3rem;
                        font-weight: 700;
                        padding: 0.5rem 1rem;
                        border-radius: 10px;
                        background: rgba(255, 255, 255, 0.8);

                        &.income {
                            color: var(--color-green);
                        }

                        &.expense {
                            color: #ff6b6b;
                        }
                    }
                }
            }

            .description {
                margin: 0;
                font-size: 0.9rem;
                color: #666;
                font-style: italic;
                padding-top: 0.5rem;
                border-top: 1px solid #f0f0f0;
            }
        }
    }

    .no-transactions {
        text-align: center;
        padding: 3rem;
        color: #666;
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .controls {
            flex-direction: column;
            align-items: stretch;

            .search-box {
                min-width: auto;
            }

            .filters {
                justify-content: center;
            }
        }

        .transaction-item .transaction-info {
            flex-direction: column;
            gap: 1rem;

            .transaction-amount {
                align-self: flex-end;
            }
        }

        .month-total {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;

export default Transactions; 