"use client";

import { useState, useEffect } from "react";
import AuthSection from '@/components/AuthSection';
import TodoSection from '@/components/TodoSection';

export default function Home() {
  const [currentSession, setCurrentSession] = useState(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <AuthSection onAuthStateChange={(session) => {
        setCurrentSession(session);
      }} />
      
      {currentSession && (
        <TodoSection session={currentSession} />
      )}
    </main>
  );
}
