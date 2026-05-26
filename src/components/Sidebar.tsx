import { motion } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Stone,
  Trash,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { TodoContext } from "../context/TodoContext";
import AddCategoryModal from "./AddCategoryModal";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const context = useContext(TodoContext);
  const [isMobile, setIsMobile] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  if (!context) {
    throw new Error("The Sidebar is not provided in TodoContext");
  }

  const { categories, deleteCategory } = context;

  // Track window resizing to dynamically switch animation modes between mobile and desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      // fixed on mobile (floats over), relative on desktop (takes up layout space)
      className="fixed md:relative top-0 left-0 h-screen bg-gray-800 z-40 flex flex-col shrink-0 shadow-2xl"
      // THE PERFECT FIX:
      animate={
        isMobile
          ? {
              // Mobile Animation: Keep width stable, slide out using X
              width: 256,
              x: isOpen ? 0 : -256,
              padding: "16px",
            }
          : {
              // Desktop Animation: Keep X at 0, collapse width to 0 to free space for the main content
              width: isOpen ? 256 : 0,
              x: 0,
              // Collapse padding to 0 when closed so inner contents don't stretch layout bounds
              padding: isOpen ? "16px" : "0px",
            }
      }
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
    >
      {/* Content wrapper: Hides smoothly on desktop closure to prevent layout squishing */}
      <div
        className={`flex flex-col h-full transition-all duration-200 
          ${!isOpen ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100 w-full"}`}
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-[10px] text-2xl font-bold shadow-lg shadow-indigo-500/30"
            whileHover={{ scale: 1.1, rotate: 4 }}
            whileTap={{ scale: 0.95, rotate: -4 }}
          >
            <Stone size={24} className="text-white" />
          </motion.div>
        </div>

        <div className="space-y-4 whitespace-nowrap">
          <h2
            onClick={() => setIsCategoryOpen(true)}
            className="group flex justify-between flex-1 items-center font-bold bg-gray-700 p-2 rounded-md shadow-md cursor-pointer transition-colors duration-200 hover:bg-gray-650"
          >
            Create New Category
            <Plus className="transform transition-transform duration-300 group-hover:rotate-90" />
          </h2>

          <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-1 custom-scrollbar overflow-hidden">
            {categories.map((category) => (
              <motion.p
                whileHover={{ scale: 1.02 }}
                key={category}
                className="text-indigo-400 bg-gray-700 my-2 p-2 shadow-xl rounded capitalize shadow-indigo-600/10 flex items-center justify-between transition-colors duration-200 hover:bg-gray-650 cursor-pointer"
              >
                {category}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category);
                  }}
                  className="ml-auto text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                >
                  <Trash size={16} />
                </button>
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Button Handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-gray-800 p-2 rounded-r-md border-l border-gray-700 text-gray-400 hover:text-white transition-colors shadow-md group z-50 cursor-pointer"
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
      <AddCategoryModal
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
      />
    </motion.div>
  );
};

export default Sidebar;
