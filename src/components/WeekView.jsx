import { formatDate } from "../utils/date";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

// props로 받는 것:
// weekStartDate: 보고 있는 주의 월요일
// selectedDate: 현재 선택된 날짜
// todos: 개수 계산용 전체 목록
// onSelectDate: 날짜 클릭 시 선택 변경 함수
// onChangeWeek: 주 이동 함수 (-1: 이전 주, +1: 다음 주)
function WeekView({ weekStartDate, selectedDate, todos, onSelectDate, onChangeWeek }) {
  const todayStr = formatDate(new Date());
  const selectedStr = formatDate(selectedDate);

  // 주의 끝(일요일) 계산 — 상단 범위 표시용
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  // 월요일부터 7일치 Date 배열을 만듦 (1주차의 for 반복을 배열 생성으로)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + i);
    return date;
  });

  return (
    <div>
      {/* 주간 네비게이션: 이전 주 / 범위 / 다음 주 */}
      <div className="my-3 flex items-center justify-between rounded-xl bg-[#f1ecff] px-4 py-2.5">
        <button
          onClick={() => onChangeWeek(-1)}
          className="px-2 text-[#672be0] hover:opacity-70"
        >
          ◀
        </button>
        <span className="text-sm font-bold text-[#672be0]">
          {formatDate(weekStartDate)} ~ {formatDate(weekEndDate)}
        </span>
        <button
          onClick={() => onChangeWeek(1)}
          className="px-2 text-[#672be0] hover:opacity-70"
        >
          ▶
        </button>
      </div>

      {/* 7개 날짜 칸 */}
      <div className="mb-4 flex justify-between gap-1.5">
        {days.map((date) => {
          const dateStr = formatDate(date);
          // 해당 날짜의 Todo 개수
          const count = todos.filter((todo) => todo.date === dateStr).length;
          const isSelected = dateStr === selectedStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(date)}
              className={`flex-1 rounded-lg py-2 text-center text-xs ${
                isSelected
                  ? "bg-[#672be0] text-white" // 선택된 날짜: 메인 컬러 배경
                  : "bg-gray-100 hover:bg-[#ece6fb]"
              } ${isToday ? "border-2 border-[#672be0]" : ""}`} // 오늘: 테두리
            >
              <div className="font-bold">{DAY_NAMES[date.getDay()]}</div>
              <div className="text-sm">{date.getDate()}</div>
              <div className={isSelected ? "text-[#e3d9ff]" : "text-gray-500"}>
                {count}개
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;