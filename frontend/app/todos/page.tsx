// todos/page.tsx
// Todo 목록 페이지 — Server Component
// URL의 ?date= 로 선택 날짜를 받아, 그 날짜의 Todo만 서버에서 가져온다.
// 주간 뷰 / 필터 / 검색을 함께 적용한다.

import Link from "next/link";
import { getTodos } from "../actions";
import { formatDate } from "../utils/date";
import TodoListClient from "./TodoListClient";
import TodoControls from "./TodoControls";
import WeekView from "./WeekView";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; filter?: string; search?: string }>;
}) {
  const { date, filter, search } = await searchParams;

  // 선택 날짜가 없으면 오늘 날짜를 기본값으로 사용한다
  const selectedDate = date ?? formatDate(new Date());

  // 선택 날짜 + 필터 + 검색을 모두 서버에 넘겨 해당 목록을 가져온다
  const todos = await getTodos(selectedDate, filter, search);

  return (
    <div>
      {/* 헤더 */}
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">할 일 목록</h1>
        <Link
          href={`/todos/new?date=${selectedDate}`}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + 새 할 일
        </Link>
      </header>

      {/* 주간 뷰 */}
      <WeekView selectedDate={selectedDate} todos={todos} />

      {/* 필터 + 검색 */}
      <TodoControls
        currentFilter={filter}
        currentSearch={search}
        selectedDate={selectedDate}
      />

      {/* 목록 */}
      {todos.length === 0 ? (
        <p className="py-16 text-center" style={{ color: "var(--color-muted)" }}>
          {search
            ? `"${search}"에 대한 검색 결과가 없습니다.`
            : "이 날짜에 할 일이 없습니다. 추가해보세요."}
        </p>
      ) : (
        <TodoListClient todos={todos} />
      )}
    </div>
  );
}