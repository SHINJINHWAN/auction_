import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AuctionNew.css';

function AuctionNew() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('가전');
  const [brand, setBrand] = useState('기타');
  const [status, setStatus] = useState('신품');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [startPrice, setStartPrice] = useState('');
  const [buyNow, setBuyNow] = useState('');
  const [bidUnit, setBidUnit] = useState('1000');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [minBid, setMinBid] = useState('1');
  const [autoExt, setAutoExt] = useState(false);

  const [shipping, setShipping] = useState('무료');
  const [shippingType, setShippingType] = useState('택배');
  const [location, setLocation] = useState('');

  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('이미지 업로드 실패');
      const url = await res.text();
      setImageUrl(url);
    } catch (err) {
      alert('이미지 업로드 실패: ' + err.message);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!imageUrl) {
    alert('이미지를 먼저 업로드하세요.');
    return;
  }

  // 필수 필드 검증
  if (!title || !startPrice || !startDate || !startTime || !endDate || !endTime || !minBid) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }

  // 날짜/시간 검증
  const startDateTime = new Date(`${startDate} ${startTime}`);
  const endDateTime = new Date(`${endDate} ${endTime}`);
  const now = new Date();

  if (startDateTime <= now) {
    alert('시작일시는 현재 시간보다 이후여야 합니다.');
    return;
  }

  if (endDateTime <= startDateTime) {
    alert('종료일시는 시작일시보다 이후여야 합니다.');
    return;
  }

  const auctionData = {
    title,
    category,
    status,
    brand,
    description: desc,
    startPrice: parseInt(startPrice),
    buyNowPrice: buyNow ? parseInt(buyNow) : null,
    bidUnit: parseInt(bidUnit),
    startTime: `${startDate} ${startTime}:00`,
    endTime: `${endDate} ${endTime}:00`,
    minBidCount: parseInt(minBid),
    autoExtend: autoExt,
    shippingFee: shipping,
    shippingType,
    location,
    imageUrl1: imageUrl // DTO의 @JsonProperty("imageUrl1")와 일치
  };

  try {
    console.log('📤 전송할 데이터:', auctionData);
    const res = await fetch('http://localhost:8080/api/auctions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auctionData),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ 서버 응답:', res.status, errorText);
      throw new Error(`서버 오류 (${res.status}): ${errorText}`);
    }
    
    const result = await res.text();
    console.log('✅ 성공 응답:', result);
    alert('경매가 등록되었습니다');
    navigate('/');
  } catch (err) {
    console.error('❌ 오류 발생:', err);
    alert('에러 발생: ' + err.message);
  }
};

  const CATEGORY_LIST = ['가전', '전자제품', '패션', '명품', '도서', '취미', '스포츠'];
  const BRAND_LIST = ['삼성', 'LG', 'Apple', 'Sony', 'Nike', '기타'];

  return (
    <form className="auction-new-form" onSubmit={handleSubmit}>
      <h2>경매 등록</h2>

      <div>
        <label>상품명</label>
        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label>카테고리</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORY_LIST.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div>
        <label>상품 상태</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="신품">신품</option>
          <option value="중고">중고</option>
        </select>
      </div>

      <div>
        <label>브랜드</label>
        <select value={brand} onChange={e => setBrand(e.target.value)}>
          {BRAND_LIST.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label>상품 설명</label>
        <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows="4" />
      </div>

      <div>
        <label>이미지 업로드 (1장 필수)</label>
        <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />
        {imageUrl && <img src={`http://localhost:8080${imageUrl}`} alt="업로드 미리보기" width="100" />}
      </div>

      <div>
        <label>시작가</label>
        <input type="number" value={startPrice} onChange={e => setStartPrice(e.target.value)} required />
        <label>즉시구매가</label>
        <input type="number" value={buyNow} onChange={e => setBuyNow(e.target.value)} />
        <label>입찰단위</label>
        <select value={bidUnit} onChange={e => setBidUnit(e.target.value)}>
          <option value="1000">1,000원</option>
          <option value="5000">5,000원</option>
          <option value="10000">10,000원</option>
        </select>
      </div>

      <div>
        <label>시작일시</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
      </div>

      <div>
        <label>종료일시</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
      </div>

      <div>
        <label>최소 입찰 수</label>
        <input type="number" value={minBid} onChange={e => setMinBid(e.target.value)} min={1} required />
        <label>자동 연장</label>
        <input type="checkbox" checked={autoExt} onChange={e => setAutoExt(e.target.checked)} />
      </div>

      <div>
        <label>배송비</label>
        <select value={shipping} onChange={e => setShipping(e.target.value)}>
          <option value="무료">무료</option>
          <option value="착불">착불</option>
          <option value="선불">선불</option>
        </select>
        <label>배송 방법</label>
        <select value={shippingType} onChange={e => setShippingType(e.target.value)}>
          <option value="택배">택배</option>
          <option value="퀵">퀵</option>
          <option value="직거래">직거래</option>
        </select>
        <label>거래지역</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <button type="submit" style={{ marginTop: 24 }}>등록하기</button>
    </form>
  );
}

export default AuctionNew;
