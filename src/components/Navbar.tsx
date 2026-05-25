import { motion } from "framer-motion";
import { Logs, Stone } from "lucide-react";
import AddTaskModal from "./AddTaskModal";
import { useState } from "react";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      className="flex justify-between items-center"
    >
      <h1 className="text-2xl flex items-center gap-3">
        <motion.i>
          <Stone className="text-indigo-600 shadow-2xl" />
        </motion.i>{" "}
        To Do lists
      </h1>
      <motion.button
        initial={{ background: "#4a5565" }}
        whileHover={{ background: "#6a7282" }}
        className="flex items-center gap-3 bg-gray-500 p-2 rounded-bl-lg rounded-tr-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        Add Task <Logs />
      </motion.button>
    </motion.div>
  );
};

export default Navbar;
