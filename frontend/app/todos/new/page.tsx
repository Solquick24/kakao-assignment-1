// todos/new/page.tsx
// 새 Todo 생성 페이지 — Client Component
// URL의 ?date= 로 받은 날짜에 Todo를 생성한다 (주간 뷰에서 선택한 날짜).

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTodo } from "../../actions";
import { formatDate } from "../../utils/date";

export default function NewTodoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL의 date가 있으면 그 날짜, 없으면 오늘
  const initialDate = searchParams.get("date") ?? formatDate(new Date());

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (title.trim() === "") {
      setError("할 일 내용을 입력해주세요.");
      return;
    }
    await createTodo(title.trim(), date);
    // 생성한 날짜의 목록으로 돌아간다
    router.push(`/todos?date=${date}`);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">새 할 일 추가</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="할 일을 입력하세요"
        className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none"
        autoFocus
      />

      {/* 날짜 선택 */}
      <label className="mt-4 block text-sm" style={{ color: "var(--color-muted)" }}>
        날짜
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 outline-none"
        />
      </label>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          className="rounded-lg px-5 py-2 font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          저장
        </button>
        <button
          onClick={() => router.push(`/todos?date=${date}`)}
          className="rounded-lg px-5 py-2 font-medium"
          style={{ color: "var(--color-muted)" }}
        >
          취소
        </button>
      </div>
    </div>
  );
}