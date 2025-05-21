import React, { useEffect, useState } from 'react';
import TileHeader from '../reusable/TileHeader';
import axiosInstance from '../../config/axiosConfig';

const AttendanceSummary = () => {
  const [attendanceData, setAttendanceData] = useState({
    daysAttended: 0,
    leavesTaken: 0,
    wfhTaken: 0,
    workingHoursPerMonth: 160, // Static value
  });

  const employeeId = '100';

  const fetchAttendanceData = async () => {
    try {

      // Fetch days attended (attendance count)
      const attendanceResponse = await axiosInstance.post('/api/EmployeeDetails/getEmployeeAttendanceCount', {
        employeeId: employeeId,
      });
      const daysAttended = attendanceResponse.data[0]?.AttendanceCount || 0;
      console.log('Request successful. Attendance Response:', attendanceResponse);

      // Fetch leaves taken
      const leaveResponse = await axiosInstance.post('/api/EmployeeDetails/getEmployeeLeaveCount', {
        employeeId: employeeId,
      });
      const leavesTaken = leaveResponse.data[0]?.LeaveCount || 0;
      console.log('Request successful. Leaves Response:', leaveResponse);

      // Fetch work from home (WFH) days
      const wfhResponse = await axiosInstance.post('/api/EmployeeDetails/getRemoteAttendanceCount', {
        employeeId: employeeId,
      });
      const wfhTaken = wfhResponse.data[0]?.RemoteAttendanceCount || 0;
      console.log('Request successful. WFH Response:', wfhResponse);

      // Fetch working hours per month
      // const workingHoursResponse = await axiosInstance.post('', {
      //   employeeId: employeeId,
      // });
      // const workingHoursPerMonth = workingHoursResponse.data[0]?.WorkingHoursPerMonth || 0;
      // console.log('Request successful. Working Hours Response:', workingHoursResponse);

      // Update state with fetched data
      
      setAttendanceData({
        daysAttended: daysAttended,
        leavesTaken: leavesTaken,
        wfhTaken: wfhTaken,
        workingHoursPerMonth: 160, // Keep this static or calculate if needed
      });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [employeeId]);

  return (
    <div className="bg-white shadow-customShadow rounded-lg font-rubik">
      <TileHeader HeaderText="Attendance Summary This Month" showDatePicker={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3">
        <div className="bg-customOrange-100 text-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Days Attended</h2>
          <p className="text-3xl font-bold">{attendanceData.daysAttended}</p>
        </div>
        <div className="bg-customOrange-100 text-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Leaves Taken</h2>
          <p className="text-3xl font-bold">{attendanceData.leavesTaken}</p>
        </div>
        <div className="bg-customOrange-100 text-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">WFH Taken</h2>
          <p className="text-3xl font-bold">{attendanceData.wfhTaken}</p>
        </div>
        <div className="bg-customOrange-100 text-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Working Hours per Month</h2>
          <p className="text-3xl font-bold">{attendanceData.workingHoursPerMonth}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
