import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../redux/tasks/actions";
import { CommentInterface } from "../../interface/CommentInterface";
import { AppDispatch } from "../../redux/store";
import { selectUserState } from "../../redux/user/selectors"; // Selector to get logged-in user
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [key, seconds] of Object.entries(intervals)) {
    const timeValue = Math.floor(diffInSeconds / seconds);
    if (timeValue >= 1) {
      return `${timeValue} ${key}${timeValue > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

const Comment = ({ id, comment, firstName, lastName, userId, createdAt }: CommentInterface) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectUserState);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);

  const handleDelete = () => {
    dispatch(deleteComment(id));
  };

  const handleEdit = () => {
    if (editedComment.trim() === "") return;
    dispatch(editComment({ commentId: id, comment: editedComment }));
    setIsEditing(false);
  };

  return (
    <div className="p-2 bg-white rounded-md shadow-sm mb-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="font-bold text-sm">{`${firstName} ${lastName}`}</span>
          <span className="text-xs text-gray-500 ml-2">{getTimeAgo(createdAt)}</span>
        </div>

        {/* Show edit/delete buttons only for the comment's author */}
        {currentUser?.id === userId && (
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-500 text-xs hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-500 text-xs hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col">
          <textarea
            className="w-full p-2 border rounded-lg text-sm"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-1">
            <button onClick={() => setIsEditing(false)} className="text-gray-500 text-xs hover:underline">
              Cancel
            </button>
            <button onClick={handleEdit} className="text-green-500 text-xs hover:underline">
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 text-sm">{comment}</p>
      )}
    </div>
  );
};

export default Comment;
