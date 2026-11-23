import { useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import Calendar from "../components/Calendar";
import VenueImage from "../components/VenueImage";
import { EQUIP_DETAIL, TIME_SLOTS, getReviews, getVenue } from "../data/venues";
import { useReservations } from "../context/ReservationContext";
import {
  dayPrice,
  dayStatus,
  formatDateKo,
  formatPrice,
  isWeekend,
  slotPrice,
} from "../utils";

const SATURDAY = "2000-01-01";
const TABS = [
  ["info", "기본 정보"],
  ["rental", "대관 정보"],
  ["equip", "장비 정보"],
  ["review", "공연 후기"],
];

export default function VenueDetail() {
  const { id } = useParams();
  const venue = getVenue(id);
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { reservations, isFavorite, toggleFavorite } = useReservations();
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState("info");
  const [date, setDate] = useState(() => {
    const d = sp.get("date");
    return venue && d && dayStatus(venue.id, d, reservations) === "available"
      ? d
      : "";
  });

  if (!venue) {
    return (
      <div className="container empty">
        존재하지 않는 공연장입니다.{" "}
        <Link to="/search" className="accent">
          공연장 찾기
        </Link>
      </div>
    );
  }

  const fav = isFavorite(venue.id);
  const reviews = getReviews(venue);

  return (
    <div className="container page">
      <div className="detail-grid">
        <div>
          <div className="gallery-main">
            <VenueImage venue={venue} index={img} className="fill" />
            <button
              className="g-arrow left"
              onClick={() => setImg((img + 3) % 4)}
              aria-label="이전 사진"
            >
              ‹
            </button>
            <button
              className="g-arrow right"
              onClick={() => setImg((img + 1) % 4)}
              aria-label="다음 사진"
            >
              ›
            </button>
          </div>
          <div className="thumbs">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`thumb ${i === img ? "active" : ""}`}
                onClick={() => setImg(i)}
              >
                <VenueImage venue={venue} index={i} className="fill" />
              </button>
            ))}
          </div>

          <div className="title-row">
            <div>
              <h1>{venue.name}</h1>
              <div className="rating big">
                ★ {venue.rating} <span>({venue.reviewCount}개의 후기)</span>
              </div>
              <div className="tags">
                {venue.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              className={`heart lg ${fav ? "on" : ""}`}
              onClick={() => toggleFavorite(venue.id)}
              aria-label="찜하기"
            >
              {fav ? "♥" : "♡"}
            </button>
          </div>

          <div className="tabs">
            {TABS.map(([k, label]) => (
              <button
                key={k}
                className={tab === k ? "active" : ""}
                onClick={() => setTab(k)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="tab-body">
            {tab === "info" && (
              <ul className="info-list">
                <li>
                  <b>위치</b>
                  <span>{venue.address}</span>
                </li>
                <li>
                  <b>공연장 규모</b>
                  <span>
                    {venue.area}평 (수용 {venue.capacity}명, 스탠딩 기준)
                  </span>
                </li>
                <li>
                  <b>대관료</b>
                  <span>
                    평일 {formatPrice(venue.basePrice)} · 주말{" "}
                    {formatPrice(venue.weekendPrice)} (종일 기준)
                  </span>
                </li>
                <li>
                  <b>운영 시간</b>
                  <span>{venue.hours}</span>
                </li>
                <li>
                  <b>주차</b>
                  <span>{venue.parking}</span>
                </li>
                <li>
                  <b>특징</b>
                  <span>{venue.description}</span>
                </li>
              </ul>
            )}
            {tab === "rental" && (
              <>
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>타임</th>
                      <th>시간</th>
                      <th>평일</th>
                      <th>주말(토·일)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.label}</td>
                        <td>{formatPrice(slotPrice(venue, s))}</td>
                        <td>{formatPrice(slotPrice(venue, s, SATURDAY))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ul className="notes">
                  <li>셋업·리허설·철수 시간은 각 타임에 포함됩니다.</li>
                  <li>음향 엔지니어 1인이 기본 제공됩니다.</li>
                  <li>이용 3일 전까지 취소 시 전액 환불됩니다.</li>
                  <li>주말(토·일)은 평일보다 대관료가 높게 책정됩니다.</li>
                </ul>
              </>
            )}
            {tab === "equip" && (
              <ul className="equip-list">
                {venue.equipment.map((e) => (
                  <li key={e}>
                    <b>{e}</b>
                    <span>{EQUIP_DETAIL[e]}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "review" && (
              <ul className="review-list">
                {reviews.map((r) => (
                  <li key={r.user}>
                    <div>
                      <b>{r.user}</b>
                      <span className="rating">{"★".repeat(r.rating)}</span>
                      <em>{r.date}</em>
                    </div>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="book-card">
          <h3>예약 가능 날짜</h3>
          <Calendar
            value={date}
            onSelect={setDate}
            statusOf={(d) => dayStatus(venue.id, d, reservations)}
          />
          <div className="book-summary">
            <span>
              {date
                ? `선택한 날짜: ${formatDateKo(date)}`
                : "날짜를 선택해 주세요"}
            </span>
            <strong>
              {date
                ? `${formatPrice(dayPrice(venue, date))} (${isWeekend(date) ? "주말" : "평일"} 종일)`
                : `${formatPrice(venue.basePrice)} ~`}
            </strong>
          </div>
          <button
            className="btn-primary block"
            disabled={!date}
            onClick={() => navigate(`/venues/${venue.id}/book?date=${date}`)}
          >
            예약하기
          </button>
        </aside>
      </div>
    </div>
  );
}
