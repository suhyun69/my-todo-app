"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import AuthSection from '@/components/AuthSection';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (currentSession?.user?.id) {
      fetchTodos();
    }
  }, [currentSession?.user?.id]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // 새로운 todo 추가
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { text: newTodo.trim(), user_id: currentSession.user.id }
        ])
        .select()
        .single();

      if (error) throw error;
      setTodos([...todos, data]);
      setNewTodo("");
    } catch (error) {
      console.error('Error inserting todo:', error);
    }
  };

  // todo 상태 토글
  const toggleTodo = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTodos(todos.map(todo => 
        todo.id === id ? data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // todo 수정
  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ text: editText.trim() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTodos(todos.map(todo =>
        todo.id === id ? data : todo
      ));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <AuthSection onAuthStateChange={(session) => {
        setCurrentSession(session);
        if (!session) {
          setTodos([]);
        }
      }} />

      <h1 className="text-4xl font-bold mb-4">Todo List</h1>
      
      {currentSession && (
        <>
          {/* Todo 입력 폼 */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
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

          {/* Todo 목록 */}
          {/* 진행중인 Todo 섹션 */}
          <div className="w-full max-w-2xl mb-8">
            <h2 className="text-2xl font-semibold mb-4">진행중인 할 일</h2>
            <ul className="space-y-2">
              {todos
                .filter(todo => !todo.completed)
                .map(todo => (
                  <li key={todo.id} className="flex items-center p-3 border rounded">
                    <input 
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-3"
                    />
                    {editingId === todo.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 p-1 border rounded"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(todo.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <span
                        onDoubleClick={() => {
                          setEditingId(todo.id);
                          setEditText(todo.text);
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        {todo.text}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          {/* 완료된 Todo 섹션 */}
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">완료된 할 일</h2>
            <ul className="space-y-2">
              {todos
                .filter(todo => todo.completed)
                .map(todo => (
                  <li key={todo.id} className="flex items-center p-3 border rounded opacity-50">
                    <input 
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-3"
                    />
                    <span className="line-through">{todo.text}</span>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
