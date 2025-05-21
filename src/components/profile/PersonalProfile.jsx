import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileHeader from "../reusable/ProfileHeader";
import GeneralInformation from "../reusable/GeneralInfomation";
import ContactInformation from "../reusable/ContactInformation";
import DocumentsSection from "../reusable/DocumentSection";
import SecurityQuestionsSection from "../reusable/SecurityQuestionsSection";
import { fetchSecurityQuestions, selectSecurityQuestions } from "../../features/employees/employeeSecurityQuestionSlice";
import { fetchEmployeeDetails, selectEmployeeDetails } from '../../features/employees/employeeDetailsSlice'; // Adjust the import path
import ResetButton from "../reusable/ResetButton";

const PersonalProfile = () => {
  const [view, setView] = useState("details");
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

  const dispatch = useDispatch();

  // Get employee details and loading state from Redux
  const employeeDetails = useSelector(selectEmployeeDetails);
  const employeeDetailsloading = useSelector(state => state.employeeDetails.loading);
  const employeeDetailsError = useSelector(state => state.employeeDetails.error);

  // Get security questions and loading state from Redux
  const loading = useSelector((state) => state.securityQuestions?.loading);
  const error = useSelector((state) => state.securityQuestions?.error);

  useEffect(() => {
    dispatch(fetchSecurityQuestions());
    dispatch(fetchEmployeeDetails())
  }, [dispatch]);

  const securityQuestions = useSelector(selectSecurityQuestions);

  let content;

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

  const userDocuments = [
    { name: "Resume.pdf" },
    { name: "Contract.pdf" },
    // Add more documents here as per user data
  ];

  content = (
    <div>
      <ProfileHeader employeeDetails={details}/>
      <div className="bg-white p-3 shadow-lg rounded-lg m-3">
        <div>
          <div className="flex border-b border-gray-300">
            <button
              className={`font-semibold text-m mb-2 bg-white p-1 ${
                view === "details" ? "border-b-2 border-customGrey" : ""
              }`}
              onClick={() => setView("details")}
            >
              Details
            </button>
            <button
              className={`font-semibold text-m mb-2 bg-white p-3 ${
                view === "security" ? "border-b-2 border-customGrey" : ""
              }`}
              onClick={() => setView("security")}
            >
              Security Questions
            </button>
            <button
              className={`font-semibold text-m mb-2 bg-white p-3 ${
                view === "documents" ? "border-b-2 border-customGrey" : ""
              }`}
              onClick={() => setView("documents")}
            >
              Documents
            </button>
            <button
              className={`font-semibold text-m mb-2 bg-white p-3 ${
                view === "settings" ? "border-b-2 border-customGrey" : ""
              }`}
              onClick={() => setView("settings")}
            >
              Settings
            </button>
          </div>
          
          {view === "details" ? (
            <div className="pt-3 space-y-3">
              <GeneralInformation details={details}/>
              <ContactInformation details={details}/>
            </div>
          ) : view === "security" ? (
            <div className="pt-3"> 
              {loading ? (
                <p>Loading security questions...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <>
                  <SecurityQuestionsSection questions={securityQuestions} />
                </>
              )}
            </div>
          ) : view === "documents" ?(
            <div>
              <DocumentsSection userDocuments={userDocuments} />
            </div>
          ) : (
            <div>
              <ResetButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`transition-all duration-300 ${
        isCollapsed ? "ml-20" : "ml-64"
      }`}
    >
      {content}
    </div>
  );
};

export default PersonalProfile;