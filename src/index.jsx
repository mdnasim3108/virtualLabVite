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
// import TDashboard from "./components/facultyPageContentspageContents/dashboard/Dashboard";

// import TeacherDashboard from "./components/facultyPageContents/teacherDash";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <HomeLayout>
        <Dashboard />
      </HomeLayout>
    ),
  },
  {
    path: "/classmates",
    element: (
      <HomeLayout>
        <Classmates />
      </HomeLayout>
    ),
  },
  {
    path: "/courses",
    element: (
      <HomeLayout>
        <Courses />
      </HomeLayout>
    ),
  },
  {
    path: "/experiments",
    element: (
      <HomeLayout>
        <Experiments />
      </HomeLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <HomeLayout>
        <Profile />
      </HomeLayout>
    ),
  },
  {
    path: "/submissions",
    element: (
       <HomeLayout>
        <Submissions />
      </HomeLayout> 
    ),
  },
  {
    path: "/teachers",
    element: (
      <HomeLayout>
        <Teachers />
      </HomeLayout>
    ),
  },
  {
    path: "/grades",
    element: (
      <HomeLayout>
        <Grades />
      </HomeLayout>
    ),
  },
  {
    path: "/editor/:id",
    element: (
      <HomeLayout>
        <Editor />
      </HomeLayout>
    ),
  },
  {
    path: "/teacherDash",
    element: (
      <HomeLayout>
        <TeacherDash />
      </HomeLayout>
    ),
  },
  {
    path: "/experimentSubmissions",
    element: (
      <HomeLayout>
        <ExperimentSubmissions />
      </HomeLayout>
    ),
  },
  {
    path: "/teacherExperiments",
    element: (
      <HomeLayout>
        < TeacherExperiments />
      </HomeLayout>
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
