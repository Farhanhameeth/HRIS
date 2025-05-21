import React, { useEffect, useState } from "react";

const SettingsPage = () => {
  console.log("✅ SettingsPage is rendering...");

  // Load dark mode state from localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Permissions state
  const [employeePermissions, setEmployeePermissions] = useState({
    canView: true,
    canEdit: false,
    canDelete: false,
  });

  // Common settings state
  const [commonSettings, setCommonSettings] = useState({
    setting1: false,
    setting2: false,
  });

  // Apply dark mode globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle permission changes
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setEmployeePermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  // Handle common settings changes
  const handleCommonSettingChange = (e) => {
    const { name, checked } = e.target;
    setCommonSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 shadow-md rounded-lg bg-white dark:bg-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Settings Page</h1>

        {/* Appearance Section */}
        <section className="mb-6 p-4 bg-white dark:bg-gray-700 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Appearance</h2>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="dark:text-white">Enable Dark Mode</span>
          </label>
        </section>

        {/* Permissions Section */}
        <section className="mb-6 p-4 bg-white dark:bg-gray-700 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Permissions</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canView"
                checked={employeePermissions.canView}
                onChange={handlePermissionChange}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="dark:text-white">Can View</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canEdit"
                checked={employeePermissions.canEdit}
                onChange={handlePermissionChange}
                className="form-checkbox h-5 w-5 text-yellow-600"
              />
              <span className="dark:text-white">Can Edit</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="canDelete"
                checked={employeePermissions.canDelete}
                onChange={handlePermissionChange}
                className="form-checkbox h-5 w-5 text-red-600"
              />
              <span className="dark:text-white">Can Delete</span>
            </label>
          </div>
        </section>

        {/* Common Settings Section */}
        <section className="p-4 bg-white dark:bg-gray-700 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Common Settings</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="setting1"
                checked={commonSettings.setting1}
                onChange={handleCommonSettingChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="dark:text-white">Sample Setting 1</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="setting2"
                checked={commonSettings.setting2}
                onChange={handleCommonSettingChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="dark:text-white">Sample Setting 2</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
