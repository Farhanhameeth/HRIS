import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectEmployeeId } from "../features/auth/authSlice";
import forgotPassword, { 
    addTicket,
    submitTicket,
    fetchEmailwiseSecurityQuestions,
    setIsTypeEmailOpen,
    setIsForgotPasswordOpen,
    selectSecQuestions,
    setCurrentPage,
    setItemsPerPage,
} from "../features/auth/forgotPassword";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid/index.js";

// ZXC@123q
function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordVisible, setPasswordVisible] = useState(false);

    // State to store the user's answers
    const [userAnswers, setUserAnswers] = useState({});
    const [submissionError, setSubmissionError] = useState(null); // For error message

    const [errors, setErrors] = useState({});   

    // These selectors get state data from the forgotPassword slice
    const secQuestions = useSelector(selectSecQuestions);
    const error = useSelector((state) => state.forgotPassword.error);
    const currentPage = useSelector((state) => state.forgotPassword.currentPage);
    const itemsPerPage = useSelector((state) => state.forgotPassword.itemsPerPage);
    const isTypeEmailOpen = useSelector((state) => state.forgotPassword.isTypeEmailOpen);
    const isForgotPasswordOpen = useSelector((state) => state.forgotPassword.isForgotPasswordOpen);
    const status = useSelector((state) => state.forgotPassword.status);
    const employeeId = useSelector(selectEmployeeId);
  
    const validateForm = () => {
      const newErrors = {};
  
    if (!email) {newErrors.email = 'Email is required';
    }else if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Email must be a valid email address';
    } 
    else if (email && secQuestions.length === 0) {
      newErrors.email = 'No security questions found';
    }  
      return newErrors;
    };

    const handleSubmit = () => {
      const employeeId = secQuestions[0].employeeId;
      const userId = secQuestions[0].userId;

      console.log("EMP : ", employeeId);
      console.log("USER : ", userId);


      const newTicket = {
        employeeId: employeeId,
        targetDepartmentId: 1,
        description: "Reset Password",
        // handleBy: 1, // Example handleBy value
        statusId: 1, // Example statusId value
        feedbackRating: 0, // Default feedback rating
        insertBy: userId,
      };
  
      try {
        const result = dispatch(submitTicket(newTicket)).unwrap();
        console.log("Ticket Record submission successful:", result);
        alert('Request has been submitted to the System Admin');
  
      } catch (error) {
        console.error("Ticket Record submission error:", error);
      }
      
    };

    const handleLogin = () => {
        dispatch(loginUser({ email, password }))
            .unwrap()
            .then((result) => {
                console.log('Login successful, navigating to dashboard');
                console.log('Employee ID:', result.EmployeeId); // Use the employeeId from the fulfilled action
                navigate('/dashboard');
            })
            .catch((error) => {
                console.log('Failed login:', error);
            });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
      if (status === 'succeeded') {
          const newErrors = validateForm();
          if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors);
          } else {
              setErrors({});
              dispatch(setIsForgotPasswordOpen(true));  // Open the popup if no errors
          }
      } else if (status === 'failed') {
          setErrors({ email: 'Failed to fetch security questions' });
      }
  }, [status, secQuestions, dispatch]);

    // Function to handle forgot password flow
    const handleForgotPassword = () => {

      setErrors({});

      dispatch(fetchEmailwiseSecurityQuestions(email));  // Fetch questions based on email

    };
      
    const handleCloseForgotPassword = () => {
        setUserAnswers('');
        dispatch(setIsForgotPasswordOpen(false));  // Close the popup
        dispatch(setIsTypeEmailOpen(false)); // Ensure Type Email popup is also closed

    };

    const handleTypeEmail = () => {
      dispatch(setIsTypeEmailOpen(true));  // Open the popup
     // dispatch(fetchEmailwiseSecurityQuestions(email));  // Fetch questions based on email
  };

  const handleCloseTypeEmail = () => {
    dispatch(setIsTypeEmailOpen(false));  // Close the popup
  };

  // Handle input change for security questions
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({
        ...userAnswers,
        [questionId]: answer,
    });
};

// Check answers when user submits
const handleSubmitAnswers = () => {
    let hasError = false;

    secQuestions.forEach((question) => {
        if (userAnswers[question.Id] !== question.answer) {
            hasError = true;
        }
    });

    if (hasError) {
        setSubmissionError("One or more answers are incorrect.");
    } else {
        setSubmissionError(null);
        handleSubmit();
        dispatch(setIsForgotPasswordOpen(false)); // Close the popup after submission
        dispatch(setIsTypeEmailOpen(false));  // Close the popup
        //clear the userAnswers
        setUserAnswers({});

        // Proceed to next step like resetting password
    }
};

    return (
        <div className="flex items-start h-screen bg-cover bg-center" style={{ backgroundImage: "url('/Login_Backround2.png')" }}>
            <div className="relative w-1/3 p-8 rounded-2xl shadow-lg ml-14 mt-20">
                <div className="absolute inset-0 bg-black rounded-2xl" style={{ opacity: 0.8 }}></div>
                <div className="relative flex flex-col z-100">
                    <div className="pt-2 mb-4">
                        <img src="/IQ_Logo_Orange.png" alt="Logo" className="h-24 w-56" />
                        <h2 className="mt-6 text-4xl text-white">
                            Human Resource Information System
                        </h2>
                    </div>
                    <div className="pb-6">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="mt-4 p-3 w-full border rounded-md"
                        />
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="mt-4 p-3 w-full border rounded-md"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <button onClick={togglePasswordVisibility} className="text-gray-600">
                                    {passwordVisible ? (
                                        <EyeSlashIcon className="h-5 w-5 mt-4" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 mt-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <input type="checkbox" id="remember" className="mr-2" />
                                <label htmlFor="remember" className="text-white">Remember me</label>
                            </div>
                            <a href="#" className="text-white" onClick={handleTypeEmail}>
                                Forgot Password?
                            </a>
                        </div>
                        <div className="text-red-500 text-sm mt-2" style={{ height: "24px" }}>
                            {auth.error}
                        </div>
                        <button
                            onClick={handleLogin}
                            className="mt-4 p-3 w-full bg-customGrey border-2 text-white rounded-md hover:brightness-110"
                        >
                            Login
                        </button>
                        <br />
                        <br />
                        <div>
    <a href="/Terms" className="text-white" target="_blank" rel="noopener noreferrer">
        Terms and Conditions
    </a>
</div>

                    </div>
                </div>
            </div>

            {isTypeEmailOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center" onClick={handleCloseTypeEmail}>
                    <div className="bg-black p-8 rounded-lg shadow-lg w-1/3 max-w-2xl h-[40vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold text-red-600 mb-6">Type Email</h2>

                        
                        <div>
                           
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className={`mt-4 p-3 w-full border rounded-md shadow-sm focus:ring-2 ${
                              errors.email ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
                            }`}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                        )}       
                          
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleForgotPassword}
                                className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCloseTypeEmail}
                                className="px-5 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isForgotPasswordOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center" onClick={handleCloseForgotPassword}>
                    <div className="bg-black p-8 rounded-lg shadow-lg w-1/3 max-w-2xl h-[80vh] overflow-y-auto"  onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold text-red-600 mb-6">Security Questions</h2>

                        {secQuestions.map((question) => (
                            <div key={question.Id} className="mb-4">
                                <p className="text-gray-300">{question.question}</p>
                                <input
                                    type="text"
                                    value={userAnswers[question.Id] || ""}
                                    onChange={(e) => handleAnswerChange(question.Id, e.target.value)}
                                    placeholder="Answer"
                                    className="mt-2 p-3 w-full border rounded-md"
                                />
                            </div>
                        ))}

                        {submissionError && (
                            <div className="text-red-500 mb-4">
                                {submissionError}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleSubmitAnswers}
                                className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCloseForgotPassword}
                                className="px-5 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
