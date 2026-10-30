# CHAPTER 1 : INTRODUCTION

Smart Finance Manager is an AI-powered personal finance management and goal-planning web application. It helps individuals understand their financial health, create and track savings goals, and receive data-driven predictions on whether those goals are achievable within a chosen time frame. The system combines financial calculations, a Machine Learning prediction model, and personalized investment recommendations into a single, easy-to-use platform built for the Indian financial context (INR currency and instruments such as PPF, LIC, Mutual Funds, Fixed Deposits, and Mediclaim).

## 1.1 Existing System

In most households, personal finance is managed manually or through scattered, disconnected tools. The limitations of the existing approach are:

- **Manual tracking:** Income, expenses, and EMIs are recorded in notebooks or spreadsheets, which is error-prone and time-consuming.
- **No feasibility analysis:** Users set goals like buying a home or funding education without any objective way to judge whether the goal is realistic given their income and expenses.
- **Generic advice:** Online calculators give a single figure but do not consider the user's full financial profile (age, salary, EMIs, and expenses) together.
- **No risk-based planning:** Existing tools rarely compare low-risk, moderate-risk, and high-risk investment strategies side by side for the same goal.
- **No predictive intelligence:** Traditional calculators are purely arithmetic; they cannot estimate a probability of success or explain the reasons behind it.
- **Scattered tools:** Separate apps are needed for budgeting, goal tracking, SIP projection, and insurance planning, with no unified view.

## 1.2 Need for System

The need for the proposed system arises from the gaps in the existing approach:

- A **single platform** to profile financial health and manage multiple goals.
- An **objective feasibility check** that computes how much a user must save each month and whether it fits within their disposable income.
- A **prediction of success probability** using a Machine Learning model, expressed as a simple percentage with human-readable reasons.
- **Risk-based investment strategies** (Low, Moderate, High) with compound-interest projections, so the user can choose a plan that suits their comfort level.
- **Personalized recommendations** for asset allocation and health insurance (Mediclaim) based on the user's age.
- **Secure, multi-user access** so each user's financial data stays private.
- A **modern, responsive interface** accessible from any web browser.

## 1.3 Operating Environment – Hardware and Software

**Hardware Requirements**

| Component | Minimum Requirement |
| :--- | :--- |
| Processor | Intel Core i3 (or equivalent) and above |
| RAM | 4 GB (8 GB recommended) |
| Hard Disk | 20 GB free space |
| Display | 1366 × 768 resolution or higher |
| Internet | Required (client–server communication) |

**Software Requirements**

| Component | Specification |
| :--- | :--- |
| Operating System | Windows 10/11, Linux, or macOS |
| Frontend Framework | React 19 with React Router v7 |
| Frontend Build Tool | Vite 8 |
| Backend Language | Python 3.8+ |
| Backend Framework | Flask (with Flask-CORS) |
| Machine Learning | Scikit-Learn (DecisionTreeRegressor), Pandas, NumPy |
| Database | MySQL Server 8.x |
| Database Driver | mysql-connector-python |
| Security | Werkzeug Security (scrypt password hashing) |
| Web Browser | Google Chrome / Microsoft Edge / Mozilla Firefox (latest) |
| IDE / Tools | VS Code, Node.js (v18+) & npm |

---

# CHAPTER 2 : PROPOSED SYSTEM

## 2.1 Proposed System (Introduction of System)

The proposed Smart Finance Manager is a full-stack web application that automates personal financial planning. After registering and logging in, a user creates a financial profile containing age, monthly salary, loan EMI, and average monthly expenses. From this profile, the system calculates key financial metrics such as **Disposable Income**, **Savings Rate**, and **Debt-to-Income (DTI) Ratio**.

The user can then create one or more **financial goals**, each with a target amount and a target duration in years. For every goal, the system:

1. Computes the flat monthly saving required to reach the target.
2. Checks **traditional feasibility** against the user's disposable income.
3. Builds **three risk-based investment strategies** — Low (5%), Moderate (9%), and High (13%) annual return — and projects the growth of investments year by year using compound interest.
4. Runs a **Machine Learning model** (Decision Tree Regressor) to estimate the **success probability** of the goal and explains the result with reasons.
5. Provides an **age-appropriate Mediclaim (health insurance) recommendation** to protect the user's investment portfolio.

The architecture follows a clean three-tier client–server model:

```
  React SPA  ──HTTP/JSON──►  Flask REST API  ──SQL──►  MySQL Database
 (Vite:5173)                 (127.0.0.1:5000)          (smart_finance)
                                   │
                                   └──► Scikit-Learn Decision Tree Model
```

## 2.2 Module Specifications (Scope)

The system is divided into the following functional modules:

**1. Authentication Module**
- User registration with a unique username and a securely hashed (scrypt) password.
- User login with credential verification.
- Session persistence on the client using browser local storage.

**2. Profile & Financial Health Module**
- Create and update a financial profile (name, age, salary, loan EMI, average expenses).
- Automatic calculation of Disposable Income, Savings Rate, and DTI Ratio.

**3. Goal Management Module**
- Full create, read, update, and delete (CRUD) operations on financial goals.
- Each goal stores name, target amount, target years, and optional custom monthly savings.

**4. Prediction & Recommendation Module**
- ML-based goal success probability prediction with explanatory reasons.
- Risk-based investment allocation (Low / Moderate / High).
- Year-wise compound-interest projection for each strategy.
- Age-based Mediclaim recommendation and budget guidance.

**5. Dashboard & Navigation Module**
- Summary view of financial metrics and goals.
- Navigation across Dashboard, Profile, Goals, and Predictions pages.

**Scope Boundaries (not covered in the current version):**
- No live bank-account or UPI integration — data is entered manually.
- No real-time market data; return rates are assumed standard values.
- The ML model is trained on a synthetically generated dataset, not on real user outcomes.
- No native mobile app — the interface is responsive web only.

## 2.3 Objectives of System

- To give users a clear picture of their **financial health** through automatically computed metrics.
- To allow users to **define and manage financial goals** in a structured way.
- To **predict the feasibility** of each goal using a Machine Learning model and present a success probability with explanations.
- To offer **risk-based investment strategies** with compound-interest projections.
- To deliver **personalized insurance and budgeting recommendations**.
- To ensure **data security and privacy** for every registered user.
- To present all of this through a **clean, responsive, and intuitive** user interface.
