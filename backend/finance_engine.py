import prediction_model

def calculate_financial_metrics(profile):
    salary = profile['salary']
    loan_emi = profile['loan_emi']
    avg_expenses = profile['avg_expenses']

    disposable_income = salary - loan_emi - avg_expenses

    if salary > 0:
        savings_rate = (disposable_income / salary) * 100
        dti_ratio = (loan_emi / salary) * 100
    else:
        savings_rate = 0.0
        dti_ratio = 0.0

    return {
        'disposable_income': round(disposable_income, 2),
        'savings_rate': round(savings_rate, 2),
        'dti_ratio': round(dti_ratio, 2)
    }

def get_mediclaim_recommendation(age):
    if age < 30:
        cover_amount = "5 Lakhs"
        est_premium = "₹500 - ₹800"
        plan_type = "Individual Health Shield"
        benefits = "Ideal for young professionals. Covers hospitalization and accidents with low premium rates."
    elif age >= 30 and age < 50:
        cover_amount = "10 Lakhs"
        est_premium = "₹1,200 - ₹1,800"
        plan_type = "Family Floater Plan"
        benefits = "Covers you, spouse, and kids. Protects family savings against unexpected medical emergencies."
    else:
        cover_amount = "15 Lakhs"
        est_premium = "₹2,500 - ₹4,000"
        plan_type = "Senior/Comprehensive Health Plan"
        benefits = "Covers critical illnesses, pre-existing diseases, and annual health checkups."

    warning_text = (
        "CRITICAL WARNING: Many people ignore Mediclaim. A single major medical emergency can wipe out "
        "years of savings and force you to sell your Stocks/Mutual Funds. Paying a small monthly premium "
        "shields your investment portfolio from breaking."
    )

    return {
        'plan_type': plan_type,
        'cover_amount': cover_amount,
        'estimated_monthly_premium': est_premium,
        'key_benefits': benefits,
        'importance_note': warning_text
    }

def project_compound_interest(monthly_investment, annual_rate, years):
    monthly_rate = (annual_rate / 100) / 12
    projections = []

    for year in range(1, years + 1):
        months = year * 12
        if monthly_rate > 0:
            future_value = monthly_investment * (((1 + monthly_rate) ** months - 1) / monthly_rate)
        else:
            future_value = monthly_investment * months

        projections.append({
            'year': year,
            'projected_amount': round(future_value, 2),
            'total_invested': round(monthly_investment * months, 2),
            'interest_earned': round(future_value - (monthly_investment * months), 2)
        })

    return projections

def analyze_goal_and_recommend(profile, goal):
    age = profile['age']
    salary = profile['salary']
    loan_emi = profile['loan_emi']
    avg_expenses = profile['avg_expenses']

    goal_name = goal['goal_name']
    target_amount = goal['target_amount']
    target_years = goal['target_years']

    disposable_income = salary - loan_emi - avg_expenses

    needed_monthly = target_amount / (target_years * 12)

    if needed_monthly <= 0:
        traditional_feasibility = "Invalid Goal"
    elif needed_monthly <= disposable_income:
        traditional_feasibility = "Feasible (Fits in your budget)"
    elif needed_monthly <= disposable_income * 1.3:
        traditional_feasibility = "Challenging (Requires budget adjustments)"
    else:
        traditional_feasibility = "Unachievable (Exceeds disposable income)"

    low_risk_rate = 5.0
    low_risk_needed = target_amount / (((1 + (low_risk_rate/1200)) ** (target_years * 12) - 1) / (low_risk_rate/1200)) if target_years > 0 else 0
    low_risk_projections = project_compound_interest(low_risk_needed, low_risk_rate, target_years)
    low_risk_prediction = prediction_model.predict_goal_success(
        age=age,
        salary=salary,
        loan_emi=loan_emi,
        avg_expenses=avg_expenses,
        target_amount=target_amount,
        target_years=target_years,
        needed_monthly=low_risk_needed
    )

    low_risk_allocation = {
        'LIC_PPF': 50,
        'Debt_Mutual_Funds': 30,
        'Mediclaim': 20,
        'Stocks': 0
    }

    mod_risk_rate = 9.0
    mod_risk_needed = target_amount / (((1 + (mod_risk_rate/1200)) ** (target_years * 12) - 1) / (mod_risk_rate/1200)) if target_years > 0 else 0
    mod_risk_projections = project_compound_interest(mod_risk_needed, mod_risk_rate, target_years)
    mod_risk_prediction = prediction_model.predict_goal_success(
        age=age,
        salary=salary,
        loan_emi=loan_emi,
        avg_expenses=avg_expenses,
        target_amount=target_amount,
        target_years=target_years,
        needed_monthly=mod_risk_needed
    )

    mod_risk_allocation = {
        'Balanced_Mutual_Funds': 40,
        'Stocks_Equity': 20,
        'Life_Insurance': 25,
        'Mediclaim': 15
    }

    high_risk_rate = 13.0
    high_risk_needed = target_amount / (((1 + (high_risk_rate/1200)) ** (target_years * 12) - 1) / (high_risk_rate/1200)) if target_years > 0 else 0
    high_risk_projections = project_compound_interest(high_risk_needed, high_risk_rate, target_years)
    high_risk_prediction = prediction_model.predict_goal_success(
        age=age,
        salary=salary,
        loan_emi=loan_emi,
        avg_expenses=avg_expenses,
        target_amount=target_amount,
        target_years=target_years,
        needed_monthly=high_risk_needed
    )

    high_risk_allocation = {
        'Stocks_Equity': 60,
        'Equity_Mutual_Funds': 30,
        'Mediclaim': 10,
        'Life_Insurance': 0
    }

    mediclaim_advice = get_mediclaim_recommendation(age)

    return {
        'goal_name': goal_name,
        'target_amount': target_amount,
        'target_years': target_years,
        'needed_monthly_flat': round(needed_monthly, 2),
        'disposable_income': round(disposable_income, 2),
        'traditional_feasibility': traditional_feasibility,

        'mediclaim_advice': mediclaim_advice,

        'investment_options': {
            'low_risk': {
                'annual_rate': low_risk_rate,
                'monthly_savings_needed': round(low_risk_needed, 2),
                'allocation': low_risk_allocation,
                'projections': low_risk_projections,
                'success_probability': low_risk_prediction['success_probability'],
                'reasons': low_risk_prediction['reasons']
            },
            'moderate_risk': {
                'annual_rate': mod_risk_rate,
                'monthly_savings_needed': round(mod_risk_needed, 2),
                'allocation': mod_risk_allocation,
                'projections': mod_risk_projections,
                'success_probability': mod_risk_prediction['success_probability'],
                'reasons': mod_risk_prediction['reasons']
            },
            'high_risk': {
                'annual_rate': high_risk_rate,
                'monthly_savings_needed': round(high_risk_needed, 2),
                'allocation': high_risk_allocation,
                'projections': high_risk_projections,
                'success_probability': high_risk_prediction['success_probability'],
                'reasons': high_risk_prediction['reasons']
            }
        }
    }

