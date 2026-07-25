import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "port": int(os.getenv("DB_PORT", 3306))
}
DB_NAME = os.getenv("DB_NAME", "smart_finance")


def get_db_connection(include_db=True):
    config = DB_CONFIG.copy()
    if include_db:
        config["database"] = DB_NAME

    try:
        connection = mysql.connector.connect(**config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def initialize_database():
    conn = get_db_connection(include_db=True)
    if conn is None:
        return False
    conn.close()
    return True

def create_user(username, password_hash):
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        query = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(query, (username, password_hash))
        conn.commit()
        return True
    except Error as e:
        print(f"Error creating user: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        return user
    except Error as e:
        print(f"Error fetching user: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def save_profile(user_id, name, age, salary, loan_emi, avg_expenses):
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO profile (user_id, name, age, salary, loan_emi, avg_expenses)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                age = VALUES(age),
                salary = VALUES(salary),
                loan_emi = VALUES(loan_emi),
                avg_expenses = VALUES(avg_expenses)
        """
        values = (user_id, name, age, salary, loan_emi, avg_expenses)
        cursor.execute(query, values)
        conn.commit()
        return True
    except Error as e:
        print(f"Error saving profile for user {user_id}: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def get_profile(user_id):
    conn = get_db_connection()
    if conn is None:
        return None

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM profile WHERE user_id = %s", (user_id,))
        profile = cursor.fetchone()
        return profile
    except Error as e:
        print(f"Error getting profile for user {user_id}: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def add_goal(user_id, goal_name, target_amount, target_years, custom_monthly_savings):
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO goals (user_id, goal_name, target_amount, target_years, custom_monthly_savings)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (user_id, goal_name, target_amount, target_years, custom_monthly_savings)
        cursor.execute(query, values)
        conn.commit()
        return True
    except Error as e:
        print(f"Error adding goal for user {user_id}: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def get_goals(user_id):
    conn = get_db_connection()
    if conn is None:
        return []

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM goals WHERE user_id = %s", (user_id,))
        goals = cursor.fetchall()
        return goals
    except Error as e:
        print(f"Error retrieving goals for user {user_id}: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

def delete_goal(goal_id, user_id):
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM goals WHERE id = %s AND user_id = %s", (goal_id, user_id))
        conn.commit()
        return True
    except Error as e:
        print(f"Error deleting goal: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def update_goal(goal_id, user_id, goal_name, target_amount, target_years, custom_monthly_savings):
    conn = get_db_connection()
    if conn is None:
        return False

    try:
        cursor = conn.cursor()
        query = """
            UPDATE goals 
            SET goal_name = %s, target_amount = %s, target_years = %s, custom_monthly_savings = %s
            WHERE id = %s AND user_id = %s
        """
        values = (goal_name, target_amount, target_years, custom_monthly_savings, goal_id, user_id)
        cursor.execute(query, values)
        conn.commit()
        return True
    except Error as e:
        print(f"Error updating goal: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

