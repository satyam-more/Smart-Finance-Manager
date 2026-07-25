import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor


trained_model = None
feature_columns = ['age', 'savings_rate', 'dti_ratio', 'goal_intensity', 'target_years']

def generate_synthetic_dataset(num_samples=2000):
    np.random.seed(42)

    data = []
    for _ in range(num_samples):
        age = int(np.random.randint(22, 60))
        salary = float(np.random.randint(25000, 180000))
        dti_ratio = float(np.random.uniform(0.0, 0.6))
        expense_ratio = float(np.random.uniform(0.2, 0.6))

        savings_rate = 1.0 - dti_ratio - expense_ratio
        if savings_rate < 0.0:
            savings_rate = 0.0

        disposable_income = salary * savings_rate

        target_years = int(np.random.randint(2, 16))
        target_amount = float(np.random.randint(50000, 50000000))

        needed_monthly = target_amount / (target_years * 12)

        if disposable_income > 0:
            goal_intensity = needed_monthly / disposable_income
        else:
            goal_intensity = 2.0

        if goal_intensity > 1.0:
            success_prob = 0.25 - (goal_intensity - 1.0) * 0.12
            success_prob = max(0.01, min(0.20, success_prob))
        else:
            success_prob = 0.85 - (goal_intensity * 0.35) - (dti_ratio * 0.25)

            if savings_rate >= 0.30:
                success_prob += 0.15
            elif savings_rate >= 0.20:
                success_prob += 0.08
            elif savings_rate < 0.10:
                success_prob -= 0.2

            if target_years >= 10:
                success_prob += 0.10
            elif target_years >= 5:
                success_prob += 0.05

            if age <= 30:
                success_prob += 0.05
            elif age > 50:
                success_prob -= 0.05

            if dti_ratio < 0.15:
                success_prob += 0.08

            if goal_intensity <= 0.5:
                success_prob += 0.10
            elif goal_intensity <= 1.0:
                success_prob += 0.03

            success_prob = max(0.05, min(0.98, success_prob))


        data.append({
            'age': age,
            'savings_rate': savings_rate * 100,
            'dti_ratio': dti_ratio * 100,
            'goal_intensity': goal_intensity * 100,
            'target_years': target_years,
            'success_prob': success_prob * 100
        })

    return pd.DataFrame(data)

def train_prediction_model():
    global trained_model

    print("Generating synthetic data science dataset...")
    df = generate_synthetic_dataset()

    X = df[feature_columns]
    y = df['success_prob']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = DecisionTreeRegressor(max_depth=5, random_state=42)

    model.fit(X_train, y_train)

    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Data Science Model trained successfully!")
    print(f"-> Training Set R2 Score: {train_score * 100:.2f}%")
    print(f"-> Testing Set R2 Score: {test_score * 100:.2f}%")

    trained_model = model


    importances = model.feature_importances_
    print("Model Feature Importances:")
    for col, imp in zip(feature_columns, importances):
        print(f"  - {col}: {imp * 100:.2f}%")

def predict_goal_success(age, salary, loan_emi, avg_expenses, target_amount, target_years, needed_monthly=None):
    global trained_model

    if trained_model is None:
        train_prediction_model()

    disposable_income = salary - loan_emi - avg_expenses

    savings_rate = (disposable_income / salary * 100) if salary > 0 else 0.0

    dti_ratio = (loan_emi / salary * 100) if salary > 0 else 0.0

    if needed_monthly is None:
        needed_monthly = target_amount / (target_years * 12)

    if disposable_income > 0:
        goal_intensity = (needed_monthly / disposable_income) * 100
    else:
        goal_intensity = 200.0


    input_data = pd.DataFrame([{
        'age': age,
        'savings_rate': savings_rate,
        'dti_ratio': dti_ratio,
        'goal_intensity': goal_intensity,
        'target_years': target_years
    }])

    input_data = input_data[feature_columns]

    success_probability = trained_model.predict(input_data)[0]
    success_probability = max(1.0, min(98.0, success_probability))


    reasons = []
    if dti_ratio > 40:
        reasons.append("Your Debt-to-Income (DTI) ratio is high (above 40%), meaning EMIs consume a large part of your salary.")
    if savings_rate < 15:
        reasons.append("Your monthly savings rate is low (under 15%), leaving little room for unexpected expenses.")
    if goal_intensity > 70:
        reasons.append("This goal requires over 70% of your disposable income, which puts high pressure on your monthly budget.")
    elif goal_intensity > 40:
        reasons.append("This goal requires a moderate portion of your disposable income (40%-70%). It is achievable but requires discipline.")
    else:
        reasons.append("The goal intensity is low (under 40% of disposable income), making it highly manageable.")

    if age > 50 and target_years > 10:
        reasons.append("The goal timeline extends past retirement age, increasing the prediction risk factor.")

    return {
        'success_probability': round(success_probability, 1),
        'reasons': reasons,
        'metrics': {
            'savings_rate': round(savings_rate, 1),
            'dti_ratio': round(dti_ratio, 1),
            'goal_intensity': round(goal_intensity, 1)
        }
    }

if __name__ == '__main__':
    train_prediction_model()
    test_result = predict_goal_success(30, 80000, 10000, 30000, 500000, 5)
    print("Test Prediction Output:", test_result)
