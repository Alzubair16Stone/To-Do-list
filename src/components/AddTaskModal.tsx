import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flag } from "lucide-react";
import { TodoContext } from "../context/TodoContext";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("AddTaskModal must be used within a TodoProvider");
  }

  const { addTodo, addCategory, categories } = context;

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<boolean>(false); // For adding new category
  const [dueDate, setDueDate] = useState<string>("");
  const createdAt = new Date().toISOString();
  const [warning, setWarning] = useState<string>("");
  if (!isOpen) return null; // Safety check, though AnimatePresence handles this

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setWarning("Please fill in the task title before submitting.");
      setTimeout(() => setWarning(""), 3000); // Clear warning after 3 seconds
      return;
    }

    addTodo({
      title,
      priority,
      description,
      category,
      dueDate,
      createdAt,
      id: "",
      isCompleted: false,
    });
    addCategory(category); // Ensure category is added to the list if it's new
    setTitle(""); // Reset form
    setDescription(""); // Reset form
    setCategory(""); // Reset form
    setDueDate(""); // Reset form
    onClose(); // Close modal
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Closes modal if clicking outside the box
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
        className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-700 p-6 shadow-2xl relative text-white"
      >
        {/* Modal Warning */}
        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} // Note: changed from -20 to 0 for cleaner positioning
              exit={{ y: -50, opacity: 0 }}
              // 2. Cleaned up Tailwind positioning classes
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none"
            >
              <p>{warning}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-4 text-indigo-400">
          Create New Task
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g., Design landing page structure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              autoFocus
            />
          </div>

          {/* Priority & Due Date (Grid Layout) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Priority
              </label>
              <div className="relative flex items-center">
                <Flag
                  size={16}
                  className="absolute left-3 text-gray-500 pointer-events-none"
                />
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "low" | "medium" | "high")
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Due Date
              </label>
              <div className="relative flex items-center">
                <Calendar
                  size={16}
                  className="absolute left-3 text-gray-500 pointer-events-none"
                />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer scheme-dark" // scheme-dark forces calendar UI to look good in dark mode
                />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            {/* Description Textarea */}
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              placeholder="Add more details about the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div>
            {/* Category Input */}
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Category
            </label>
            {newCategory ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={category}
                  onChange={(e) => {
                    if (e.target.value.trim() !== "")
                      return setCategory(e.target.value);
                  }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setNewCategory(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
            {!newCategory && (
              <button
                type="button"
                onClick={() => setNewCategory(true)}
                className="mt-2 px-3 py-1 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                + Add New Category
              </button>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTaskModal;
