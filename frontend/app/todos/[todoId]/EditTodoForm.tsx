// todos/[todoId]/EditTodoForm.tsx
// 수정 폼 — 입력/클릭 인터랙션이 있으므로 Client Component
// 서버에서 받은 기존 Todo 값으로 입력창을 채우고, 수정 내용을 저장한다.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Todo, updateTodo } from "../../actions";

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  // 기존 값으로 입력 상태를 초기화한다
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [error, setError] = useState("");

  // 저장 버튼 클릭 시 수정 내용을 서버에 반영한다
  async function handleSubmit() {
    if (title.trim() === "") {
      setError("할 일 내용을 입력해주세요.");
      return;
    }

    await updateTodo(todo.id, title.trim(), completed);
    router.push("/todos");
  }

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none"
        autoFocus
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* 완료 여부 토글 */}
      <label className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-5 w-5 cursor-pointer"
          style={{ accentColor: "var(--color-primary)" }}
        />
        <span>완료됨</span>
      </label>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          className="rounded-lg px-5 py-2 font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          저장
        </button>
        <button
          onClick={() => router.push("/todos")}
          className="rounded-lg px-5 py-2 font-medium"
          style={{ color: "var(--color-muted)" }}
        >
          취소
        </button>
      </div>
    </div>
  );
}