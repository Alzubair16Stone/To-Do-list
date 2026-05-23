import { TodoProvider } from "./context/TodoContext";
import "./App.css";

function App() {
  return (
    <TodoProvider>
      <h1>To-Do List</h1>
    </TodoProvider>
  );
}

export default App;
