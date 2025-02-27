"use client";

import { useState, useEffect } from "react";
import AuthSection from '@/components/AuthSection';
import TodoSection from '@/components/TodoSection';
import ProfileSection from '@/components/ProfileSection';
import LessonSection from '@/components/LessonSection';
import LessonForm from '@/components/LessonFormSection';

export default function Home() {
  const [currentSession, setCurrentSession] = useState(null);
  const [profile, setProfile] = useState(null);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <AuthSection 
        onAuthStateChange={setCurrentSession}
        onProfileChange={setProfile}
      />
      {/* <ProfileSection session={currentSession} /> */}
      {/* <LessonSection profile={profile} />
      {currentSession && (
        <TodoSection session={currentSession} profile={profile} />
      )} */}
      <LessonForm />
    </main>
  );
}
