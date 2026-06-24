// route.ts
// 브라우저에서 오는 HTTP 요청을 받아 FastAPI 백엔드로 전달하는 프록시(proxy)
// 브라우저가 FastAPI(localhost:8000)에 직접 요청하면 CORS 문제와 주소 노출이 생기므로,
// Next 서버가 중간에서 대신 요청해준다.

import { NextRequest, NextResponse } from "next/server";

// 서버 전용 환경변수 (NEXT_PUBLIC_ 이 없으므로 브라우저에는 노출되지 않는다)
const BACKEND_URL = process.env.BACKEND_URL;

// 전체 Todo 목록 조회 — GET /api/todos
export async function GET() {
  const response = await fetch(`${BACKEND_URL}/todos`, {
    // 항상 최신 데이터를 받아오기 위해 캐시를 사용하지 않는다
    cache: "no-store",
  });
  const data = await response.json();
  return NextResponse.json(data);
}

// 새 Todo 생성 — POST /api/todos
export async function POST(request: NextRequest) {
  // 브라우저가 보낸 요청 본문(JSON)을 꺼낸다
  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

// Todo 수정 — PUT /api/todos?id=1
export async function PUT(request: NextRequest) {
  // 쿼리스트링(?id=)에서 수정할 대상 id를 꺼낸다
  const id = request.nextUrl.searchParams.get("id");
  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

// Todo 삭제 — DELETE /api/todos?id=1
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  return NextResponse.json(data);
}