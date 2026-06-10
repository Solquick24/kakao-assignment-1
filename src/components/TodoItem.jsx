import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  // 이 항목이 수정 모드인지 (1주차의 editingTodoId를 항목별 상태로 가져옴)
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 입력값
  const [editText, setEditText] = useState(todo.text);

  // 수정 저장
  function handleSave() {
    const trimmed = editText.trim();
    // 공백이면 저장하지 않고 수정 모드만 종료
    if (trimmed === "") {
      setIsEditing(false);
      setEditText(todo.text); // 원래 값으로 되돌림
      return;
    }
    onEdit(todo.id, trimmed); // App의 editTodo 호출
    setIsEditing(false);
  }

  // 수정 취소: 원래 텍스트로 되돌리고 모드 종료
  function handleCancel() {
    setEditText(todo.text);
    setIsEditing(false);
  }

  // ---- 수정 모드: 입력창 + 저장/취소 ----
  if (isEditing) {
    return (
      <li className="flex items-center justify-between border-b border-gray-100 p-2.5">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            else if (e.key === "Escape") handleCancel();
          }}
          autoFocus
          className="mr-2 flex-1 rounded-md border border-[#672be0] px-2 py-1.5 text-sm focus:outline-none"
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="rounded-md bg-[#f1ecff] px-2.5 py-1.5 text-xs text-[#672be0] hover:bg-[#e3d9ff]"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md bg-[#f1ecff] px-2.5 py-1.5 text-xs text-[#672be0] hover:bg-[#e3d9ff]"
          >
            취소
          </button>
        </div>
      </li>
    );
  }

  // ---- 일반 모드: 텍스트 + 완료/수정/삭제 ----
  return (
    <li className="flex items-center justify-between border-b border-gray-100 p-2.5">
      {/* 완료면 취소선 + 회색 (1주차 completed 클래스) */}
      <span
        className={`flex-1 text-sm ${
          todo.completed ? "text-gray-400 line-through" : ""
        }`}
      >
        {todo.text}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onToggle(todo.id)}
          className="rounded-md bg-[#f1ecff] px-2.5 py-1.5 text-xs text-[#672be0] hover:bg-[#e3d9ff]"
        >
          {todo.completed ? "취소" : "완료"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-md bg-[#f1ecff] px-2.5 py-1.5 text-xs text-[#672be0] hover:bg-[#e3d9ff]"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded-md bg-[#f1ecff] px-2.5 py-1.5 text-xs text-[#672be0] hover:bg-[#e3d9ff]"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default TodoItem;