//import { useState } from 'react'
//import heroImg from './assets/hero.png'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
import { Routes, Route, Navigate } from "react-router-dom";
import { SignupForm } from "./components/auth/signup-form";
import { LoginForm } from "./components/auth/login-form";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminLayout from "./components/layouts/AdminLayout";
//user pages
import Dashboard from "./components/user-pages/Dashbord";
import Profile from "./components/user-pages/Profile";
import EditProfile from "./components/user-pages/EditProfile";
import Jobs from "./components/user-pages/Jobs";
import JobDetails from "./components/user-pages/JobDetails";
import SavedJobs from "./components/user-pages/SavedJobs";
import ApplyJob from "./components/user-pages/ApplyJob";
import UserApplications from "./components/user-pages/UserApplications";
import UserApplicationDetails from "./components/user-pages/UserApplicationDetails";
import Resume from "./components/user-pages/Resume";

//recruiters pages
import RecruiterDashboard from "./components/recruiter-pages/RecruiterDashboard";
import CompanyProfile from "./components/recruiter-pages/CompanyProfile";
import MyJobs from "./components/recruiter-pages/MyJobs";
import RecruiterJobDetails from "./components/recruiter-pages/RecruiterJobDetails";
import CreateJob from "./components/recruiter-pages/CreateJob";
import EditJob from "./components/recruiter-pages/EditJob";
import Applicants from "./components/recruiter-pages/Applicants";
import ApplicantDetails from "./components/recruiter-pages/ApplicantDetails";
import Interviews from "./components/recruiter-pages/Interviews";
import RecruiterProfile from "./components/recruiter-pages/RecruiterProfile";

//Admin pages
import AdminDashboard from "./components/admin-pages/AdminDashboard";
import AdminUsers from "./components/admin-pages/AdminUsers";
import AdminUserDetails from "@/components/admin-pages/AdminUserDetails";
import AdminRecruiters from "./components/admin-pages/AdminRecruiters";
import AdminRecruiterDetails from "./components/admin-pages/AdminRecruiterDetails";
import AdminJobs from "./components/admin-pages/AdminJobs";
import AdminJobDetails from "./components/admin-pages/AdminJobDetails";
import AdminApplications from "./components/admin-pages/AdminApplications";
import AdminApplicationDetails from "./components/admin-pages/AdminApplicationDetails";
import AdminProfile from "./components/admin-pages/AdminProfile";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="/register" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        <Route path="/applications" element={<UserApplications />} />
        <Route path="/applications/:id" element={<UserApplicationDetails />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/saved-jobs" element={<SavedJobs/>}/>
        
        {/* Recruiter Routes */}
        <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="recruiter/company" element={<CompanyProfile/>}/>
        <Route path="recruiter/jobs" element={<MyJobs />} />
        <Route path="recruiter/jobs/:id" element={<RecruiterJobDetails />} />
        <Route path="recruiter/jobs/create" element={<CreateJob />} />
        <Route path="recruiter/jobs/edit/:jobId" element={<EditJob />} />
        <Route path="recruiter/applicants" element={<Applicants />} />
        <Route path="recruiter/applicants/:id" element={<ApplicantDetails />} />
        <Route path="recruiter/interviews" element={<Interviews />} />
        <Route path="recruiter/profile" element={<RecruiterProfile />} />
        </Route>
      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/users/:id" element={<AdminUserDetails />} />
          <Route path="admin/recruiters" element={<AdminRecruiters />} />
          <Route path="admin/recruiters/:id" element={<AdminRecruiterDetails />} />
          <Route path="admin/jobs" element={<AdminJobs />} />
          <Route path="admin/jobs/:id" element={<AdminJobDetails />} />
          <Route path="admin/applications" element={<AdminApplications />} />
          <Route path="admin/applications/:id" element={<AdminApplicationDetails />} />
          <Route path="admin/profile" element={<AdminProfile />} />
      </Route>
    
   </Routes>
  );
}

export default App;
