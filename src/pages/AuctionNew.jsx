import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AuctionNew.css';

function AuctionNew() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('가전');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('신품');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState([null, null, null]);
  const [imageUrls, setImageUrls] = useState(['', '', '']);

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

  const handleImageChange = (idx, file) => {
    const newImages = [...images];
    newImages[idx] = file;
    setImages(newImages);

    const urls = [...imageUrls];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls[idx] = reader.result;
        setImageUrls(urls);
      };
      reader.readAsDataURL(file);
    } else {
      urls[idx] = '';
      setImageUrls(urls);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // 이미지 1장 이상 첨부 필수
  if (!images[0] || images[0].size === 0) {
    alert('이미지는 최소 1장 첨부해야 합니다.');
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

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('status', status);
  formData.append('brand', brand);
  formData.append('description', desc);
  formData.append('startPrice', startPrice);
  formData.append('buyNowPrice', buyNow);
  formData.append('bidUnit', bidUnit);
  formData.append('startTime', `${startDate} ${startTime}:00`); // 'yyyy-MM-dd HH:mm:ss'
  formData.append('endTime', `${endDate} ${endTime}:00`);
  formData.append('minBidCount', minBid);
  formData.append('autoExtend', autoExt ? '1' : '0');
  formData.append('shippingFee', shipping);
  formData.append('shippingType', shippingType);
  formData.append('location', location);

  if (images[0] && images[0].size > 0) formData.append('image1', images[0]);
  if (images[1] && images[1].size > 0) formData.append('image2', images[1]);
  if (images[2] && images[2].size > 0) formData.append('image3', images[2]);
  console.log(images[0], images[1], images[2])
  try {
    const res = await fetch('http://localhost:8080/api/auctions', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || '업로드 실패');
    }

    alert('경매가 등록되었습니다');
    navigate('/');
  } catch (err) {
    console.error('❌ 등록 실패:', err);
    alert("에러 발생: " + err.message);
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
          <option value="">선택</option>
          {BRAND_LIST.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label>상품 설명</label>
        <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows="4" />
      </div>

      <div>
        <label>이미지 업로드 (최대 3장)</label>
        {[0, 1, 2].map(i => (
          <div key={i}>
            <input type="file" accept="image/*" onChange={e => handleImageChange(i, e.target.files[0])} />
            {imageUrls[i] && <img src={imageUrls[i]} alt={`이미지 ${i + 1}`} width="100" />}
          </div>
        ))}
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
