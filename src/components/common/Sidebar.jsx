import React from "react";
import {
  FaUser,
  FaBook,
  FaDollarSign,
  FaChartLine,
  FaGraduationCap,
  FaHandHoldingUsd,
  FaTicketAlt,
  FaCogs,
  FaDatabase,
  FaWrench,
  FaRegBuilding,
  FaBriefcaseMedical,
  FaReceipt,
  FaDashcube,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../features/navbar/sidebarSlice";
import { logout, selectDepartment } from "../../features/auth/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const department = useSelector(selectDepartment);

  // Define sidebar items, conditionally move "Database" and "Resources" above "Settings"
  const sidebarItems = [
    { to: "/dashboard", icon: <FaDashcube />, label: "Dashboard" },
    { to: "/profile", icon: <FaUser />, label: "Profile" },
    { to: "/leave", icon: <FaBook />, label: "Leave" },
    { to: "/payroll", icon: <FaDollarSign />, label: "Payroll" },
    { to: "/kpi", icon: <FaChartLine />, label: "KPI" },
    { to: "/trainings", icon: <FaGraduationCap />, label: "Trainings" },
    { to: "/loans", icon: <FaHandHoldingUsd />, label: "Loans" },
    { to: "/tickets", icon: <FaTicketAlt />, label: "Ticketing" },
    { to: "/structure", icon: <FaRegBuilding />, label: "Structure" },
    { to: "/grievances", icon: <FaWrench />, label: "Grievances" },
    { to: "/reports", icon: <FaReceipt />, label: "Reports" },
    // Conditionally include "Database" and "Resources" above "Settings"
    ...(department === "Human Resource"
      ? [
          { to: "/database", icon: <FaDatabase />, label: "Database" },
          { to: "/resources", icon: <FaBriefcaseMedical />, label: "Resources" }
        ]
      : []),
    { to: "/settings", icon: <FaCogs />, label: "Settings" } // Settings moved after "Database" and "Resources"
  ];

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <aside
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
        //customGrey
      } bg-black fixed overflow-y-auto scrollbar-hide no-scrollbar transition-all duration-300`}
    >
      <nav className="flex flex-col justify-between h-full">
        <div>
          <div
            className={`p-5 flex items-center justify-between py-10 ${
              isCollapsed && "justify-center"
            }`}
          >
            <div
              className="flex items-center cursor-pointer rounded-lg"
              onClick={handleToggleSidebar}
            >
              <img
                src="/IQ_Logo_Old.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              {!isCollapsed && (
                <span className="text-white text-lg font-semibold ml-2">
                  HRIS
                </span>
              )}
            </div>
          </div>
          <ul className="flex flex-col space-y-2">
            {sidebarItems.map(({ to, icon, label }) => (
              <NavLink
                to={to}
                key={to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl mx-1 ${
                    isActive ? "text-white" : "text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <li
                    className={`px-7 py-3 flex items-center rounded-xl hover:mx-1  ${
                      isActive ? "bg-red-600 text-white" : "hover:bg-red-800"
                    }`}
                  >
                    {icon}
                    {!isCollapsed && <span className="ml-2">{label}</span>}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
