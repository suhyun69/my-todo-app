import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LessonSection({ profile }) {

    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState('');

    useEffect(() => {
        fetchLessons()
    }, []);

    const fetchLessons = async () => {
        try {
            const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .order('created_at', { ascending: true });

            if (error) throw error;
            setLessons(data || []);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newLesson.trim() === "") return;
        
        try {
          const { data, error } = await supabase
            .from('lessons')
            .insert([
              { title: newLesson.trim(), user_id: profile.nickname }
            ])
            .select()
            .single();
    
          if (error) throw error;
          setLessons([...lessons, data]);
          setNewLesson("");

          fetchLessons();
        } catch (error) {
          console.error('Error inserting lesson:', error);
        }
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-4">Lesson Section</h1>
      
            {/* lesson 입력 폼 */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
                <div className="flex gap-2">
                <input
                    type="text"
                    value={newLesson}
                    onChange={(e) => setNewLesson(e.target.value)}
                    placeholder="새로운 수업을 입력하세요"
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

            {/* 진행중인 lesson 섹션 */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4">Lesson List</h2>
                <ul className="space-y-2">
                {lessons
                    // .filter(lesson => !lesson.completed)
                    .map(lesson => (
                        <li key={lesson.id} className="flex items-center p-3 border rounded">
                            {lesson.title}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )

}