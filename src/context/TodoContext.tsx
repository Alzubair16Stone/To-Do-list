import {
  createContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { Task } from "../types";

interface TodoContextType {
  todos: Task[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addTodo: (todo: Task) => void;
  deleteTodo: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => boolean;
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
      return saved ? JSON.parse(saved) : ["Work", "Personal", "Shopping"];
    }
    return [];
  });

  const addTodo = (todo: Task) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodoComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  };

  const addCategory = (category: string): boolean => {
    const trimmed = category.trim();
    if (!trimmed) return false;

    let alreadyExists = false;

    setCategories((prevCategories) => {
      if (
        prevCategories.some(
          (cat) => cat.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        alreadyExists = true;
        return prevCategories; // Returns unchanged reference array
      }
      return [...prevCategories, trimmed];
    });

    return !alreadyExists; // If it already exists, returns false so UI can show your warning popup
  };

  const deleteCategory = (category: string) => {
    // 1. Remove the targeted Category parameter array entry safely
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat !== category),
    );

    // 2. Cascading Delete: Wipe out all corresponding sub-tasks assigned under that category header space
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.category !== category),
    );
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // CRITICAL MEMOIZATION: This blocks unneeded re-rendering cycles down the react element tree!
  const contextValue = useMemo(
    () => ({
      todos,
      loading,
      setLoading,
      addTodo,
      deleteTodo,
      categories,
      addCategory,
      deleteCategory,
      toggleTodoComplete,
    }),
    [todos, loading, categories],
  );

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
};
