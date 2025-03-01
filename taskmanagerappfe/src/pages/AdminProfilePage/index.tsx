import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { selectUserById } from "../../redux/users/selectors";
import { updateUser, getUsers } from "../../redux/users/actions"; // Import actions
import { unwrapResult } from "@reduxjs/toolkit";

const AdminProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => selectUserById(state, userId || ""));
  const isEditMode = location.pathname.includes("/edit/");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate("/users");
    } else if (!user) {
      dispatch(getUsers({ pageNumber: 1, numberOfResults: 10 }));
    }
  }, [userId, dispatch, navigate, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(updateUser({ userId, ...formData }));
      unwrapResult(resultAction); // Unwrap to catch possible errors

      navigate("/users"); // Redirect back after successful update
    } catch (err: any) {
      setError(err?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isEditMode ? "Edit User" : "User Profile"}
      </h2>

      {isEditMode ? (
        <>
          <div>
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p className="text-gray-600">
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
        </>
      )}

      <button
        onClick={() => navigate("/users")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
      >
        Back to Users
      </button>
    </div>
  );
};

export default AdminProfilePage;
