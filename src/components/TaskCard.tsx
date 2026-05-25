import { motion } from "framer-motion";
import { TodoContext } from "../context/TodoContext";
import { useContext } from "react";
import type { Task } from "../types";

const TaskCard = () => {
  const context = useContext(TodoContext);

  // If the component is placed outside of <TodoProvider>, context will be undefined
  if (!context) {
    throw new Error("TaskCard must be used within a TodoProvider");
  }

  const { todos, deleteTodo } = context;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 mt-6">
      {todos.map((todo: Task) => (
        <motion.div
          // exit={{ y: -250, opacity: 0 }}
          className="bg-white p-4 shadow-md rounded-md text-black"
          initial={{ y: -200, opacity: 0 }}
          animate={{
            y: 0,
            opacity: [0.2, 0.7, 1],
            transition: { duration: 0.3 },
          }}
          key={todo.id}
        >
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>{todo.category}</p>
          <p
            className={`${todo.priority == "medium" ? "text-amber-500" : todo.priority == "low" ? "text-emerald-500" : todo.priority == "high" ? "bg-rose-500" : " "} capitalize w-fit p-0.5 rounded`}
          >
            {todo.priority}
          </p>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="bg-red-500 text-white py-2 px-4 rounded-md"
          >
            Delete
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskCard;
