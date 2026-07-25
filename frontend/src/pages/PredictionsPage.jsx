import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils';

export default function PredictionsPage() {
  const {
    goals, selectedGoalId, setSelectedGoalId,
    recommendations, loadingRecs,
    activeTab, setActiveTab
  } = useAppContext();
  const navigate = useNavigate();

  const renderProjectionChart = (projections, targetAmount) => {
    if (!projections || projections.length === 0) return null;

    const width = 500;
    const height = 220;
    const padding = 40;

    const maxVal = Math.max(...projections.map(p => p.projected_amount), targetAmount) * 1.1;
    const years = projections.length;

    const getX = (year) => padding + (year / years) * (width - 2 * padding);
    const getY = (val) => height - padding - (val / maxVal) * (height - 2 * padding);

    let projectionPath = `M ${getX(0)} ${getY(0)}`;
    projections.forEach((p) => {
      projectionPath += ` L ${getX(p.year)} ${getY(p.projected_amount)}`;
    });

    let areaPath = `${projectionPath} L ${getX(years)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

    let investmentPath = `M ${getX(0)} ${getY(0)}`;
    projections.forEach((p) => {
      investmentPath += ` L ${getX(p.year)} ${getY(p.total_invested)}`;
    });

    const targetY = getY(targetAmount);
    const themeColor = activeTab === 'high' ? '#f43f5e' : activeTab === 'moderate' ? '#8b5cf6' : '#10b981';

    return (
      <div className="chart-container">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Compound Growth Projection</span>
          <span style={{ color: themeColor }}>Rate: {activeTab === 'high' ? '13%' : activeTab === 'moderate' ? '9%' : '5%'} p.a.</span>
        </h4>
        <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />

          <line x1={padding} y1={targetY} x2={width - padding} y2={targetY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x={width - padding - 5} y={targetY - 5} fill="#f59e0b" fontSize="10" textAnchor="end" fontWeight="600">
            Target: {formatCurrency(targetAmount)}
          </text>

          <path d={areaPath} fill="url(#chart-area-grad)" />
          <path d={investmentPath} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={projectionPath} fill="none" stroke={themeColor} strokeWidth="3" />

          {projections.map((p, idx) => {
            const showMarker = idx === 0 || idx === Math.floor(years / 2) || idx === years - 1;
            if (!showMarker) return null;
            return (
              <g key={p.year}>
                <circle cx={getX(p.year)} cy={getY(p.projected_amount)} r="5" fill={themeColor} stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={getX(p.year)} cy={getY(p.total_invested)} r="3.5" fill="#64748b" />
                <text x={getX(p.year)} y={height - padding + 18} fill="#94a3b8" fontSize="10" textAnchor="middle">
                  Yr {p.year}
                </text>
                <text x={getX(p.year)} y={getY(p.projected_amount) - 8} fill="#f8fafc" fontSize="9" fontWeight="600" textAnchor="middle">
                  {formatCurrency(p.projected_amount)}
                </text>
              </g>
            );
          })}
          <text x={padding} y={height - padding + 18} fill="#94a3b8" fontSize="10" textAnchor="middle">
            Start
          </text>
        </svg>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '1.5px', borderBottom: '1.5px dashed #64748b' }}></span>
            Principal Saved
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: themeColor }}>
            <span style={{ display: 'inline-block', width: '10px', height: '3px', background: themeColor }}></span>
            Projected Value
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Prediction & Optimization</h1>
          <p className="page-subtitle">Machine learning analysis and investment strategy</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <p>No active goals found.</p>
            <button className="btn-neon" style={{ maxWidth: '200px', margin: '1rem auto' }} onClick={() => navigate('/goals')}>
              Create a Goal
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select a Goal to Analyze:
            </h4>
            <div className="goals-list">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className={`goal-item-card ${selectedGoalId === g.id ? 'active' : ''}`}
                  onClick={() => setSelectedGoalId(g.id)}
                >
                  <div className="goal-info">
                    <h4>{g.goal_name}</h4>
                    <p>Target: <strong>{formatCurrency(g.target_amount)}</strong> in <strong>{g.target_years} Years</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {loadingRecs && <div className="loading">Running Scikit-Learn DecisionTree classifier...</div>}

          {!loadingRecs && recommendations && (
            <div>
              <div className="prediction-box">
                <div className="prediction-header">
                  <span className="predict-title">AI Success Chance ({activeTab} risk)</span>
                  <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>
                    Decision Tree Model
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className={`predict-percentage ${
                    recommendations.investment_options[`${activeTab}_risk`].success_probability >= 70 ? 'text-green' :
                    recommendations.investment_options[`${activeTab}_risk`].success_probability >= 40 ? 'text-yellow' :
                    'text-rose'
                  }`}>
                    {recommendations.investment_options[`${activeTab}_risk`].success_probability}%
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Feasibility Success Rate
                  </span>
                </div>

                {recommendations.investment_options[`${activeTab}_risk`].reasons.length > 0 && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(16,185,129,0.15)', paddingTop: '0.75rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                      Predictive Feature Explanations:
                    </strong>
                    <ul className="factors-list" style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                      {recommendations.investment_options[`${activeTab}_risk`].reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>
                Investment Strategy Horizon
              </h3>
              <div className="tabs">
                <button
                  className={`tab-btn low ${activeTab === 'low' ? 'active' : ''}`}
                  onClick={() => setActiveTab('low')}
                >
                  Low Risk (5%)
                </button>
                <button
                  className={`tab-btn mod ${activeTab === 'moderate' ? 'active' : ''}`}
                  onClick={() => setActiveTab('moderate')}
                >
                  Moderate Risk (9%)
                </button>
                <button
                  className={`tab-btn high ${activeTab === 'high' ? 'active' : ''}`}
                  onClick={() => setActiveTab('high')}
                >
                  High Risk (13%)
                </button>
              </div>

              {(() => {
                const monthlySavings = recommendations.investment_options[`${activeTab}_risk`].monthly_savings_needed;
                const disposable = recommendations.disposable_income;
                let feasText = '';
                let feasClass = '';
                if (monthlySavings <= disposable * 0.5) {
                  feasText = 'Easily Achievable (Under 50% of surplus)';
                  feasClass = 'text-green';
                } else if (monthlySavings <= disposable) {
                  feasText = 'Feasible (Fits in your budget)';
                  feasClass = 'text-green';
                } else if (monthlySavings <= disposable * 1.3) {
                  feasText = 'Challenging (Requires budget adjustments)';
                  feasClass = 'text-violet';
                } else {
                  feasText = 'Unachievable (Exceeds disposable income)';
                  feasClass = 'text-rose';
                }
                return (
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>Budget Assessment ({activeTab} risk):</span>
                    <strong className={feasClass}>{feasText}</strong>
                  </div>
                );
              })()}

              <div style={{ background: 'rgba(4, 8, 18, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  Required Monthly Savings:
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0' }} className="text-green">
                  {formatCurrency(recommendations.investment_options[`${activeTab}_risk`].monthly_savings_needed)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Needed to target {formatCurrency(recommendations.target_amount)} in {recommendations.target_years} years.
                </div>
              </div>

              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                Suggested Asset Allocation:
              </h4>
              <div className="allocation-grid">
                {Object.entries(recommendations.investment_options[`${activeTab}_risk`].allocation).map(([asset, percent]) => (
                  <div key={asset} className="alloc-card">
                    <div className="alloc-label">{asset.replace(/_/g, ' ')}</div>
                    <div className="alloc-percentage">
                      {percent}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {formatCurrency((recommendations.investment_options[`${activeTab}_risk`].monthly_savings_needed * percent) / 100)} /m
                    </div>
                  </div>
                ))}
              </div>

              {renderProjectionChart(
                recommendations.investment_options[`${activeTab}_risk`].projections,
                recommendations.target_amount
              )}

              <div className="mediclaim-alert">
                <div className="mediclaim-title">
                  🛡️ Mediclaim Safety Net ({recommendations.mediclaim_advice.plan_type})
                </div>
                <div className="mediclaim-body">
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    Recommended Health Cover: <strong className="text-rose">{recommendations.mediclaim_advice.cover_amount}</strong> (Est. premium: <strong>{recommendations.mediclaim_advice.estimated_monthly_premium}</strong>/month).
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    "{recommendations.mediclaim_advice.key_benefits}"
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px dashed rgba(244,63,94,0.15)', paddingTop: '0.5rem' }}>
                    {recommendations.mediclaim_advice.importance_note}
                  </p>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}
