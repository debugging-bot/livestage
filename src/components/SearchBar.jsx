import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS, PEOPLE_OPTIONS, BUDGET_OPTIONS } from "../data/venues";
import {
  addDays,
  BOOKING_END,
  BOOKING_START,
  inBookingRange,
  formatPrice,
} from "../utils";

export default function SearchBar({ initial = {}, variant = "hero" }) {
  const navigate = useNavigate();
  const [region, setRegion] = useState(initial.region || "서울 전체");
  const [date, setDate] = useState(
    initial.date || (inBookingRange(addDays(14)) ? addDays(14) : BOOKING_START),
  );
  const [people, setPeople] = useState(initial.people || "150");
  const [budget, setBudget] = useState(initial.budget || "0");
  const submit = (e) => {
    e.preventDefault();
    navigate(
      `/search?${new URLSearchParams({ region, date, people, budget })}`,
    );
  };

  return (
    <form className={`sbar ${variant}`} onSubmit={submit}>
      <label className="sfield">
        <span>지역 선택</span>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="sfield">
        <span>공연 날짜</span>
        <input
          type="date"
          value={date}
          min={BOOKING_START}
          max={BOOKING_END}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label className="sfield">
        <span>예상 관객 수</span>
        <select value={people} onChange={(e) => setPeople(e.target.value)}>
          {PEOPLE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}명
            </option>
          ))}
        </select>
      </label>
      <label className="sfield">
        <span>예산</span>
        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b === 0 ? "제한 없음" : `${formatPrice(b)} 이하`}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-primary sbar-btn">
        {variant === "hero" ? "공연장 검색" : "검색하기"}
      </button>
    </form>
  );
}