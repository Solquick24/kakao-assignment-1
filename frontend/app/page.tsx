// page.tsx (루트 '/')
// 루트로 접속하면 곧장 Todo 목록 페이지(/todos)로 보내준다.

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/todos");
}