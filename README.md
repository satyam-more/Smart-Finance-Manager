# 💰 Smart Finance Manager

A comprehensive, AI-powered personal finance management and goal planning application. Smart Finance Manager empowers users to track their financial health, manage savings goals, evaluate goal feasibility using Machine Learning algorithms, and receive personalized investment and budgeting strategies.

---

## ✨ Features

- 🔐 **Authentication & Security**: Secure user registration and login with encrypted password storage.
- 📊 **Financial Health Profiling**: Input age, salary, loan EMIs, and monthly expenses to calculate key financial metrics:
  - **Net & Disposable Income**
  - **Debt-to-Income (DTI) Ratio**
  - **Savings Rate**
  - **Financial Health Score** (Poor, Fair, Good, Excellent)
- 🎯 **Smart Goal Tracking**: Create, edit, track, and manage custom financial goals with target amounts, timelines, and monthly savings allocations.
- 🤖 **ML Goal Feasibility Prediction**: Machine Learning model (Decision Tree Regressor trained on financial parameters) that evaluates goal completion probability and feasibility (High, Moderate, Low, At Risk).
- 📈 **Customized Investment Recommendations**: Tailored portfolio suggestions (Index Funds, Equity Mutual Funds, Debt Funds, FDs, PPF) based on goal duration and user age/risk profile.
- 💡 **Budget Optimization Tips**: Actionable insights to reduce debt, optimize savings, and align monthly contributions with financial goals.
- 🎨 **Modern Responsive UI**: Clean, intuitive visual design built with React and Vite.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19, React Router v7
- **Build Tool**: Vite
- **Styling**: Modern CSS / Design System

### **Backend**
- **Framework**: Python / Flask
- **API Architecture**: RESTful API with Flask-CORS
- **Security**: Werkzeug Security (SHA256 password hashing)

### **Machine Learning & Analytics**
- **ML Framework**: Scikit-Learn (`DecisionTreeRegressor`)
- **Data Processing**: Pandas, NumPy

### **Database**
- **Database Engine**: MySQL Server
- **Driver**: `mysql-connector-python`

---

## 📁 Repository Structure

```text
Smart-Finance-Manager/
├── backend/
│   ├── app.py                # Flask REST API endpoints
│   ├── db_helper.py          # MySQL database connection & CRUD operations
│   ├── finance_engine.py     # Financial metric calculations & recommendation logic
│   ├── prediction_model.py   # Machine Learning model training & prediction pipeline
│   ├── requirements.txt      # Python backend dependencies
│   └── smart_finance.sql     # Database schema SQL script
├── frontend/
│   ├── src/                  # React source code (pages, components, CSS)
│   ├── package.json          # Frontend dependencies and npm scripts
│   ├── vite.config.js        # Vite configuration
│   └── index.html            # Entry HTML template
├── smart_finance.sql         # Main MySQL database dump
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### **Prerequisites**
Make sure you have the following installed on your machine:
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js (v18+)](https://nodejs.org/) & npm
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

---

### 🗄️ 1. Database Setup

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or MySQL CLI).
2. Create the database and import the schema:
   ```sql
   CREATE DATABASE smart_finance_db;
   USE smart_finance_db;
   SOURCE smart_finance.sql;
   ```
3. Update MySQL connection credentials in `backend/db_helper.py` if needed:
   ```python
   DB_CONFIG = {
       'host': 'localhost',
       'user': 'root',
       'password': 'YOUR_MYSQL_PASSWORD',
       'database': 'smart_finance_db'
   }
   ```

---

### 🐍 2. Backend Setup (Flask API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask development server:
   ```bash
   python app.py
   ```
   The backend API will run locally at `http://127.0.0.1:5000`.

---

### ⚛️ 3. Frontend Setup (React App)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## 🔑 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/status` | Server and database health check |
| **POST** | `/api/register` | Register a new user account |
| **POST** | `/api/login` | Log in existing user |
| **GET / POST** | `/api/profile` | Retrieve or update user financial profile |
| **GET / POST** | `/api/goals` | Fetch all user goals or create a new goal |
| **PUT / DELETE** | `/api/goals/<id>` | Update or delete a specific financial goal |
| **GET** | `/api/goals/<id>/recommendations` | Get ML goal prediction & investment recommendations |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
