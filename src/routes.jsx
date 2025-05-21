// import React from "react";
import { Routes, Route} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import DatabasePage from "./pages/DatabasePage.jsx";
import GrievancesPage from "./pages/GrievancesPage.jsx";
import KPIPage from "./pages/KPIPage.jsx";
import LeavePage from "./pages/LeavePage.jsx";
import LoansPage from "./pages/LoansPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import StructurePage from "./pages/StructurePage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import TrainingsPage from "./pages/TrainingsPage.jsx";
import TermsPage from "./pages/Terms.jsx";
import ProtectedRoute from "./components/route/protectedRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";




function AppRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage/>}/>
      <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/grievances" element={<GrievancesPage />} />
          <Route path="/kpi" element={<KPIPage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/structure" element={<StructurePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />

        </Route>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;