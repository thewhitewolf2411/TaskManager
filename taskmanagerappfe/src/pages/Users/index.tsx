import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../redux/users/actions";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { selectError, selectLoading } from "../../redux/users/reducer";
import { selectUsersState } from "../../redux/users/selectors";
import { selectUserState } from "../../redux/user/selectors"; // ✅ Get logged-in user info
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const { users } = useSelector(selectUsersState);
  const loggedInUser = useSelector(selectUserState); // ✅ Get logged-in user

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numberOfResults, setNumberOfResults] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getUsers({ pageNumber, numberOfResults }));
  }, [dispatch, pageNumber, numberOfResults]);

  const openModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      dispatch(deleteUser({ userId: selectedUserId, pageNumber, numberOfResults }));
      closeModal();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => navigate("/admin/user/create")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add New User
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              users.map((user: any) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="border border-gray-300 px-4 py-2">{user.firstName}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.lastName}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/user/edit/${user.id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Modify
                    </button>
                    
                    <button
                      onClick={() => openModal(user.id)}
                      className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ${
                        user.id === loggedInUser.id ? "opacity-0 pointer-events-none" : ""
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default AdminDashboard;
