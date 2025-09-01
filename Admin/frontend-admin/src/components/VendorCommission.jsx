import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VendorCommission() {
  const [commission, setCommission] = useState(null);

  const fetchCommission = () => {
    axios.get('http://localhost:5000/api/commission')
      .then(res => setCommission(res.data))
      .catch(err => console.error('Failed to load commission:', err));
  };

  useEffect(() => {
    fetchCommission(); // Initial load
    const interval = setInterval(fetchCommission, 10000); // Fetch every 10s
    return () => clearInterval(interval); // Clean up
  }, []);

  if (!commission) return <p className="text-white p-4">Loading commission settings...</p>;

  return (
    <div className="p-4 text-white font-poppins bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Commission Structure</h2>

      <p className="mb-3">💰 <strong>Default Commission:</strong> {commission.defaultCommission}%</p>

      <h3 className="text-lg font-semibold text-gray-300 mb-2">Tiered Commission:</h3>
      <ul className="space-y-2">
        {commission.tiers.map((tier, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded shadow text-sm">
            ₹{tier.min} - ₹{tier.max === 1000000000 ? '∞' : tier.max} :
            <span className="text-orange-400 font-semibold ml-1">{tier.rate}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
