import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VenueImage from '../components/VenueImage';
import VenueCard from '../components/VenueCard';
import { VENUES, getVenue } from '../data/venues';
import { useReservations } from '../context/ReservationContext';
import { formatDateKo, formatPrice, getSlot, todayStr } from '../utils';

const MENUS = [
  ['reservations', '📋 예약 내역'],
  ['favorites', '♡ 찜한 공연장'],
  ['profile', '👤 회원 정보'],
];

const STATUS_CLASS = { '예약 완료': 'green', '예약 대기': 'orange', '이용 완료': 'gray', '예약 취소': 'red' };

export default function MyPage() {
  const navigate = useNavigate();
  const { reservations, favorites, cancelReservation } = useReservations();
  const [menu, setMenu] = useState('reservations'); // 여기 이해 안 됨. -> 아 그냥 useState 인가?
  const [tab, setTab] = useState('all');
  const [cancelId, setCancelId] = useState('');

  const isUpcoming = (reservation) => 
    reservation.date > todayStr() &&
    reservation.status !== '취소' &&
    reservation.status !== '이용 완료';
  const sorted = [...reservations].sort((a, b) =>
    b.date.localeCompare(a.date));
  const upcoming = sorted.filter(isUpcoming);
  const past = sorted.filter((r) => !isUpcoming(r));
  const shown = tab === 'upcoming' 
  ? upcoming : tab === 'past' 
  ? past : sorted;

  return (
    <div className="container page">
      <div className="my-layout">
        <aside className="my-sidebar">
          <div className="my-logo">마이페이지</div>
          {MENUS.map(([key, label]) => (
            <button key={key} className={menu === key ? 'active' : ''} onClick={() => setMenu(key)}>
              {label}</button>
          ))}
        </aside>

        <section className="my-content">
          {menu === 'reservations' && (
            <>
              <h2>예약 내역</h2>
              <div className="tabs">
                <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
                  전체</button>
                <button className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
                  예정된 예약 ({upcoming.length})</button>
                <button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>
                  지난 예약 ({past.length})</button>
              </div>

              {shown.length === 0 && <div className="empty">예약 내역이 없어요.</div>}
              <ul className="res-list">
                {shown.map((r) => {
                  const venue = getVenue(r.venueId);
                  const slot = getSlot(r.slotId);
                  return (
                    <li key={r.id} className="res-row">
                      <VenueImage venue={venue} className="res-img" />
                      <div className="res-main">
                        <b>{r.eventName}</b>
                        <span>{venue.name} · {venue.region}</span>
                        <span>📅 {formatDateKo(r.date)} · {slot.label} · 👥 {r.people}명</span>
                        <span>💰 {formatPrice(r.total)}</span>
                      </div>
                      <div className="res-side">
                        <span className={`status ${STATUS_CLASS[r.status]}`}>
                          {r.status}
                        </span>
                        <div className="res-btns">
                          <button className="btn-outline-sm dark" onClick={() => navigate(`/venues/${venue.id}`)}>
                            상세보기</button>
                          {isUpcoming(r) && cancelId !== r.id && (
                            <button className="btn-danger-sm" onClick={() => setCancelId(r.id)}>
                              취소하기</button>
                          )}
                          {cancelId === r.id && (
                            <>
                              <button className="btn-danger-fill" onClick={() => {
                                cancelReservation(r.id);
                                setCancelId('');
                              }}>취소 확정</button>
                              <button className="btn-outline-sm dark" onClick={() => setCancelId('')}>
                                닫기</button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {menu === 'favorites' && (
            <>
              <h2>찜한 공연장</h2>
              {favorites.length === 0 ? (
                <div className="empty">
                  아직 찜한 공연장이 없어요. <Link to="/search" className="accent">공연장 찾기</Link>
                </div>
              ) : (
                <div className="vgrid">
                  {VENUES.filter((v) =>
                    favorites.includes(v.id)).map((v) =>
                      <VenueCard key={v.id} venue={v} />)}
                </div>
              )}
            </>
          )}

          {menu === 'profile' && (
            <>
              <h2>내 정보</h2>
              <ul className="info-list">
                <li><b>이름</b><span>홍길동 (더미 데이터)</span></li>
                <li><b>연락처</b><span>010-1234-5678</span></li>
                <li><b>이메일</b><span>user@example.com</span></li>
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}