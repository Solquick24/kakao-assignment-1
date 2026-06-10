// 필터 탭 목록 (1주차의 data-filter와 같은 역할)
const FILTERS = [
  { key: "all", label: "전체" },
  { key: "active", label: "진행 중" },
  { key: "completed", label: "완료" },
];

// currentFilter: 현재 선택된 필터 / onChange: 필터를 바꾸는 함수 (둘 다 App에서 받음)
function FilterTabs({ currentFilter, onChange }) {
  return (
    <div className="mt-4 flex gap-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          // 현재 선택된 탭이면 메인 컬러, 아니면 회색 (1주차의 active 클래스)
          className={`flex-1 rounded-lg py-2 text-sm ${
            currentFilter === filter.key
              ? "bg-[#672be0] text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;