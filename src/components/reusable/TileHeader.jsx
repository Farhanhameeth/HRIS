import React from 'react';

const TileHeader = ({ HeaderText, showDatePicker, selectedDate, onDateChange, showMonthPicker, selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate a list of years, e.g., from 2000 to 2030
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i);

  return (
    <div className="mx-auto bg-white rounded-lg font-rubik">
      <div className="text-sm font-bold bg-customLightBlue rounded-t-lg p-4 border-b flex justify-between items-center">
        <span>{HeaderText}</span>
        <div className="flex space-x-4">
          {showDatePicker && (
            <input 
              type="date" 
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value) : null)}
              className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customLightBlue" 
            />
          )}
          {showMonthPicker && (
            <div className="flex space-x-2">
              <select 
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customLightBlue"
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>

              <select 
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customLightBlue"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TileHeader;
