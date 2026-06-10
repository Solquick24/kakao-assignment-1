// Date 객체를 "YYYY-MM-DD" 문자열로 변환 (저장/비교용)
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 화면에 보여줄 날짜 문구 (예: "2026년 6월 10일 (수)")
export function getDisplayDate(date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = dayNames[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// 주어진 날짜가 속한 주의 월요일을 구함 (주간 뷰 시작 기준)
// 1주차 getWeekStart와 동일: 일요일(0)이면 6일 전, 그 외엔 (1 - day)일 전이 월요일
export function getWeekStart(date) {
  const result = new Date(date);
  const day = result.getDay(); // 0:일 ~ 6:토
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}