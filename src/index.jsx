import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ContextProvider from "./contextStore/contextProvider";
import Auth from "./components/authentication/auth";
import Dashboard from "./components/facultyPageContents/dashboard/Dashboard";
import StudentDashboard from "./components/pageContents/dashboard/Dashboard";
import Classmates from "./components/pageContents/classmates/Classmates";
import Courses from "./components/pageContents/courses/Courses";
import Experiments from "./components/pageContents/experiments/Experiments";
import Profile from "./components/pageContents/profile/Profile";
import Submissions from "./components/pageContents/submissions/Submissions";
import Teachers from "./components/pageContents/teachers/Teachers";
import Grades from "./components/pageContents/grades/grades";
import HomeLayout from "./components/layout/homeLayout";
import Editor from "./components/pageContents/editor/editor";
import TeacherDash from "./components/facultyPageContents/teacherDash";
import ExperimentSubmissions from "./components/facultyPageContents/experimentSubmissions/experimentSubmissions";
import TeacherExperiments from "./components/facultyPageContents/teacherExperiments/teacherExperiments";
import PrivateRoute from "./privateRoute";
import Students from "./components/facultyPageContents/Students/Students";
import FacultyAnnouncements from "./components/facultyPageContents/announcements/Announcements";
import FacultyGradings from "./components/facultyPageContents/facultyGradings/facultyGradings";
import { Resetpass } from "./components/authentication/resetPassword/resetPass";
import ResetSuccessfull from "./components/authentication/resetPassword/resetSucess";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/resetPassword",
    element: <Resetpass/>,
  },
  {
    path: "/resetsuccessful",
    element: <ResetSuccessfull/>,
  },
  {
    path: "/facultyDashboard",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Dashboard />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/studentDashboard",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <StudentDashboard />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/classmates",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Classmates />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/courses",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Courses />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/experiments",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Experiments />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Profile />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/submissions",
    element: (
      <PrivateRoute>
       <HomeLayout>
        <Submissions />
      </HomeLayout> 
      </PrivateRoute>
    ),
  },
  {
    path: "/faculties",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Teachers />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/grades",
    element: (
    <PrivateRoute>
      <HomeLayout>
        <Grades />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/editor/:id",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <Editor />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/teacherDash",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <TeacherDash />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/experimentSubmissions",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <ExperimentSubmissions />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/teacherExperiments",
    element: (
      <PrivateRoute>
      <HomeLayout>
        < TeacherExperiments />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/Students",
    element: (
      <PrivateRoute>
      <HomeLayout>
        < Students />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/Announcements",
    element: (
      <PrivateRoute>
      <HomeLayout>
        < FacultyAnnouncements />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/FacultyGradings",
    element: (
      <PrivateRoute>
      <HomeLayout>
        <FacultyGradings />
      </HomeLayout>
      </PrivateRoute>
    ),
  },
  
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
