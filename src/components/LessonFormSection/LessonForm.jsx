import { useState } from 'react';

export default function LessonForm({ onSubmit, isSubmitting }) {
  const [lessonData, setLessonData] = useState({
    title: '',
    instructor1: '',
    instructor2: '',
    start_datetime: '',
    end_datetime: '',
    region: '',
    place: '',
    price: '',
    account: '',
    discounts: [], // [{type: '', condition: '', amount: ''}]
    contacts: [],  // [{type: '', contact: '', name: ''}]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 할인 정보 관리
  const addDiscount = () => {
    setLessonData(prev => ({
      ...prev,
      discounts: [...prev.discounts, { type: '', condition: '', amount: '' }]
    }));
  };

  const updateDiscount = (index, field, value) => {
    setLessonData(prev => ({
      ...prev,
      discounts: prev.discounts.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // 연락처 정보 관리
  const addContact = () => {
    setLessonData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { type: '', contact: '', name: '' }]
    }));
  };

  const updateContact = (index, field, value) => {
    setLessonData(prev => ({
      ...prev,
      contacts: prev.contacts.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(lessonData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 레슨 정보 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">기본 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="레슨 제목"
            value={lessonData.title}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="instructor1"
            placeholder="주강사"
            value={lessonData.instructor1}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="instructor2"
            placeholder="부강사 (선택사항)"
            value={lessonData.instructor2}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            name="start_datetime"
            value={lessonData.start_datetime}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            name="end_datetime"
            value={lessonData.end_datetime}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="region"
            placeholder="지역"
            value={lessonData.region}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="place"
            placeholder="장소"
            value={lessonData.place}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="가격"
            value={lessonData.price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="account"
            placeholder="계좌번호"
            value={lessonData.account}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
      </div>

      {/* 할인 정보 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">할인 정보</h2>
          <button 
            type="button" 
            onClick={addDiscount}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            할인 추가
          </button>
        </div>
        {lessonData.discounts.map((discount, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="할인 유형"
              value={discount.type}
              onChange={(e) => updateDiscount(index, 'type', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="할인 조건"
              value={discount.condition}
              onChange={(e) => updateDiscount(index, 'condition', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="할인 금액"
              value={discount.amount}
              onChange={(e) => updateDiscount(index, 'amount', e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
        ))}
      </div>

      {/* 연락처 정보 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">연락처 정보</h2>
          <button 
            type="button" 
            onClick={addContact}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            연락처 추가
          </button>
        </div>
        {lessonData.contacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="연락처 유형"
              value={contact.type}
              onChange={(e) => updateContact(index, 'type', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="연락처"
              value={contact.contact}
              onChange={(e) => updateContact(index, 'contact', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="이름"
              value={contact.name}
              onChange={(e) => updateContact(index, 'name', e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? '등록 중...' : '레슨 등록'}
      </button>
    </form>
  );
} 