// utils/date.ts
// 날짜 관련 공용 함수

// Date 객체를 "YYYY-MM-DD" 문자열로 변환한다
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 주어진 날짜가 속한 주의 월요일을 구한다
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay(); // 0(일) ~ 6(토)
  // 월요일을 기준으로 맞춘다 (일요일이면 -6, 그 외 1-day)
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}