import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserState } from "../../redux/user/selectors";
import Header from "../Header";

const ProtectedRoute = () => {
  const user = useSelector(selectUserState);
  if (!user.token) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;