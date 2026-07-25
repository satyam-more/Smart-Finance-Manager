import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL, formatCurrency } from '../utils';

export default function ProfilePage() {
  const { user, profile, metrics, loadProfile, selectedGoalId, loadRecommendations } = useAppContext();

  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    age: profile?.age?.toString() || '',
    salary: profile?.salary?.toString() || '',
    loan_emi: profile?.loan_emi?.toString() || '',
    avg_expenses: profile?.avg_expenses?.toString() || ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        age: profile.age.toString(),
        salary: profile.salary.toString(),
        loan_emi: profile.loan_emi.toString(),
        avg_expenses: profile.avg_expenses.toString()
      });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          name: profileForm.name,
          age: parseInt(profileForm.age),
          salary: parseFloat(profileForm.salary),
          loan_emi: parseFloat(profileForm.loan_emi || 0),
          avg_expenses: parseFloat(profileForm.avg_expenses || 0)
        })
      });
      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        loadProfile(user.id);
        if (selectedGoalId) {
          loadRecommendations(selectedGoalId, user.id);
        }
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the backend API.");
    } finally {
      setSaving(false);
    }
  };

  const getDtiBadge = (dti) => {
    if (dti < 30) return <span className="badge badge-green">Safe (&lt; 30%)</span>;
    if (dti <= 50) return <span className="badge badge-yellow">Warning (30%-50%)</span>;
    return <span className="badge badge-red">High Risk (&gt; 50%)</span>;
  };

  const getSavingsBadge = (rate) => {
    if (rate >= 20) return <span className="badge badge-green">Healthy (&gt;= 20%)</span>;
    if (rate >= 10) return <span className="badge badge-yellow">Average (10%-20%)</span>;
    return <span className="badge badge-red">Critical (&lt; 10%)</span>;
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget & Profile</h1>
          <p className="page-subtitle">Manage your financial details and view health metrics</p>
        </div>
      </div>

      <div className="profile-page-grid">
        <div className="glass-card">
          <h2 className="section-title">Personal Details</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.name}
                onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.age}
                  onChange={e => setProfileForm({...profileForm, age: e.target.value})}
                  placeholder="e.g. 28"
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Salary (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.salary}
                  onChange={e => setProfileForm({...profileForm, salary: e.target.value})}
                  placeholder="e.g. 80000"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Monthly Loan EMIs (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.loan_emi}
                  onChange={e => setProfileForm({...profileForm, loan_emi: e.target.value})}
                  placeholder="e.g. 15000"
                />
              </div>
              <div className="form-group">
                <label>Avg Monthly Expenses (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.avg_expenses}
                  onChange={e => setProfileForm({...profileForm, avg_expenses: e.target.value})}
                  placeholder="e.g. 30000"
                />
              </div>
            </div>

            <button type="submit" className="btn-neon" style={{ marginTop: '0.5rem' }} disabled={saving}>
              {saving ? 'Saving...' : saved ? '✓ Saved Successfully' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {profile && metrics && (
          <div className="glass-card">
            <h2 className="section-title">Financial Ratios</h2>
            <div className="metrics-row">
              <div className="metric-card">
                <span className="metric-desc">Debt-to-Income</span>
                <div className={`metric-val ${metrics.dti_ratio > 50 ? 'red' : metrics.dti_ratio > 30 ? 'yellow' : 'green'}`}>
                  {metrics.dti_ratio}%
                </div>
                {getDtiBadge(metrics.dti_ratio)}
              </div>
              <div className="metric-card">
                <span className="metric-desc">Savings Rate</span>
                <div className={`metric-val ${metrics.savings_rate < 10 ? 'red' : metrics.savings_rate < 20 ? 'yellow' : 'green'}`}>
                  {metrics.savings_rate}%
                </div>
                {getSavingsBadge(metrics.savings_rate)}
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Liquid Monthly Surplus: <strong className="text-green">{formatCurrency(metrics.disposable_income)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
