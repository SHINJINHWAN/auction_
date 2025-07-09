import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/CustomerService.css';

const CustomerService = () => {
  const navigate = useNavigate();
  return (
    <div className="cs-main">
      <h2>고객센터</h2>
      <div className="cs-menu">
        <button onClick={() => navigate('/faq')}>자주 묻는 질문(FAQ)</button>
        <button onClick={() => navigate('/notice')}>공지사항</button>
        <button onClick={() => navigate('/event')}>이벤트</button>
        <button onClick={() => navigate('/inquiry')}>1:1 문의</button>
      </div>
    </div>
  );
};

export default CustomerService; 