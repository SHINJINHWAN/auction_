import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import AuctionNew from './pages/AuctionNew';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<AuctionNew />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;