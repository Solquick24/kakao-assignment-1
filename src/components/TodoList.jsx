import TodoItem from "./TodoItem";

// App에서 todos와 동작 함수들을 props로 받음
function TodoList({ todos, onToggle, onDelete, onEdit }) {
  // 표시할 Todo가 없으면 빈 상태 안내 (1주차 createEmptyMessage)
  if (todos.length === 0) {
    return (
      <p className="py-5 text-center text-sm text-gray-400">
        표시할 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="mt-4">
      {/* 1주차의 forEach 반복 → React에선 map으로 그림 */}
      {/* key는 React가 각 항목을 구분하는 데 필수 */}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;