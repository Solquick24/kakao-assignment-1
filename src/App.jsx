import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterTabs from "./components/FilterTabs";
import WeekView from "./components/WeekView";
import { formatDate, getWeekStart } from "./utils/date";

const STORAGE_KEY = "todo_app_data";
const WEEK_KEY = "todo_app_week"; // 보고 있는 주를 따로 저장

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("저장된 데이터를 불러오지 못했습니다. 초기화합니다.", error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// 저장된 주 시작일을 불러옴 (없으면 이번 주 월요일)
function loadWeekStart() {
  const saved = localStorage.getItem(WEEK_KEY);
  if (saved) {
    const date = new Date(saved);
    // 유효한 날짜인지 확인 후 사용
    if (!isNaN(date.getTime())) return getWeekStart(date);
  }
  return getWeekStart(new Date());
}

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 보고 있는 주의 월요일 (새로고침 후 유지되도록 저장된 값에서 초기화)
  const [weekStartDate, setWeekStartDate] = useState(loadWeekStart);

  // todos 변경 시 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // weekStartDate 변경 시 자동 저장 (문자열로 변환해서 저장)
  useEffect(() => {
    localStorage.setItem(WEEK_KEY, formatDate(weekStartDate));
  }, [weekStartDate]);

  function addTodo(text) {
    const newTodo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      date: formatDate(selectedDate),
    };
    setTodos([...todos, newTodo]);
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleComplete(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function editTodo(id, newText) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }

  // 주간 뷰에서 날짜 칸 클릭 → 그 날짜 선택 (새 객체로 교체)
  function selectDate(date) {
    setSelectedDate(new Date(date));
  }

  // 주 이동 (-1: 이전 주, +1: 다음 주) → 새 객체로 교체
  function changeWeek(offset) {
    const newWeekStart = new Date(weekStartDate);
    newWeekStart.setDate(newWeekStart.getDate() + offset * 7);
    setWeekStartDate(newWeekStart);
  }

  const selectedDateStr = formatDate(selectedDate);
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedDateStr) return false;
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
      <div className="w-[420px] rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-[#672be0]">
          Todo List
        </h1>

        {/* 일간 DateHeader 대신 주간 뷰로 교체 */}
        <WeekView
          weekStartDate={weekStartDate}
          selectedDate={selectedDate}
          todos={todos}
          onSelectDate={selectDate}
          onChangeWeek={changeWeek}
        />

        <TodoInput onAdd={addTodo} />

        <FilterTabs currentFilter={currentFilter} onChange={setCurrentFilter} />

        <TodoList
          todos={filteredTodos}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </div>
    </div>
  );
}

export default App;