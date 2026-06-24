// todos/TodoListClient.tsx
// 목록의 인터랙션(완료 토글, 삭제, 수정 이동)을 담당하는 Client Component
// 버튼 클릭 같은 이벤트 처리가 필요하므로 "use client"를 선언한다.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Todo, updateTodo, deleteTodo } from "../actions";

export default function TodoListClient({ todos }: { todos: Todo[] }) {
  const router = useRouter();

  // 완료 여부를 토글한다 (현재 상태의 반대로 수정)
  async function handleToggle(todo: Todo) {
    await updateTodo(todo.id, todo.title, !todo.completed);
    router.refresh(); // 서버 데이터를 다시 불러와 화면을 갱신한다
  }

  // Todo를 삭제한다
  async function handleDelete(id: number) {
    await deleteTodo(id);
    router.refresh();
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm"
        >
          {/* 완료 체크박스 */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
            className="h-5 w-5 cursor-pointer"
            style={{ accentColor: "var(--color-primary)" }}
          />

          {/* 할 일 내용 (완료 시 취소선 + 흐린색) */}
          <span
            className="flex-1"
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "var(--color-muted)" : "var(--color-text)",
            }}
          >
            {todo.title}
          </span>

          {/* 수정 페이지로 이동 */}
          <Link
            href={`/todos/${todo.id}`}
            className="text-sm"
            style={{ color: "var(--color-primary)" }}
          >
            수정
          </Link>

          {/* 삭제 버튼 */}
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}