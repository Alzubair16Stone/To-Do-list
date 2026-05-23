import { createContext, useState } from "react";
import type { Task } from "../types";

export const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTodo = (todo: Task) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo: Task) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, loading, setLoading, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};
