# Todo App — Next.js + FastAPI

React(Vite) 기반의 2차 Todo 앱을 **Next.js App Router + FastAPI** 풀스택 구조로 재구성한 프로젝트다. 로컬스토리지 기반 상태 관리를 서버 API 기반 데이터 흐름으로 전환하고, Server / Client Component를 역할에 맞게 분리하는 것을 목표로 한다.

---

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 18, TypeScript 5, Tailwind CSS 4 |
| Backend | FastAPI, Uvicorn, SQLAlchemy 2, Pydantic 2, SQLite |
| 통신 | Next 기본 `fetch` (Axios 미사용) |

---

## 디렉토리 구조

```
kakao-work/
├── frontend/                       # Next.js (App Router)
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       └── route.ts        # FastAPI 프록시 (GET/POST/PUT/DELETE)
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   ├── page.tsx         # 수정 페이지 (Server) — 기존 데이터 로딩
│   │   │   │   └── EditTodoForm.tsx # 수정 폼 (Client) — 입력/저장 인터랙션
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # 생성 페이지 (Client) — 날짜 선택 포함
│   │   │   ├── page.tsx             # 목록 페이지 (Server) — 데이터 진입점
│   │   │   ├── WeekView.tsx         # 주간 뷰 (Client) — 날짜 선택/주 이동
│   │   │   ├── TodoControls.tsx     # 필터 탭 + 검색창 (Client)
│   │   │   ├── TodoListClient.tsx   # 목록 인터랙션 (Client) — 완료/삭제
│   │   │   ├── loading.tsx          # 로딩 UI
│   │   │   └── error.tsx            # 에러 UI (Client)
│   │   ├── utils/
│   │   │   └── date.ts              # 날짜 포맷/주 계산 헬퍼
│   │   ├── actions.ts              # Server Actions (CRUD + 조회)
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 루트 → /todos 리다이렉트
│   │   └── globals.css            # 전역 스타일 / 컬러 토큰
│   └── .env.local                 # NEXT_PUBLIC_API_URL, BACKEND_URL
│
└── backend/                        # FastAPI
    ├── main.py                     # 앱 + 모델 + 스키마 + 라우터 (단일 파일)
    ├── requirements.txt
    └── .env.local                  # DATABASE_URL
```

---

## 아키텍처 개요

데이터의 소유권을 클라이언트(로컬스토리지)에서 서버(SQLite)로 옮긴 것이 2차 과제와의 핵심 차이다. 브라우저는 더 이상 데이터를 직접 저장하지 않고, Next 서버를 거쳐 FastAPI에 요청한다.

```
┌────────────┐   클릭/입력    ┌──────────────────────┐
│  Browser   │ ────────────▶ │  Client Component     │
│            │               │  (WeekView, Controls, │
│            │               │   TodoListClient ...)  │
└────────────┘               └───────────┬───────────┘
                                         │ Server Action 호출 (import)
                                         │ 또는 fetch('/api/todos')
                                         ▼
                              ┌──────────────────────┐
                              │   Next.js 서버         │
                              │   actions.ts / route.ts│  ← BACKEND_URL 사용
                              └───────────┬───────────┘
                                         │ fetch(http://localhost:8000)
                                         ▼
                              ┌──────────────────────┐
                              │   FastAPI (main.py)    │
                              │   필터/검색/날짜 처리   │
                              └───────────┬───────────┘
                                         ▼
                                   ┌────────────┐
                                   │  SQLite    │
                                   └────────────┘
```

### 요청 경로를 둘로 나눈 이유

| 경로 | 사용처 | 역할 |
| --- | --- | --- |
| `actions.ts` (Server Action) | Server Component의 데이터 조회, 폼 제출 | 컴포넌트에서 직접 import해 호출. FastAPI와 직통하며 `revalidatePath`로 캐시를 갱신한다. |
| `route.ts` (API Route) | 브라우저의 직접 HTTP 요청 | `fetch('/api/todos')`를 받아 FastAPI로 중계하는 프록시. CORS 문제와 백엔드 주소 노출을 막는다. |

---

## Server / Client Component 분리 원칙

App Router에서 컴포넌트는 기본적으로 Server Component이며, 인터랙션이 필요한 경우에만 `"use client"`를 선언한다. 이 프로젝트는 **"보여주는 책임"과 "조작하는 책임"**을 파일 단위로 분리했다.

| 컴포넌트 | 종류 | 책임 |
| --- | --- | --- |
| `todos/page.tsx` | Server | URL 파라미터를 읽어 데이터를 가져오는 진입점 |
| `[todoId]/page.tsx` | Server | 수정 대상 Todo를 서버에서 로딩 |
| `WeekView.tsx` | Client | 날짜 칸 클릭, 주 이동 (URL 변경) |
| `TodoControls.tsx` | Client | 필터 탭, 검색 입력 (URL 변경) |
| `TodoListClient.tsx` | Client | 완료 토글, 삭제, 수정 이동 |
| `EditTodoForm.tsx` | Client | 수정 내용 입력 및 저장 |
| `error.tsx` | Client | 에러 경계 (App Router 규칙상 Client 필수) |

> Server Component에 `onClick` 등 이벤트 핸들러를 직접 두면 에러가 발생한다. 따라서 Server 페이지가 데이터를 받아 Client 자식 컴포넌트에 props로 내려주는 구조를 따른다.

---

## 상태 관리 — URL 기반

2차 과제는 필터 상태를 `useState`로 관리해 새로고침 시 초기화됐다. 이번에는 **선택 날짜 · 필터 · 검색어를 모두 URL 쿼리 파라미터로 관리**한다.

```
/todos?date=2026-06-24&filter=active&search=회의
```

- 새로고침, 공유, 뒤로가기에서도 화면 상태가 그대로 복원된다.
- Server Component(`page.tsx`)가 `searchParams`를 읽어 그대로 FastAPI에 전달하므로, **필터링과 검색이 클라이언트가 아닌 서버(DB)에서 수행된다.**
- Client 컴포넌트는 상태를 직접 들고 있지 않고, `router.push`로 URL만 바꾼다. 날짜를 바꿔도 필터/검색이 풀리지 않도록 세 값을 항상 함께 조립한다.

---

## API 명세

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/todos` | 전체 목록 조회 |
| GET | `/todos?date=YYYY-MM-DD` | 특정 날짜 조회 |
| GET | `/todos?filter=active\|completed` | 상태별 조회 |
| GET | `/todos?search=키워드` | 키워드 검색 (제목 부분 일치) |
| GET | `/todos/{id}` | 단일 조회 (수정 페이지용) |
| POST | `/todos` | 생성 (`title`, `date`) |
| PUT | `/todos/{id}` | 수정 (`title`, `completed`) |
| DELETE | `/todos/{id}` | 삭제 |

`date`, `filter`, `search`는 조합 가능하며, 모든 조건은 SQLAlchemy 쿼리 단계에서 누적 적용된다.

### 데이터 모델

```
Todo
├── id        : int   (PK)
├── title     : str
├── completed : bool
└── date      : str   (YYYY-MM-DD)
```

---

## 구현 기능

**기본**
- Todo CRUD (생성 / 조회 / 수정 / 삭제)
- Server / Client Component 분리
- API Route 프록시 + Server Action 연동
- 환경변수 분리 (`.env.local`)
- `loading.tsx` / `error.tsx` 처리

**도전**
- 서버 기반 상태별 필터링 (URL 파라미터)
- 서버 기반 검색 (필터와 동시 적용)
- 2차 과제 주간 뷰를 서버 데이터 기반으로 이식 (날짜별 Todo 관리)

---

## 실행 방법

**백엔드**

```bash
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000
```

**프론트엔드**

```bash
cd frontend
npm install
npm run dev                        # http://localhost:3000
```

두 서버를 동시에 실행한 뒤 `http://localhost:3000`에 접속한다. 루트 접속 시 `/todos`로 자동 이동한다.

### 환경변수

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000

# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
```

---

## 2차 과제 대비 변경점

| 항목 | 2차 (React) | 3차 (Next + FastAPI) |
| --- | --- | --- |
| 데이터 저장 | localStorage | SQLite (서버) |
| 필터 상태 | `useState` | URL 쿼리 파라미터 |
| 필터링 처리 | 클라이언트 배열 필터 | 서버 DB 쿼리 |
| 렌더링 | 전부 클라이언트 | Server / Client 분리 |
| 라우팅 | 단일 페이지 | 파일 기반 라우팅 |
