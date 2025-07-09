import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/InquiryDetail.css';

const InquiryDetail = () => {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/inquiry/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('문의 상세 불러오기 실패');
        return res.json();
      })
      .then(setInquiry)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="inquiry-detail">불러오는 중...</div>;
  if (error) return <div className="inquiry-detail error">{error}</div>;
  if (!inquiry) return null;

  return (
    <div className="inquiry-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← 목록으로</button>
      <h2>{inquiry.title}</h2>
      <div className="inquiry-date">{inquiry.createdAt?.slice(0, 10)}</div>
      <div className="inquiry-content">{inquiry.content}</div>
      <div className="inquiry-answer-tip">
        답변은 쪽지함에서 확인하실 수 있습니다.
      </div>
    </div>
  );
};

export default InquiryDetail; 