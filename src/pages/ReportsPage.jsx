import React, { useState, useEffect } from 'react';

const reports = [
  { id: 1, name: 'Annual Report 2022', category: 'Annual' },
  { id: 2, name: 'Monthly Report June', category: 'Monthly' },
  { id: 3, name: 'Quarterly Report Q1', category: 'Quarterly' },
  { id: 4, name: 'Monthly Report July', category: 'Monthly' },
  { id: 5, name: 'Annual Report 2023', category: 'Annual' },
  { id: 6, name: 'Quarterly Report Q2', category: 'Quarterly' },
  { id: 7, name: 'Annual Report 2024', category: 'Annual' },
  { id: 8, name: 'Monthly Report August', category: 'Monthly' },
  { id: 9, name: 'Quarterly Report Q3', category: 'Quarterly' },
];

const categories = ['All', 'Annual', 'Monthly', 'Quarterly'];

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredReports, setFilteredReports] = useState(reports);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Apply dark mode globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    filterReports();
  }, [searchTerm, selectedCategory]);

  const filterReports = () => {
    let filtered = reports;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((report) => report.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Reports</h1>
        {/* Dark Mode Toggle */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="dark:text-white">Enable Dark Mode</span>
        </label>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md flex-1 mr-4"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => alert(`Viewing report: ${report.name}`)}
          >
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              {report.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{report.category} Report</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
