import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployeeDetails, selectEmployeeDetails } from '../features/employees/employeeDetailsSlice';
import Announcement from "../components/dashboard/AnnouncementBoard";
import LeaveLogs from "../components/dashboard/LeaveLogs";
import EmployeeBirthdays from "../components/dashboard/EmployeeBirthdays";
import EmployeeOverview from "../components/dashboard/EmployeeOverview";
import PayrollSummary from "../components/dashboard/PayrollSummary";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import AttendanceSummary from "../components/dashboard/AttendanceSummary";

function DashboardPage() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(state => state.sidebar.isCollapsed);

  const employeeDetails = useSelector(selectEmployeeDetails);

  useEffect(() => {
    dispatch(fetchEmployeeDetails())
  }, [dispatch]);
    // Apply dark mode on mount based on localStorage
    useEffect(() => {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

  const details = [
    { label: "Full Name", value: `${employeeDetails[0]?.firstName} ${employeeDetails[0]?.lastName}` },
    { label: "Role", value: employeeDetails[0]?.roleDescription },
    { label: "Country", value: employeeDetails[0]?.countryDescription },
    { label: "Birth Date", value: employeeDetails[0]?.birthDate },
    { label: "Address Line 1", value: employeeDetails[0]?.addressLine1 },
    { label: "Address Line 2", value: employeeDetails[0]?.addressLine2 },
    { label: "City", value: employeeDetails[0]?.city },
    { label: "State", value: employeeDetails[0]?.state },
    { label: "Contract Type", value: employeeDetails[0]?.contractType },
    { label: "Department", value: employeeDetails[0]?.departmentDescription },
    { label: "Unit", value: employeeDetails[0]?.unitDescription },
    { label: "Manager", value: "Shanaka HKL" },
    { label: "Email", value: employeeDetails[0]?.email },
    { label: "Personal Phone No.", value: employeeDetails[0]?.personalPhoneNo },
    { label: "Social Media", value: "Github | LinkedIn | Facebook" }, 
  ];

  return (
    <div>
      {/* Adjust the margin-left based on whether the sidebar is collapsed */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <EmployeeOverview employeeDetails={details}/>
        <div className="flex flex-wrap gap-2 p-3">
          <div className="w-full min-w-[300px] space-y-2">
            <AttendanceSummary />
            {/* <LeaveLogs /> */}
          </div>
          <div className="flex-1 min-w-[500px] space-y-2">
            <Announcement />
            <EmployeeBirthdays />
            {/* <LeaveLogs /> */}
          </div>
          <div className="flex-1 min-w-[500px]">
            <UpcomingEvents />
          </div>
          <div className="flex-1 min-w-[300px]">
            <LeaveLogs />          
          </div>
          <div className="w-full min-w-[300px]">
            <PayrollSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
