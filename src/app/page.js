"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([
    { id: 1, text: "리액트 공부하기", completed: false },
    { id: 2, text: "운동하기", completed: false }
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    setTodos([...todos, { id: newId, text: newTodo.trim(), completed: false }]);
    setNewTodo("");
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Todo 앱</h1>
      
      {/* 새로운 Todo 입력 폼 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새로운 할 일을 입력하세요"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </form>

      {/* 진행중인 Todo 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">할 일 목록</h2>
        <ul className="space-y-2">
          {todos
            .filter(todo => !todo.completed)
            .map(todo => (
              <li key={todo.id} className="flex items-center gap-2 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    setTodos(todos.map(t =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    ));
                  }}
                />
                <span>{todo.text}</span>
              </li>
            ))}
        </ul>
      </section>

      {/* 완료된 Todo 섹션 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">완료된 목록</h2>
        <ul className="space-y-2">
          {todos
            .filter(todo => todo.completed)
            .map(todo => (
              <li key={todo.id} className="flex items-center gap-2 p-2 border rounded opacity-50">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    setTodos(todos.map(t =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    ));
                  }}
                />
                <span className="line-through">{todo.text}</span>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
