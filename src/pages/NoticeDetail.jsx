import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/notice/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('공지사항을 불러올 수 없습니다.');
        return res.json();
      })
      .then(setNotice)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="notice-detail">불러오는 중...</div>;
  if (error) return <div className="notice-detail error">{error}</div>;
  if (!notice) return null;

  return (
    <div className="notice-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← 목록으로</button>
      <h2>{notice.title}</h2>
      <div className="notice-date">{notice.createdAt?.slice(0, 10)}</div>
      <div className="notice-content">{notice.content}</div>
    </div>
  );
};

export default NoticeDetail; 