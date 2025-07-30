import React, { useContext, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5001/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleError = (err) => {
        console.error('API Error:', err);
        if (err.response) {
            // Server responded with error status
            setError(err.response.data?.message || `Server error: ${err.response.status}`);
        } else if (err.request) {
            // Request was made but no response received
            setError("Unable to connect to server. Please check your connection.");
        } else {
            // Something else happened
            setError("Something went wrong. Please try again.");
        }
    };

    const addIncome = async (income) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}add-income`, income, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getIncomes();
        } catch (err) {
            handleError(err);
        }
    };

    const getIncomes = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${BASE_URL}get-incomes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes(data);
        } catch (err) {
            handleError(err);
        }
    }, []);

    const deleteIncome = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}delete-income/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getIncomes(); // Refresh incomes after deletion
        } catch (err) {
            handleError(err);
        }
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}add-expense`, expense, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getExpenses(); // Refresh expenses after adding
        } catch (err) {
            handleError(err);
        }
    };

    // Fetch expenses
    const getExpenses = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${BASE_URL}get-expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(data);
        } catch (err) {
            handleError(err);
        }
    }, []);

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}delete-expense/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            getExpenses(); // Refresh expenses after deletion
        } catch (err) {
            handleError(err);
        }
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get the latest transaction history (last 3 transactions)
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    // Authentication functions
    const login = async (credentials) => {
        try {
            const { data } = await axios.post(`${BASE_URL}login`, credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setError('');
        } catch (err) {
            handleError(err);
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await axios.post(`${BASE_URL}signup`, userData);
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setError('');
        } catch (err) {
            handleError(err);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setIncomes([]);
        setExpenses([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Check if user is already logged in
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                expenses,
                totalIncome,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError,
                user,
                isAuthenticated,
                login,
                signup,
                logout,
                checkAuth,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use Global Context
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
