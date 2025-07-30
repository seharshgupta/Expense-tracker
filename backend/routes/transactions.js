const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { verifyToken } = require('../controllers/auth');

const router = require('express').Router();


router.post('/add-income', verifyToken, addIncome)
    .get('/get-incomes', verifyToken, getIncomes)
    .delete('/delete-income/:id', verifyToken, deleteIncome)
    .post('/add-expense', verifyToken, addExpense)
    .get('/get-expenses', verifyToken, getExpense)
    .delete('/delete-expense/:id', verifyToken, deleteExpense)

module.exports = router