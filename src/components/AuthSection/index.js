import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';
import AuthButtons from './AuthButtons';

export default function AuthSection({ onAuthStateChange }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: null });

  useEffect(() => {
    // 1. 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // AuthSection 내부 상태 업데이트
      onAuthStateChange?.(session); // 부모 컴포넌트에 세션 상태 전달
    });

    // 2. 실시간 세션 변경 감지 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // AuthSection 내부 상태 업데이트
      onAuthStateChange?.(session); // 부모 컴포넌트에 세션 상태 전달
    });

    // 3. 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe();
  }, [onAuthStateChange]);

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

  return (
    <>
      <div className="w-full max-w-2xl flex justify-end gap-2 mb-8">
        <AuthButtons
          session={session}
          authLoading={authLoading}
          handleSignOut={handleSignOut}
          setAuthModal={setAuthModal}
        />
      </div>

      {session && (
        <p className="text-lg text-gray-600 mb-8">
          {session.user.id}님, 안녕하세요
        </p>
      )}

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: null })}
        onSubmit={authModal.mode === 'signup' ? handleSignUp : handleSignIn}
        loading={authLoading}
      />
    </>
  );
}