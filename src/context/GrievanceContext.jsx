import React, { createContext, useContext, useState, useEffect } from 'react';
import initialGrievances from '../data/grievances.json';

const GrievanceContext = createContext();

const STORAGE_KEY = 'grievease_grievances_v1';
const AUTH_KEY = 'grievease_admin_session';

export function GrievanceProvider({ children }) {
  const [grievances, setGrievances] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading stored grievances:', e);
    }
    return initialGrievances;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
    } catch (e) {
      console.error('Error saving grievances:', e);
    }
  }, [grievances]);

  // Submit new grievance
  const addGrievance = (newRecord) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const completeRecord = {
      ...newRecord,
      date: formattedDate,
      status: 'Submitted',
      timeline: [
        {
          status: 'Submitted',
          date: `${formattedDate} ${formattedTime}`,
          note: `Grievance registered and AI analysis completed with ${newRecord.confidence || 95}% confidence.`
        }
      ]
    };

    setGrievances(prev => [completeRecord, ...prev]);
    return completeRecord;
  };

  // Update grievance status (Submitted -> In Review -> Resolved)
  const updateGrievanceStatus = (id, newStatus, adminNote = '') => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setGrievances(prev => prev.map(item => {
      if (item.id.toLowerCase() === id.toLowerCase()) {
        const defaultNotes = {
          'Submitted': 'Grievance reverted to Submitted state for re-verification.',
          'In Review': 'Admin reviewed grievance; assigned to departmental field team for action.',
          'Resolved': 'Issue rectified on-site. Verified by campus facilities supervisor.'
        };

        const newTimelineEvent = {
          status: newStatus,
          date: `${formattedDate} ${formattedTime}`,
          note: adminNote || defaultNotes[newStatus] || `Status updated to ${newStatus}`
        };

        return {
          ...item,
          status: newStatus,
          timeline: [...(item.timeline || []), newTimelineEvent]
        };
      }
      return item;
    }));
  };

  // Get single grievance
  const getGrievanceById = (id) => {
    if (!id) return null;
    return grievances.find(g => g.id.toLowerCase().trim() === id.toLowerCase().trim()) || null;
  };

  // Reset data to defaults
  const resetToDefault = () => {
    setGrievances(initialGrievances);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGrievances));
  };

  // Admin login / logout
  const loginAdmin = (email, password) => {
    // Demo login: allow default credentials or any reasonable input
    if (email && password) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, message: 'Please enter valid administrative credentials' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        addGrievance,
        updateGrievanceStatus,
        getGrievanceById,
        resetToDefault,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
}

export function useGrievances() {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error('useGrievances must be used within a GrievanceProvider');
  }
  return context;
}
