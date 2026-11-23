import { useNavigate } from "react-router-dom";
import VenueImage from "./VenueImage";
import { useReservations } from "../context/ReservationContext";
import { dayStatus, formatPrice } from "../utils";
export default function VenueCard({ venue, date }) {
  const navigate = useNavigate();
  const { reservations, isFavorite, toggleFavorite } = useReservations();
  const status = date ? dayStatus(venue.id, date, reservations) : null;
  const open = status === "available";
  const go = () =>
    navigate(`/venues/${venue.id}${date ? `?date=${date}` : ""}`);
  const fav = isFavorite(venue.id);
  return (
    <article
      className={`vcard ${status && !open ? "closed" : ""}`}
      onClick={go}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go()}
    >
      <VenueImage venue={venue} className="vcard-img">
        {status && (
          <span className={`badge ${open ? "badge-green" : "badge-red"}`}>
            {open ? "예약 가능" : "예약 마감"}
          </span>
        )}
      </VenueImage>
      <div className="vcard-body">
        <div className="vcard-top">
          <h3>{venue.name}</h3>
          <button
            className={`heart ${fav ? "on" : ""}`}
            aria-label="찜하기"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(venue.id);
            }}
          >
            {fav ? "♥" : "♡"}
          </button>
        </div>
        <div className="rating">
          ★ {venue.rating} <span>({venue.reviewCount})</span>
        </div>
        <div className="tags">
          {venue.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <dl className="vinfo">
          <div>
            <dt>수용 인원</dt>
            <dd>{venue.capacity}명</dd>
          </div>
          <div>
            <dt>대관료</dt>
            <dd>
              평일 {formatPrice(venue.basePrice)}
              <br />
              주말 {formatPrice(venue.weekendPrice)}
            </dd>
          </div>
          <div>
            <dt>기본 장비</dt>
            <dd>{venue.equipment.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
