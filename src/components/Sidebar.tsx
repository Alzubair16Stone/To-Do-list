import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("The Sidebar is not provider in TodoContext");
  }

  const { categories } = context;

  return (
    <motion.div
      className="fixed md:relative top-0 left-0 h-screen bg-gray-800 p-4 shadow-2xl z-40 flex flex-col flex-shrink-0"
      initial={{ x: 0 }}
      animate={{
        width: isOpen ? 256 : 0,
        x:
          typeof window !== "undefined" && window.innerWidth < 768
            ? isOpen
              ? 0
              : -256
            : 0,
        padding: isOpen ? "16px" : "0px",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      <div
        className={`flex flex-col h-full ${!isOpen ? "md:opacity-0 md:pointer-events-none" : ""}`}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-[10px] text-2xl font-bold after:content-['Z'] shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.1, rotate: 4 }}
            whileTap={{ scale: 0.95, rotate: -4 }}
          />
        </div>

        <div className="space-y-4 whitespace-nowrap">
          <h2 className="group flex justify-between flex-1 items-center font-bold bg-gray-700 p-2 rounded-md shadow-md cursor-pointer transition-colors duration-200 hover:bg-gray-650">
            Create New Category
            <Plus className="transform transition-transform duration-300 group-hover:rotate-90" />
          </h2>
          {categories.map((category) => (
            <p
              key={category}
              className="text-indigo-400 bg-gray-700 my-4 p-2 shadow-xl rounded capitalize shadow-indigo-600"
            >
              {category}
            </p>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-gray-800 p-2 rounded-r-md border-l border-gray-700 text-gray-400 hover:text-white transition-colors shadow-md group z-50"
      >
        {isOpen ? (
          <PanelLeftClose
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        ) : (
          <PanelLeftOpen
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
        )}
      </button>
    </motion.div>
  );
};

export default Sidebar;
