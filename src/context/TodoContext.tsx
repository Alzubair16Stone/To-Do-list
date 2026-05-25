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
}

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);

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

  useEffect(() => {
    setTodos([
      {
        id: "1",
        title: "Sample Task",
        description: "This is a sample task description.",
        priority: "low",
        category: "general",
        dueDate: new Date().toISOString(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCategories(["general", "work", "personal"]);
  }, []);

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
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
