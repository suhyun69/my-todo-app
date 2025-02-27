"use client";

import { useState, useEffect } from "react";
import AuthSection from '@/components/AuthSection';
import TodoSection from '@/components/TodoSection';
import ProfileSection from '@/components/ProfileSection';

export default function Home() {
  const [currentSession, setCurrentSession] = useState(null);
  const [profile, setProfile] = useState(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <AuthSection 
        onAuthStateChange={(session) => {
          setCurrentSession(session);
        }}
        onProfileChange={(profile) => {
          setProfile(profile);
        }} 
      />
      {/* <ProfileSection session={currentSession} /> */}
      {currentSession && (
        <TodoSection session={currentSession} profile={profile} />
      )}
    </main>
  );
}
