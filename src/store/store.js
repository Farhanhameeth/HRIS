import { configureStore } from '@reduxjs/toolkit';
import announcementSlice from '../features/announcement/announcementSlice';
import authReducer from '../features/auth/authSlice';
import payrollReducer from '../features/payroll/payrollSlice';
import trainingReducer from '../features/training/trainingSlice';
import leaveReducer from "../features/leave/leaveSlice";
import loanSlice from '../features/loan/loanSlice.js';
import { thunk } from 'redux-thunk';
import employeeBirthdaySlice from "../features/employees/employeeBirthdaySlice.js";
import employeeDetailsReducer from '../features/employees/employeeDetailsSlice';
import securityQuestionsReducer from '../features/employees/employeeSecurityQuestionSlice';
import payrollSummaryReducer from '../features/payroll/payrollSummarySlice';
import grievancesReducer from '../features/grievances/grievancesSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';
import resourceReducer from '../features/resource/resourceSlice';
import databaseReducer from '../features/database/databaseSlice';
import forgotPasswordReducer from '../features/auth/forgotPassword';
import sidebarReducer from '../features/navbar/sidebarSlice';
import upcomingEventsReducer from '../features/upcomingEvents/upcomingEventsSlice.js';
import employeeSecurityQuestionSlice from '../features/employees/employeeSecurityQuestionSlice';
import visualLeaveSlice from '../features/leave/visualLeaveSlice.js';
import UpcomingHolidaysSlice from '../features/upcomingEvents/upcomingHolidaysSlice.js';
// import attendanceSummaryReducer from '../features/employees/attendanceSummaryReducer.js'



export const store = configureStore({
    reducer: {
        announcement: announcementSlice,
        auth: authReducer,
        payroll: payrollReducer,
        payrollSummary: payrollSummaryReducer,
        training: trainingReducer,
        leave: leaveReducer,
        grievances: grievancesReducer,
        tickets: ticketsReducer,
        loans: loanSlice,
        employeeBirthday: employeeBirthdaySlice,
        employeeDetails: employeeDetailsReducer,
        employeeSecurityQuestions : employeeSecurityQuestionSlice,
        resource: resourceReducer,
        forgotPassword: forgotPasswordReducer,
        database: databaseReducer,
        sidebar: sidebarReducer,
        upcomingEvents: upcomingEventsReducer,
        visualLeave: visualLeaveSlice,
        upcomingHolidays: UpcomingHolidaysSlice
        // employeeDetails: employeeDetailsReducer,

        // attendanceSummary: attendanceSummaryReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
