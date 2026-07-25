import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, API_BASE_URL } from '../utils';

export default function DashboardPage() {
  const { user, profile, metrics, goals, loadGoals } = useAppContext();
  const navigate = useNavigate();

  const handleDeleteGoal = async (e, goalId) => {
    e.stopPropagation();
    if (!user || !confirm("Are you sure you want to delete this goal?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': user.id.toString() }
      });
      if (response.ok) {
        loadGoals(user.id);
      } else {
        alert("Failed to delete goal");
      }
    } catch (err) {
      console.error(err);
    }
  };


  const getDtiStatus = (dti) => {
    if (dti < 30) return { label: 'Safe', cls: 'green' };
    if (dti <= 50) return { label: 'Warning', cls: 'yellow' };
    return { label: 'High Risk', cls: 'red' };
  };

  const getSavingsStatus = (rate) => {
    if (rate >= 20) return { label: 'Healthy', cls: 'green' };
    if (rate >= 10) return { label: 'Average', cls: 'yellow' };
    return { label: 'Critical', cls: 'red' };
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username}</p>
        </div>
      </div>

      {!profile ? (
        <div className="dashboard-welcome-card">
          <div className="welcome-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5.25 3.85 10.14 9 11 5.15-.86 9-5.75 9-11V7l-9-5z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2>Complete Your Profile</h2>
          <p>Set up your financial profile to unlock personalized insights, goal tracking, and AI-powered predictions.</p>
          <button className="btn-neon" style={{ maxWidth: '280px' }} onClick={() => navigate('/profile')}>
            Set Up Profile
          </button>
        </div>
      ) : (
        <>
          <div className="dashboard-stats-grid">
            <div className="dash-stat-card">
              <div className="dash-stat-icon green-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">Monthly Salary</span>
                <span className="dash-stat-value">{formatCurrency(profile.salary)}</span>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon violet-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">Disposable Income</span>
                <span className="dash-stat-value text-green">{metrics ? formatCurrency(metrics.disposable_income) : '—'}</span>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon rose-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">Active Goals</span>
                <span className="dash-stat-value">{goals.length}</span>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon amber-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">Monthly EMIs</span>
                <span className="dash-stat-value text-rose">{formatCurrency(profile.loan_emi)}</span>
              </div>
            </div>
          </div>

          {metrics && (
            <div className="dashboard-metrics-section">
              <h3 className="dash-section-heading">Financial Health Overview</h3>
              <div className="dashboard-health-grid">
                <div className="health-gauge-card">
                  <div className="gauge-ring-wrapper">
                    <svg viewBox="0 0 120 120" className="gauge-ring">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={metrics.dti_ratio > 50 ? '#f43f5e' : metrics.dti_ratio > 30 ? '#f59e0b' : '#10b981'}
                        strokeWidth="10"
                        strokeDasharray={`${(metrics.dti_ratio / 100) * 314} 314`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                      />
                    </svg>
                    <div className="gauge-center-text">
                      <span className={`gauge-value ${getDtiStatus(metrics.dti_ratio).cls}`}>{metrics.dti_ratio}%</span>
                    </div>
                  </div>
                  <span className="gauge-label">Debt-to-Income</span>
                  <span className={`badge badge-${getDtiStatus(metrics.dti_ratio).cls}`}>{getDtiStatus(metrics.dti_ratio).label}</span>
                </div>

                <div className="health-gauge-card">
                  <div className="gauge-ring-wrapper">
                    <svg viewBox="0 0 120 120" className="gauge-ring">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={metrics.savings_rate < 10 ? '#f43f5e' : metrics.savings_rate < 20 ? '#f59e0b' : '#10b981'}
                        strokeWidth="10"
                        strokeDasharray={`${(Math.min(metrics.savings_rate, 100) / 100) * 314} 314`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                      />
                    </svg>
                    <div className="gauge-center-text">
                      <span className={`gauge-value ${getSavingsStatus(metrics.savings_rate).cls}`}>{metrics.savings_rate}%</span>
                    </div>
                  </div>
                  <span className="gauge-label">Savings Rate</span>
                  <span className={`badge badge-${getSavingsStatus(metrics.savings_rate).cls}`}>{getSavingsStatus(metrics.savings_rate).label}</span>
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-actions-section">
            <h3 className="dash-section-heading">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-card" onClick={() => navigate('/profile')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Edit Profile</span>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/goals')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span>Add New Goal</span>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/predictions')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>View Predictions</span>
              </button>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="dashboard-goals-preview">
              <h3 className="dash-section-heading">Active Goals</h3>
              <div className="goals-preview-list">
                {goals.slice(0, 3).map((g) => (
                  <div key={g.id} className="goal-preview-card" onClick={() => navigate('/predictions')}>
                    <div className="goal-preview-info">
                      <h4>{g.goal_name}</h4>
                      <p>{formatCurrency(g.target_amount)} in {g.target_years} years</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        className="btn logout-btn"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.7rem', margin: 0 }}
                        onClick={(e) => handleDeleteGoal(e, g.id)}
                      >
                        Delete
                      </button>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
