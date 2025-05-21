import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "../../index.css";
import TileHeader from "../reusable/TileHeader";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUpcomingEvents,
  selectUpcomingEvents,
  setSelectedDate,
} from "../../features/upcomingEvents/upcomingEventsSlice";

import {
  fetchHolidays,
  selectHolidays,
} from "../../features/upcomingEvents/upcomingHolidaysSlice";

const UpcomingEvents = () => {
  const [date, setDate] = useState(dayjs()); 
  const dispatch = useDispatch(); 

  // Log the entire state
  const fullState = useSelector((state) => state);
  console.log("Full state:", fullState); // Add this line to log the full state

  const events = useSelector(selectUpcomingEvents); 
  const status = useSelector((state) => state.upcomingEvents.status); 

  const holidays = useSelector(selectHolidays);
  const holidayStatus = useSelector((state) => state.upcomingHolidays.status);

  useEffect(() => {
    // Dispatch fetchUpcomingEvents and fetchHolidays when the component mounts or the selected date changes
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    dispatch(fetchUpcomingEvents(formattedDate));

    // Dispatch the fetchHolidays action with a date range
    const startDate = formattedDate;
    const endDate = dayjs(date).add(7, 'day').format("YYYY-MM-DD"); // For example, fetching holidays for the next week
    dispatch(fetchHolidays({ startDate, endDate }));
  }, [dispatch, date]);

  const onChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setDate(newDate);
    dispatch(setSelectedDate(formattedDate));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="bg-white rounded-lg shadow-md max-h-full">
          <TileHeader HeaderText="Upcoming Events and Holidays" showDatePicker={false} />

          <div className="flex justify-center">
            {/* Centering wrapper */}
            <DateCalendar
              value={date}
              onChange={onChange}
              sx={{
                margin: "6px", // Adjust the margin around the calendar component
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: "#f0f0f0", // Change the background color of the calendar header
                },
                "& .MuiPickersDay-root": {
                  color: "#000000", // Change the color of the day numbers
                },
                "& .Mui-selected": {
                  backgroundColor: "#FF944D", // Change the background color of selected days
                  color: "#ffffff",
                },
                "& .MuiPickersDay-dayWithMargin": {
                  margin: "4px 4px", // Adjust the spacing between days
                },
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center">
          <h2 className="text-md font-bold text-gray-800 mb-2 w-full text-left px-3">Events</h2>
            <ul className="p-3 pt-1 w-full">
              {status === "loading" && <p>Loading events...</p>}
              {status === "failed" && <p>Failed to load events.</p>}
              {status === "succeeded" && events.length > 0 ? (
                events.map((event) => (
                  <li
                    key={event.id}
                    className="mb-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 w-full"
                  >
                    <h3 className="text-base font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">Date: {event.date}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </li>
                ))
              ) : (
                <p>No upcoming events.</p>
              )}
            </ul>

            <h2 className="text-md font-bold text-gray-800 mb-4 w-full text-left px-3">Holidays</h2>
            <ul className="p-3 pt-1 w-full">
              {holidayStatus === "loading" && <p>Loading holidays...</p>}
              {holidayStatus === "failed" && <p>Failed to load holidays.</p>}
              {holidayStatus === "succeeded" && holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <li
                    key={holiday.id}
                    className="mb-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 w-full"
                  >
                    <h3 className="text-base font-semibold text-gray-900">
                      {holiday.Title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Date: {holiday.StartDate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {holiday.Description}
                    </p>
                  </li>
                ))
              ) : (
                <p>No holidays during this period.</p>
              )}
            </ul>

          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default UpcomingEvents;
