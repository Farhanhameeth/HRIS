import React, { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillAlert, AiOutlineUser } from "react-icons/ai";
import { toggleDropdown } from "../../features/navbar/sidebarSlice";
import AvatarIcon from "../../../public/User.png";

const EmployeeOverview = ({ employeeDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showDropdown } = useSelector((state) => state.sidebar);
  const [profileImage, setProfileImage] = useState(AvatarIcon);
  const [email, setEmail] = useState("");

  const API_BASE_URL = "http://localhost:5077";
  const employeeId = sessionStorage.getItem("employeeId");


  useEffect(() => {
    console.log(" Employee Details Data:", employeeDetails);

    const fetchedEmail = employeeDetails.find((detail) => detail.label === "Email")?.value || "";
    setEmail(fetchedEmail);

    const imagePath = employeeDetails.find((detail) => detail.label === "imagePath")?.value || "";
    if (imagePath) {
      setProfileImage(imagePath);
    } else {
      setProfileImage(AvatarIcon);
    }
  }, [employeeDetails]);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleToggleDropdown = (value) => {
    dispatch(toggleDropdown(value));
  };

  const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!employeeId) {
    console.error("Missing Employee ID: Cannot upload file");
    alert("Employee ID not found. Please try again later.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    const payload = {
      employeeId,
      imagePath: base64Image
    };

    console.log("Uploading Base64 image for Employee ID:", employeeId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/EmployeeDetails/uploadProfilePicture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Upload successful");
        setProfileImage(base64Image); // directly show the Base64 image
        alert("Profile picture uploaded");
      } else {
        console.error("Upload failed");
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  reader.readAsDataURL(file);
};

  

  const department = employeeDetails.find((detail) => detail.label === "Department")?.value || "";
  const unit = employeeDetails.find((detail) => detail.label === "Unit")?.value || "";
  const country = employeeDetails.find((detail) => detail.label === "Country")?.value || "";

  return (
    <div className="flex items-center justify-between bg-customGrey text-white p-3 m-2 rounded-md shadow-lg">
      <div className="flex items-center">
        <label className="relative cursor-pointer">
          <img
            src={profileImage}
            alt="Avatar"
            className="h-16 w-16 rounded-full mr-4 border-2 border-white"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </label>

        <div>
          <h1 className="text-lg font-bold">
            Welcome {employeeDetails?.find((detail) => detail.label === "Full Name")?.value || "User"}
          </h1>
          <p className="text-sm text-gray-300">{`${department} Department | ${unit} | ${country} | ${employeeId}`}</p>
        </div>
        <div className="absolute right-10 flex items-center px-2">
          <button className="text-white px-1">
            <AiFillAlert />
          </button>
          <span className="text-white">|</span>
          <div
            onMouseEnter={() => handleToggleDropdown(true)}
            onMouseLeave={() => handleToggleDropdown(false)}
            className="text-white px-1 flex items-center cursor-pointer"
          >
            <AiOutlineUser />
            <FaCaretDown />
            {showDropdown && (
              <div className="absolute mt-2 py-2 bg-white rounded-md shadow-xl">
                <ul>
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverview;
