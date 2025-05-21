import React from 'react';
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const GeneralInformation = ({details}) => {
  return (
    <div className="bg-white p-4 rounded-lg w-full border border-gray-300 mx-auto">
      <div className="flex items-center mb-4">
        <InformationCircleIcon className="h-6 w-6 text-customOrange-300 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {details
        .filter(detail => detail.label !== 'Email' && detail.label !== 'Personal Phone No.' && detail.label !== 'Social Media')
        .map((detail, index) => (
          <div key={index}>
            <p className="font-medium">{detail.label}</p>
            <p>{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralInformation;
