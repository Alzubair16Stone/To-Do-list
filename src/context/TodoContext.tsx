import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Task } from "../types";

interface TodoContextType {
  todos: Task[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addTodo: (todo: Task) => void;
  deleteTodo: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  toggleTodoComplete: (id: string) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("categories");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const addTodo = (todo: Task) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
    // Will add a screen to warn the user "There is already a category with this name" if the category already exists
  };

  const deleteCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
    // Will add a screen to warn the user "Are you sure you want to delete this category? All tasks under this category will be deleted as well" before deleting the category
  };

  const toggleTodoComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        loading,
        setLoading,
        deleteTodo,
        categories,
        addCategory,
        deleteCategory,
        toggleTodoComplete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
