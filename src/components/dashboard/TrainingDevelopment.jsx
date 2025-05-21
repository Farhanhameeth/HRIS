import React from 'react';

function TrainingSummary() {
  const trainingData = [
    { 
      id: '#1', 
      employeeId: 'E123', 
      achieveId: 'A001', 
      firstName: 'Justin', 
      lastName: 'Hogan', 
      courseName: 'React Basics', 
      trainingProvider: 'Udemy', 
      duration: '30 hours' 
    },
    { 
      id: '#2', 
      employeeId: 'E124', 
      achieveId: 'A002', 
      firstName: 'Roberto', 
      lastName: 'Diaz', 
      courseName: 'Advanced JavaScript', 
      trainingProvider: 'Coursera', 
      duration: '40 hours' 
    },
    { 
      id: '#3', 
      employeeId: 'E125', 
      achieveId: 'A003', 
      firstName: 'Will', 
      lastName: 'John', 
      courseName: 'CSS Mastery', 
      trainingProvider: 'Pluralsight', 
      duration: '25 hours' 
    },
    // Add more data as needed
  ];

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md w-full font-rubik text-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Training Summary</h2>
        <select className="border rounded p-2">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Yearly</option>
        </select>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">Employee ID</th>
            <th className="p-2 border-b">Achieve ID</th>
            <th className="p-2 border-b">First Name</th>
            <th className="p-2 border-b">Last Name</th>
            <th className="p-2 border-b">Course Name</th>
            <th className="p-2 border-b">Training Provider</th>
            <th className="p-2 border-b">Duration</th>
          </tr>
        </thead>
        <tbody>
          {trainingData.map((entry, index) => (
            <tr key={index}>
              <td className="p-2 border-b">{entry.id}</td>
              <td className="p-2 border-b">{entry.employeeId}</td>
              <td className="p-2 border-b">{entry.achieveId}</td>
              <td className="p-2 border-b">{entry.firstName}</td>
              <td className="p-2 border-b">{entry.lastName}</td>
              <td className="p-2 border-b">{entry.courseName}</td>
              <td className="p-2 border-b">{entry.trainingProvider}</td>
              <td className="p-2 border-b">{entry.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
}

export default TrainingSummary;
