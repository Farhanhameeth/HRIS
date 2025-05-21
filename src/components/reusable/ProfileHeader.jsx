import React from "react";

const ProfileHeader = ({employeeDetails}) => {

  const Name = employeeDetails.find((detail) => detail.label === 'Full Name')?.value || '';
  const Role = employeeDetails.find((detail) => detail.label === 'Role')?.value || '';
  const Country = employeeDetails.find((detail) => detail.label === 'Country')?.value || '';

  const handleContactClick = () => {
    window.location.href = "mailto:joseph.rodrigo@example.com";
  };

  return (
    <div className="flex items-center justify-between p-5 border border-gray-300 bg-white shadow-lg rounded-lg m-3">
      <div className="flex items-center space-x-4">
        <div className="p-3">
          <img
            className="h-20 w-20 rounded-full"
            src="/User.png"
            alt="Employee"
          />
        </div>
        <div>
          <p className="text-xl font-semibold">{Name}</p>
          <p className="text-m text-gray-600 font-semibold">{Role}</p>
          <p className="text-m text-gray-500">{Country}</p>
        </div>
      </div>
      <button 
        className="bg-customOrange-300 hover:bg-customOrange-500 text-white font-semibold py-2 px-4 rounded-full flex items-center"
        onClick={handleContactClick}
      >
        Contact
      </button>
    </div>
  );
};

export default ProfileHeader;
