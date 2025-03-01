import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { deleteTask, updateTask, addComment } from "../../redux/tasks/actions";
import { TaskInterface } from "../../interface/TaskInterface";
import { AppDispatch } from "../../redux/store";
import Comment from "../Comment";
import { selectTasks } from "../../redux/tasks/selectors";

const priorityColors: Record<string, string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-500 text-white",
};

const categoryLabels: Record<number, string> = {
  10: "Personal",
  20: "Work",
  30: "Learning",
};

const TaskModal = ({ task, onClose }: { task: TaskInterface; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  const updatedTask = tasks.find((t) => t.id === task.id) || task;

  const [title, setTitle] = useState(updatedTask.title);
  const [description, setDescription] = useState(updatedTask.description);
  const [priority, setPriority] = useState(updatedTask.priority);
  const [categoryId, setCategoryId] = useState(updatedTask.categoryId || 10);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setTitle(updatedTask.title);
    setDescription(updatedTask.description);
    setPriority(updatedTask.priority);
    setCategoryId(updatedTask.categoryId);
  }, [updatedTask]);

  const handleBlur = () => {
    dispatch(updateTask({ id: updatedTask.id, title, description, priority, categoryId }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
    dispatch(updateTask({ id: updatedTask.id, priority: e.target.value, categoryId }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(Number(e.target.value));
    dispatch(updateTask({ id: updatedTask.id, categoryId: Number(e.target.value) }));
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    dispatch(addComment({ taskId: updatedTask.id, comment: newComment }));
    setNewComment("");
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
        {/* Priority Header (Dropdown) */}
        <div className="text-center text-lg font-bold py-2 rounded-t-lg">
          <select
            className={`w-full p-2 rounded-md cursor-pointer ${priorityColors[priority] || "bg-gray-500 text-white"}`}
            value={priority}
            onChange={handlePriorityChange}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full px-3 py-2 border rounded-md cursor-pointer"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            <option value={10}>Personal</option>
            <option value={20}>Work</option>
            <option value={30}>Learning</option>
          </select>
        </div>

        <input
          type="text"
          className="text-lg font-bold w-full mt-4 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
        />

        <textarea
          className="w-full text-gray-700 px-2 py-1 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
        />

        <h3 className="text-md font-semibold mt-4">Comments</h3>
        <div className="bg-gray-100 p-2 rounded-md mt-2 max-h-60 overflow-y-auto">
          {updatedTask.comments.length > 0 ? (
            updatedTask.comments.map((comment) => (
              <Comment key={comment.id} id={comment.id} comment={comment.comment} firstName={comment.firstName} lastName={comment.lastName} createdAt={comment.createdAt} userId={comment.userId} />
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border rounded-lg"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
          >
            Add Comment
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => dispatch(deleteTask(task.id))} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Delete Task
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;
