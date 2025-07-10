import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import QuickMenu from './components/QuickMenu';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import AuctionNew from './pages/AuctionNew';
import Event from './pages/Event';
import EventAdmin from './pages/EventAdmin';
import EventDetail from './pages/EventDetail';
import EventList from './pages/EventList';
import FAQ from './pages/FAQ';
import FAQAdmin from './pages/FAQAdmin';
import FAQList from './pages/FAQList';
import InquiryAdmin from './pages/InquiryAdmin';
import InquiryAdminDetailPage from './pages/InquiryAdminDetailPage';
import InquiryDetail from './pages/InquiryDetail';
import InquiryList from './pages/InquiryList';
import InquiryMy from './pages/InquiryMy';
import InquiryNew from './pages/InquiryNew';
import Auction from './pages/Auction'; // 경매 전체 리스트 페이지 import 추가
import Notice from './pages/Notice';
import NoticeAdmin from './pages/NoticeAdmin';
import NoticeDetail from './pages/NoticeDetail';
import NoticeList from './pages/NoticeList';
import CustomerService from './pages/CustomerService';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auction" element={<Auction />} /> {/* 경매 전체 리스트 라우트 추가 */}
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auction/new" element={<AuctionNew />} />
            <Route path="/event" element={<Event />} />
            <Route path="/event/admin" element={<EventAdmin />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/event/list" element={<EventList />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/admin" element={<FAQAdmin />} />
            <Route path="/faq/list" element={<FAQList />} />
            <Route path="/inquiry/admin" element={<InquiryAdmin />} />
            <Route path="/inquiry/admin/:id" element={<InquiryAdminDetailPage />} />
            <Route path="/inquiry/:id" element={<InquiryDetail />} />
            <Route path="/inquiry/list" element={<InquiryList />} />
            <Route path="/inquiry/my" element={<InquiryMy />} />
            <Route path="/inquiry/new" element={<InquiryNew />} />
            <Route path="/inquiry" element={<InquiryNew />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notice/admin" element={<NoticeAdmin />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            <Route path="/notice/list" element={<NoticeList />} />
            <Route path="/customer-service" element={<CustomerService />} />
          </Routes>
        </main>
        <Footer />
        <QuickMenu />
      </div>
    </Router>
  );
}

export default App;