import { ShieldExclamationIcon } from "@heroicons/react/24/solid"; // Heroicons v2

const SecurityQuestionsSection = ({ questions }) => {
  if (!questions) {
    return <p>Loading security questions...</p>;
  }
  
  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex items-center mb-2">
        <ShieldExclamationIcon className="h-6 w-6 text-customOrange-300 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Security Questions & Answers</h3>
      </div>

      {/* Map through each security question and its answer */}
      {questions.map((question, index) => (
        <div
          key={index}
          className="mb-2 bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200"
        >
          <div className="text-sm text-gray-500 font-medium">
            Question {index + 1}:
          </div>
          <div className="mt-1 text-sm text-gray-800 font-semibold">
            {question.question}
          </div>
          <div className="mt-2 text-sm text-gray-500 font-medium">Answer:</div>
          <div className="mt-1 text-sm text-black-600">
            {question.answer}
          </div>
        </div>
      ))}
    </div>
  );
};


export default SecurityQuestionsSection;


// import { useState } from "react";
// import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

// const SecurityQuestionsSection = ({ questions, employeeId }) => {
//   const [editableQuestions, setEditableQuestions] = useState(
//     questions.map((q) => ({ ...q, isEditing: false, newAnswer: q.answer }))
//   );

//   const handleEditClick = (index) => {
//     const updatedQuestions = [...editableQuestions];
//     updatedQuestions[index].isEditing = true;
//     setEditableQuestions(updatedQuestions);
//   };

//   const handleChange = (index, value) => {
//     const updatedQuestions = [...editableQuestions];
//     updatedQuestions[index].newAnswer = value;
//     setEditableQuestions(updatedQuestions);
//   };

//   const handleSave = async (index) => {
//   try {
//     const updatedQuestion = editableQuestions[index];

//     // Retrieve token from localStorage or any authentication state management
//     const token = "mdVz9RbOZfR0Gz28IgOA7Q==" // Ensure you set this token after login

//     const response = await fetch("http://localhost:5077/api/EmployeewiseSecurityQuestion/updateEmployeeSecurityAnswer", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}` // Include the token in the request header
//       },
//       body: JSON.stringify({
//         employeeId: employeeId,
//         questionId: updatedQuestion.questionId,
//         answer: updatedQuestion.newAnswer,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     // Handle JSON parsing
//     const text = await response.text();
//     let result;
//     try {
//       result = JSON.parse(text);
//     } catch (error) {
//       throw new Error("Invalid JSON response: " + text);
//     }

//     if (result.success) {
//       const updatedQuestions = [...editableQuestions];
//       updatedQuestions[index].answer = updatedQuestions[index].newAnswer;
//       updatedQuestions[index].isEditing = false;
//       setEditableQuestions(updatedQuestions);
//     } else {
//       alert("Update failed: " + (result.message || "Unknown error"));
//     }
//   } catch (error) {
//     console.error("Error updating security answer:", error);
//     alert("An error occurred while updating. Please try again.");
//   }
// };


//   return (
//     <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
//       <div className="flex items-center mb-2">
//         <ShieldExclamationIcon className="h-6 w-6 text-customOrange-300 mr-2" />
//         <h3 className="text-lg font-semibold text-gray-800">Security Questions & Answers</h3>
//       </div>

//       {editableQuestions.map((question, index) => (
//         <div
//           key={index}
//           className="mb-2 bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200"
//         >
//           <div className="text-sm text-gray-500 font-medium">
//             Question {index + 1}:
//           </div>
//           <div className="mt-1 text-sm text-gray-800 font-semibold">
//             {question.question}
//           </div>
//           <div className="mt-2 text-sm text-gray-500 font-medium">Answer:</div>
//           {question.isEditing ? (
//            <input
//            type="text"
//            id={`answer-${index}`}  // Adding a unique ID
//            name={`answer-${index}`} // Adding a unique Name
//            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
//            value={question.newAnswer}
//            onChange={(e) => handleChange(index, e.target.value)}
//          />
         
//           ) : (
//             <div className="mt-1 text-sm text-black-600">{question.answer}</div>
//           )}
//           <div className="mt-2">
//             {question.isEditing ? (
//               <button
//                 className="bg-blue-500 text-white px-3 py-1 rounded-lg"
//                 onClick={() => handleSave(index)}
//               >
//                 Save
//               </button>
//             ) : (
//               <button
//                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
//                 onClick={() => handleEditClick(index)}
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SecurityQuestionsSection;
