from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import db_helper
import finance_engine

app = Flask(__name__)
CORS(app)

db_initialized = False
try:
    db_initialized = db_helper.initialize_database()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")

def get_authorized_user_id():
    user_id_header = request.headers.get('X-User-Id')
    if not user_id_header:
        return None
    try:
        return int(user_id_header)
    except ValueError:
        return None

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "database_connected": db_initialized
    })

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    existing_user = db_helper.get_user_by_username(username)
    if existing_user:
        return jsonify({"error": "Username is already taken"}), 409

    password_hash = generate_password_hash(password)

    success = db_helper.create_user(username, password_hash)
    if success:
        return jsonify({"message": "User registered successfully! Please log in."}), 201
    else:
        return jsonify({"error": "Failed to create user."}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = db_helper.get_user_by_username(username)
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    if check_password_hash(user['password'], password):
        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": user['id'],
                "username": user['username']
            }
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/profile', methods=['POST'])
def save_user_profile():
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name")
    age = data.get("age")
    salary = data.get("salary")
    loan_emi = data.get("loan_emi", 0.0)
    avg_expenses = data.get("avg_expenses", 0.0)

    if not name or age is None or salary is None:
        return jsonify({"error": "Missing required fields (name, age, salary)"}), 400

    try:
        age = int(age)
        salary = float(salary)
        loan_emi = float(loan_emi)
        avg_expenses = float(avg_expenses)
    except ValueError:
        return jsonify({"error": "Invalid numeric format"}), 400

    success = db_helper.save_profile(user_id, name, age, salary, loan_emi, avg_expenses)
    if success:
        return jsonify({"message": "Profile saved successfully!"}), 200
    else:
        return jsonify({"error": "Failed to save profile."}), 500

@app.route('/api/profile', methods=['GET'])
def get_user_profile():
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    profile = db_helper.get_profile(user_id)
    if not profile:
        return jsonify({"profile": None, "metrics": None})

    metrics = finance_engine.calculate_financial_metrics(profile)

    return jsonify({
        "profile": profile,
        "metrics": metrics
    })

@app.route('/api/goals', methods=['POST'])
def add_user_goal():
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    goal_name = data.get("goal_name")
    target_amount = data.get("target_amount")
    target_years = data.get("target_years")
    custom_monthly_savings = data.get("custom_monthly_savings", 0.0)

    if not goal_name or not target_amount or not target_years:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        target_amount = float(target_amount)
        target_years = int(target_years)
        custom_monthly_savings = float(custom_monthly_savings)
    except ValueError:
        return jsonify({"error": "Invalid numeric format"}), 400

    success = db_helper.add_goal(user_id, goal_name, target_amount, target_years, custom_monthly_savings)
    if success:
        return jsonify({"message": "Goal added successfully!"}), 200
    else:
        return jsonify({"error": "Failed to save goal"}), 500

@app.route('/api/goals', methods=['GET'])
def get_user_goals():
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    goals = db_helper.get_goals(user_id)
    return jsonify(goals)

@app.route('/api/goals/<int:goal_id>', methods=['DELETE'])
def delete_user_goal(goal_id):
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    success = db_helper.delete_goal(goal_id, user_id)
    if success:
        return jsonify({"message": "Goal deleted successfully!"}), 200
    else:
        return jsonify({"error": "Failed to delete goal"}), 500

@app.route('/api/goals/<int:goal_id>', methods=['PUT'])
def update_user_goal(goal_id):
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    goal_name = data.get("goal_name", "").strip()
    target_amount = data.get("target_amount")
    target_years = data.get("target_years")
    custom_monthly_savings = data.get("custom_monthly_savings", 0.0)

    if not goal_name or target_amount is None or target_years is None:
        return jsonify({"error": "Goal name, target amount, and target years are required"}), 400

    try:
        target_amount = float(target_amount)
        target_years = int(target_years)
        custom_monthly_savings = float(custom_monthly_savings)
    except ValueError:
        return jsonify({"error": "Invalid numeric values"}), 400

    success = db_helper.update_goal(goal_id, user_id, goal_name, target_amount, target_years, custom_monthly_savings)
    if success:
        return jsonify({"message": "Goal updated successfully!"}), 200
    else:
        return jsonify({"error": "Failed to update goal"}), 500


@app.route('/api/goals/<int:goal_id>/recommendations', methods=['GET'])
def get_goal_recommendations(goal_id):
    user_id = get_authorized_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized. Please log in first."}), 401

    profile = db_helper.get_profile(user_id)
    if not profile:
        return jsonify({"error": "Please create a user profile first."}), 400

    goals = db_helper.get_goals(user_id)
    selected_goal = None
    for goal in goals:
        if goal['id'] == goal_id:
            selected_goal = goal
            break

    if not selected_goal:
        return jsonify({"error": "Goal not found"}), 404

    analysis = finance_engine.analyze_goal_and_recommend(profile, selected_goal)
    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
