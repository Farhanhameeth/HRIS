import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployeeDetails, selectEmployeeDetails } from "../features/employees/employeeDetailsSlice";
import KPIDurationSet from "../components/reusable/KPIDurationSet";
import KPISetComponent from "../components/reusable/KPISetComponent";
import SetKPIUserFeedbackComponent from "../components/reusable/SetKPIUserFeedbackComponent";
import SetComplianceComponent from "../components/reusable/SetComplianceComponent";
import SetComplianceUserFeedback from "../components/reusable/SetComplianceUserFeedback";
import CommentAndTrainingComponent from "../components/reusable/CommentAndTrainingComponent";
import PrintReportModal from "../components/reusable/PrintReportModal";


import "tailwindcss/tailwind.css";

const KPIManagement = () => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const employeeDetailsData = useSelector(selectEmployeeDetails);
  const [selectedComplianceEmployee, setSelectedComplianceEmployee] = useState("");
  
  // Format employee details in the same structure as used in components
  const employeeDetails = employeeDetailsData.length > 0 ? [
    { label: "Full Name", value: `${employeeDetailsData[0]?.firstName} ${employeeDetailsData[0]?.lastName}` },
    { label: "Department", value: employeeDetailsData[0]?.departmentDescription },
    { label: "Unit", value: employeeDetailsData[0]?.unitDescription },
    { label: "Country", value: employeeDetailsData[0]?.countryDescription },
    { label: "Email", value: employeeDetailsData[0]?.email },
    { label: "Role", value: employeeDetailsData[0]?.roleDescription },
  ] : [];

  // Get department from employee details
  const department = employeeDetails.find((detail) => detail.label === "Department")?.value || "";
  
  // Define isHR based on department value
  const isHR = department.toLowerCase().includes("human resource");
  console.log("Report Person ID:", employeeDetailsData[0]?.employeeId);

  // Current user ID for API calls
  const currentUserId = employeeDetailsData[0]?.employeeId || "";

  useEffect(() => {
    dispatch(fetchEmployeeDetails());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState(1);
  const totalSteps = 6;
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });

  const [kpiDuration, setKpiDuration] = useState("");
  const [kpi, setKpi] = useState("");
  const [description, setDescription] = useState("");
  const [expectedPercentage, setExpectedPercentage] = useState("");
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selfRating, setSelfRating] = useState(0);
  const [employeeComplianceMap, setEmployeeComplianceMap] = useState({});

  const [compliance, setCompliance] = useState("");
  const [complianceDetails, setComplianceDetails] = useState("");
  const [compliancePercentage, setCompliancePercentage] = useState("");
  const [complianceSet, setComplianceSet] = useState([]);
  const [kpiSet, setKpiSet] = useState([]);
  
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (employeeDetailsData?.[0]?.employeeId) {
      fetch(`http://localhost:5077/api/ReportPersonDetails/getEmployeesByReportPerson/${employeeDetailsData[0].employeeId}`, {
        headers: {
          'PPA_KEY': 'SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa',
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            console.log("Error response:", text);
            throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
          });
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEmployees(data); // Keep full employee objects: { employeeId, firstName, lastName }
        }
      })
      .catch(err => {
        console.error("Failed to fetch employees:", err);
        // Fallback data while troubleshooting
        setEmployees([
          { employeeId: "E001", firstName: "John", lastName: "Doe" },
          { employeeId: "E002", firstName: "Jane", lastName: "Smith" }
        ]);
      });
    }
  }, [employeeDetailsData]);

  const [training, setTraining] = useState("");
  const [trainingDuration, setTrainingDuration] = useState("");
  const [trainingPriority, setTrainingPriority] = useState("");
  const [trainingSet, setTrainingSet] = useState([]);

  // Set the initial active tab based on user role
  useEffect(() => {
    if (!isHR) {
      setActiveTab(4);
      setCompletedSteps((prev) => ({ ...prev, 1: true, 2: true, 3: true }));
    }
  }, [isHR]);

  // Calculate end date based on duration and start date
  useEffect(() => {
    if (startDate) {
      const calculatedEndDate = new Date(startDate);
      if (kpiDuration === "weekly") calculatedEndDate.setDate(calculatedEndDate.getDate() + 7);
      if (kpiDuration === "monthly") calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 1);
      if (kpiDuration === "quarterly") calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 3);
      if (kpiDuration === "yearly") calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + 1);
      setEndDate(calculatedEndDate.toISOString().split("T")[0]);
    }
  }, [kpiDuration, startDate]);

  // Progress calculation
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  // Navigation functions
  const goToTab = (tab) => {
    if (tab <= activeTab || completedSteps[tab - 1]) {
      setActiveTab(tab);
    } else {
      alert("Please complete the previous step before continuing.");
    }
  };

  const markStepComplete = (step) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: true }));
  };

  // Button click handlers
  const clickedProcessingButton = () => {
    markStepComplete(1);
    setActiveTab(2);
  };

  const addTrainingToGrid = () => {
    setTrainingSet([
      ...trainingSet,
      {
        compliance: training,
        details: trainingDuration,
        expectedPercentage: trainingPriority,
        startDate,
        endDate
      },
    ]);
    setTraining("");
    setTrainingDuration("");
    setTrainingPriority("");
  };

  const addComplianceToGrid = () => {
    setComplianceSet([
      ...complianceSet,
      { compliance, details: complianceDetails, expectedPercentage: compliancePercentage, startDate, endDate },
    ]);
    setCompliance("");
    setComplianceDetails("");
    setCompliancePercentage("");
  };

  const addKpiToGrid = () => {
    setKpiSet([
      ...kpiSet,
      { employee: userName, kpi, description, expectedPercentage, startDate, endDate, selfRating: 0, departmentRating: 0 },
    ]);
    markStepComplete(3);
  };

  // This function handles the submission of KPIs when the Submit button is clicked
  const handleKpiSubmit = async () => {
    try {
      // Loop through each KPI in the set
      for (const kpiItem of kpiSet) {
        const payload = {
          employeeId: kpiItem.employee,
          description: `${kpiItem.kpi}: ${kpiItem.description}`,
          targetPercentage: parseFloat(kpiItem.expectedPercentage),
          insertBy: currentUserId
        };

        // Call the API to save this KPI
        const response = await fetch('http://localhost:5077/api/KpiTargetDetails/insertKpiTarget', {
          method: 'POST',
          headers: {
            'PPA_KEY': 'SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Failed to save KPI for ${kpiItem.employee}: ${response.statusText}`);
        }
        console.log(`Saved KPI for ${kpiItem.employee}: ${kpiItem.kpi}`);
      }

      // All KPIs saved successfully
      alert("✅ KPIs saved successfully!");
      markStepComplete(3);
      setActiveTab(4);
    } catch (error) {
      console.error("Error saving KPIs:", error);
      alert("❌ Failed to save KPIs. See console for details.");
    }
  };

  const handleSelfRatingChange = (index, value) => {
    const updated = [...kpiSet];
    updated[index].selfRating = value;
    setKpiSet(updated);
  };

  const handleDepartmentRatingChange = (index, value) => {
    const updated = [...kpiSet];
    updated[index].departmentRating = value;
    setKpiSet(updated);
  };

  const onSubmitFeedback = () => {
    markStepComplete(4);
    setActiveTab(5);
  };

  const submitComplianceFeedback = async () => {
    try {
      for (const emp of employees) {
        const complianceEntries = employeeComplianceMap[emp.employeeId];
        if (!complianceEntries || complianceEntries.length === 0) continue;
  
        const totalDeptRating = complianceEntries.reduce(
          (sum, entry) => sum + parseFloat(entry.departmentRating || 0),
          0
        );
  
        const payload = {
          employeeId: emp.employeeId,
          achievePercentage: totalDeptRating,
          insertBy: employeeDetailsData[0]?.employeeId
        };
  
        const response = await fetch('http://localhost:5077/api/ComplianceAchieveDetails/insertComplianceAchieveDetails', {
          method: 'POST',
          headers: {
            'PPA_KEY': 'SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error for ${emp.employeeId}:`, errorText);
          throw new Error(`HTTP ${response.status}`);
        }
  
        const result = await response.json();
        console.log(`Saved for ${emp.employeeId}:`, result);
      }
  
      markStepComplete(5);
      setActiveTab(6);
      alert("✅ Compliance ratings saved successfully.");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("❌ Failed to submit compliance feedback. Check console for details.");
    }
  };


  const handlePrint = () => {
    window.print();
    // const printSection = document.getElementById('print-section');
    // if (printSection) {
    //   const originalContent = document.body.innerHTML;
    //   const printContent = printSection.innerHTML;
    //   document.body.innerHTML = printContent;
    //   window.print();
    //   document.body.innerHTML = originalContent;
    //   window.location.reload(); // Restore after print
    // }
  };
  
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return isHR && (
          <KPIDurationSet {...{ kpiDuration, setKpiDuration, startDate, setStartDate, endDate, setEndDate, clickedProcessingButton,currentUserId }} />
        );
      case 2:
        return isHR && (
          <SetComplianceComponent
            {...{
              compliance,
              setCompliance,
              complianceDetails,
              setComplianceDetails,
              compliancePercentage,
              setCompliancePercentage,
              complianceSet,
              addComplianceToGrid,
              kpiStartDate: startDate,
              kpiEndDate: endDate,
              onContinue: () => {
                if (complianceSet.length === 0) {
                  alert("⚠️ Please add at least one compliance entry before continuing.");
                  return;
                }
                markStepComplete(2);
                setActiveTab(3);
              },
              unitId: employeeDetailsData[0]?.unitId,
              currentUserId: employeeDetailsData[0]?.employeeId,
            }}
          />
        );
      case 3:
        return isHR && (
          <KPISetComponent 
            {...{ 
              kpiSet, 
              employees, 
              userName, 
              setUserName, 
              kpi, 
              setKpi, 
              description, 
              setDescription, 
              expectedPercentage, 
              setExpectedPercentage, 
              addKpiToGrid, 
              clickedSubmitButton: handleKpiSubmit 
            }} 
          />
        );
      case 4:
        return <SetKPIUserFeedbackComponent {...{ kpiSet, handleSelfRatingChange, handleDepartmentRatingChange, startDate, endDate, selfRating, onSubmitFeedback }} />;
      case 5:
        return (
          <SetComplianceUserFeedback
            {...{
              setCompliance: complianceSet,
              handleSelfRatingChange,
              handleDepartmentRatingChange,
              startDate,
              endDate,
              selfRating,
              submitComplianceFeedback,
              employeeComplianceMap,
              setEmployeeComplianceMap,
              employees,
              selectedEmployee: selectedComplianceEmployee,
              setSelectedEmployee: setSelectedComplianceEmployee,
            }}
          />
        );
      case 6:
        return (
          <div>
            <CommentAndTrainingComponent
              {...{
                training,
                setTraining,
                trainingDuration,
                setTrainingDuration,
                trainingPriority,
                setTrainingPriority,
                trainingSet,
                addTrainingToGrid,
              }}
            />
        
            <div className="text-right mt-6">
              <button onClick={handlePrint} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                🖨️ Print Report
              </button>
            </div>
        
            {/* Hidden report modal for printing */}
            <PrintReportModal
  // ref={printRef}
  employeeDetails={employeeDetails} // [{label: 'Full Name', value: '...'}, ...]
  kpiSet={kpiSet} // array of all KPI entries
  employeeComplianceMap={employeeComplianceMap} // keyed by employeeId
  employees={employees} // list of all employee objects
  startDate={startDate}
  endDate={endDate}
/>

          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? "ml-24" : "ml-64"}`}>
      <div className="m-3 pt-1 shadow-customShadow rounded-lg bg-white">
        <div className="px-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Step {activeTab} of {totalSteps}</span>
            <span className="text-gray-600 text-sm">{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: `linear-gradient(to right,rgba(79, 255, 144, 0.8),rgba(53, 200, 58, 0.98),rgba(5, 126, 3, 0.8),rgb(8, 151, 0))`,
              }}
            ></div>
          </div>
        </div>

        <div className="border-b border-gray-200 m-3">
          <nav className="flex space-x-8 py-1">
            {[
              "Set KPI Duration",
              "Set Compliance",
              "Set KPI",
              "Set KPI User Feedback",
              "Set Compliance Feedback",
              "Comments and Training",
            ].map((label, i) => (
              <button
                key={i}
                onClick={() => goToTab(i + 1)}
                className={`font-semibold text-m mb-2 bg-white p-1 ${activeTab === i + 1 ? "border-b-2 border-customGrey" : ""} ${!completedSteps[i] && i + 1 > activeTab ? "text-gray-400" : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default KPIManagement;