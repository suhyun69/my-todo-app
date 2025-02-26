export default function AuthButtons({ session, authLoading, handleSignOut, setAuthModal }) {
  if (session) {
    return (
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
    );
  }

  return (
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
  );
} 