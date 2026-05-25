import { TodoProvider } from "./context/TodoContext";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TaskCard from "./components/TaskCard";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <TodoProvider>
      <div className="flex min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 p-6">
          <Navbar />
          <TaskCard />
        </main>

        {/* 3. خلفية معتمة (Overlay) تظهر في الهواتف فقط عند فتح السايدبار لإغلاقه عند الضغط في أي مكان */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}
      </div>
    </TodoProvider>
  );
}

export default App;
