import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InnerLayout from './layouts/InnerLayout';
import CenterLayout from './layouts/CenterLayout';

import Notes from './features/user/Notes';
import Quizzes from './features/user/Quizzes';
import Analytics from './features/user/Analytics';
import Feedback from './features/user/Feedback';

import Dashboard from './features/admin/Dashboard';
import ManageUser from './features/admin/ManageUser';
import AdminFeedback from './features/admin/ManageFeedback';

import Login from './features/auth/Login';
import Register from './features/auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path='/' element={<CenterLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User routes */}
        <Route path="/user" element={<InnerLayout role="user" />}>
          <Route index element={<Navigate to="/user/notes" />} />
          <Route path="notes" element={<Notes />} />
          <Route path="quiz" element={<Quizzes />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<InnerLayout role="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ManageUser />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
