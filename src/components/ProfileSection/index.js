import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthSection({ session }) {

    const [profiles, setProfiles] = useState([]);
    const [newProfile, setNewProfile] = useState('');

    useEffect(() => {
        fetchProfiles()
      }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newProfile.trim() === "") return;
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert([
              { nickname: newProfile.trim(), user_id: null }
            ])
            .select()
            .single();
    
          if (error) throw error;
          setProfiles([...profiles, data]);
          setNewProfile("");

          fetchProfiles();
        } catch (error) {
          console.error('Error inserting profile:', error);
        }
    };

    const fetchProfiles = async () => {
        try {
            const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: true });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleProfileAssign = async (id) => {
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ user_id: session?.user?.id })
            .eq('id', id)
            .select()
            .single();
    
          if (error) throw error;
          setProfiles(profiles.map(profile =>
            profile.id === id ? data : profile
          ));
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };

    return (
        <>
            <h1 className="text-4xl font-bold mb-4">Profile List</h1>
      
            {/* profile 입력 폼 */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
                <div className="flex gap-2">
                <input
                    type="text"
                    value={newProfile}
                    onChange={(e) => setNewProfile(e.target.value)}
                    placeholder="새로운 프로필을 입력하세요"
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

            {/* 진행중인 profile 섹션 */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4">Profile List</h2>
                <ul className="space-y-2">
                {profiles
                    // .filter(profile => !profile.completed)
                    .map(profile => (
                        <li key={profile.id} className="flex items-center p-3 border rounded">
                            <input 
                            type="checkbox"
                            checked={profile.completed}
                            onChange={() => toggleprofile(profile.id)}
                            className="mr-3"
                            />
                            {profile.nickname}

                            {!profile.user_id ? (
                                <button
                                    onClick={() => handleProfileAssign(profile.id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                    저장
                                </button>
                            ) : (
                                <>
                                    - {profile.user_id}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}