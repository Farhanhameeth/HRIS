import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const initialDepartments = [
  {
    name: "Engineering",
    subDepartments: [
      {
        name: "Software Development",
        subDepartments: [{ name: "Frontend Team" }, { name: "Backend Team" }],
      },
      { name: "Quality Assurance" },
    ],
  },
  {
    name: "Human Resources",
    subDepartments: [{ name: "Recruitment" }, { name: "Employee Relations" }],
  },
  { name: "Finance" },
];

const DepartmentNode = ({ department, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(department.name);
  const [editing, setEditing] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
    onUpdate(department, { ...department, name: e.target.value });
  };

  return (
    <div className="ml-4 mt-4">
      <div className="p-3 border border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md flex justify-between items-center">
        {editing ? (
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 rounded-md text-gray-800 dark:text-gray-200"
            value={name}
            onChange={handleNameChange}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <span onClick={() => setEditing(true)} className="cursor-pointer">
            {department.name}
          </span>
        )}
        <div className="flex items-center space-x-2">
          {department.subDepartments && department.subDepartments.length > 0 && (
            <FontAwesomeIcon
              icon={isOpen ? faChevronDown : faChevronRight}
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer"
            />
          )}
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => onDelete(department)}
            className="cursor-pointer text-red-600 dark:text-red-400"
          />
        </div>
      </div>

      {isOpen && department.subDepartments && department.subDepartments.length > 0 && (
        <div className="ml-6 mt-2 border-l-2 border-red-600 dark:border-red-400 pl-4">
          {department.subDepartments.map((subDept, idx) => (
            <DepartmentNode
              key={idx}
              department={subDept}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentStructure = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleUpdate = (oldDept, updatedDept) => {
    const updateDepartments = (depts) =>
      depts.map((dept) =>
        dept === oldDept ? updatedDept : { ...dept, subDepartments: dept.subDepartments ? updateDepartments(dept.subDepartments) : [] }
      );
    setDepartments(updateDepartments(departments));
  };

  const handleDelete = (department) => {
    const deleteDepartments = (depts) =>
      depts.filter((dept) => dept !== department).map((dept) =>
        dept.subDepartments ? { ...dept, subDepartments: deleteDepartments(dept.subDepartments) } : dept
      );
    setDepartments(deleteDepartments(departments));
  };

  const addDepartment = () => {
    setDepartments([...departments, { name: "New Department" }]);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Department Structure</h1>
        {/* Dark Mode Toggle */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="dark:text-white">Enable Dark Mode</span>
        </label>
      </div>

      <button
        className="mb-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-500 transition-all"
        onClick={addDepartment}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Department
      </button>
      <div>
        {departments.map((dept, idx) => (
          <DepartmentNode
            key={idx}
            department={dept}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentStructure;
