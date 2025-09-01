import React, { useEffect, useState } from 'react';
import { useCommission } from './CommissionContext';

export default function CommissionSettings() {
  const {
    defaultCommission,
    setDefaultCommission,
    tiers,
    setTiers,
    saveCommissionSettings,
  } = useCommission();

  const defaultTiers = [
    { min: 0, max: 10000, rate: 12 },
    { min: 10001, max: 50000, rate: 10 },
    { min: 50001, max: Infinity, rate: 8 },
  ];

  const [localTiers, setLocalTiers] = useState([]);
  const [localDefault, setLocalDefault] = useState(defaultCommission);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setLocalDefault(defaultCommission);
    setLocalTiers(tiers);
  }, [defaultCommission, tiers]);

  const handleSave = async () => {
    if (!validateTiers(localTiers)) return;
    setDefaultCommission(localDefault);
    setTiers(localTiers);
    await saveCommissionSettings(localTiers, localDefault);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const validateTiers = (tiers) => {
    const sorted = [...tiers].sort((a, b) => a.min - b.min);
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (current.max >= next.min) {
        alert(`Overlap: ₹${current.min} - ₹${current.max} conflicts with ₹${next.min} - ₹${next.max}`);
        return false;
      }
    }
    return true;
  };

  const addTier = () => {
    setLocalTiers([...localTiers, { min: 0, max: '', rate: 0 }]);
  };

  const deleteTier = (index) => {
    const updated = [...localTiers];
    updated.splice(index, 1);
    setLocalTiers(updated);
  };

  const handleReset = () => {
    setLocalDefault(10);
    setLocalTiers(defaultTiers);
    setDefaultCommission(10);
    setTiers(defaultTiers);
    setShowResetConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen font-poppins text-white">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Commission Settings</h1>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded shadow-md">
          ✅ Commission settings saved successfully!
        </div>
      )}

      {/* Default Commission */}
      <div className="bg-gray-800 p-4 rounded border border-gray-700 mb-6">
        <label className="block text-sm text-gray-300 mb-1">Default Commission (%)</label>
        <input
          type="number"
          value={localDefault}
          onChange={(e) => setLocalDefault(Number(e.target.value))}
          className="w-24 p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
      </div>

      {/* Tiers */}
      <div className="bg-gray-800 p-4 rounded border border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-300">Tiered Commission Rates</h2>
          <button onClick={addTier} className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-sm rounded">+ Add Tier</button>
        </div>

        {localTiers.map((tier, index) => (
          <div key={index} className="flex flex-wrap items-center gap-3 mb-3">
            <input type="number" value={tier.min} onChange={(e) => {
              const updated = [...localTiers];
              updated[index].min = Number(e.target.value);
              setLocalTiers(updated);
            }} className="w-24 p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Min" />

            <span className="text-gray-300">to</span>

            <input type="number" value={tier.max === Infinity ? '' : tier.max} onChange={(e) => {
              const updated = [...localTiers];
              updated[index].max = e.target.value === '' ? Infinity : Number(e.target.value);
              setLocalTiers(updated);
            }} className="w-24 p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="∞" />

            <span className="text-orange-400">⇒</span>

            <input type="number" value={tier.rate} onChange={(e) => {
              const updated = [...localTiers];
              updated[index].rate = Number(e.target.value);
              setLocalTiers(updated);
            }} className="w-24 p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="%" />
            <span>%</span>

            <button onClick={() => deleteTier(index)} className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Delete</button>
          </div>
        ))}
      </div>

      {/* Preview Table */}
      <div className="bg-gray-800 p-4 rounded border border-gray-700 mb-6">
        <h3 className="text-md font-semibold mb-2 text-gray-200">📊 Current Commission Tiers</h3>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="text-gray-300 border-b border-gray-700">
              <th className="py-2">Min (₹)</th>
              <th className="py-2">Max (₹)</th>
              <th className="py-2">Commission (%)</th>
            </tr>
          </thead>
          <tbody>
            {localTiers.map((tier, index) => (
              <tr key={index} className="text-gray-100 text-center">
                <td className="py-1">{tier.min}</td>
                <td className="py-1">{tier.max === Infinity ? '∞' : tier.max}</td>
                <td className="py-1">{tier.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold">💾 Save</button>
        <button onClick={() => setShowResetConfirm(true)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold">♻ Reset to Default</button>
      </div>

      {/* Confirm Reset */}
      {showResetConfirm && (
        <div className="mt-4 bg-gray-800 p-4 rounded border border-red-600">
          <p className="text-red-400 mb-3">Are you sure you want to reset to default values?</p>
          <div className="flex gap-4">
            <button onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">Yes, Reset</button>
            <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
