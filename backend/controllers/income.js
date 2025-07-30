const IncomeSchema= require("../models/IncomeModel")


exports.addIncome = async (req, res) => {
    const {title, amount, category, description, date}  = req.body
    const userId = req.userId; // From auth middleware

    const income = IncomeSchema({
        title,
        amount,
        category,
        description,
        date,
        user: userId
    })

    try {
        if(!title || !category || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        
        // Convert amount to number and validate
        const numAmount = Number(amount);
        if(isNaN(numAmount) || numAmount <= 0){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        
        // Validate date
        const dateObj = new Date(date);
        if(isNaN(dateObj.getTime())){
            return res.status(400).json({message: 'Invalid date format!'})
        }
        
        // Update the amount to be a number
        income.amount = numAmount;
        
        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

exports.getIncomes = async (req, res) =>{
    try {
        const userId = req.userId; // From auth middleware
        const incomes = await IncomeSchema.find({ user: userId }).sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    const userId = req.userId; // From auth middleware
    
    try {
        const income = await IncomeSchema.findOneAndDelete({ _id: id, user: userId });
        if (!income) {
            return res.status(404).json({message: 'Income not found'});
        }
        res.status(200).json({message: 'Income Deleted'})
    } catch (err) {
        res.status(500).json({message: 'Server Error'})
    }
}