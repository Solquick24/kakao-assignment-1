// actions.ts
// 서버에서 실행되는 함수들의 모음 (Server Actions)
// 페이지/컴포넌트에서 import 하여 직접 호출한다.
// FastAPI 백엔드와 직접 통신하며, 데이터 변경 후 화면을 갱신한다.

"use server";

import { revalidatePath } from "next/cache";

// 서버 전용 환경변수
const BACKEND_URL = process.env.BACKEND_URL;

// Todo 데이터의 타입 정의
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  date: string;
}

// ──────────────────────────────────────────────
// 조회 (Read)
// ──────────────────────────────────────────────

export async function getTodos(
  date?: string,
  filter?: string,
  search?: string
): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (filter) params.set("filter", filter);
  if (search) params.set("search", search);

  const queryString = params.toString();
  const url = `${BACKEND_URL}/todos${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Todo 목록을 불러오지 못했습니다");
  return response.json();
}
// 단일 Todo를 가져온다 (수정 페이지에서 기존 값을 채울 때 호출)
export async function getTodo(id: number): Promise<Todo> {
  const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo를 불러오지 못했습니다");
  }

  return response.json();
}

// ──────────────────────────────────────────────
// 생성 / 수정 / 삭제 (Create / Update / Delete)
// ──────────────────────────────────────────────

export async function createTodo(title: string, date: string): Promise<void> {
  await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, date }),
  });
  revalidatePath("/todos");
}
// 기존 Todo를 수정한다 (내용 + 완료 여부)
export async function updateTodo(
  id: number,
  title: string,
  completed: boolean
): Promise<void> {
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed }),
  });

  revalidatePath("/todos");
}

// Todo를 삭제한다
export async function deleteTodo(id: number): Promise<void> {
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "DELETE",
  });

  revalidatePath("/todos");
}