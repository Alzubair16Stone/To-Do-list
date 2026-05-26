import { motion, AnimatePresence } from "framer-motion";
import { TodoContext } from "../context/TodoContext";
import { useContext } from "react";
import { Trash2, Calendar, Folder } from "lucide-react";
import type { Task } from "../types";

// Inner single card component for individual state and clean animations
interface SingleCardProps {
  todo: Task;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void; // Optional: If your context supports marking as done
}

const SingleTaskCard = ({
  todo,
  onDelete,
  onToggleComplete,
}: SingleCardProps) => {
  // Define dynamic priority badge styles
  const priorityStyles = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <motion.div
      layout // Smoothly animates the layout grid when cards surrounding this element are deleted
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative flex flex-col justify-between p-5 bg-gray-800/40 border border-gray-700/60 rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-sm
        ${todo.isCompleted ? "opacity-40 border-gray-800 bg-gray-900/20 select-none" : "hover:border-indigo-500/40 hover:bg-gray-800/80 hover:shadow-indigo-500/5"}`}
    >
      {/* Top Section: Title & Checkbox & Delete */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Optional Completion Checkbox */}
            <input
              type="checkbox"
              checked={todo.isCompleted || false}
              onChange={() => onToggleComplete?.(todo.id)}
              className="mt-1 w-4 h-4 rounded-md border-gray-600 bg-gray-900 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-gray-800 cursor-pointer transition-colors"
            />
            <h3
              className={`text-base font-semibold text-white tracking-wide truncate flex-1
              ${todo.isCompleted ? "line-through text-gray-500" : ""}`}
            >
              {todo.title}
            </h3>
          </div>

          {/* Delete Icon - Hidden by default, slides/fades in when hover on card */}
          <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer -mt-1 -mr-1"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Task Description */}
        {todo.description && (
          <p
            className={`text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3
            ${todo.isCompleted ? "text-gray-600" : ""}`}
          >
            {todo.description}
          </p>
        )}
      </div>

      {/* Bottom Section: Metadata Footer */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-700/40 mt-auto">
        {/* Priority Badge */}
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${priorityStyles[todo.priority]}`}
        >
          {todo.priority}
        </span>

        {/* Category Badge */}
        <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-700/30 px-2.5 py-0.5 rounded-full border border-gray-700/50">
          <Folder size={11} className="text-gray-500" />
          <span className="truncate max-w-[80px]">{todo.category}</span>
        </span>

        {/* Due Date Indicator */}
        {todo.dueDate && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">
            <Calendar size={12} />
            <span>
              {new Date(todo.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Main Grid Container Wrapper Component
const TaskCard = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("TaskCard must be used within a TodoProvider");
  }

  // Destruction custom parameters out of your context state layer
  // Added "toggleTodoComplete" property name optionally to bridge modern interactions
  const { todos, deleteTodo, toggleTodoComplete } = context as any;

  return (
    <div className="p-4 w-full">
      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-500 text-sm">
            No tasks available in this workspace context panel view.
          </p>
        </div>
      ) : (
        // Grid setup optimized for responsive screens layouts
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          <AnimatePresence mode="popLayout">
            {todos.map((todo: Task) => (
              <SingleTaskCard
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggleComplete={toggleTodoComplete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
