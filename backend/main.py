# main.py
# FastAPI 기반 Todo CRUD API 서버
# - SQLite DB에 Todo를 저장하고, 목록 조회 / 생성 / 수정 / 삭제 엔드포인트를 제공한다

import os

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel

# .env.local 파일에서 환경변수를 불러온다
load_dotenv(".env.local")

# ──────────────────────────────────────────────
# DB 설정
# ──────────────────────────────────────────────
# 환경변수에 DB 주소가 없으면 기본값으로 로컬 SQLite 파일을 사용한다
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

# SQLite는 기본적으로 한 스레드에서만 연결을 허용하므로,
# 여러 요청을 처리할 수 있도록 check_same_thread 옵션을 꺼준다
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# DB 세션을 만들어내는 팩토리. 요청마다 세션을 하나씩 발급한다
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모든 DB 모델이 상속받는 기반 클래스
Base = declarative_base()


# ──────────────────────────────────────────────
# DB 모델 (실제 테이블 구조 정의)
# ──────────────────────────────────────────────
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)  # 고유 식별자
    title = Column(String, nullable=False)              # 할 일 내용
    completed = Column(Boolean, default=False)          # 완료 여부
    date = Column(String, nullable=False)               # 할 일 날짜 (YYYY-MM-DD)
# ──────────────────────────────────────────────
# Pydantic 스키마 (요청/응답 데이터 구조 정의)
# ──────────────────────────────────────────────
# 생성 요청 시 받을 데이터 (내용 + 날짜)
class TodoCreate(BaseModel):
    title: str
    date: str



# 수정 요청 시 받을 데이터
class TodoUpdate(BaseModel):
    title: str
    completed: bool
    
# 응답으로 내보낼 데이터 구조
class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: str

    class Config:
        from_attributes = True

# 테이블이 없으면 생성한다
Base.metadata.create_all(bind=engine)


# ──────────────────────────────────────────────
# FastAPI 앱 생성 및 CORS 설정
# ──────────────────────────────────────────────
app = FastAPI(title="Todo API")

# 프론트엔드(localhost:3000)에서 오는 요청을 허용한다
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# DB 세션 의존성
# ──────────────────────────────────────────────
# 요청이 들어오면 세션을 열고, 처리가 끝나면 반드시 닫아준다
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ──────────────────────────────────────────────
# 엔드포인트 구현
# ──────────────────────────────────────────────

# 전체 Todo 목록 조회 (+ 날짜 / 상태 / 검색 필터)
@app.get("/todos", response_model=list[TodoResponse])
def read_todos(
    date: str | None = None,     # 특정 날짜 (YYYY-MM-DD)
    filter: str | None = None,   # active / completed
    search: str | None = None,   # 키워드 검색
    db: Session = Depends(get_db),
):
    query = db.query(Todo)

    # 날짜 필터 (주간 뷰에서 선택한 날짜)
    if date:
        query = query.filter(Todo.date == date)

    # 상태 필터
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)

    # 검색
    if search:
        query = query.filter(Todo.title.ilike(f"%{search}%"))

    return query.all()

# 단일 Todo 조회 (수정 페이지에서 기존 값을 불러올 때 사용)
@app.get("/todos/{todo_id}", response_model=TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo를 찾을 수 없습니다")
    return todo


# 새 Todo 생성
@app.post("/todos", response_model=TodoResponse)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(title=payload.title, completed=False, date=payload.date)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


# 기존 Todo 수정
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo를 찾을 수 없습니다")

    todo.title = payload.title
    todo.completed = payload.completed
    db.commit()
    db.refresh(todo)
    return todo


# Todo 삭제
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo를 찾을 수 없습니다")

    db.delete(todo)
    db.commit()
    return {"message": "삭제되었습니다"}