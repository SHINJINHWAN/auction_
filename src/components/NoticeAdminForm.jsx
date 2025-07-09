import React, { useState, useEffect } from 'react';
import '../style/NoticeAdminForm.css';

const initialState = { title: '', content: '' };

const NoticeAdminForm = ({ selectedNotice, onSubmit, onDelete, onCancel }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (selectedNotice) setForm(selectedNotice);
    else setForm(initialState);
  }, [selectedNotice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="notice-admin-form" onSubmit={handleSubmit}>
      <h3>{selectedNotice ? '공지 수정' : '공지 등록'}</h3>
      <div>
        <label>제목</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />
      </div>
      <div className="notice-admin-form-btns">
        <button type="submit">{selectedNotice ? '수정' : '등록'}</button>
        {selectedNotice && (
          <button type="button" className="delete" onClick={() => onDelete(selectedNotice.id)}>
            삭제
          </button>
        )}
        <button type="button" onClick={onCancel}>취소</button>
      </div>
    </form>
  );
};

export default NoticeAdminForm; 