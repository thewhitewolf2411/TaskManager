import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { createTask } from "../../redux/tasks/actions";
import { AppDispatch } from "../../redux/store";

const CreateTaskModal = ({ status, onClose }: { status: "todo" | "inProgress" | "completed"; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [categoryId, setCategoryId] = useState(10);
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    dispatch(createTask({ title, description, priority, status, categoryId, dueDate }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Create Task</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value={10}>Personal</option>
            <option value={20}>Work</option>
            <option value={30}>Learning</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
