# 📝 과제 2. React로 Todo 앱 만들기

1차 과제에서 Vanilla JS로 만든 Todo 앱을 React Function Component 구조로 마이그레이션한 과제다.
컴포넌트 단위로 UI를 분리하고, `useState` / `useEffect`로 상태와 부수 효과를 관리한다.

---

## 🚀 실행 방법

1. 저장소 클론
   ```bash
   git clone 저장소 주소
   cd 프로젝트 폴더
   ```
2. 의존성 설치
   ```bash
   npm install
   ```
3. 개발 서버 실행
   ```bash
   npm run dev
   ```
4. 브라우저에서 `http://localhost:5173` 으로 접속 (주소는 다를 수 있음)

---

## 🛠️ 활용 스택

- `React` (v18+)
- `Vite` (v5)
- `Tailwind CSS` (v4)
- `Web Storage API` (localStorage)

---

## 📁 프로젝트 구조

```
src/
├─ App.jsx                  # 최상위 컴포넌트 (공유 상태 보유)
├─ index.css               # Tailwind 진입점
├─ main.jsx                # 앱 진입점
├─ components/
│  ├─ TodoInput.jsx        # 입력창 + 추가 버튼 + 에러 메시지
│  ├─ FilterTabs.jsx       # 전체 / 진행 중 / 완료 필터 탭
│  ├─ TodoList.jsx         # 목록 전체 (+ 빈 상태 안내)
│  ├─ TodoItem.jsx         # 할 일 한 개 (일반 ↔ 수정 모드)
│  └─ WeekView.jsx         # 주간 뷰 (날짜 7칸 + 주 이동)
└─ utils/
   └─ date.js              # 날짜 유틸 (formatDate / getDisplayDate / getWeekStart)
```

---

## ✅ 구현 기능

### 기본 미션
- **Todo CRUD** : 생성 / 수정 / 완료 처리 / 삭제 (수정은 `prompt()` 대신 인라인 입력창)
- **상태별 필터링** : 전체 / 진행 중 / 완료 탭 (탭 전환 후 추가해도 필터 유지)
- **일간 뷰** : 날짜별 Todo 관리, 선택된 날짜의 Todo만 표시
- **로컬스토리지 연동** : `useEffect`로 todos 변경 시 자동 저장, 새로고침 후 데이터 유지

### 도전 미션
- **주간 뷰** : 월~일 날짜 표시, 이전/다음 주 이동, 날짜별 Todo 개수, 오늘 날짜 강조, 새로고침 후 주차 유지

---

## 🔑 핵심 설계

- **상태 위치** : 여러 컴포넌트가 공유하는 상태(`todos`, `currentFilter`, `selectedDate`, `weekStartDate`)는 공통 부모인 App에, 한 컴포넌트만 쓰는 상태(`isEditing`, `text` 등)는 해당 컴포넌트 내부에 둠.
- **단방향 데이터 흐름** : 상태는 App에서 props로 자식에게 내려보내고, 자식은 콜백 함수(props)를 호출해 App에 변경을 요청.
- **자동 저장** : `useEffect`의 의존성 배열을 활용해 todos가 바뀔 때마다 localStorage에 자동 저장.

---

## 📌 참고사항

- 본 과제는 AI(Claude 등)를 활용해 1차 과제를 migration했으며, 생성된 코드를 직접 읽고 1차 과제와 비교하며 직접 수정했다.