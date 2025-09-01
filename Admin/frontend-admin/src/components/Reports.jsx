import React, { useState } from 'react';
import {
  FaFilePdf,
  FaFileExcel,
  FaChartBar
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const earnings = {
    monthly: '₹52,400',
    yearly: '₹6,34,800',
    total: '₹10,12,000',
  };

  const bookings = {
    completed: 182,
    ongoing: 15,
    cancelled: 23,
  };

  const monthlyEarningsData = [
    { month: 'Jan', earnings: 40000 },
    { month: 'Feb', earnings: 52000 },
    { month: 'Mar', earnings: 47000 },
    { month: 'Apr', earnings: 58000 },
    { month: 'May', earnings: 62400 },
    { month: 'Jun', earnings: 40000 },
    { month: 'Jul', earnings: 50000 },
    { month: 'Aug', earnings: 56000 },
    { month: 'Sep', earnings: 44000 },
    { month: 'Oct', earnings: 48000 },
    { month: 'Nov', earnings: 51000 },
    { month: 'Dec', earnings: 60000 },
  ];

  // Function to handle PDF and Excel exports
  const handleExport = (type) => {
    if (type === 'PDF') {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Bike Rental Report', 14, 22);
      doc.setFontSize(12);
      doc.text(`From: ${startDate || 'N/A'}  To: ${endDate || 'N/A'}`, 14, 32);

      // Table for earnings and bookings
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Monthly Earnings', earnings.monthly],
          ['Yearly Earnings', earnings.yearly],
          ['Total Earnings', earnings.total],
          ['Completed Bookings', bookings.completed],
          ['Ongoing Bookings', bookings.ongoing],
          ['Cancelled Bookings', bookings.cancelled],
        ],
      });

      // Monthly earnings chart data
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Month', 'Earnings']],
        body: monthlyEarningsData.map((data) => [data.month, `₹${data.earnings}`]),
      });

      doc.save('bike_rental_report.pdf');
    } else if (type === 'Excel') {
      // Excel Data Preparation
      const worksheetData = [
        ['Metric', 'Value'],
        ['Monthly Earnings', earnings.monthly],
        ['Yearly Earnings', earnings.yearly],
        ['Total Earnings', earnings.total],
        ['Completed Bookings', bookings.completed],
        ['Ongoing Bookings', bookings.ongoing],
        ['Cancelled Bookings', bookings.cancelled],
        ['Monthly Earnings Chart', ''],
        ...monthlyEarningsData.map((data) => [data.month, data.earnings]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'bike_rental_report.xlsx');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 flex items-center gap-3">
        <FaChartBar className="text-orange-400" /> Reports & Analytics
      </h1>

      {/* Filter Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Date</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          />
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded mt-2 sm:mt-0"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-lg font-semibold">Monthly Earnings</h3>
          <p className="text-2xl mt-2 text-green-400">{earnings.monthly}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold">Yearly Earnings</h3>
          <p className="text-2xl mt-2 text-blue-400">{earnings.yearly}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-2xl mt-2 text-yellow-400">{earnings.total}</p>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="text-lg font-semibold">Completed Bookings</h3>
          <p className="text-2xl mt-2 text-green-300">{bookings.completed}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold">Ongoing Bookings</h3>
          <p className="text-2xl mt-2 text-blue-300">{bookings.ongoing}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-600">
          <h3 className="text-lg font-semibold">Cancelled Bookings</h3>
          <p className="text-2xl mt-2 text-red-300">{bookings.cancelled}</p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Monthly Earnings Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEarningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#6B7280' }} />
              <Bar dataKey="earnings" fill="#f97316" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleExport('PDF')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          <FaFilePdf /> Export PDF
        </button>
        <button
          onClick={() => handleExport('Excel')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          <FaFileExcel /> Export Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;
