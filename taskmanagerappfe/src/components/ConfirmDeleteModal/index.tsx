import { motion } from "framer-motion";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }} // Fade in from top
        animate={{ opacity: 1, y: 0 }}  // Fully visible
        exit={{ opacity: 0, y: -20 }}   // Fade out to top
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Confirm Deletion</h2>
        <p className="text-center text-gray-700">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="flex justify-center space-x-4 mt-6">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDeleteModal;
