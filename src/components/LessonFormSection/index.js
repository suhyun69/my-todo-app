import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import LessonForm from './LessonForm';

export default function LessonFormSection({ profile }) {
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (lessonData) => {
    if (!profile) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. lessons 테이블에 기본 정보 저장
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: lessonData.title,
          instructor1: lessonData.instructor1,
          instructor2: lessonData.instructor2 || null,
          start_datetime: lessonData.start_datetime,
          end_datetime: lessonData.end_datetime,
          region: lessonData.region,
          place: lessonData.place,
          price: parseInt(lessonData.price),
          account: lessonData.account,
          created_by: profile.id
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // 2. 할인 정보 저장
      if (lessonData.discounts.length > 0) {
        const discountsToInsert = lessonData.discounts.map(discount => ({
          no: lesson.no,
          type: discount.type,
          condition: discount.condition,
          amount: parseInt(discount.amount),
          created_by: profile.id
        }));

        const { error: discountError } = await supabase
          .from('lesson_discount')
          .insert(discountsToInsert);

        if (discountError) throw discountError;
      }

      // 3. 연락처 정보 저장
      if (lessonData.contacts.length > 0) {
        const contactsToInsert = lessonData.contacts.map(contact => ({
          no: lesson.no,
          type: contact.type,
          contact: contact.contact,
          name: contact.name || null,
          created_by: profile.id
        }));

        const { error: contactError } = await supabase
          .from('lesson_contact')
          .insert(contactsToInsert);

        if (contactError) throw contactError;
      }

      alert('레슨이 성공적으로 등록되었습니다.');
      
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('레슨 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">레슨 등록</h1>
      <LessonForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
}