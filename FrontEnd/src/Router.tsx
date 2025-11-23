import { createBrowserRouter, Navigate } from "react-router-dom";

import CenterLayout from "./layouts/CenterLayout";

// Auth features
import Login from "./features/guest/Login/Login";
import Register from "./features/guest/Register/Register";

// User features
import NotesPage from "./features/user/notes/Notes/NotesPage";
import Quizzes from "./features/user/quizzes/Quizzes/Quizzes";
// Admin features
import AdminFeedback from "./features/admin/ManageFeedback";
import SettingsConfig from "./features/admin/settings/SettingsConfig";
import QuizGeneration from "./features/user/quizzes/QuizGeneration/QuizGeneration";
import QuizDetailPage from "./features/user/quizzes/QuizDetailPage/QuizDetailPage";
import QuizView from "./features/user/quizzes/QuizAttempt/QuizAttemptView";
import QuizResultView from "./features/user/quizzes/QuizAttemptResult/QuizResultView";
import QuizHistory from "./features/user/quizzes/QuizHistory/QuizHistory";
import { LandingPage } from "./features/guest/HomePage/HomePage";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import EntryComponent from "./features/guest/Entry/EntryComponent";
import Feedbacks from "./features/user/feedbacks/Feedbacks/Feedbacks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CenterLayout />,
    children: [
      { index: true, element: <EntryComponent /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <Navigate to="/user/notes" /> },
      { path: "notes", element: <NotesPage /> },
      { path: "quiz", element: <Quizzes /> },
      { path: "quiz/generate", element: <QuizGeneration /> },
      { path: "quiz/:id", element: <QuizDetailPage /> },
      { path: "quiz/history/:id", element: <QuizHistory /> },
      { path: "quiz/quizAttempt/:id", element: <QuizView /> },
      { path: "quiz/quizAttemptResult/:id", element: <QuizResultView /> },
      { path: "feedbacks", element: <Feedbacks /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/settings" /> },
      { path: "settings", element: <SettingsConfig /> },
      { path: "feedback", element: <AdminFeedback /> },
    ],
  },
  {
    path: "/homepage", element: <LandingPage />,
  }
]);
