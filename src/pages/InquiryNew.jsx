import React from 'react';
import InquiryForm from '../components/InquiryForm';

const InquiryNew = () => {
  // 실제 로그인 사용자 정보로 userId 대체 필요
  const handleSubmit = (inquiry) => {
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    }).then(() => {
      alert('문의가 등록되었습니다.');
      window.location.href = '/inquiry/my';
    });
  };
  return (
    <div>
      <InquiryForm userId="user1" onSubmit={handleSubmit} />
    </div>
  );
};

export default InquiryNew; 