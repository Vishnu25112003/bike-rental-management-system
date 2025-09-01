import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CommissionContext = createContext();
const API_URL = 'http://localhost:5000/api/commission';

export function CommissionProvider({ children }) {
  const [defaultCommission, setDefaultCommission] = useState(10);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        if (res.data) {
          setDefaultCommission(res.data.defaultCommission);
          setTiers(res.data.tiers.map(t =>
            t.max === 'Infinity' ? { ...t, max: Infinity } : t
          ));
        }
      })
      .catch(err => console.error('Error loading commission:', err))
      .finally(() => setLoading(false));
  }, []);

  const saveCommissionSettings = async (customTiers, customDefault) => {
    try {
      await axios.post(API_URL, {
        defaultCommission: customDefault ?? defaultCommission,
        tiers: (customTiers ?? tiers).map(t => ({
          ...t,
          max: t.max === Infinity ? 'Infinity' : t.max
        }))
      });
      alert('Commission settings saved successfully!');
    } catch (err) {
      console.error('Failed to save commission settings:', err);
      alert('Failed to save commission settings.');
    }
  };

  const getCommissionRate = (earnings) => {
    const tier = tiers.find(t => earnings >= t.min && earnings <= t.max);
    return tier ? tier.rate : defaultCommission;
  };

  return (
    <CommissionContext.Provider value={{
      defaultCommission,
      setDefaultCommission,
      tiers,
      setTiers,
      getCommissionRate,
      saveCommissionSettings,
      loading
    }}>
      {children}
    </CommissionContext.Provider>
  );
}

export function useCommission() {
  return useContext(CommissionContext);
}
