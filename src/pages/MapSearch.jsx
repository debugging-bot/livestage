import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueImage from "../components/VenueImage";
import { VENUES } from "../data/venues";
import { formatPrice } from "../utils";
// 외부 지도 API 키 없이 동작하도록 만든 "지도 느낌" 목업.
// 나중에 카카오맵/네이버지도로 교체할 때는 venue.x, venue.y 대신 위도/경도를 추가하면 된다.
const LABELS = [
  { name: "상수역", x: 10, y: 54, station: true },
  { name: "홍대입구역", x: 48, y: 61, station: true },
  { name: "합정역", x: 26, y: 76, station: true },
  { name: "망원역", x: 8, y: 95, station: true },
  { name: "서교동", x: 68, y: 72 },
  { name: "연남동", x: 60, y: 14 },
  { name: "상수동", x: 22, y: 34 },
  { name: "합정동", x: 52, y: 90 },
];
export default function MapSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const list = VENUES.filter(
    (v) =>
      !q || v.name.includes(q) || v.region.includes(q) || v.address.includes(q),
  );
  const selected = list.find((v) => v.id === selectedId);
  return (
    <div className="map-page">
      <aside className="map-side">
        <input
          className="map-search"
          placeholder="🔍 지역 또는 공연장 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="map-count">공연장 {list.length}곳</p>
        <ul className="map-list">
          {list.map((v) => (
            <li
              key={v.id}
              className={v.id === selectedId ? "active" : ""}
              onClick={() => setSelectedId(v.id)}
            >
              <VenueImage venue={v} className="map-thumb" />
              <div>
                <b>{v.name}</b>
                <span>
                  수용 {v.capacity}명 · {v.region}
                </span>
                <span className="price">
                  평일 {formatPrice(v.basePrice)} · 주말 {formatPrice(v.weekendPrice)}
                </span>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="empty">검색 결과가 없어요.</li>}
        </ul>
      </aside>
      <section className="map-canvas" onClick={() => setSelectedId(null)}>
        <svg
          className="map-roads"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="river" d="M0 90 Q18 94 34 100 L0 100 Z" />
          <ellipse className="park" cx="78" cy="30" rx="10" ry="8" />
          <ellipse className="park" cx="14" cy="18" rx="8" ry="6" />
          <path className="road big" d="M0 62 L100 42" />
          <path className="road big" d="M38 0 L58 100" />
          <path className="road" d="M0 38 L100 24" />
          <path className="road" d="M0 80 L100 70" />
          <path className="road" d="M20 0 L10 100" />
          <path className="road" d="M76 0 L88 100" />
          <path className="road" d="M0 20 L60 30" />
        </svg>
        {LABELS.map((l) => (
          <span
            key={l.name}
            className={`map-label ${l.station ? "station" : ""}`}
            style={{ left: `${l.x}%`, top: `${l.y}%` }}
          >
            {l.station && "🚇 "}
            {l.name}
          </span>
        ))}
        {list.map((v) => (
          <button
            key={v.id}
            className={`pin ${v.id === selectedId ? "selected" : ""}`}
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
            aria-label={v.name}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(v.id);
            }}
          >
            <i />
          </button>
        ))}
        {selected && (
          <div
            className={`map-popup ${selected.y < 38 ? "below" : ""}`}
            style={{ left: `${selected.x}%`, top: `${selected.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/venues/${selected.id}`);
            }}
          >
            <VenueImage venue={selected} className="popup-img" />
            <div className="popup-body">
              <b>{selected.name}</b>
              <span className="rating">
                ★ {selected.rating} <em>({selected.reviewCount})</em>
              </span>
              <span>수용 인원 {selected.capacity}명</span>
              <span>평일 {formatPrice(selected.basePrice)}</span>
              <span>주말 {formatPrice(selected.weekendPrice)}</span>
              <span className="popup-go">상세보기 →</span>
            </div>
            <button
              className="popup-close"
              aria-label="닫기"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(null);
              }}
            >
              ×
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
