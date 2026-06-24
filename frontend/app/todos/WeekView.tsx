// todos/WeekView.tsx
// 주간 뷰 — 월~일 7개 날짜 칸을 보여주고, 클릭하면 그 날짜로 URL을 바꾼다.
// 클릭 인터랙션이 있으므로 Client Component.

"use client";

import { useRouter } from "next/navigation";
import { Todo } from "../actions";
import { formatDate, getWeekStart } from "../utils/date";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeekView({
  selectedDate, // 현재 선택된 날짜 (YYYY-MM-DD)
  todos, // 개수 표시용 (선택 날짜의 목록)
}: {
  selectedDate: string;
  todos: Todo[];
}) {
  const router = useRouter();

  // 선택된 날짜가 속한 주의 월요일을 구한다
  const weekStart = getWeekStart(new Date(selectedDate));

  // 주의 끝(일요일) — 상단 범위 표시용
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // 월요일부터 7일치 Date 배열
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const todayStr = formatDate(new Date());

  // 날짜를 클릭하면 ?date=... 로 URL을 바꿔 해당 날짜 목록을 불러온다
  function handleSelectDate(dateStr: string) {
    router.push(`/todos?date=${dateStr}`);
  }

  // 주 이동 (-1: 이전 주, +1: 다음 주) — 이동한 주의 월요일을 선택 날짜로
  function handleChangeWeek(direction: number) {
    const newDate = new Date(weekStart);
    newDate.setDate(weekStart.getDate() + direction * 7);
    router.push(`/todos?date=${formatDate(newDate)}`);
  }

  return (
    <div className="mb-4">
      {/* 주간 네비게이션 */}
      <div
        className="my-3 flex items-center justify-between rounded-xl px-4 py-2.5"
        style={{ backgroundColor: "#f1ecff" }}
      >
        <button
          onClick={() => handleChangeWeek(-1)}
          style={{ color: "var(--color-primary)" }}
          className="px-2 hover:opacity-70"
        >
          ◀
        </button>
        <span
          className="text-sm font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          {formatDate(weekStart)} ~ {formatDate(weekEnd)}
        </span>
        <button
          onClick={() => handleChangeWeek(1)}
          style={{ color: "var(--color-primary)" }}
          className="px-2 hover:opacity-70"
        >
          ▶
        </button>
      </div>

      {/* 7개 날짜 칸 */}
      <div className="flex justify-between gap-1.5">
        {days.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          // 선택된 날짜 칸에만 개수를 정확히 표시 (todos는 선택 날짜 목록이므로)
          const count = isSelected ? todos.length : null;

          return (
            <button
              key={dateStr}
              onClick={() => handleSelectDate(dateStr)}
              className="flex-1 rounded-lg py-2 text-center text-xs"
              style={{
                backgroundColor: isSelected ? "var(--color-primary)" : "#f3f4f6",
                color: isSelected ? "white" : "var(--color-text)",
                border: isToday ? "2px solid var(--color-primary)" : "none",
              }}
            >
              <div className="font-bold">{DAY_NAMES[date.getDay()]}</div>
              <div className="text-sm">{date.getDate()}</div>
              <div style={{ color: isSelected ? "#e3d9ff" : "var(--color-muted)" }}>
                {count !== null ? `${count}개` : ""}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}