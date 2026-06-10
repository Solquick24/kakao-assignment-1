import { useState } from "react";

// onAdd: App에서 내려준 "추가" 함수 (props)
function TodoInput({ onAdd }) {
  // 입력창의 현재 값을 상태로 관리 (1주차엔 input.value를 직접 읽었음)
  const [text, setText] = useState("");
  // 에러 메시지 상태 (1주차의 errorMessage 영역)
  const [error, setError] = useState("");

  function handleAdd() {
    const trimmed = text.trim();

    // 빈 입력이면 안내 메시지 표시 후 종료
    if (trimmed === "") {
      setError("할 일을 입력해주세요.");
      return;
    }

    setError(""); // 정상 입력 시 에러 제거
    onAdd(trimmed); // App의 addTodo 호출
    setText(""); // 입력창 비우기
  }

  return (
    <div>
      <div className="flex gap-2">
        {/* value와 onChange로 입력창을 상태와 연결 (제어 컴포넌트) */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          // Enter 키로도 추가 (1주차의 keydown 이벤트)
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#672be0] focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-[#672be0] px-4 py-2 text-sm text-white hover:bg-[#561fc0]"
        >
          추가
        </button>
      </div>

      {/* 에러가 있을 때만 표시 (1주차의 errorMessage 채우기) */}
      <p className="mt-2 h-4 text-sm text-red-500">{error}</p>
    </div>
  );
}

export default TodoInput;