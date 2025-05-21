import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { fetchEmployeeBirthdays, selectEmployeeBirthdays } from "../../features/employees/employeeBirthdaySlice";
import TileHeader from "../reusable/TileHeader";
import AvatarIcon from '../../../public/User.png'; // Make sure to import your avatar icon
import { isSameDay } from "date-fns";


Modal.setAppElement('#root'); // Set the app root element for accessibility

const EmployeeBirthdays = ({ month }) => {
  const dispatch = useDispatch();
  const birthdays = useSelector(selectEmployeeBirthdays);
  const status = useSelector((state) => state.employeeBirthday.status);
  const error = useSelector((state) => state.employeeBirthday.error);

  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(2);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployeeBirthdays(month)); // Ensure month is passed correctly
    }
  }, [dispatch, status, month]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const sortedBirthdays = [...birthdays].sort(
    (a, b) => new Date(b.birthDate) - new Date(a.birthDate)
  );

  const filteredBirthdays = selectedDate
  ? sortedBirthdays.filter((a) => {
      // Ensure birthDate is parsed correctly
      const birthDate = new Date(a.birthDate);
      if (isNaN(birthDate.getTime())) return false; // Ignore invalid dates

      // Normalize birthDate to match only day & month
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      // Normalize selected date
      const selectedUTCDate = new Date(selectedDate);
      selectedUTCDate.setHours(0, 0, 0, 0); // Reset to start of day

      const selectedMonth = selectedUTCDate.getMonth();
      const selectedDay = selectedUTCDate.getDate();

      return birthMonth === selectedMonth && birthDay === selectedDay;
    })
  : sortedBirthdays;



  const displayedBirthdays = filteredBirthdays.slice(0, visibleCount);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className=" bg-white shadow-customShadow rounded-lg">
      <TileHeader 
          HeaderText="Employee Birthdays" 
          showDatePicker={true} 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
      />
      {displayedBirthdays.length === 0 ? (
        <p className="text-gray-600 p-4">No Birthdays for the selected date.</p>
      ) : (
        <ul className="p-3">
          {displayedBirthdays.map((birthday, index) => (
            <li
              key={index}
              className="mb-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <div className="flex items-center">
                <img
                  src={AvatarIcon}
                  alt="Avatar"
                  className="h-14 w-14 rounded-full mr-4 border-2 border-white"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {birthday.firstName} {birthday.lastName}'s Birthday
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(birthday.birthDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* {filteredBirthdays.length > visibleCount && (
        <button
          onClick={openModal}
          className="mt-4 w-full p-2 bg-customOrange-100 text-black rounded-md hover:bg-customOrange-200 transition-colors duration-200"
        >
          View More
        </button>
      )} */}

<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="More Birthdays"
  className="modal p-6 bg-white rounded-lg shadow-lg"
  overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
>
  <div className="relative">
    <button
      onClick={closeModal}
      className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
    <h2 className="text-lg font-bold mb-4">More Birthdays</h2>
    <ul>
      {filteredBirthdays.map((birthday, index) => (
        <li
          key={index}
          className="mb-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          <h3 className="text-base font-semibold text-gray-900">
            {birthday.firstName} {birthday.lastName}'s Birthday
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(birthday.birthDate).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  </div>
</Modal>

<div className="mt-2 p-2 flex justify-between">
  <button
    onClick={openModal}
    className="w-1/2 p-2 bg-customOrange-100 text-black rounded-md hover:bg-customOrange-200 transition-colors duration-200"
  >
    View More
  </button>
  <button
    onClick={() => setSelectedDate(null)}
    className="w-1/2 ml-2 p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors duration-200"
  >
    Clear Filter
  </button>
</div>

    </div>
  );
};

export default EmployeeBirthdays;
