// todos/loading.tsx
// 데이터를 불러오는 동안 자동으로 보여지는 로딩 화면
// (App Router가 Server Component의 데이터 로딩 중 자동으로 표시해준다)

export default function Loading() {
  return (
    <p className="py-20 text-center" style={{ color: "var(--color-muted)" }}>
      불러오는 중...
    </p>
  );
}