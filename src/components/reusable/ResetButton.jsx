import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid/index.js";
import { selectEmployeeId, selectUserId } from "../../features/auth/authSlice";

import {
  setIsResetPasswordOpen,
  updateNewPassword,
  checkPassword,
} from "../../features/employees/employeeDetailsSlice";

const ResetButton = () => {
  const isResetPasswordOpen = useSelector(
    (state) => state.employeeDetails.isResetPasswordOpen
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);

  const [errors, setErrors] = useState({});
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleRetypePasswordVisibility = () => {
    setRetypePasswordVisible(!retypePasswordVisible);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current Password is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#%&!$*])[a-zA-Z0-9@#%&!$*]{8,15}$/.test(
        newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must be 8-15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, %, &, !, $, *)";
    }

    if (!retypePassword) {
      newErrors.retypePassword = "Re-Type the new password";
    } else if (retypePassword != newPassword) {
      newErrors.retypePassword = "Password does not match";
    }

    return newErrors;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    console.log("current password: ", currentPassword);
    console.log("new password: ", newPassword);
    console.log("Id: ", userId);

    // Perform validation
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({});
    }

    //First, check if the current password is correct
    try {
      const passwordData = { currentPassword, userId };
      const checkResult = await dispatch(checkPassword(passwordData)).unwrap();

      if (checkResult !== "EQUAL") {
        setErrors({ currentPassword: "Current password is incorrect" });
        return; // Stop if the password doesn't match
      }

      // If password is correct, proceed to update the password
      const updatedNewPassword = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        Id: userId,
      };

      const result = await dispatch(
        updateNewPassword(updatedNewPassword)
      ).unwrap();
      alert("Password Updated Successfully");
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  const handleResetPassword = () => {
    dispatch(setIsResetPasswordOpen(true));
  };

  const handleCloseResetPassword = () => {
    dispatch(setIsResetPasswordOpen(false));
  };

  return (
    <div>
      <button
        className="mt-4 p-3 bg-customGrey border-2 text-white rounded-3xl hover:brightness-110"
        onClick={handleResetPassword}
      >
        Reset Password
      </button>

      {isResetPasswordOpen && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center"
          onClick={handleCloseResetPassword}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-customOrange-300 mb-6">
              Reset Password
            </h2>

            <div className="relative">
              <label
                className={`block text-sm font-medium mb-2 ${
                  errors.currentPassword ? "text-red-600" : "text-gray-700"
                }`}
                htmlFor="currentPassword"
              >
                Current Password
              </label>

              <input
                type={currentPasswordVisible ? "text" : "password"}
                //value={password}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter Current Password"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
                  errors.currentPassword
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-gray-600"
                }`}
                // className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-600 focus:border-red-600"
                // className="mt-4 p-3 w-full border rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  onClick={toggleCurrentPasswordVisibility}
                  className="text-gray-600"
                >
                  {currentPasswordVisible ? (
                    <EyeSlashIcon className="h-5 w-5 mt-4" />
                  ) : (
                    <EyeIcon className="h-5 w-5 mt-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>
            <br />

            <div className="relative">
              <label
                className={`block text-sm font-medium mb-2 ${
                  errors.newPassword ? "text-red-600" : "text-gray-700"
                }`}
                htmlFor="newPassword"
              >
                New Password
              </label>

              <input
                type={newPasswordVisible ? "text" : "password"}
                //value={password}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
                  errors.newPassword
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-gray-600"
                }`}
                // className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-600 focus:border-red-600"
                // className="mt-4 p-3 w-full border rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  onClick={toggleNewPasswordVisibility}
                  className="text-gray-600"
                >
                  {newPasswordVisible ? (
                    <EyeSlashIcon className="h-5 w-5 mt-4" />
                  ) : (
                    <EyeIcon className="h-5 w-5 mt-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <br />

            <div className="relative">
              <label
                className={`block text-sm font-medium mb-2 ${
                  errors.retypePassword ? "text-red-600" : "text-gray-700"
                }`}
                htmlFor="retypePassword"
              >
                Re-Type Password
              </label>

              <input
                type={retypePasswordVisible ? "text" : "password"}
                //value={password}
                onChange={(e) => setRetypePassword(e.target.value)}
                placeholder="Re-Type Password"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
                  errors.retypePassword
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-gray-600"
                }`}
                // className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-600 focus:border-red-600"
                // className="mt-4 p-3 w-full border rounded-md"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  onClick={toggleRetypePasswordVisibility}
                  className="text-gray-600"
                >
                  {retypePasswordVisible ? (
                    <EyeSlashIcon className="h-5 w-5 mt-4" />
                  ) : (
                    <EyeIcon className="h-5 w-5 mt-4" />
                  )}
                </button>
              </div>
              {errors.retypePassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.retypePassword}
                </p>
              )}
            </div>
            <br />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleUpdatePassword}
                className="px-5 py-2 bg-customOrange-300 text-white rounded-md shadow hover:bg-customOrange-500 focus:ring-2 focus:ring-red-600"
              >
                Save
              </button>
              <button
                onClick={handleCloseResetPassword}
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
};

export default ResetButton;
