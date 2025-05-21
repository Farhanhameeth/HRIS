import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TileHeader from "../reusable/TileHeader";
import "react-tooltip/dist/react-tooltip.css";
import AvatarIcon from "../../../public/User.png";
import { fetchLeaves,
        addLeave,
        setSelectedLeave,
        updateLeaveStatus,
        fetchAllEmployees,
        fetchAllLeaveTypes,
        submitLeave,
        setIsModalOpen,
        setCurrentPage,
        setItemsPerPage, 
} from "../../features/leave/leaveSlice";
import {
  fetchVisualLeaveData,
  selectVisualLeaveData,
} from "../../features/leave/visualLeaveSlice";
import { selectEmployeeId, selectUserId } from '../../features/auth/authSlice';

const LeaveLogs = () => {
  const dispatch = useDispatch();

  // Get visual leave data, status, and error from the Redux store
  const visualLeaveData = useSelector(selectVisualLeaveData);
  const status = useSelector((state) => state.visualLeave.status);
  const error = useSelector((state) => state.visualLeave.error);

  const leaves = useSelector((state) => state.leave.leaves);
  const currentPage = useSelector((state) => state.leave.currentPage);
  const itemsPerPage = useSelector((state) => state.leave.itemsPerPage);

  const employeeId = useSelector(selectEmployeeId);
  const userId = useSelector(selectUserId);

  const hardcodedemployeeId = employeeId;

  useEffect(() => {
    dispatch(fetchLeaves());
    dispatch(fetchVisualLeaveData());
  }, [dispatch]);

  const formatInsertDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  // const filteredLeaves = leaves.filter(leave => new Date(leave.dateFrom) > today);
  const filteredLeaves = leaves.filter((leave) => {
    const leaveDate = new Date(leave.dateFrom);

    // return leaveDate > today && leaveDate <= thirtyDaysFromNow;
    return leaveDate > today ;
  });

  const filteredVisualLeaveData = Array.isArray(visualLeaveData)
    ? visualLeaveData.filter(
        (leave) =>
          leave.type === "Annual Leave" || leave.type === "Casual Leave"
      )
    : [];

  
  const totalItems = leaves.length;
  const indexOfLastItem = currentPage * filteredLeaves.length;
  const indexOfFirstItem = 1;
  const currentItems = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

  function numOfDays(dateFrom, dateTo) {
    // Convert the date strings to Date objects
    const leaveDateFrom = new Date(dateFrom);
    const leaveDateTo = new Date(dateTo);
  
    // Calculate the difference in milliseconds
    const timeDiff = leaveDateTo - leaveDateFrom;
  
    // Convert difference from milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    // Return the appropriate string
    if (diffDays === 0) {
      return "1 day leave";
    } else {
      return `${diffDays + 1} days leave`;  // Add 1 since date range is inclusive
    }
  }

  // Example usage
  const leave = {
    dateFrom: "2024-08-31",
    dateTo: "2024-09-01"
  };

  console.log(numOfDays(leave.dateFrom, leave.dateTo));  // Output: "2 days"

  return (
    <div className="bg-white shadow-customShadow rounded-lg max-w-full">
      <TileHeader
        HeaderText="Leave Summary This Month"
        showDatePicker={false}
      />

      {/* Display loader while fetching data */}
      {status === "loading" && <p>Loading...</p>}

      {/* Display error message if request failed */}
      {status === "failed" && <p>Error: {error}</p>}

      <div className="p-6">
        <div className="flex justify-around">
          {console.log(visualLeaveData)}
          {filteredVisualLeaveData &&
            filteredVisualLeaveData.map((leave, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 mb-2">
                  <CircularProgressbar
                    value={(leave.TotalLeaveDays / leave.dateCount) * 100}
                    text={`${leave.TotalLeaveDays}/${leave.dateCount}`}
                    styles={buildStyles({
                      pathColor: leave.pathColor || "#34D399",
                      trailColor: leave.pathColor
                        ? leave.pathColor + "33"
                        : "#34D39933", // Lighter shade of the path color
                      textColor: leave.textColor || "#34D399",
                      textSize: "18px", // Adjust text size inside the circle
                      strokeWidth: 8, // Adjust stroke width
                    })}
                  />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {leave.type}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Upcoming Leave Section */}
      <div className="m-3">
        <div className="mb-2 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Upcoming Leaves
          </h3>
          <div className="grid gap-2 max-h-56 overflow-y-auto">
            {" "}
            {/* Set max height and enable scrolling */}
            {currentItems.map((leave) => (
              <div
                key={leave.Id}
                className="flex items-center justify-between bg-white p-3 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold	">
                    {leave.firstName + " " + leave.lastName}
                  </h3>
                  <p>
                    {formatInsertDate(leave.dateFrom)}{" "}
                    {"- [" + leave.type + "]" + leave.isFirstHalf &&
                    leave.isSecondHalf
                      ? "- [Full Day]"
                      : "- [Half Day]"}
                  </p>
                </div>
                <div className="pl-3">
                  <img
                    src={AvatarIcon}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full mr-4 border-2 border-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="p-4 flex justify-center space-x-4">
        <button className="bg-customOrange-100 px-4 py-2 rounded-lg hover:bg-customOrange-200">
          <Link to="/leave#requestLeave">
          Request Leave</Link>
        </button>
        <button className="bg-customOrange-100 px-4 py-3 rounded-lg hover:bg-customOrange-200">
          <Link to="/leave#leaveLogs"
          >View Leave History</Link>
        </button>
      </div>
    </div>
  );
};

export default LeaveLogs;


////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from "react-router-dom";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import TileHeader from "../reusable/TileHeader";
// import "react-tooltip/dist/react-tooltip.css";
// import AvatarIcon from "../../../public/User.png";
// import {
//   addLeave,
//   setSelectedLeave,
//   updateLeaveStatus,
//   fetchLeaves,
//   fetchAllEmployees,
//   fetchAllLeaveTypes,
//   submitLeave,
//   setIsModalOpen,
//   setCurrentPage,
//   setItemsPerPage,
// } from '../../features/leave/leaveSlice';
// import { selectEmployeeId, selectUserId } from '../../features/auth/authSlice';

// const LeaveLogs = () => {

//   const dispatch = useDispatch();
//   const leaves = useSelector((state) => state.leave.leaves);
//   const currentPage = useSelector((state) => state.leave.currentPage);
//   const itemsPerPage = useSelector((state) => state.leave.itemsPerPage);

//   const employeeId = useSelector(selectEmployeeId);
//   const userId = useSelector(selectUserId);

//   const hardcodedemployeeId = employeeId;

//   useEffect(() => {
//     dispatch(fetchLeaves());
//   }, [dispatch]);

//   const formatInsertDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, options);
//   };
  
//   const today = new Date();

//   const thirtyDaysFromNow = new Date();
//   thirtyDaysFromNow.setDate(today.getDate() + 60);

//   // const filteredLeaves = leaves.filter(leave => new Date(leave.dateFrom) > today);
//   const filteredLeaves = leaves.filter(leave => {
//     const leaveDate = new Date(leave.dateFrom);
//     // return leaveDate > today && leaveDate <= thirtyDaysFromNow;
//     return leaveDate > today ;

//   });
  
//   const totalItems = leaves.length;
//   const indexOfLastItem = currentPage * filteredLeaves.length;
//   const indexOfFirstItem = 1;
//   const currentItems = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

//   function numOfDays(dateFrom, dateTo) {
//     // Convert the date strings to Date objects
//     const leaveDateFrom = new Date(dateFrom);
//     const leaveDateTo = new Date(dateTo);
  
//     // Calculate the difference in milliseconds
//     const timeDiff = leaveDateTo - leaveDateFrom;
  
//     // Convert difference from milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
//     const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
//     // Return the appropriate string
//     if (diffDays === 0) {
//       return "1 day leave";
//     } else {
//       return `${diffDays + 1} days leave`;  // Add 1 since date range is inclusive
//     }
//   }
  
//   // Example usage
//   const leave = {
//     dateFrom: "2024-08-31",
//     dateTo: "2024-09-01"
//   };
  
//   console.log(numOfDays(leave.dateFrom, leave.dateTo));  // Output: "2 days"
  

//   const leaveData = [
//     {
//       type: "Annual Leave",
//       remaining: 5,
//       total: 10,
//       pathColor: "#34D399",
//       textColor: "#34D399",
//     },
//     {
//       type: "Casual Leave",
//       remaining: 3,
//       total: 10,
//       pathColor: "#F87171",
//       textColor: "#F87171",
//     },
//   ];

//   const upcomingLeaves = [
//     {
//       name: "Joseph Rodrigo",
//       date: "30 Aug 2024",
//       leaveType: "[Half day]",
//       avatar: AvatarIcon,
//     },
//     {
//       name: "Nishadi Perera",
//       date: "01 Sep 2024",
//       leaveType: "[Full day]",
//       avatar: AvatarIcon,
//     },
//     {
//       name: "Thithira",
//       date: "05 Sep 2024",
//       leaveType: "[Half day]",
//       avatar: AvatarIcon,
//     },
//     {
//       name: "Shanaka Lakmal",
//       date: "10 Sep 2024",
//       leaveType: "[Full day]",
//       avatar: AvatarIcon,
//     },
//     {
//       name: "Althaf Rifath",
//       date: "15 Sep 2024",
//       leaveType: "[Half day]",
//       avatar: AvatarIcon,
//     },
//   ];

//   return (
//     <div className="bg-white shadow-customShadow rounded-lg max-w-full">
//       <TileHeader
//         HeaderText="Leave Summary This Month"
//         showDatePicker={false}
//       />
//       <div className="p-6">
//         <div className="flex justify-around">
//           {leaveData.map((leave, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div className="w-24 h-24 mb-2">
//                 <CircularProgressbar
//                   value={(leave.remaining / leave.total) * 100}
//                   text={`${leave.remaining}/${leave.total}`}
//                   styles={buildStyles({
//                     pathColor: leave.pathColor,
//                     trailColor: leave.pathColor + "33", // Lighter shade of the path color
//                     textColor: leave.textColor,
//                     textSize: "18px", // Adjust text size inside the circle
//                     strokeWidth: 8, // Adjust stroke width
//                   })}
//                 />
//               </div>
//               <p className="text-sm font-medium text-gray-600">{leave.type}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Upcoming Leave Section */}
//       <div className="m-3">
//         <div className="mb-2 p-4 bg-gray-100 rounded-lg">
//           <h3 className="text-base font-semibold text-gray-900 mb-3">
//             Upcoming Leaves
//           </h3>
//           <div className="grid gap-2 max-h-56 overflow-y-auto">  {/* Set max height and enable scrolling */}
//             {currentItems.map((leave) => (
//               <div key={leave.Id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                 <div>
//                   <h3 className="font-semibold  ">{leave.firstName + " " + leave.lastName}</h3>
//                   <p>{formatInsertDate(leave.dateFrom)} {"- [" + leave.type + "]" + leave.isFirstHalf && leave.isSecondHalf ? '- [Full Day]' : '- [Half Day]'}</p>
//                   <p>{leave.isFirstHalf && leave.isSecondHalf ? numOfDays(leave.dateFrom, leave.dateTo) : ''}</p>
//                 </div>
//                 <div className="pl-3">
//                   <img
//                     src={AvatarIcon}
//                     alt="Avatar"
//                     className="h-12 w-12 rounded-full mr-4 border-2 border-white"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Call-to-Action Buttons */}
//       <div className="p-4 flex justify-center space-x-4">
//         <button className="bg-customOrange-100 px-4 py-2 rounded-lg hover:bg-customOrange-200">
//           <Link to="/leave">Request Leave</Link>
//         </button>
//         <button className="bg-customOrange-100 px-4 py-3 rounded-lg hover:bg-customOrange-200">
//          <Link to="/leave">View Leave History</Link>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LeaveLogs;