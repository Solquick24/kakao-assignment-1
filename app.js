/* =========================
   상태(데이터) 관리
========================= */

// 모든 Todo를 담는 배열
let todos = [];

// 각 Todo를 구분하기 위한 고유 id 값 (생성할 때마다 1씩 증가)
let nextTodoId = 1;

// 현재 선택된 필터 상태 ("all" | "active" | "completed")
let currentFilter = "all";

// 현재 선택된 날짜 (기본값: 오늘) - 이 날짜의 Todo만 목록에 표시됨
let selectedDate = new Date();

// 현재 화면에 보여줄 주의 시작일(월요일) - 주간 뷰 기준점
let weekStartDate = getWeekStart(new Date());

// 현재 인라인 수정 중인 Todo의 id (수정 중이 아니면 null)
let editingTodoId = null;

/* =========================
   LocalStorage 연동
========================= */

// 로컬스토리지에 데이터를 저장할 때 사용할 key 이름
const STORAGE_KEY = "todo_app_data";

// 현재 상태(todos, nextTodoId)를 로컬스토리지에 저장
// 객체/배열은 문자열만 저장 가능한 로컬스토리지 특성상 JSON.stringify로 변환
function saveToLocalStorage() {
  const data = {
    todos: todos,
    nextTodoId: nextTodoId,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 로컬스토리지에서 데이터를 불러와 상태에 복원
// 저장된 문자열을 JSON.parse로 다시 객체/배열로 변환
function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  // 저장된 데이터가 없으면(최초 실행) 아무것도 하지 않음
  if (!savedData) return;

  // 저장된 값이 손상됐거나 형식이 잘못된 경우(JSON.parse 실패)에 대비한 예외 처리
  // 파싱에 실패하면 앱이 멈추지 않도록 손상된 데이터를 비우고 기본 상태로 시작
  try {
    const parsedData = JSON.parse(savedData);

    // 불러온 값이 배열이 맞을 때만 복원, 아니면 안전하게 빈 배열 사용
    todos = Array.isArray(parsedData.todos) ? parsedData.todos : [];
    nextTodoId = parsedData.nextTodoId || 1;
  } catch (error) {
    // 손상된 데이터는 제거하고 초기 상태로 진행
    console.error("저장된 데이터를 불러오지 못했습니다. 초기화합니다.", error);
    localStorage.removeItem(STORAGE_KEY);
    todos = [];
    nextTodoId = 1;
  }
}

/* =========================
   DOM 요소 가져오기
========================= */
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const errorMessage = document.getElementById("errorMessage");

// 모든 필터 탭 버튼 (전체 / 진행 중 / 완료)
const filterTabs = document.querySelectorAll(".tab");

// 주간 뷰 관련 요소
const weekView = document.getElementById("weekView");
const weekRangeText = document.getElementById("weekRangeText");
const prevWeekButton = document.getElementById("prevWeekButton");
const nextWeekButton = document.getElementById("nextWeekButton");

/* =========================
   날짜 유틸
========================= */

// Date 객체를 "YYYY-MM-DD" 문자열로 변환 (저장 및 비교에 사용)
// 로컬 시간 기준으로 변환해야 시간대 오차로 날짜가 밀리지 않음
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 주어진 날짜가 속한 주의 월요일을 구함 (주간 뷰의 시작 기준)
function getWeekStart(date) {
  const result = new Date(date);
  const day = result.getDay(); // 0:일 ~ 6:토

  // 월요일을 주의 시작으로 맞추기 위한 보정값
  // 일요일(0)이면 6일 전이 월요일, 그 외에는 (day - 1)일 전이 월요일
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  return result;
}

/* =========================
   주간 뷰 렌더링
========================= */

// 현재 weekStartDate 기준으로 월~일 7개 날짜 칸을 생성
function renderWeekView() {
  // 기존 칸을 비우고 다시 그림
  weekView.innerHTML = "";

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const todayStr = formatDate(new Date());
  const selectedStr = formatDate(selectedDate);

  // 주의 시작(월요일)과 끝(일요일) 날짜 계산
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  // 상단에 주 범위 텍스트 표시 (예: 2026-06-01 ~ 2026-06-07)
  weekRangeText.textContent = `${formatDate(weekStartDate)} ~ ${formatDate(weekEndDate)}`;

  // 월요일부터 7일간 반복하며 날짜 칸 생성
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + i);

    const dateStr = formatDate(date);

    // 해당 날짜의 Todo 개수 계산
    const count = todos.filter((todo) => todo.date === dateStr).length;

    // 날짜 칸 생성
    const dayBox = document.createElement("div");
    dayBox.className = "day";

    // 현재 선택된 날짜면 강조
    if (dateStr === selectedStr) {
      dayBox.classList.add("selected");
    }

    // 오늘 날짜면 테두리로 구분
    if (dateStr === todayStr) {
      dayBox.classList.add("today");
    }

    // 요일 / 날짜 숫자 / Todo 개수 표시
    dayBox.innerHTML = `
      <div class="day-name">${dayNames[date.getDay()]}</div>
      <div class="day-number">${date.getDate()}</div>
      <div class="day-count">${count}개</div>
    `;

    // 날짜 클릭 시 해당 날짜를 선택하고 목록 갱신
    dayBox.addEventListener("click", () => {
      selectedDate = new Date(date);
      editingTodoId = null; // 날짜를 바꾸면 진행 중이던 수정은 취소
      renderWeekView();
      renderTodos();
    });

    weekView.appendChild(dayBox);
  }
}

/* =========================
   주 이동
========================= */

// 보고 있는 주를 offset(주 단위)만큼 이동 (-1: 이전 주, +1: 다음 주)
function changeWeek(offset) {
  weekStartDate.setDate(weekStartDate.getDate() + offset * 7);
  renderWeekView();
}

/* =========================
   Create: 새로운 Todo 추가
========================= */
function addTodo() {
  // 입력값 양쪽 공백 제거
  const text = todoInput.value.trim();

  // 입력값이 비어있으면 안내 메시지를 표시하고 종료
  if (text === "") {
    errorMessage.textContent = "할 일을 입력해주세요.";
    return;
  }

  // 정상 입력 시 이전 안내 메시지 제거
  errorMessage.textContent = "";

  // 새 Todo 객체를 배열에 추가 (현재 선택된 날짜를 함께 저장)
  todos.push({
    id: nextTodoId++,
    text: text,
    completed: false, // 완료 여부 (기본값: 미완료)
    date: formatDate(selectedDate), // 어느 날짜의 할 일인지 저장
  });

  // 입력창 비우기
  todoInput.value = "";

  // 변경된 내용을 저장하고 화면 다시 그리기
  saveToLocalStorage();
  renderWeekView(); // 개수 표시 갱신을 위해 주간 뷰도 다시 그림
  renderTodos();
}

/* =========================
   Delete: 특정 Todo 삭제
========================= */
function deleteTodo(id) {
  // 전달받은 id와 다른 항목만 남겨서 사실상 해당 항목을 제거
  todos = todos.filter((todo) => todo.id !== id);

  saveToLocalStorage();
  renderWeekView(); // 개수 갱신
  renderTodos();
}

/* =========================
   Update(완료 토글): 완료 여부 변경
========================= */
function toggleComplete(id) {
  // id가 일치하는 항목의 completed 값을 반대로 변경
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveToLocalStorage();
  renderWeekView(); // 개수 자체는 그대로지만 일관성을 위해 함께 갱신
  renderTodos();
}

/* =========================
   Update(수정) - 인라인 방식
========================= */

// 수정 시작: 해당 Todo를 수정 모드로 전환 (텍스트 → 입력창)
function startEditTodo(id) {
  editingTodoId = id;
  renderTodos();
}

// 수정 저장: 입력된 새 텍스트로 갱신
function saveEditTodo(id, newText) {
  const trimmedText = newText.trim();

  // 공백만 입력된 경우 저장하지 않고 수정 모드만 종료
  if (trimmedText === "") {
    editingTodoId = null;
    renderTodos();
    return;
  }

  // 대상 Todo의 텍스트를 새 값으로 갱신
  const targetTodo = todos.find((todo) => todo.id === id);
  targetTodo.text = trimmedText;

  // 수정 모드 종료
  editingTodoId = null;

  saveToLocalStorage();
  renderTodos();
}

// 수정 취소: 변경 없이 수정 모드만 종료
function cancelEditTodo() {
  editingTodoId = null;
  renderTodos();
}

/* =========================
   필터링: 선택된 날짜 + 현재 필터에 맞는 Todo만 골라내기
========================= */
function getFilteredTodos() {
  // 현재 선택된 날짜 문자열
  const selectedDateStr = formatDate(selectedDate);

  return todos.filter((todo) => {
    // 1) 선택된 날짜와 일치하지 않으면 제외
    if (todo.date !== selectedDateStr) return false;

    // 2) 상태 필터 적용
    if (currentFilter === "active") return !todo.completed; // 진행 중(미완료)만
    if (currentFilter === "completed") return todo.completed; // 완료만
    return true; // "all"이면 해당 날짜 전체 표시
  });
}

/* =========================
   Read: 필터링된 Todo를 화면에 렌더링
========================= */
function renderTodos() {
  // 기존 목록을 비우고 다시 그림
  todoList.innerHTML = "";

  // 선택된 날짜 + 현재 필터에 해당하는 Todo만 가져오기
  const filteredTodos = getFilteredTodos();

  // 표시할 Todo가 없으면 안내 문구 출력 후 종료
  if (filteredTodos.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "표시할 할 일이 없습니다.";
    todoList.appendChild(emptyMessage);
    return;
  }

  filteredTodos.forEach((todo) => {
    // 항목 전체를 감싸는 li
    const listItem = document.createElement("li");
    listItem.className = "todo-item";

    // 현재 이 항목이 수정 모드인지 확인
    const isEditing = todo.id === editingTodoId;

    if (isEditing) {
      // ---- 수정 모드: 텍스트 대신 입력창 + 저장/취소 버튼 ----

      // 기존 텍스트가 채워진 입력창
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "todo-edit-input";
      editInput.value = todo.text;

      // Enter로 저장, Esc로 취소 (키보드 편의 기능)
      editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEditTodo(todo.id, editInput.value);
        } else if (event.key === "Escape") {
          cancelEditTodo();
        }
      });

      // 버튼 영역
      const actions = document.createElement("div");
      actions.className = "todo-actions";

      // 저장 버튼
      const saveButton = document.createElement("button");
      saveButton.textContent = "저장";
      saveButton.addEventListener("click", () =>
        saveEditTodo(todo.id, editInput.value)
      );

      // 취소 버튼
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "취소";
      cancelButton.addEventListener("click", () => cancelEditTodo());

      actions.append(saveButton, cancelButton);
      listItem.append(editInput, actions);

      todoList.appendChild(listItem);

      // 수정 모드로 들어오면 입력창에 자동 포커스 + 커서를 끝으로
      editInput.focus();
      editInput.setSelectionRange(todo.text.length, todo.text.length);
    } else {
      // ---- 일반 모드: 텍스트 + 완료/수정/삭제 버튼 ----

      // Todo 텍스트 영역
      const textSpan = document.createElement("span");
      textSpan.className = "todo-text";
      textSpan.textContent = todo.text;

      // 완료 상태면 취소선 클래스 추가
      if (todo.completed) {
        textSpan.classList.add("completed");
      }

      // 버튼들을 담는 영역
      const actions = document.createElement("div");
      actions.className = "todo-actions";

      // 완료 처리 버튼
      const completeButton = document.createElement("button");
      completeButton.textContent = todo.completed ? "취소" : "완료";
      completeButton.addEventListener("click", () => toggleComplete(todo.id));

      // 수정 버튼 (클릭 시 인라인 수정 모드로 전환)
      const editButton = document.createElement("button");
      editButton.textContent = "수정";
      editButton.addEventListener("click", () => startEditTodo(todo.id));

      // 삭제 버튼
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));

      // 버튼들을 actions에, 텍스트와 actions를 li에 붙이기
      actions.append(completeButton, editButton, deleteButton);
      listItem.append(textSpan, actions);

      todoList.appendChild(listItem);
    }
  });
}

/* =========================
   필터 탭 클릭 처리
========================= */
function setupFilterTabs() {
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 클릭한 탭의 data-filter 값을 현재 필터로 저장
      currentFilter = tab.dataset.filter;
      editingTodoId = null; // 필터를 바꾸면 진행 중이던 수정은 취소

      // 모든 탭에서 active 제거 후, 클릭한 탭에만 active 추가 (시각적 구분)
      filterTabs.forEach((eachTab) => eachTab.classList.remove("active"));
      tab.classList.add("active");

      // 선택된 필터 기준으로 목록 다시 그리기
      renderTodos();
    });
  });
}

/* =========================
   이벤트 연결
========================= */

// 추가 버튼 클릭 시 Todo 추가
addButton.addEventListener("click", addTodo);

// 입력창에서 Enter 키를 눌러도 Todo 추가 (편의 기능)
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

// 이전 / 다음 주 이동 버튼
prevWeekButton.addEventListener("click", () => changeWeek(-1));
nextWeekButton.addEventListener("click", () => changeWeek(1));

// 필터 탭 이벤트 연결
setupFilterTabs();

/* =========================
   초기 실행
========================= */
loadFromLocalStorage(); // 저장된 데이터 불러오기 (새로고침 시 복원)
renderWeekView(); // 이번 주 날짜 칸 표시
renderTodos(); // 현재 선택된 날짜 + 필터에 맞는 Todo 목록 표시