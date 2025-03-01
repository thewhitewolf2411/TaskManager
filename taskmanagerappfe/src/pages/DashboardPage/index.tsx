import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTaskStatus } from "../../redux/tasks/actions";
import { selectTasks } from "../../redux/tasks/selectors";
import { AppDispatch } from "../../redux/store";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskModal from "../../components/TaskModal";
import CreateTaskModal from "../../components/CreateTaskModal";
import useMedia from "../../hooks/useMedia";
import { TaskInterface } from "../../interface/TaskInterface";

const priorityColors: Record<string, string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-500 text-white",
};

const reorder = (list: TaskInterface[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  const [selectedTask, setSelectedTask] = useState<TaskInterface | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<"todo" | "inProgress" | "completed">("todo");
  const columnCount = useMedia(["(min-width: 1000px)", "(min-width: 600px)"], [3, 1], 3);

  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [dueDateFilter, setDueDateFilter] = useState<string>("All");

  const [taskColumns, setTaskColumns] = useState<Record<string, TaskInterface[]>>({
    todo: [],
    inProgress: [],
    completed: [],
  });

  useEffect(() => {
    dispatch(
      getTasks({
        priorityFilter: priorityFilter === "All" ? null : priorityFilter,
        dueDateFilter,
      })
    );
  }, [dispatch, priorityFilter, dueDateFilter]);

  useEffect(() => {
    const groupedTasks: Record<string, TaskInterface[]> = { todo: [], inProgress: [], completed: [] };
    tasks.forEach((task: TaskInterface) => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].push(task);
      }
    });
    setTaskColumns(groupedTasks);
  }, [tasks]);

  const openCreateTaskModal = (status: "todo" | "inProgress" | "completed") => {
    setNewTaskStatus(status);
    setIsCreateModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    // If task is reordered within the same column
    if (source.droppableId === destination.droppableId) {
      const updatedColumn = reorder(taskColumns[source.droppableId], source.index, destination.index);
      setTaskColumns({ ...taskColumns, [source.droppableId]: updatedColumn });
    } else {
      // If task moves across columns
      const startColumn = [...taskColumns[source.droppableId]];
      const finishColumn = [...taskColumns[destination.droppableId]];
      const [movedTask] = startColumn.splice(source.index, 1);

      // ✅ Create a new task object (avoid modifying read-only status)
      const updatedTask = { ...movedTask, status: destination.droppableId };

      finishColumn.splice(destination.index, 0, updatedTask);

      setTaskColumns({
        ...taskColumns,
        [source.droppableId]: startColumn,
        [destination.droppableId]: finishColumn,
      });

      dispatch(updateTaskStatus({ taskId: movedTask.id, status: updatedTask.status }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="mx-auto max-w-6xl mt-10 p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Task Dashboard</h2>

        <div className="flex justify-between mb-4">
          <div>
            <label className="mr-2 font-semibold">Filter by Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as "All" | "High" | "Medium" | "Low")}
              className="p-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="mr-2 font-semibold">Filter by Due Date:</label>
            <input
              type="date"
              className="p-2 border rounded-lg"
              value={dueDateFilter === "All" ? "" : dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value || "All")}
            />
            <button
              onClick={() => setDueDateFilter("All")}
              className="ml-2 p-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div className={`grid ${columnCount === 3 ? "grid-cols-3 gap-4" : "grid-cols-1"}`}>
          {["todo", "inProgress", "completed"].map((status) => (
            <div key={status} className="w-full min-w-[300px] bg-gray-100 p-4 rounded-lg shadow-lg min-h-[400px] flex flex-col">
              <h3 className="text-lg font-semibold mb-3 text-center capitalize">
                {status.replace(/([A-Z])/g, " $1")}
              </h3>

              {/* Add Task Button */}
              <button
                onClick={() => openCreateTaskModal(status as "todo" | "inProgress" | "completed")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-3"
              >
                + Add Task
              </button>

              <Droppable droppableId={status} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex-grow flex flex-col min-w-[300px] min-h-[400px]">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className="w-full bg-white p-3 rounded-lg shadow-md mb-3 cursor-pointer hover:bg-gray-200 transition border border-gray-300"
                            >
                              <h4 className="font-bold">{task.title}</h4>

                              {/* Priority Tag */}
                              <span className={`text-xs px-2 py-1 rounded-lg ${priorityColors[task.priority] || "bg-gray-500 text-white"}`}>
                                {task.priority} Priority
                              </span>

                              {/* 📅 Due Date Display */}
                              {task.dueDate && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Due: {new Date(task.dueDate).toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {isCreateModalOpen && <CreateTaskModal status={newTaskStatus} onClose={closeCreateTaskModal} />}
    </DragDropContext>
  );
};

export default Dashboard;
