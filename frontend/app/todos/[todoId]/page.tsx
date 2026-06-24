// todos/page.tsx
// Todo 목록 페이지 — Server Component
// URL의 searchParams(?filter=, ?search=)를 읽어 서버에서 필터링/검색된 목록을 가져온다.

import Link from "next/link";
import { getTodos } from "../actions";
import TodoListClient from "./TodoListClient";
import TodoControls from "./TodoControls";

export default async function TodosPage({
  searchParams,
}: {
  // Next.js 15부터 searchParams는 Promise이므로 await로 꺼낸다
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const { filter, search } = await searchParams;

  // URL 파라미터를 그대로 서버 요청에 넘긴다 (서버에서 필터링/검색 처리)
  const todos = await getTodos(filter, search);

  return (
    <div>
      {/* 헤더 영역: 제목 + 새 Todo 추가 버튼 */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">할 일 목록</h1>
        <Link
          href="/todos/new"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          + 새 할 일
        </Link>
      </header>

      {/* 필터 탭 + 검색창 (Client Component) */}
      <TodoControls currentFilter={filter} currentSearch={search} />

      {/* 목록 (비어있을 때 분기 처리) */}
      {todos.length === 0 ? (
        <p className="py-20 text-center" style={{ color: "var(--color-muted)" }}>
          {search
            ? `"${search}"에 대한 검색 결과가 없습니다.`
            : "표시할 할 일이 없습니다."}
        </p>
      ) : (
        <TodoListClient todos={todos} />
      )}
    </div>
  );
}