import React, { useState } from "react";
import { motion } from "framer-motion";
import { Login, Register } from "../../api/Auth";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailure, selectLoading, selectError } from "../../redux/user/reducer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest())
    try {
      const [err, data] = isLogin
        ? await Login(formData.email, formData.password)
        : await Register(formData.firstName, formData.lastName, formData.email, formData.password);

    if (err) dispatch(loginFailure(err))
    else if(data) dispatch(loginSuccess(data))

    } catch (err:any) {
      dispatch(loginFailure(err))
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Task Manager App</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-96 min-h-[450px] flex flex-col justify-between">
        <div className="flex mb-4 relative">
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors duration-300 ${
              isLogin ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors duration-300 ${
              !isLogin ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
          <motion.div
            className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500"
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col justify-center"
        >
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className={`rounded p-2 w-full ${
                isLogin ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
              } text-white transition-all`}
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
