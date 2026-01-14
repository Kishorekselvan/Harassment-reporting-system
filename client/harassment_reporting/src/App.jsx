import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import Admin from './pages/Admin';
import Police from './pages/Police';
import ReportDetail from './pages/ReportDetail';
import ReportSubmission from './pages/ReportSubmission';
import ViewReports from './pages/ViewReports';
import ReportDetailView from './pages/ReportDetailView';
import AddPolice from './pages/AddPolice';

import PoliceReports from './components/PoliceReports';
import UpdateProfile from './components/UpdateProfile';
import UpdatePassword from './components/UpdatePassword';
import PoliceDetails from './components/PoliceDetails';
import HandleReports from './components/HandleReports';

import UserChatPage from "./components/UserChatPage";
import PoliceChatPage from "./components/PoliceChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/userpage" element={<User />} />
      <Route path="/adminpage" element={<Admin />} />

      <Route path="/report/:id" element={<ReportDetail />} />
      <Route path="/report-submission" element={<ReportSubmission />} />
      <Route path="/admin/view-reports" element={<ViewReports />} />
      <Route path="/report-detail/:reportId" element={<ReportDetailView />} />
      <Route path="/admin/add-police" element={<AddPolice />} />

      {/* CHAT ROUTES */}
      <Route path="/chat/user/:reportId" element={<UserChatPage />} />
      <Route path="/chat/police/:reportId" element={<PoliceChatPage />} />

      {/* POLICE DASHBOARD (ONLY ONE policepage route) */}
      <Route path="/policepage" element={<Police />}>
        <Route index element={<PoliceReports />} />
        <Route path="reports" element={<PoliceReports />} />
        <Route path="update-profile" element={<UpdateProfile />} />
        <Route path="update-password" element={<UpdatePassword />} />
        <Route path="police-details" element={<PoliceDetails />} />
        <Route path="handle-reports/:id" element={<HandleReports />} />
      </Route>
    </Routes>
  );
}

export default App;
