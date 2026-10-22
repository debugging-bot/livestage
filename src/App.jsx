import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
//import { ReservationProvider } from './context/ReservationContext';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MapSearch from './pages/MapSearch';
import VenueDetail from './pages/VenueDetail';
import Booking from './pages/Booking';
import MyPage from './pages/MyPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/map" element={<MapSearch />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/venues/:id/book" element={<Booking />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<div className="container empty">페이지를 찾을 수 없습니다.</div>} />
          </Routes>
        </main>
        <footer className="footer">© 2026 LiveStage · 밴드를 위한 공연장 예약 플랫폼 (수업 프로젝트용 더미 데이터)</footer>
    </HashRouter>
  );
}