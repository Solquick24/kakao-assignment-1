// todos/error.tsx
// 데이터 로딩 등에서 에러가 발생하면 자동으로 보여지는 화면
// error.tsx는 반드시 Client Component여야 한다 (Next.js 규칙)

"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="py-20 text-center">
      <p className="mb-4" style={{ color: "var(--color-muted)" }}>
        오류가 발생했습니다: {error.message}
      </p>
      {/* reset()을 호출하면 해당 구간을 다시 렌더링해 재시도한다 */}
      <button
        onClick={() => reset()}
        className="rounded-lg px-5 py-2 font-medium text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        다시 시도
      </button>
    </div>
  );
}