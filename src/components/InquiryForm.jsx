import React, { useState } from 'react';
import '../style/InquiryForm.css';

const InquiryForm = ({ userId, onSubmit }) => {
  const [form, setForm] = useState({ title: '', content: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSubmit({ ...form, userId });
    setForm({ title: '', content: '' });
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h3>1:1 문의 등록</h3>
      <div>
        <label>제목</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label>내용</label>
        <textarea name="content" value={form.content} onChange={handleChange} required />
      </div>
      <button type="submit">문의하기</button>
    </form>
  );
};

export default InquiryForm; 