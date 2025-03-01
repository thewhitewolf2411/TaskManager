import { useSelector } from "react-redux";
import { selectUserState } from "../../redux/user/selectors";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const user = useSelector(selectUserState);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-600">First Name</label>
          <p className="border rounded p-2 w-full bg-gray-100">{user.firstName}</p>
        </div>

        <div>
          <label className="block text-gray-600">Last Name</label>
          <p className="border rounded p-2 w-full bg-gray-100">{user.lastName}</p>
        </div>

        <div>
          <label className="block text-gray-600">Email</label>
          <p className="border rounded p-2 w-full bg-gray-100">{user.email}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
