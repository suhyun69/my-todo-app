"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: null });

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log('Current session:', session);
    });

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log('Auth state changed:', {
        event: _event,
        session: session
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로그인한 사용자의 todos 불러오기
  useEffect(() => {
    if (session) {
      fetchTodos();
    } else {
      setTodos([]); // 로그아웃 시 todos 초기화
    }
  }, [session]);

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

  // 회원가입 핸들러
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      setAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      // alert('가입 확인 이메일을 확인해주세요!');
      setAuthModal({ isOpen: false, mode: null });
    } catch (error) {
      alert('회원가입 오류: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // 로그인 핸들러
  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      console.log('Login successful:', {
        user: data.user,
        session: data.session
      });
      setAuthModal({ isOpen: false, mode: null });
    } catch (error) {
      alert('로그인 오류: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert('로그아웃 오류: ' + error.message);
    } finally {
      setAuthLoading(false);
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
          { text: newTodo.trim(), user_id: session.user.id }
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
      {/* 인증 버튼 섹션 */}
      <div className="w-full max-w-2xl flex justify-end gap-2 mb-8">
        {session ? (
          <>
            <span className="py-2 px-4">{session.user.email}</span>
            <button
              onClick={handleSignOut}
              disabled={authLoading}
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              disabled={authLoading}
              className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              회원가입
            </button>
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              disabled={authLoading}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              로그인
            </button>
          </>
        )}
      </div>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: null })}
        onSubmit={authModal.mode === 'signup' ? handleSignUp : handleSignIn}
        loading={authLoading}
      />

      {/* Todo 앱 제목 및 환영 메시지 */}
      <h1 className="text-4xl font-bold mb-4">Todo List</h1>
      {session && (
        <p className="text-lg text-gray-600 mb-8">
          {session.user.id}님, 안녕하세요
        </p>
      )}
      
      {/* 새로운 Todo 입력 폼 - 로그인한 경우에만 표시 */}
      {session && (
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
      )}

      {/* Todo 목록 - 로그인한 경우에만 표시 */}
      {session && (
        <>
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
