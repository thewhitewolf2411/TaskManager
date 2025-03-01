import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserState } from "../../redux/user/selectors";
import { logout } from "../../redux/user/reducer";
import { motion } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(selectUserState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Ensure navigation after logout
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      {/* Clickable Title to Navigate Home */}
      <h1 
        className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600 transition" 
        onClick={() => navigate("/")}
      >
        Task Manager
      </h1>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          <span className="text-gray-700">{user.firstName} {user.lastName}</span>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden"
          >
            <button onClick={() => handleNavigate("/dashboard")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Dashboard
            </button>
            
            {user.role === "admin" && (
              <button onClick={() => handleNavigate("/users")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Users
              </button>
            )}

            <button onClick={() => handleNavigate("/profile")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>

            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
