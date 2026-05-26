import { useState, useEffect, useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import { motion, AnimatePresence } from "framer-motion";
interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [warning, setWarning] = useState<string>("");
  if (!isOpen) return null;
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("The AddCategoryModal is not provided in TodoContext");
  }

  const { addCategory } = context;

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      setWarning("Please fill up the categroy name!!");
    }
    addCategory(categoryName);
    setCategoryName("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="gap-2 bg-gray-800 w-full max-w-md rounded-2xl broder border-gray-700 p-5 shadow-2xl relative text-white flex flex-col justify-center items-center bg-"
        >
          <div className="font-bold text-xl">
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-6">
            <button
              className="cursor-pointer px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              onClick={handleSubmit}
            >
              Add
            </button>
            <button
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
              onClick={() => {
                setCategoryName("");
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddCategoryModal;
