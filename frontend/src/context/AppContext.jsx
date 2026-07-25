import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('moderate');
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('inzofin_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadProfile(parsedUser.id);
      loadGoals(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    if (selectedGoalId && user) {
      loadRecommendations(selectedGoalId, user.id);
    } else {
      setRecommendations(null);
    }
  }, [selectedGoalId]);

  const loadProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setMetrics(data.metrics);
      } else {
        setProfile(null);
        setMetrics(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadGoals = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecommendations = async (goalId, userId) => {
    setLoadingRecs(true);
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/recommendations`, {
        headers: { 'X-User-Id': userId.toString() }
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data);
      } else {
        alert(data.error || "Failed to load recommendations");
        setSelectedGoalId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the backend API.");
      setSelectedGoalId(null);
    } finally {
      setLoadingRecs(false);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('inzofin_user', JSON.stringify(userData));
    loadProfile(userData.id);
    loadGoals(userData.id);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('inzofin_user');
    setProfile(null);
    setMetrics(null);
    setGoals([]);
    setSelectedGoalId(null);
    setRecommendations(null);
  };

  const value = {
    user,
    profile,
    metrics,
    goals,
    selectedGoalId,
    recommendations,
    activeTab,
    loadingRecs,
    setSelectedGoalId,
    setActiveTab,
    loadProfile,
    loadGoals,
    loadRecommendations,
    loginUser,
    logoutUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
