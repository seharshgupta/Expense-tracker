# Expense Tracker - Full Stack Application

A comprehensive expense tracking application built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### Authentication System
- **User Registration**: Secure account creation with email and password
- **User Login**: JWT-based authentication with persistent sessions
- **User-Specific Data**: Each user can only access their own transactions
- **Secure Logout**: Proper session termination and data clearing
- **Password Security**: Bcrypt hashing with salt rounds

### Dashboard
- **Financial Overview**: Total income, expenses, and net balance with visual indicators
- **Monthly Statistics**: Current month's income, expenses, and balance
- **Spending Trends**: Interactive charts showing spending patterns
- **Quick Insights**: Top spending categories, average expenses, highest transactions
- **Recent Activity**: Latest 5 transactions with hover effects

### Transactions Page
- **Comprehensive Transaction History**: All transactions grouped by month
- **Advanced Filtering**: Filter by transaction type (income/expense)
- **Search Functionality**: Search transactions by title or category
- **Sorting Options**: Sort by date, amount, or title (ascending/descending)
- **Monthly Summaries**: Income and expense totals for each month
- **Detailed View**: Transaction descriptions, categories, and formatted dates

### Income & Expense Management
- Add, view, and delete income entries
- Add, view, and delete expense entries with categories
- Form validation and error handling

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Styled Components** - CSS-in-JS styling
- **Chart.js** - Data visualization
- **Moment.js** - Date formatting
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
expense-tracker_fullstack/
├── backend/
│   ├── app.js                 # Main server file
│   ├── controllers/           # Route controllers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   └── db/                   # Database connection
├── frontend/
│   ├── src/
│   │   ├── Components/       # React components
│   │   │   ├── Dashboard/    # Dashboard overview
│   │   │   ├── Transactions/ # Transaction history
│   │   │   ├── Income/       # Income management
│   │   │   └── Expenses/     # Expense management
│   │   ├── context/          # Global state management
│   │   └── styles/           # Global styles
│   └── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker_fullstack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create Environment Variables**
   Create a `.env` file in the backend directory (use `env.example` as reference):
   ```env
   PORT=5001
   MONGO_URL="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourCluster"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5001`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - Register a new account or login with existing credentials
   - Start tracking your expenses!

## 📊 Key Improvements

### Dashboard Enhancements
- **Visual Statistics Cards**: Large, colorful cards with icons for main metrics
- **Monthly Overview**: Current month's financial summary
- **Insights Panel**: Quick analytics including top spending category and averages
- **Recent Activity**: Latest transactions with hover animations
- **Responsive Design**: Mobile-friendly layout

### Transactions Page Features
- **Advanced Filtering**: Filter by transaction type and search functionality
- **Sorting Options**: Multiple sorting criteria with toggle order
- **Monthly Grouping**: Transactions organized by month with summaries
- **Detailed Transaction Cards**: Rich transaction information with categories
- **Transaction Count**: Shows filtered vs total transaction counts

### Navigation Improvements
- **Separate Routes**: Dashboard and Transactions are now distinct pages
- **Clear Navigation**: Updated menu items with proper routing
- **Consistent Styling**: Unified design language across components

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/signup` - Register new user
- `POST /api/v1/login` - User login

### Income (Protected Routes)
- `POST /api/v1/add-income` - Add new income
- `GET /api/v1/get-incomes` - Get user's incomes
- `DELETE /api/v1/delete-income/:id` - Delete income by ID

### Expenses (Protected Routes)
- `POST /api/v1/add-expense` - Add new expense
- `GET /api/v1/get-expenses` - Get user's expenses
- `DELETE /api/v1/delete-expense/:id` - Delete expense by ID

**Note**: All transaction endpoints require authentication via JWT token.

## 🎨 UI/UX Features

- **Modern Design**: Clean, card-based layout with subtle shadows
- **Color Coding**: Green for income, red for expenses
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Proper feedback during data operations
- **Error Handling**: User-friendly error messages

## 🔮 Future Enhancements

- Budget setting and tracking
- Export functionality (PDF, CSV)
- Recurring transactions
- Multiple currency support
- Advanced analytics and reporting
- Dark mode theme
- Push notifications for budget alerts
- Password reset functionality
- Email verification
- Social media login integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository. 