import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL, formatCurrency } from '../utils';

export default function GoalsPage() {
  const { user, profile, goals, loadGoals, setSelectedGoalId } = useAppContext();
  const navigate = useNavigate();

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [goalForm, setGoalForm] = useState({
    goal_name: '',
    target_amount: '',
    target_years: ''
  });

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const url = editingGoalId 
      ? `${API_BASE_URL}/goals/${editingGoalId}` 
      : `${API_BASE_URL}/goals`;
      
    const method = editingGoalId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          goal_name: goalForm.goal_name,
          target_amount: parseFloat(goalForm.target_amount),
          target_years: parseInt(goalForm.target_years)
        })
      });
      const data = await response.json();

      if (response.ok) {
        setGoalForm({ goal_name: '', target_amount: '', target_years: '' });
        setEditingGoalId(null);
        loadGoals(user.id);
      } else {
        alert(data.error || `Failed to ${editingGoalId ? 'update' : 'add'} goal`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (e, goalId) => {
    e.stopPropagation();
    if (!user || !confirm("Are you sure you want to delete this goal?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': user.id.toString() }
      });
      if (response.ok) {
        if (editingGoalId === goalId) {
          setEditingGoalId(null);
          setGoalForm({ goal_name: '', target_amount: '', target_years: '' });
        }
        loadGoals(user.id);
      } else {
        alert("Failed to delete goal");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (e, goal) => {
    e.stopPropagation();
    setEditingGoalId(goal.id);
    setGoalForm({
      goal_name: goal.goal_name,
      target_amount: goal.target_amount.toString(),
      target_years: goal.target_years.toString()
    });
  };

  const handleGoalClick = (goalId) => {
    setSelectedGoalId(goalId);
    navigate('/predictions');
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Goals</h1>
          <p className="page-subtitle">Set targets and track your wealth-building journey</p>
        </div>
      </div>

      <div className="goals-page-grid">
        <div className="glass-card">
          <h2 className="section-title">{editingGoalId ? "Edit Goal" : "Create New Goal"}</h2>
          {profile ? (
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={goalForm.goal_name}
                  onChange={e => setGoalForm({...goalForm, goal_name: e.target.value})}
                  placeholder="e.g. Child Higher Education, Home Downpayment"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Target Amount (INR)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={goalForm.target_amount}
                    onChange={e => setGoalForm({...goalForm, target_amount: e.target.value})}
                    placeholder="e.g. 1000000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Years to Achieve</label>
                  <input
                    type="number"
                    className="form-control"
                    value={goalForm.target_years}
                    onChange={e => setGoalForm({...goalForm, target_years: e.target.value})}
                    placeholder="e.g. 8"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-neon">
                  {editingGoalId ? 'Save Changes' : 'Add Goal'}
                </button>
                {editingGoalId && (
                  <button
                    type="button"
                    className="btn logout-btn"
                    style={{ margin: 0, width: 'auto', padding: '0.6rem 1.2rem' }}
                    onClick={() => {
                      setEditingGoalId(null);
                      setGoalForm({ goal_name: '', target_amount: '', target_years: '' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="empty-state">Complete your profile setup to activate target planner.</div>
          )}
        </div>

        <div className="glass-card">
          <h2 className="section-title">Active Goals</h2>
          {goals.length === 0 ? (
            <div className="empty-state">No active goals created yet. Use the form to add your first goal.</div>
          ) : (
            <div className="goals-list">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="goal-item-card"
                  onClick={() => handleGoalClick(g.id)}
                >
                  <div className="goal-info">
                    <h4>{g.goal_name}</h4>
                    <p>Target: <strong>{formatCurrency(g.target_amount)}</strong> in <strong>{g.target_years} Years</strong></p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      className="btn-predict-sm"
                      onClick={(e) => { e.stopPropagation(); handleGoalClick(g.id); }}
                    >
                      Analyze
                    </button>
                    <button
                      className="btn-predict-sm"
                      style={{ background: 'var(--violet-primary)' }}
                      onClick={(e) => handleEditClick(e, g)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn logout-btn"
                      style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem', margin: 0 }}
                      onClick={(e) => handleDeleteGoal(e, g.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
