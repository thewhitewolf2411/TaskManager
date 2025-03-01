import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserState } from "../redux/user/selectors";

import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";
import AdminDashboard from "../pages/Users";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfilePage from "../pages/Profile";
import AdminProfilePage from "../pages/AdminProfilePage";


const App = () => {
  const user = useSelector(selectUserState);

  return (
    <Routes>
      {/* Redirect based on role */}
      <Route 
        path="/" 
        element={user.token ? <Navigate to={user.role === "admin" ? "/users" : "/dashboard"} replace /> : <AuthPage />} 
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ✅ Admin Profile Routes */}
        <Route path="/admin/user/:userId" element={<AdminProfilePage />} />
        <Route path="/admin/user/edit/:userId" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;