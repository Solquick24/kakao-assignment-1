// todos/TodoControls.tsx
// 상태 필터 탭 + 검색창 — 선택된 날짜(date)를 유지하면서 필터/검색을 적용한다.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FILTERS = [
  { value: "", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function TodoControls({
  currentFilter,
  currentSearch,
  selectedDate,
}: {
  currentFilter?: string;
  currentSearch?: string;
  selectedDate: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentSearch ?? "");

  // date는 항상 유지하고, filter/search를 합쳐 URL을 만든다
  function updateUrl(filter: string, search: string) {
    const params = new URLSearchParams();
    params.set("date", selectedDate); // 선택 날짜 유지
    if (filter) params.set("filter", filter);
    if (search) params.set("search", search);
    router.push(`/todos?${params.toString()}`);
  }

  function handleFilterClick(filterValue: string) {
    updateUrl(filterValue, searchInput.trim());
  }

  function handleSearch() {
    updateUrl(currentFilter ?? "", searchInput.trim());
  }

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="할 일 검색..."
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 outline-none"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          검색
        </button>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((tab) => {
          const isActive = (currentFilter ?? "") === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilterClick(tab.value)}
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                backgroundColor: isActive ? "var(--color-primary)" : "white",
                color: isActive ? "white" : "var(--color-muted)",
                border: "1px solid #eee",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}